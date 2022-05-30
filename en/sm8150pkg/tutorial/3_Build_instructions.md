# Adding your device as a build target

With this out of the way, let's add our device to the Renegade SM8150 repo's build system!

First, make sure that you're in the repo's directory:

```bash
$ pwd 
/home/user/MU-sm8150pkg
```

Enter the virtual environment, if you haven't already done so:
```bash
$ python3 -m venv SurfaceDuo
$ source SurfaceDuo/bin/activate
(SurfaceDuo) $
```

Now, we're ready.

**We will do this over four steps.**

## Step 1: Add a new device to Platforms/SurfaceDuoPkg/SurfaceDuo.dsc

This file tells the build system about the different devices that it can build UEFI firmware for. 
We will have to add our device to that list, since it's not already there.

Let's do this by opening the file in question:
```bash
(SurfaceDuo) $ nano Platforms/SurfaceDuoPkg/SurfaceDuo.dsc
```

This will open up `SurfaceDuo.dsc` in the GNU Nano text editor, as follows:

![The GNU Nano text editor showing the file SurfaceDuo.dsc](/img/ssh/1.png)

Find the `Build ID Tables` section of that file:

![A crop of the Nano editor view, showing the section of concern](/img/ssh/2.png)

Add another row with your device's model and codename to the tail end of the table. In this instance, there are three devices, so my device (OnePlus 7 Pro / `guacamole` ) will be the 4th device on that list:

![The same section, after adding the new device block](/img/ssh/3.png)

Then, set `BUILD_DEVICE_ID` to match the number for your device's new entry:

![Changing BUILD_DEVICE_ID to match the new device entry's number](/img/ssh/4.png)

Now, you can save that file by pressing `Ctrl` + `S` on your keyboard. Don't close `nano` just yet, since we have more to edit!

## Step 2: Set your device's screen resolution:

Now that we have informed the build system of the existence of our new device, we should tell it a bit more about our device.
In that same file, go to the next section, which deals with screen resolutions.
Don't be lazy and modify an existing configuration!!! This CAN wreak havoc on your device!

Simply copy this template after the last device, increment the `BUILD_DEVICE_ID` accordingly, and fill out the dimensions with the correct values for your device.   
(**hint**: GSMArena or "device info" apps on the Play Store can be helpful for determining your screen's resolution)

```C
#Device name
  !if $(BUILD_DEVICE_ID) == 3
        gSurfaceDuoPkgTokenSpaceGuid.PcdMipiFrameBufferWidth|1440 // <--- this is the width of your screen
        gSurfaceDuoPkgTokenSpaceGuid.PcdMipiFrameBufferHeight|3120 // <-- this is the height of your screen
  !endif
```

Before:

![The section before adding in the new device screen resolution block](/img/ssh/5.png)

After:

![That same section after adding the block of concern](/img/ssh/6.png)

## Step 3: Copy your device's bootloader firmware binaries and Device Tree Blob:

> Each device has its own **specific** firmware binaries, and **you need to add those in before building**.

Remember the files we have obtained in the first step? **Time to put those to good use!**

**First**, copy the Device Tree Blob (DTB) file, `fdt.dd` from the very first step of this guide, to the `ImageResources\dtbs` directory.

**Make sure you change the filename `Guacamole.dtb` in the example below to reflect your own device's codename!**

```
(SurfaceDuo) $ cp /path/to/fdt.dd ImageResources/dtbs/Guacamole.dtb
```

Then, let's create an empty directory in which we will put the firmware binaries we extracted from the bootloader:
(replace `DEVICE_MAKE` and `Codename_MODEL_NAME` accordingly - I will use `OnePlus/Guacamole_7_Pro`)

```bash
(SurfaceDuo) $ pwd
/home/user/MU-sm8150pkg
(SurfaceDuo) $ ls Platforms/SurfaceDuoPkg/CustomizedBinaries/
LemonICE  XiaoMi
(SurfaceDuo) $ mkdir -p Platforms/SurfaceDuoPkg/CustomizedBinaries/OnePlus/Guacamole_7_Pro
```

Now, move the firmware binaries we extracted with 7-Zip to the folder we just created, keeping in mind the correct paths:

```bash
(SurfaceDuo) $ mv /path/to/needed/files/* Platforms/SurfaceDuoPkg/CustomizedBinaries/OnePlus/Guacamole_7_Pro
```

## Step 4: Configure the build system to process the firmware binaries for your device:

We will now need to inform the build system of these files. The files `DXE0.inc` through `DXE3.inc` tell the build system about the locations of these firmware binaries for each separate device. So, we will make a copy of one of these files and modify it with the correct paths for our own files.

Let's copy it as follows:

```bash
(SurfaceDuo) $ cp Platforms/SurfaceDuoPkg/Include/DXE3.inc Platforms/SurfaceDuoPkg/Include/DXE4.inc
```

Then, we'll open it in Nano:

```bash
(SurfaceDuo) $ nano Platforms/SurfaceDuoPkg/Include/DXE4.inc
```

In `nano`, we will find the following string:  
```
SECTION PE32 = SurfaceDuoPkg/CustomizedBinaries/XiaoMi/Andromeda_MIX3_5G/
```

and replace all occurrences of it after adding in the path for our own device's files:  

```
SECTION PE32 = SurfaceDuoPkg/CustomizedBinaries/OnePlus/Guacamole_7_Pro/
```

Then, find this section in the file:

```
SECTION UI = "Panel_samsung_ea8076_fhd_amoled_cmd.xml"
```

and comment out the entire block, so that it becomes like this:

```
#    FILE FREEFORM = 708A5B80-136B-45A9-A03E-98F450FC24BF {
#            SECTION UI = "Panel_samsung_ea8076_fhd_amoled_cmd.xml"
#            SECTION RAW = Platforms/SurfaceDuoPkg/CustomizedBinaries/XiaoMi/Andromeda_MIX3_5G/Panel_samsung_ea8076_fhd_>
#    }
```

APART FROM THAT, DO **NOT** CHANGE ANYTHING! **__YOU HAVE BEEN WARNED__**.

**A cautionary tale, courtesy of Sunflower2333:**

```
 ! What I want to say is, this step might be really important.
 ! I once added Xiaomi MIX 3 5G's firmware binaries and tested uefi on QRD 855.
 ! However, after some tests, its debug board burnt.
 ! Another QRD also met with the problem.
 ! I can not determine what caused the death.
 ! Anyway, it was certainly not caused by PEP, because I haven't installed it.
 ! So, don't be lazy. Remember to replace the binaries.
```

**Now, on to the last step!**

Open `Platforms/SurfaceDuoPkg/SurfaceDuo.fdf` as follows:

```
(SurfaceDuo) $ nano Platforms/SurfaceDuoPkg/SurfaceDuo.fdf
```

Then, find this block:

![A part of SurfaceDuo.fdf that tells the build system where to locate the files that describe the paths for the firmware binaries](/img/ssh/7.png)

Change this template accordingly, then copy it to the end, after the last device entry:

```
 #Device name
  !if $(BUILD_DEVICE_ID) == 4
    !include SurfaceDuoPkg/Include/DXE4.inc
  !endif
```
![The same excerpt above, after being edited](/img/ssh/8.png)

**One last thing:** we will tell the build process to use the generic ACPI tables, instead of Surface Duo-specific ones:

```
(SurfaceDuo) $ nano Platforms/SurfaceDuoPkg/Include/ACPI.inc
```
Comment out the first block, and uncomment out the second one.  
A quick way to do this is by highlighting the block with `Shift` + arrow keys, then pressing `Alt` + `3` on the keyboard.

Before:

![ACPI.inc before commenting out the first block](/img/ssh/9_before.png)

After:

![ACPI.inc after commenting out the first block](/img/ssh/10_after.png)

Save and exit.

Now, you are ready to build!!!!

## Step 5: Starting the build:

Double-check that you are in the build's virtual environment first:

```
$ python3 -m venv SurfaceDuo
$ source SurfaceDuo/bin/activate
```

Next, we will invoke Stuart, a tool that will check that the required repositories in the main tree are present and up-to-date. The repo includes a handy `./setup_uefi.sh` that makes this easy:

```
(SurfaceDuo) $ ./setup_uefi.sh
INFO:root:Log Started: Wednesday, May 25, 2022 05:41PM
SECTION:root:Init SDE
SECTION - Init SDE
DEBUG:root:--- self_describing_environment.load_workspace()
.
.
.
.
```

<details>
<summary>Complete command output</summary>

```
.
.
.
DEBUG:root:Loading workspace: /home/$user/MU-sm8150pkg
DEBUG:root:  Including scopes: SurfaceDuo, edk2-build, cibuild, global-nix, global
DEBUG:root:--- self_describing_environment.update_simple_paths()
DEBUG:root:--- self_describing_environment.update_extdep_paths()
DEBUG:root:--- self_describing_environment.report_extdep_version()
DEBUG:EnvDict:FINAL PATH:
DEBUG:EnvDict:/home/$user/MU-sm8150pkg/SurfaceDuo/bin, /usr/local/sbin, /usr/local/bin, /usr/sbin, /usr/bin, /sbin, /bi
n, /usr/games, /usr/local/games, /snap/bin
DEBUG:EnvDict:FINAL PYTHONPATH:
DEBUG:EnvDict:/home/$user/MU-sm8150pkg/SurfaceDuo/bin, /usr/lib/python38.zip, /usr/lib/python3.8, /usr/lib/python3.8/li
b-dynload, /home/$user/MU-sm8150pkg/SurfaceDuo/lib/python3.8/site-packages
DEBUG:EnvDict:FINAL ENVIRON:
DEBUG:EnvDict:(SHELL:/bin/bash), (TERMCAP:SC|screen.xterm-256color|VT 100/ANSI X3.64 virtual terminal:DO=\E[%dB:LE=\E[%d
D:RI=\E[%dC:UP=\E[%dA:bs:bt=\E[Z:cd=\E[J:ce=\E[K:cl=\E[H\E[J:cm=\E[%i%d;%dH:ct=\E[3g:do=^J:nd=\E[C:pt:rc=\E8:rs=\Ec:sc=\
E7:st=\EH:up=\EM:le=^H:bl=^G:cr=^M:it#8:ho=\E[H:nw=\EE:ta=^I:is=\E)0:li#50:co#120:am:xn:xv:LP:sr=\EM:al=\E[L:AL=\E[%dL:c
s=\E[%i%d;%dr:dl=\E[M:DL=\E[%dM:dc=\E[P:DC=\E[%dP:im=\E[4h:ei=\E[4l:mi:IC=\E[%d@:ks=\E[?1h\E=:ke=\E[?1l\E>:vi=\E[?25l:ve
=\E[34h\E[?25h:vs=\E[34l:ti=\E[?1049h:te=\E[?1049l:us=\E[4m:ue=\E[24m:so=\E[3m:se=\E[23m:mb=\E[5m:md=\E[1m:mh=\E[2m:mr=\
E[7m:me=\E[m:ms:Co#8:pa#64:AF=\E[3%dm:AB=\E[4%dm:op=\E[39;49m:AX:vb=\Eg:G0:as=\E(0:ae=\E(B:ac=\140\140aaffggjjkkllmmnnoo
ppqqrrssttuuvvwwxxyyzz{{||}}~~..--++,,hhII00:po=\E[5i:pf=\E[4i:Km=\E[M:k0=\E[10~:k1=\EOP:k2=\EOQ:k3=\EOR:k4=\EOS:k5=\E[1
5~:k6=\E[17~:k7=\E[18~:k8=\E[19~:k9=\E[20~:k;=\E[21~:F1=\E[23~:F2=\E[24~:kB=\E[Z:kh=\E[1~:@1=\E[1~:kH=\E[4~:@7=\E[4~:kN=
\E[6~:kP=\E[5~:kI=\E[2~:kD=\E[3~:ku=\EOA:kd=\EOB:kr=\EOC:kl=\EOD:km:), (WINDOW:0), (PWD:/home/$user/MU-sm8150pkg), (LOG
NAME:$user), (XDG_SESSION_TYPE:tty), (MOTD_SHOWN:pam), (HOME:/home/$user), (LANG:en_US.UTF-8), (LS_COLORS:rs=0:di=01;3
4:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=30;4
2:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=0
1;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;3
1:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:
*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:
*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:
*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;
35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:), (VIRTUAL_ENV:/home/$user/MU-sm8150pkg/SurfaceDuo), (SSH_CONNECTION:10.10.1.99 40521 10.10.1.126 22), (LESSCLOSE:/usr/bin/lesspipe %s %s), (XDG_SESSION_CLASS:user), (TERM:screen.xterm-256color), (LESSOPEN:| /usr/bin/lesspipe %s), (USER:$user), (SHLVL:2), (XDG_SESSION_ID:3094), (XDG_RUNTIME_DIR:/run/user/1000), (PS1:(SurfaceDuo) ${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ ), (SSH_CLIENT:10.10.1.99 40521 22), (XDG_DATA_DIRS:/usr/local/share:/usr/share:/var/lib/snapd/desktop), (DBUS_SESSION_BUS_ADDRESS:unix:path=/run/user/1000/bus), (SSH_TTY:/dev/pts/0), (OLDPWD:/home/$user), (_:/home/$user/MU-sm8150pkg/SurfaceDuo/bin/stuart_setup)
SECTION:root:Loading Plugins
SECTION - Loading Plugins
SECTION:root:Start Invocable Tool
SECTION - Start Invocable Tool
INFO:root:Cmd to run is: git config --file .gitmodules --get-regexp path
INFO:root:------------------------------------------------
INFO:root:--------------Cmd Output Starting---------------
INFO:root:------------------------------------------------
INFO:root:submodule.MU_BASECORE.path MU_BASECORE
INFO:root:submodule.Common/MU_TIANO.path Common/MU_TIANO
INFO:root:submodule.Common/MU.path Common/MU
INFO:root:submodule.Common/MU_OEM_SAMPLE.path Common/MU_OEM_SAMPLE
INFO:root:submodule.Silicon/ARM/TIANO.path Silicon/ARM/TIANO
INFO:root:submodule.Platforms/SurfaceDuoPkg/FirmwareBinaries.path Platforms/SurfaceDuoPkg/FirmwareBinaries
INFO:root:------------------------------------------------
INFO:root:--------------Cmd Output Finished---------------
INFO:root:--------- Running Time (mm:ss): 00:00 ----------
INFO:root:----------- Return Code: 0x00000000 ------------
INFO:root:------------------------------------------------
INFO:root:Cmd to run is: git --version
INFO:root:------------------------------------------------
INFO:root:--------------Cmd Output Starting---------------
INFO:root:------------------------------------------------
INFO:root:git version 2.25.1
INFO:root:------------------------------------------------
INFO:root:--------------Cmd Output Finished---------------
INFO:root:--------- Running Time (mm:ss): 00:00 ----------
INFO:root:----------- Return Code: 0x00000000 ------------
INFO:root:------------------------------------------------
DEBUG:root:Setting up version aggregator
DEBUG:version_aggregator:version_aggregator logging version: {'name': 'Git', 'version': 'git version 2.25.1', 'type': 'TOOL', 'path': None}
PROGRESS:root:## Syncing Git repositories: MU_BASECORE Common/MU_TIANO Common/MU Common/MU_OEM_SAMPLE Silicon/ARM/TIANO Platforms/SurfaceDuoPkg/FirmwareBinaries...
PROGRESS - ## Syncing Git repositories: MU_BASECORE Common/MU_TIANO Common/MU Common/MU_OEM_SAMPLE Silicon/ARM/TIANO Platforms/SurfaceDuoPkg/FirmwareBinaries...
DEBUG:root:Cmd to run is: git submodule sync -- MU_BASECORE Common/MU_TIANO Common/MU Common/MU_OEM_SAMPLE Silicon/ARM/TIANO Platforms/SurfaceDuoPkg/FirmwareBinaries
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:00 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
PROGRESS:root:Done.

PROGRESS - Done.

PROGRESS:root:## Checking Git repository: MU_BASECORE...
PROGRESS - ## Checking Git repository: MU_BASECORE...
DEBUG:root:Cmd to run is: git diff MU_BASECORE
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:00 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
INFO:root:## Fetching repo.
DEBUG:root:Cmd to run is: git submodule update --init --recursive --progress MU_BASECORE
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:Submodule 'MU_BASECORE' (https://github.com/microsoft/mu_basecore.git) registered for path 'MU_BASECORE'
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/MU_BASECORE'...
DEBUG:root:remote: Enumerating objects: 354608, done.
remote: Counting objects: 100% (28077/28077), done.
remote: Compressing objects: 100% (9534/9534), done.
remote: Total 354608 (delta 18467), reused 27361 (delta 18205), pack-reused 326531
Receiving objects: 100% (354608/354608), 292.12 MiB | 16.15 MiB/s, done.iB/s
Resolving deltas: 100% (267185/267185), done.
DEBUG:root:Submodule path 'MU_BASECORE': checked out 'c4d0d1130454b3e5051bb601c707234e3a91713a'
DEBUG:root:Submodule 'BaseTools/Source/C/BrotliCompress/brotli' (https://github.com/google/brotli) registered for path 'MU_BASECORE/BaseTools/Source/C/BrotliCompress/brotli'
DEBUG:root:Submodule 'CryptoPkg/Library/OpensslLib/openssl' (https://github.com/openssl/openssl) registered for path 'MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl'
DEBUG:root:Submodule 'MdeModulePkg/Library/BrotliCustomDecompressLib/brotli' (https://github.com/google/brotli) registered for path 'MU_BASECORE/MdeModulePkg/Library/BrotliCustomDecompressLib/brotli'
DEBUG:root:Submodule 'MdeModulePkg/Universal/RegularExpressionDxe/oniguruma' (https://github.com/kkos/oniguruma) registered for path 'MU_BASECORE/MdeModulePkg/Universal/RegularExpressionDxe/oniguruma'
DEBUG:root:Submodule 'UnitTestFrameworkPkg/Library/CmockaLib/cmocka' (https://github.com/tianocore/edk2-cmocka.git) registered for path 'MU_BASECORE/UnitTestFrameworkPkg/Library/CmockaLib/cmocka'
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/MU_BASECORE/BaseTools/Source/C/BrotliCompress/brotli'...
DEBUG:root:remote: Enumerating objects: 6548, done.
remote: Counting objects: 100% (469/469), done. )
remote: Compressing objects: 100% (233/233), done. )
remote: Total 6548 (delta 231), reused 428 (delta 221), pack-reused 6079
Receiving objects: 100% (6548/6548), 39.17 MiB | 8.88 MiB/s, done.iB/s
Resolving deltas: 100% (4144/4144), done.)
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl'...
DEBUG:root:remote: Enumerating objects: 426830, done.
remote: Counting objects: 100% (77/77), done. 7)
remote: Compressing objects: 100% (40/40), done. 0)
remote: Total 426830 (delta 51), reused 53 (delta 37), pack-reused 426753
Receiving objects: 100% (426830/426830), 251.72 MiB | 16.43 MiB/s, done.iB/s
Resolving deltas: 100% (300880/300880), done.
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/MU_BASECORE/MdeModulePkg/Library/BrotliCustomDecompressLib/brotli'...
DEBUG:root:remote: Enumerating objects: 6548, done.
remote: Counting objects: 100% (468/468), done. )
remote: Compressing objects: 100% (233/233), done. )
remote: Total 6548 (delta 231), reused 427 (delta 220), pack-reused 6080
Receiving objects: 100% (6548/6548), 39.17 MiB | 19.48 MiB/s, done.iB/s
Resolving deltas: 100% (4144/4144), done.)
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/MU_BASECORE/MdeModulePkg/Universal/RegularExpressionDxe/oniguruma'...
DEBUG:root:remote: Enumerating objects: 14686, done.
remote: Counting objects: 100% (867/867), done. )
remote: Compressing objects: 100% (296/296), done. )
remote: Total 14686 (delta 592), reused 816 (delta 569), pack-reused 13819
Receiving objects: 100% (14686/14686), 6.13 MiB | 10.62 MiB/s, done.iB/s
Resolving deltas: 100% (11032/11032), done.
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/MU_BASECORE/UnitTestFrameworkPkg/Library/CmockaLib/cmocka'...
DEBUG:root:remote: Enumerating objects: 3186, done.
remote: Counting objects: 100% (3186/3186), done.
remote: Compressing objects: 100% (1201/1201), done.
remote: Total 3186 (delta 1961), reused 3145 (delta 1920), pack-reused 0
Receiving objects: 100% (3186/3186), 931.36 KiB | 3.37 MiB/s, done.
Resolving deltas: 100% (1961/1961), done.)
DEBUG:root:Submodule path 'MU_BASECORE/BaseTools/Source/C/BrotliCompress/brotli': checked out 'f4153a09f87cbb9c826d8fc12c74642bb2d879ea'
DEBUG:root:Submodule path 'MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl': checked out 'd82e959e621a3d597f1e0d50ff8c2d8b96915fd7'
DEBUG:root:Submodule 'boringssl' (https://boringssl.googlesource.com/boringssl) registered for path 'MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl/boringssl'
DEBUG:root:Submodule 'krb5' (https://github.com/krb5/krb5) registered for path 'MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl/krb5'
DEBUG:root:Submodule 'pyca.cryptography' (https://github.com/pyca/cryptography.git) registered for path 'MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl/pyca-cryptography'
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl/boringssl'...
DEBUG:root:remote: Sending approximately 262.82 MiB ...
remote: Counting objects: 15, dones: 1
remote: Total 87901 (delta 53048), reused 87901 (delta 53048)/s
Receiving objects: 100% (87901/87901), 262.82 MiB | 30.42 MiB/s, done.iB/s
Resolving deltas: 100% (53048/53048), done.
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl/krb5'...
DEBUG:root:remote: Enumerating objects: 250862, done.
remote: Counting objects: 100% (1870/1870), done.
remote: Compressing objects: 100% (764/764), done. )
remote: Total 250862 (delta 1229), reused 1501 (delta 1092), pack-reused 248992
Receiving objects: 100% (250862/250862), 73.85 MiB | 9.75 MiB/s, done.MiB/s
Resolving deltas: 100% (201778/201778), done.
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl/pyca-cryptography'...
DEBUG:root:remote: Enumerating objects: 65601, done.
remote: Counting objects: 100% (347/347), done. )
remote: Compressing objects: 100% (189/189), done. )
remote: Total 65601 (delta 201), reused 272 (delta 153), pack-reused 65254
Receiving objects: 100% (65601/65601), 50.99 MiB | 10.21 MiB/s, done.B/s
Resolving deltas: 100% (44903/44903), done.
DEBUG:root:Submodule path 'MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl/boringssl': checked out '2070f8ad9151dc8f3a73bffaa146b5e6937a583f'
DEBUG:root:Submodule path 'MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl/krb5': checked out '890ca2f401924cdcb88f493950b04700bbe52db3'
DEBUG:root:Submodule path 'MU_BASECORE/CryptoPkg/Library/OpensslLib/openssl/pyca-cryptography': checked out '09403100de2f6f1cdd0d484dcb8e620f1c335c8f'
DEBUG:root:Submodule path 'MU_BASECORE/MdeModulePkg/Library/BrotliCustomDecompressLib/brotli': checked out 'f4153a09f87cbb9c826d8fc12c74642bb2d879ea'
DEBUG:root:Submodule path 'MU_BASECORE/MdeModulePkg/Universal/RegularExpressionDxe/oniguruma': checked out 'abfc8ff81df4067f309032467785e06975678f0d'
DEBUG:root:Submodule path 'MU_BASECORE/UnitTestFrameworkPkg/Library/CmockaLib/cmocka': checked out '1cc9cde3448cdd2e000886a26acf1caac2db7cf1'
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 01:45 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
PROGRESS:root:Done.

PROGRESS - Done.

PROGRESS:root:## Checking Git repository: Common/MU_TIANO...
PROGRESS - ## Checking Git repository: Common/MU_TIANO...
DEBUG:root:Cmd to run is: git diff Common/MU_TIANO
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:00 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
INFO:root:## Fetching repo.
DEBUG:root:Cmd to run is: git submodule update --init --recursive --progress Common/MU_TIANO
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:Submodule 'Common/MU_TIANO' (https://github.com/microsoft/mu_tiano_plus.git) registered for path 'Common/MU_TIANO'
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/Common/MU_TIANO'...
DEBUG:root:remote: Enumerating objects: 332895, done.
remote: Counting objects: 100% (22067/22067), done.
remote: Compressing objects: 100% (7976/7976), done.
remote: Total 332895 (delta 13790), reused 21976 (delta 13748), pack-reused 310828
Receiving objects: 100% (332895/332895), 281.50 MiB | 16.51 MiB/s, done.iB/s
Resolving deltas: 100% (251201/251201), done.
DEBUG:root:Submodule path 'Common/MU_TIANO': checked out '7ad842b9a78d2b09e5fb9a4b1d67e6ac5c68e8f7'
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:25 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
PROGRESS:root:Done.

PROGRESS - Done.

PROGRESS:root:## Checking Git repository: Common/MU...
PROGRESS - ## Checking Git repository: Common/MU...
DEBUG:root:Cmd to run is: git diff Common/MU
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:00 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
INFO:root:## Fetching repo.
DEBUG:root:Cmd to run is: git submodule update --init --recursive --progress Common/MU
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:Submodule 'Common/MU' (https://github.com/microsoft/mu_plus.git) registered for path 'Common/MU'
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/Common/MU'...
DEBUG:root:remote: Enumerating objects: 11488, done.
remote: Counting objects: 100% (2871/2871), done.
remote: Compressing objects: 100% (1390/1390), done.
remote: Total 11488 (delta 1455), reused 2812 (delta 1417), pack-reused 8617
Receiving objects: 100% (11488/11488), 11.54 MiB | 14.83 MiB/s, done.B/s
Resolving deltas: 100% (6932/6932), done.)
DEBUG:root:Submodule path 'Common/MU': checked out '0bffb27765d4147e5811caa593ce7d7011066c59'
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:02 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
PROGRESS:root:Done.

PROGRESS - Done.

PROGRESS:root:## Checking Git repository: Common/MU_OEM_SAMPLE...
PROGRESS - ## Checking Git repository: Common/MU_OEM_SAMPLE...
DEBUG:root:Cmd to run is: git diff Common/MU_OEM_SAMPLE
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:00 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
INFO:root:## Fetching repo.
DEBUG:root:Cmd to run is: git submodule update --init --recursive --progress Common/MU_OEM_SAMPLE
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:Submodule 'Common/MU_OEM_SAMPLE' (https://github.com/microsoft/mu_oem_sample.git) registered for path 'Common/MU_OEM_SAMPLE'
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/Common/MU_OEM_SAMPLE'...
DEBUG:root:remote: Enumerating objects: 843, done.
remote: Counting objects: 100% (50/50), done. 0)
remote: Compressing objects: 100% (35/35), done. 5)
remote: Total 843 (delta 19), reused 31 (delta 14), pack-reused 793
Receiving objects: 100% (843/843), 604.95 KiB | 2.31 MiB/s, done.
Resolving deltas: 100% (491/491), done.1)
DEBUG:root:Submodule path 'Common/MU_OEM_SAMPLE': checked out 'b39df09486c3500fa83bca7b80cbb1cfe5940ced'
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:01 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
PROGRESS:root:Done.

PROGRESS - Done.

PROGRESS:root:## Checking Git repository: Silicon/ARM/TIANO...
PROGRESS - ## Checking Git repository: Silicon/ARM/TIANO...
DEBUG:root:Cmd to run is: git diff Silicon/ARM/TIANO
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:00 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
INFO:root:## Fetching repo.
DEBUG:root:Cmd to run is: git submodule update --init --recursive --progress Silicon/ARM/TIANO
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:Submodule 'Silicon/ARM/TIANO' (https://github.com/microsoft/mu_silicon_arm_tiano.git) registered for path 'Silicon/ARM/TIANO'
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/Silicon/ARM/TIANO'...
DEBUG:root:remote: Enumerating objects: 331838, done.
remote: Counting objects: 100% (22726/22726), done.
remote: Compressing objects: 100% (8161/8161), done.
remote: Total 331838 (delta 14271), reused 22671 (delta 14242), pack-reused 309112
Receiving objects: 100% (331838/331838), 279.30 MiB | 23.97 MiB/s, done.iB/s
Resolving deltas: 100% (251040/251040), done.
DEBUG:root:Submodule path 'Silicon/ARM/TIANO': checked out 'f822a8bd79e0b3f54b0c0e94b31f1fbd7876e908'
DEBUG:root:Submodule 'SoftFloat' (https://github.com/ucb-bar/berkeley-softfloat-3.git) registered for path 'Silicon/ARM/
TIANO/ArmPkg/Library/ArmSoftFloatLib/berkeley-softfloat-3'
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/Silicon/ARM/TIANO/ArmPkg/Library/ArmSoftFloatLib/berkeley-softfloat-3'...
DEBUG:root:remote: Enumerating objects: 2559, done.
remote: Counting objects: 100% (4/4), done. /4)
remote: Compressing objects: 100% (4/4), done. /4)
remote: Total 2559 (delta 0), reused 0 (delta 0), pack-reused 2555
Receiving objects: 100% (2559/2559), 760.34 KiB | 2.30 MiB/s, done.
Resolving deltas: 100% (2349/2349), done.)
DEBUG:root:Submodule path 'Silicon/ARM/TIANO/ArmPkg/Library/ArmSoftFloatLib/berkeley-softfloat-3': checked out 'b64af41c3276f97f0e181920400ee056b9c88037'
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:21 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
PROGRESS:root:Done.

PROGRESS - Done.

PROGRESS:root:## Checking Git repository: Platforms/SurfaceDuoPkg/FirmwareBinaries...
PROGRESS - ## Checking Git repository: Platforms/SurfaceDuoPkg/FirmwareBinaries...
DEBUG:root:Cmd to run is: git diff Platforms/SurfaceDuoPkg/FirmwareBinaries
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:00 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
INFO:root:## Fetching repo.
DEBUG:root:Cmd to run is: git submodule update --init --recursive --progress Platforms/SurfaceDuoPkg/FirmwareBinaries
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Starting---------------
DEBUG:root:------------------------------------------------
DEBUG:root:Submodule 'Platforms/SurfaceDuoPkg/FirmwareBinaries' (https://github.com/WOA-Project/SurfaceDuoBinaries.git)
registered for path 'Platforms/SurfaceDuoPkg/FirmwareBinaries'
DEBUG:root:Cloning into '/home/$user/MU-sm8150pkg/Platforms/SurfaceDuoPkg/FirmwareBinaries'...
DEBUG:root:remote: Enumerating objects: 1096, done.
remote: Counting objects: 100% (654/654), done. )
remote: Compressing objects: 100% (392/392), done. )
remote: Total 1096 (delta 168), reused 634 (delta 149), pack-reused 442
Receiving objects: 100% (1096/1096), 22.58 MiB | 14.13 MiB/s, done.iB/s
Resolving deltas: 100% (259/259), done.9)
DEBUG:root:Submodule path 'Platforms/SurfaceDuoPkg/FirmwareBinaries': checked out '6cda1d996fe517432b5c7fa6f309b5cc8e4a7
4da'
DEBUG:root:------------------------------------------------
DEBUG:root:--------------Cmd Output Finished---------------
DEBUG:root:--------- Running Time (mm:ss): 00:04 ----------
DEBUG:root:----------- Return Code: 0x00000000 ------------
DEBUG:root:------------------------------------------------
PROGRESS:root:Done.

PROGRESS - Done.

SECTION:root:Summary
SECTION - Summary
PROGRESS:root:Success
PROGRESS - Success
SECTION - Init SDE
SECTION - Loading Plugins
SECTION - Start Invocable Tool
SECTION - Initial update of environment
Updating..... Done
SECTION -       Updated/Verified 5 dependencies
SECTION - Second pass update of environment
Updating. Done
SECTION -       Updated/Verified 5 dependencies
SECTION - Summary
PROGRESS - Success
(SurfaceDuo) $ 
```
</details>

Run this PowerShell script that will "stamp" our build:

```
(SurfaceDuo) $ pwsh ./build_releaseinfo.ps1
Stamp build.
(SurfaceDuo) $
```
**IMPORTANT: Not doing this step will result in a cryptic error message about a missing file.**

And finally, the moment of truth ... kickstart the build as follows:

```
(SurfaceDuo) $ ./build_uefi.sh
```

This will start building the UEFI firmware. It'll take a short while ... so, relax and enjoy the ride!

Once it is succeeds, you'll find the resulting `SM8150_EFI.fd` under `Build/SurfaceDuo-AARCH64/DEBUG_CLANG38/FV/SM8150_EFI.fd`

## Step 6: Packaging into an Android boot image

For this, you will need a copy of your stock boot image. Retrieve that from the firmware dump that we extracted using `payload_dumper.py` , and copy or move it to the `~/mnt/uefi` directory created by the `build_uefi.sh` script:

```bash
(SurfaceDuo) $ mv ~/stock_rom/payload_dumper/output/boot.img ~/mnt/uefi/
(SurfaceDuo) $ cd ~/mnt/uefi
(SurfaceDuo) $
```

Then, we will run `abootimg` with the `-x` option to unpack our boot image:
```bash
(SurfaceDuo) $ abootimg -x boot.img
writing boot image config in bootimg.cfg
extracting kernel in zImage
extracting ramdisk in initrd.img
extracting device tree image in dt.img
```

**ON YOUR PHONE**, do this step to dump the Flat Device Tree:
```
# dd if=/sys/firmware/fdt of=/sdcard/fdt.dd
```
Copy this file to the `~/mnt/uefi/` folder on your Linux computer.

Next, take the `SM8150_EFI.fd.gz` file generated by the build process, and make a copy of it as follows:
```bash
(SurfaceDuo) $ cp SM8150_EFI.fd.gz tmp.gz
(SurfaceDuo) $ 
```
Now we will concatenate the Flat Device Tree we have dumped above to the end of the EFI binary:
```bash
(SurfaceDuo) $ cat fdt.dd >> tmp.gz
(SurfaceDuo) $ 
```
Once that's taken care of, we can now (finally!) generate the Android boot image!

```bash
(SurfaceDuo) $ abootimg --create uefi_test.img -k ~/mnt/uefi/tmp.gz -r initrd.img -f bootimg.cfg
reading config file bootimg.cfg
reading kernel from tmp.gz
reading ramdisk from initrd.img
Writing Boot Image uefi_test.img
(SurfaceDuo) $ ls uefi_test.img
uefi_test.img
(SurfaceDuo) $ 
```

# **Congratulations, you have successfully built your own Renegade UEFI image!**
