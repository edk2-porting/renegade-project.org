# Windows安装指南

**本教程仅支持usb正常工作的设备**

请查看右侧[设备支持状态](zh/windows/state-frame.html)

### Download Tools

下载这些文件到你的U盘

1. 下载PE

   [20h2pe_new.zip](https://pan.baidu.com/s/1Pgaz-bdTiOKFXGAxgYCX6A)
   
   提取码：1234
   
2. 下载dism++

   [Dism++](http://www.chuyu.me/zh-Hans/index.html)

3. 下载SDM845 驱动

   [GitHub WOA-Drivers](https://github.com/edk2-porting/WOA-Drivers)

   You need to extract drivers for your device here, check README.

4. 下载windows10/windows11 arm64 iso

   [UUP dump](https://uupdump.net/?lang=zh-cn)

5. 下载uefi

   [Releases · edk2-porting/edk2-sdm845 · GitHub](https://github.com/edk2-porting/edk2-sdm845/releases)

6. 下载parted

   [parted](https://pwdx.lanzoux.com/iUgSEmkrlmh)

7. 新建new.txt 文件

   ```sh
   diskpart
   sel disk 0
   sel part 17 #注意17是你的esp分区号
   assign letter=Y
   exit
   
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} testsigning on
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} nointegritychecks on
   
   shutdown -s -t 0
   
   ```

### Pre-Installation

Some devices may need additional steps. Before you proceed, please check your device page at *Devices* section.

### Create Partitions

​	电脑连接手机进入TWRP

1. 分区（仅限一加6T复制粘贴）

   !> 这可能会损坏你的设备，不慎变砖请使用9008恢复你的设备

   ```sh
   cp /sdcard/parted /sbin/ && chmod 755 /sbin/parted
   umount /data && umount /sdcard
   parted /dev/block/sda
   rm 17 #17是userdata分区号 
   mkpart esp fat32 6559MB 7000MB
   mkpart pe fat32 7000MB 10000MB
   mkpart win ntfs 10000MB 70GB
   mkpart userdata ext4 70GB 125GB
   #设置17分区为esp分区，这步很重要
   set 17 esp on
   quit
   ```

2. 重启TWRP，格式化新分区

   ```sh
   #某些TWRP是 mkfs.fat -F32 -s1 /dev/block/bootdevice/by-name/pe
   mkfs.fat -F32 -s1 /dev/block/by-name/pe
   mkfs.fat -F32 -s1 /dev/block/by-name/esp
   mkfs.ntfs -f /dev/block/by-name/win
   mke2fs -t ext4 /dev/block/by-name/userdata
   ```

3. 挂载PE分区到 `/mnt`

   ```sh
   mount /dev/block/by-name/pe /mnt
   ```

4. OTG连接U盘，复制pe文件到PE分区

   ```
   cp -r /usbstorage/20h2pe_new/* /mnt
   ```

5. Reboot to system with TWRP

   Try to boot Android first. If it works, Android is ok and we can proceed.

6. 重启进入 fastboot

### Install Windows

1. 进入fastboot，boot UEFI

   ```sh
   fastboot boot boot-xxx.img
   ```

2. 开机进入PE系统

   挂载ESP分区

   ```sh
   diskpart
   select disk 0
   list part
   select part 17 #17为你的esp分区号
   assign letter=Y
   exit
   ```

3. 安装 windows arm64

   1. 打开dism++ 释放镜像到D盘，并选择释放引导分区
   2. 安装驱动

4. 关闭驱动签名

   ```sh
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} testsigning on
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} nointegritychecks on
   ```

5. 重启，boot uefi 进入完整Windows系统

   ```sh
   shutdown -s -t 0
   ```