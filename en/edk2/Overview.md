# Brief Overview

`edk2-sdm845` is a project aimed at providing a custom UEFI environment for Snapdragon 845 in order to boot any fuOS at EL1.

As is said in README, it is a terribly broken edk2 port. But still, we're only using it as a bootloader. And it's doing well in booting Windows.

Below are some simple explanations about how everything works.

## Fastboot to EDK2

On most recent Qualcomm devices, there are two partitions called xbl and abl.

`xbl` is the UEFI firmware on Qualcomm platforms. It contains EFI drivers as well as applications (eg. Fastboot). On LA platforms, if fastboot is not launched, it loads abl immediately.

`abl` is only found on Qualcomm LA platforms, and is open-source on CodeAurora. It contains an EFI application called `LinuxLoader.efi` , which is used to load Linux kernel located in boot partition. 

Unfortunately, xbl and abl are both signed on retail devices. We can't make any modifications to them. Thus, it's impossible to boot Windows using stock bootloader.

What we are doing here is to make our UEFI Firmware *look like* a Linux kernel. It's done by adding a piece of magic header on top of the image, and also appending device tree to it. In this way, abl will be happy with the provided image.

## MemoryMap

EDK2 requires a memory map to work properly. You can start off by referring to `uefiplat.cfg` inside xbl. Note that it won't work if you only do copy-paste. Additional fixes are required.

## Display

xbl already initialized the display hardware on your device, giving you a nice framebuffer. So here we use SimpleFbDxe to make things simplified.

## EFI Drivers

As we have mentioned before, xbl is UEFI based. So we can extract binary EFI drivers from it, then insert them into our new firmware. Many drivers won't work in this way, such as those for buttons, USB, PMIC... It is sheer luck that UFS surprisingly works, enabling us to continue our journey.

## Windows

Windows on Arm, just as Windows on x86 platforms, requires a certain set of ACPI tables, which are supposed to be provided by the bootloader. In short, ACPI describes the hardware components and their configuration on your device.

Extracting the ACPI tables from a random WoA laptop won't *just* work. Qualcomm drivers will be confused when there's a mismatch between ACPI and the real hardware (your phone), resulting in a BSOD :(

Fixing ACPI is a major obstacle.
