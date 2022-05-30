# Broad overview

The process overall is *surprisingly* simple, yet there are quite a few steps. Once you're done, you'll find it very easy.

It is divided into four main parts:
1. Installation of prerequisite packages
2. Extraction of the device tree and firmware binaries
3. Preparation of the build environment
4. Adding the new device to the build system as a target (colloquially referred to as a bring-up)

That last part itself is divided into six steps.
The whole process is expected to take about two hours for the first attempt, but will definitely take much less without the learning curve (experienced users could do it from start to finish in 10 minutes).

This page will explain the first two parts.

**Let's start, shall we?**

# Prerequisite packages

For this, we'll need the following programs:

`git` - to download and upload repositories from GitHub  
`python` - many tools that we will be using are written in Python. (Most modern Linux systems have this preinstalled)  
`abootimg` - to extract and pack Android boot images.

In addition, we will also need a **Windows computer or virtual machine** with the Windows version of [7-Zip File Manager](http://7-zip.org/download.html) (`7zFM.exe`) to extract files out of the stock bootloader image.

To install these on Ubuntu, run the following command:   
```
$ sudo apt install git python abootimg
```

# Extraction of required firmware binaries from the phone and the stock bootloader image

Our first stop will be extracting the Device Tree Blob (DTB) from the phone.

On your rooted phone (in a terminal or using `adb shell`), run this command:

```
$ su
# dd if=/sys/firmware/fdt of=/sdcard/fdt.dd
```

You will have a file, `fdt.dd`, that is less than 1 MB in size in the root of your internal storage. 
Copy it to your computer, preferably using ADB, as MTP is flaky and may corrupt the file.

```
$ adb pull /sdcard/fdt.dd
```

Checking the file's hash is recommended.

Keep this file aside for now - we will be using it later on.

Know your device's **codename** - each model of Android device has a codename given to it by its engineers.
This will help you with researching information about your device, and will also be used by the build process to refer to your specific phone.
To find it out, run this command:

```
$ adb shell "getprop ro.product.device"
guacamole
$

```

This tells us that the codename for my OnePlus 7 Pro is `guacamole`. That's neat!
Device manufacturers often follow an interesting theme with codenames: OnePlus uses food, and Google uses names of fish, while Xiaomi uses names of things like luxury watches and famous artists.

**Next**, we will be extracting the bootloader, `XBL.img` , from the stock firmware image.

A good, accessible write-up of what `XBL` (e**X**tensible **B**oot**L**oader) is, which describes in ample detail what it does and what it consists of, can be found here: http://worthdoingbadly.com/qcomxbl   

We'll need to extract this bootloader image because it contains files that are specific for your phone model - using files intended for other models might result in burning the PMIC on the motherboard! **(read: irreversible damage)**

I'll be using a ZIP file of OxygenOS 11 for my OnePlus 7 Pro for this example: `OnePlus7ProOxygen_21.P.41_OTA_0410_all_2112101753_1517d4e8f.zip`

First, create a working directory in your user home and place the ZIP file in it:
```bash
$ cd ~
$ mkdir stock_rom
$ mv /path/to/OnePlus7ProOxygen_21.P.41_OTA_0410_all_2112101753_1517d4e8f.zip stock_rom
$ cd stock_rom
$
```

Now you should be in the `stock_rom` directory you just created. To confirm:

```bash
$ pwd 
/home/<your username>/stock_rom
$
```

Then, download and prepare `payload_dumper.py` as follows: (Python 3 and git must be installed)
```bash
$ git clone https://github.com/vm03/payload_dumper
Cloning into 'payload_dumper'...
remote: Enumerating objects: 83, done.
remote: Counting objects: 100% (33/33), done.
remote: Compressing objects: 100% (17/17), done.
remote: Total 83 (delta 26), reused 16 (delta 16), pack-reused 50
Receiving objects: 100% (83/83), 18.76 KiB | 1.44 MiB/s, done.
Resolving deltas: 100% (41/41), done.
$ cd payload_dumper
$ sudo pip install protobuf bsdiff4
Collecting protobuf
  Downloading protobuf-3.20.1-cp38-cp38-manylinux_2_5_x86_64.manylinux1_x86_64.whl (1.0 MB)
     |████████████████████████████████| 1.0 MB 635 kB/s
Collecting bsdiff4
  Downloading bsdiff4-1.2.2-cp38-cp38-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (31 kB)
Installing collected packages: protobuf, bsdiff4
Successfully installed bsdiff4-1.2.2 protobuf-3.20.1
```

Now that we have `payload_dumper.py` prepared, move the stock ROM's ZIP file to the `payload_dumper` directory:

```bash
$ mv ../OnePlus7ProOxygen_21.P.41_OTA_0410_all_2112101753_1517d4e8f.zip ./
```

To confirm that it was successfully moved, do this: 
```bash
$ ls
Dockerfile                                                       output             README.md
old                                                              payload_dumper.py  requirements.txt
OnePlus7ProOxygen_21.P.41_OTA_0410_all_2112101753_1517d4e8f.zip  __pycache__        update_metadata_pb2.py
```
Once that is done, extract the ZIP file:
```bash
$ unzip OnePlus7ProOxygen_21.P.41_OTA_0410_all_2112101753_1517d4e8f.zip
Archive:  OnePlus7ProOxygen_21.P.41_OTA_0410_all_2112101753_1517d4e8f.zip
signed by SignApk
 extracting: META-INF/com/android/metadata
 extracting: care_map.pb
 extracting: payload.bin
 extracting: payload_properties.txt
  inflating: META-INF/com/android/otacert
$
```

Then, run `payload_dumper.py` on the extracted `payload.bin` file:

```bash
$ python ./payload_dumper.py payload.bin
Processing LOGO partition....Done
Processing abl partition..Done
Processing boot partition................................................Done
Processing dtbo partition........Done
Processing odm partition..................................................Done
Processing system partition........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................Done
Processing vbmeta partition.Done
Processing vendor partition................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................Done
Processing aop partition.Done
Processing bluetooth partition.Done
Processing cmnlib64 partition.Done
Processing cmnlib partition.Done
Processing devcfg partition.Done
Processing dsp partition................................Done
Processing hyp partition.Done
Processing keymaster partition.Done
Processing modem partition..................................................................................Done
Processing qupfw partition.Done
Processing storsec partition.Done
Processing tz partition..Done
Processing xbl_config partition.Done
Processing xbl partition..Done
Processing oem_stanvbk partition.Done
Processing reserve partition........................................................................................................................................................................................................................................................................................................Done
Processing india partition....................................................................................................................................................................Done
$
```

You'll find the output in the `output/` directory:
```bash
$ cd output
$ ls
LOGO.img       boot.img      dsp.img    keymaster.img    qupfw.img    tz.img      xbl_config.img
abl.img        cmnlib.img    dtbo.img   modem.img        reserve.img  vbmeta.img
aop.img        cmnlib64.img  hyp.img    odm.img          storsec.img  vendor.img
bluetooth.img  devcfg.img    india.img  oem_stanvbk.img  system.img   xbl.img
```

Of all these files, we need just one file: `xbl.img`. **Copy it over to the Windows machine.**

**Once on the Windows machine**, create a new folder on your Desktop, and move the `xbl.img` file to it. 
Then, open 7-Zip from the Start menu, then navigate to that folder:  

![folder containing xbl.img open in 7-Zip File Manager on Windows](/img/0.png)

Then, right-click `xbl.img`, and select "Open Inside #". Make sure you select the correct Open Inside option, as the other ones won't work!  

![7-Zip File Manager window after right-clicking on xbl.img, with "Open Inside #" highlighted](/img/1.png)

Proceed with opening the subfiles as follows:
![](/img/2.png)
![](/img/3.png)
![](/img/4.png)
![](/img/5.png)
![](/img/6.png)
![](/img/7.png)
![](/img/8.png)
  
Finally, you will arrive at a file listing similar to the one below:
![7-Zip File Manager window showing a listing of EFI bootloader files](/img/9_final.png)

Extract it to a folder:
![7-Zip File Manager extract dialog, destination is a new folder](/img/10.png)

Then **copy that folder over to your Linux computer.**  
Once it is copied, [proceed to the next section](en/sm8150pkg/tutorial/2_Build_environment_setup.md).


