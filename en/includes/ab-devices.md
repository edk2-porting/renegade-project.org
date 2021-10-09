
## A/B Partitions

> This device uses A/B partitions layout! Read the following carefully.

In some cases second inactive slot can be unpopulated or contain much older firmware than your active slot (slot containing your current working Android ROM), leading to various issues including a **potential hard-brick**. We need to ensure none of that will happen by copying the contents of active slot to inactive.

!> If you're going to flash EDK2 to a second boot partition, do not rush and prepare your device first. **This step is NOT optional for A/B in this case!**

To do this, sideload the `copy-partitions-20210323_1922.zip` package by doing the following:

1. Download the `copy-partitions-20210323_1922.zip` file from [here](https://files.renegade-project.org/copy-partitions-20210323_1922.zip ':ignore');
2. Sideload the `copy-partitions-20210323_1922.zip` package:
    * On the device, switch recovery to sideload mode:
      * For TWRP: select "Advanced", "ADB Sideload", then swipe to begin sideload;
      * For others look for "Apply from ADB", "Install from ADB", etc;
    * On the host machine, sideload the package using: 
      ```sh
      adb sideload copy-partitions-20210323_1922.zip
      ```
    * Or simply copy that zip to the device and install it normally.
3. Reboot to Android and check that everything works.

At this point you can proceed to [Installation Guide](en/windows/Installation-guide.md) to install Windows but **don't flash EDK2 just yet**.

Once you got both Windows installed and booting successfully from fastboot and Android booting successfully after full Windows installation (check it!), now you can reboot to fastboot and finally flash EDK2 to the second slot.

If you have Android on slot A, flash EDK2 to B:

```bash
fastboot flash boot_b boot_DEVICE.img
```

If you have Android on slot B, flash EDK2 to A:

```bash
fastboot flash boot_a boot_DEVICE.img
```

Once flashed, do not change the slot right after that, reboot to Android first at least once:

```bash
fastboot reboot
```

### Slot Switching

EDK2 supports switching between A/B slots in UEFI Boot Manager to achieve a dualboot between Android and EDK2:

* Press any volume key during boot to enter UEFI Menu;
* Use volume keys and power button to navigate to `Boot Manager` > `Reboot to other slot`.

From Android, you can use `bootctl` shell command to switch the active slot back to EDK2 (requires root).