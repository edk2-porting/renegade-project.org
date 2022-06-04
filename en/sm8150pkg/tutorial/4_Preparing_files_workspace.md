# Patching your firmware binaries to fix USB FN and buttons

### Preparing the files and patching workspace:

Now, that we've booted the UEFI image, you might have noticed that USB Mass Storage Mode doesn't work, and the buttons might not be fully functional. Fortunately, fixing that is a matter of patching the DXE (**D**river e**X**ecution **E**nvironment) binaries responsible for those two.

To do that, we will first look at how binaries for the Surface Duo and Xiaomi phones were patched to determine the patch pattern, then we will find the matching "instruction" within our binary and patch it. We have to do all this manually since (a) the offset, and (b) the actual instruction to be patched might differ.

**We will be using the free software reverse-engineering suite Ghidra (depends on JDK 11 - make sure to install that as well!) and two Linux commandline programs, `hexdump` and `diff`, that in most cases should preinstalled with your Linux distribution.**

First, navigate to the root directory of the project (which is in your user folder, assuming you have been following the [Build Environment Setup](en/sm8150pkg/tutorial/2_Build_environment_setup.md) page):

```
$ cd ~/MU-sm8150pkg/
$
```

We will be patching two binaries, a `UsbConfigDxe.efi` which handles USB subsystem configuration, and `ButtonsDxe.efi` which is responsible for button mapping.
Let's copy them to a working directory - as usual, **replace the manufacturer and model names accordingly** :

```
$ mkdir ~/work
$ cp Platforms/SurfaceDuoPkg/CustomizedBinaries/[YOUR_DEVICE_MAKE]/[YOUR_DEVICE_MODEL]/{UsbConfigDxe.efi,ButtonDxe.efi} ~/work
$
```

We will have to copy the reference Xiaomi files that we will be comparing against. The first line copies the **unpatched** binary, while the second line copies the **patched** one.  
**Pay special attention to capitalization and the destination filenames!**

```
$ cp Platforms/SurfaceDuoPkg/CustomizedBinaries/XiaoMi/Andromeda_MIX3_5G/ButtonsDxe.efi ~/work/ButtonsDxe.Mix3.efi
$ cp Platforms/SurfaceDuoPkg/CustomizedBinaries/XiaoMi/Andromeda_MIX3_5G/UsbConfigDxe.efi  ~/work/UsbConfigDxe.Mix3.efi
$ cp Platforms/SurfaceDuoPkg/PatchedBinaries/Xiaomi/ButtonsDxe.efi ~/work/ButtonsDxe.Mix3.patched.efi
$ cp Platforms/SurfaceDuoPkg/PatchedBinaries/Xiaomi/UsbConfigDxe.efi ~/work/UsbConfigDxe.Mix3.patched.efi
```

The unpatched Surface Duo files will be a little trickier. They're in our source tree, but they don't have the original filenames - luckily though, the file names are mapped to the source tree directory layout in `Include/DXE?.inc`. 
I have copied the path for your convenience, but if you want to know how to manually find the path yourself, see the spoiler section below.

<details>
<summary>Obtaining the file path of Surface Duo firmware binaries</summary>

Open your `Include/DXE?.inc` file as follows:
**(substitute `?` with your device's target number!)**
```
$ nano Platforms/SurfaceDuoPkg/Include/DXE?.inc
```

Find `UsbConfigDxe` - you will find it in the following snippet:
```
    FILE DRIVER = cd823a4d-7dec-4531-ae5d-4134fa4127b8 {
            SECTION DXE_DEPEX = SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-cd823a4d-7dec-4531-ae5d-4134fa4127b8/section0.dxe.depex
#            SECTION PE32 = SurfaceDuoPkg/PatchedBinaries/UsbConfigDxe.efi
            SECTION PE32 = SurfaceDuoPkg/PatchedBinaries/Xiaomi/UsbConfigDxe.efi
            SECTION UI = "UsbConfigDxe"
    }
```

Copy the pathname in the `SECTION DXE_DEPEX` line:

```
SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-cd823a4d-7dec-4531-ae5d-4134fa4127b8/section0.dxe.depex
```

Then, remove the filename, and append `Platforms` to the beginning:

```
Platforms/SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-cd823a4d-7dec-4531-ae5d-4134fa4127b8/
```

This is the path of the folder where the Surface Duo's `UsbConfigDxe.efi` is, with `file-???` containing the UUID of the `UsbConfigDxe.efi` binary. Let's see what's in that folder:

```
$ ls Platforms/SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-cd823a4d-7dec-4531-ae5d-4134fa4127b8/
section0.dxe.depex  section1.pe  section2.ui
```

Here, `section1.pe` is the EFI binary that we're after (PE stands for "**P**ortable **E**xecutable", which is the format of executables used by both Windows and UEFI).

**The same steps above apply to `ButtonsDxe.efi` as well - repeat and substitute accordingly.**

</details>

Copy the unpatched Surface Duo binaries:

```
$ cp Platforms/SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-cd823a4d-7dec-4531-ae5d-4134fa4127b8/section1.pe ~/work/UsbConfigDxe.SDPkg.efi
$ cp Platforms/SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-5bd181db-0487-4f1a-ae73-820e165611b3/section1.pe ~/work/ButtonsDxe.SDPkg.efi
```

And finally, copy the patched Surface Duo binaries as follows:

```
$ cp Platforms/SurfaceDuoPkg/PatchedBinaries/ButtonsDxe.efi ~/work/ButtonsDxe.SDPkg.patched.efi
$ cp Platforms/SurfaceDuoPkg/PatchedBinaries/UsbConfigDxe.efi ~/work/UsbConfigDxe.SDPkg.patched.efi
```

Now, let's change to our work directory:

```
$ cd ~/work
$
```

You should have **ten** files in there:
```
$ ls
ButtonsDxe.efi               ButtonsDxe.SDPkg.efi          UsbConfigDxe.Mix3.efi          UsbConfigDxe.SDPkg.patched.efi
ButtonsDxe.Mix3.efi          ButtonsDxe.SDPkg.patched.efi  UsbConfigDxe.Mix3.patched.efi
ButtonsDxe.Mix3.patched.efi  UsbConfigDxe.efi              UsbConfigDxe.SDPkg.efi

$ ls | wc -l
10
```

Let's hex-dump all the binaries in that folder to `.hex` files:

```
$ for i in $(ls); do hexdump -C $i > $i.hex ; done
$
```

Now, for each file, we should have a corresponding `.hex` file with a hex dump of the contents:

```
$ ls
ButtonsDxe.efi                   ButtonsDxe.SDPkg.efi.hex          UsbConfigDxe.Mix3.patched.efi
ButtonsDxe.efi.hex               ButtonsDxe.SDPkg.patched.efi      UsbConfigDxe.Mix3.patched.efi.hex
ButtonsDxe.Mix3.efi              ButtonsDxe.SDPkg.patched.efi.hex  UsbConfigDxe.SDPkg.efi
ButtonsDxe.Mix3.efi.hex          UsbConfigDxe.efi                  UsbConfigDxe.SDPkg.efi.hex
ButtonsDxe.Mix3.patched.efi      UsbConfigDxe.efi.hex              UsbConfigDxe.SDPkg.patched.efi
ButtonsDxe.Mix3.patched.efi.hex  UsbConfigDxe.Mix3.efi             UsbConfigDxe.SDPkg.patched.efi.hex
ButtonsDxe.SDPkg.efi             UsbConfigDxe.Mix3.efi.hex

$ ls | wc -l
20
```

Perfect! Now, with that done, let's proceed to the next step: [analyzing the firmware binaries](en/sm8150pkg/tutorial/5_Analyzing_patching_firmware_binaries.md)!
