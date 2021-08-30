### first
Download these files to your U disk

Download Tools

i: Download [20h2pe_new.zip](https://pan.baidu.com/s/1Pgaz-bdTiOKFXGAxgYCX6A)

ii: Download [Dism++](http://www.chuyu.me/zh-Hans/index.html)

iii: Download [GitHub -WOA-Drivers](https://github.com/edk2-porting/WOA-Drivers)

iv: Download [parted](https://pwdx.lanzoux.com/iUgSEmkrlmh)

v: Download [Releases · edk2-porting/edk2-sdm845 · GitHub](https://github.com/edk2-porting/edk2-sdm845/releases)

Download windows10 arm64 iso

uupdump.ml or uup.rg-adguard.net

second

connect your phone to your PC

open Command Prompt As Administrator

Run `adb push parted /sdcard/`

partition your device

WARNING: Don't Use letters/numbers after the "#" 

```
adb shell
cp /sdcard/parted /sbin/ && chmod 755 /sbin/parted
umount /data && umount /sdcard
parted /dev/block/sda
rm 17 # remove userdata
mkpart esp fat32 6559MB 7000MB # 441 MB
mkpart pe fat32 7000MB 10000MB # 3 GB
mkpart win ntfs 10000MB 70GB # 61,680 MB ( 61.68 GB )
mkpart userdata ext4 70GB 125GB # 56,320 MB ( 56.32 GB )
set 17 esp on # mark as active partition
quit
```

format new partition

```
mkfs.fat -F32 -s1 /dev/block/sda17 mkfs.fat -F32 -s1 /dev/block/sda18 mkfs.ntfs -f /dev/block/sda19 
mke2fs -t ext4 /dev/block/sda20
mount /dev/block/by-name/pe /mnt
exit
```

copy iso ,20h2pe_new ,Dism++ Folder to usb otg
and connect otg to phone (don't remove till progress finishes ,needs iso to flash wim )

`cp -r /usbstorage/20h2pe_new/* /mnt # in twrp Advanced>Terminal`

reboot to system with twrp

try to boot Android

if it works ,android is ok

Third
shutdown android and go to fastboot mode

boot uefi

`fastboot boot uefi.img`

enter PE system

mount esp part on Y:

```
diskpart
select disk 0
list part
select part 17
assign letter=Y
exit
```

install windows arm64:

i:open dism++

ii:open File>Apply Image

iii:select iso where that is located

iv:select `C: (or D: if c: was pe partition` // disk where we have to install

v:check the slot '`AddBoot`'

vi:select 'Ok' to Apply Image //wait some time

now, install drivers

i:after opened session ,select Drivers under Control Panel

ii:and wait and it asks you to select driver.

iii:click 'Add' and Open the driver folder

iv:and it will install drivers

now ,stop the Driver signature enforcement:

```
bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} testsigning on

bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} nointegritychecks on
```

reboot and boot uefi, enjoy!
