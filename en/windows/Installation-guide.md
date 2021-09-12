# Windows Installation Guide

**This guild is only for devices with working USB!**

Please check the [Device Support Status](en/windows/state-frame.html).

### Download Tools

Download these files to your USB flash drive:

1. Download Windows PE
   
   [20h2pe_new.zip](https://pan.baidu.com/s/1Pgaz-bdTiOKFXGAxgYCX6A)
   
   Password：1234
    
2. Download dism++

   [Dism++](https://www.chuyu.me/en/index.html)

3. Download SDM845 Drivers
   
   [GitHub WOA-Drivers](https://github.com/edk2-porting/WOA-Drivers)

   You need to extract drivers for your device here, check README.

4. Download Windows 10 arm64 iso

   [UUP dump](https://uupdump.net/?lang=en-us)

5. Download UEFI

   [Releases · edk2-porting/edk2-sdm845 · GitHub](https://github.com/edk2-porting/edk2-sdm845/releases)

6. Download parted
   
   [parted](https://pwdx.lanzoux.com/iUgSEmkrlmh)

7. Create a text file, you may need it to copy-paste commands on the phone

   ```sh
   diskpart
   select disk 0
   list part
   select part 17    # 17 is the number of your ESP partition
   assign letter=Y
   exit
   
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} testsigning on
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} nointegritychecks on
   
   shutdown -s -t 0
   ```

### Pre-Installation

Some devices may need additional steps. Before you proceed, please check your device page at *Devices* section.

### Create Partitions

Enter TWRP Recovery on your phone and connect it to PC.

Open Command Prompt as Administrator and run:

```sh
adb push parted /sdcard/
adb shell
```

1. Repartition device

   The following partition layout commands is example for OnePlus 6T 128GB. 
   You may need to change the ranges for your own device or your own preferences.

   !> This may damage your device if done wrong. Please use 9008 to restore your device if it becomes bricked accidentally.

   > WARNING: Ignore the text after the `#`, it's just a comment.

   ```sh
   cp /sdcard/parted /sbin/ && chmod 755 /sbin/parted
   umount /data && umount /sdcard
   parted /dev/block/sda
   rm 17                           # remove userdata
   mkpart esp fat32 6559MB 7000MB    # 441 MB
   mkpart pe fat32 7000MB 10000MB    # 3 GB
   mkpart win ntfs 10000MB 70GB      # 61,680 MB ( 61.68 GB )
   mkpart userdata ext4 70GB 125GB   # 56,320 MB ( 56.32 GB )
   set 17 esp on                   # mark as active partition
   quit
   ```

2. Format new partitions

   ```sh
   mkfs.fat -F32 -s1 /dev/block/by-name/pe
   mkfs.fat -F32 -s1 /dev/block/by-name/esp
   mkfs.ntfs -f /dev/block/by-name/win
   mke2fs -t ext4 /dev/block/by-name/userdata
   ```

3. Mount PE partition as `/mnt`

   ```sh
   mount /dev/block/by-name/pe /mnt
   ```

4. Connect USB flash drive to device's OTG and copy PE

   ```
   cp -r /usbstorage/20h2pe_new/* /mnt
   ```

5. Reboot to system with TWRP

   Try to boot Android first. If it works, Android is ok and we can proceed.

### Install Windows

Reboot device to fastboot mode.

1. Boot UEFI

   ```sh
   fastboot boot boot-DEVICE.img
   ```

2. Enter Windows PE

   Assign Y letter to your ESP partition:

   ```sh
   diskpart
   select disk 0
   list part
   select part 17    # 17 is the number of your ESP partition
   assign letter=Y
   exit
   ```

3. Install Windows ARM64
   
   Open dism++ and install Windows:

   1. Open File > Apply Image
   2. Select iso where that is located
   3. Select the `C:\` root (or `D:\` if `C:\` is the PE partition), the destination disk where windows will be applied
   4. Check `Add Boot`
   5. Press `OK` and wait untill image applied
   
   Install drivers:

   1. Select new Windows installation on top and click `Open session`
   2. Enter `Drivers` section under `Control Panel`
   3. Click `Add` and select SDM845 Drivers folder
   4. Wait untill drivers installed

4. Enable Test-Signing mode

   ```sh
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} testsigning on
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} nointegritychecks on
   ```

5. Reboot to UEFI again, enjoy your Windows!

   ```sh
   shutdown -s -t 0
   ```