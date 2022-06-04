# Porting edk2 UEFI to SM8150 devices

# This document has been deprecated. Please see[ the Mu-SM8150pkg tutorial](en/sm8150pkg/tutorial/) for the most up-to-date version.

> This is a *temporary* solution to support multiple devices with the preliminary Multi-Device Framework

## NOTICE
	
!> This is only a guide for you to port UEFI. 
   If you want Windows support, you'll have to to **adapt DSDT** for your device.

!> A set of generic ACPI is ready for you by default.
   For newer ACPI, please check [SDPKG](https://github.com/WOA-Project/SurfaceDuoPkg) and modify it yourself.

	It had taken sunflower2333 two hours to write this doc before Sophon spent 30 min to fix grammar.
	Help sunflower2333 correct it if you find any mistakes in it. Thank you!

## 1. Add a new device in [ Platforms/SurfaceDuoPkg/SurfaceDuo.dsc](https://github.com/sunflower2333/MU-sm8150pkg/blob/main/Platforms/SurfaceDuoPkg/SurfaceDuo.dsc)

You might have found there is a macro defined in it:
```diff
 #
 # Build ID Tables
 #
 #
 #    0. Xiaomi Mix3 5g (andromeda)
 #    1. Xiaomi Pad 5   (nabu)                                         
 #    2. LG G8          (waiting...)
 #    3. Xiaomi K20 Pro (raphael)
 #    // Add your device here. For example:
+#    4. OnePlus 7	    (guacamoleb)
 #

+  DEFINE BUILD_DEVICE_ID	= 3
       // ^--- By changing the ID of the macro, you can set which device you want to build.
       //      It's used to switch between configurations.
```
	
## 2. Set your device's resolution in Platforms/SurfaceDuoPkg/SurfaceDuo.dsc

After adding device ID, you should write some configs for it.

Here's an example:

```diff
   #
   # Screen Resolution Config (Do Not Edit)
   #

+#OnePlus 7

+  !if $(BUILD_DEVICE_ID) == 0 
                          // ^--This is the ID you defined for your device before.
+       gSurfaceDuoPkgTokenSpaceGuid.PcdMipiFrameBufferWidth|1080    
                                                          // ^-- This is Width. 
+       gSurfaceDuoPkgTokenSpaceGuid.PcdMipiFrameBufferHeight|2340
                                                           // ^-- This is Height. 
                                                           // Don't mix them up.
+  !endif
```

!> Please attach your config after the last one instead of just changing original configuration. You are not lazy, right?


## 3. Get your device's firmware binaries

> Each device has its own firmware and you need to add it before building.

You can also read the [Readme file under Platforms/SurfaceDuoPkg/FirmwareBinaries](https://github.com/sunflower2333/MU-sm8150pkg/blob/main/Platforms/SurfaceDuoPkg/PatchedBinaries/Readme.md), which shows a way to get firmware binaries.

(But I prefer to use 7z to extract binaries form xbl.elf :D)

Anyway, you should get your device's EFI files.

Put these files under `CustomizedBinaries/BAND/CODENAME_NAME_XXX/`

Then, please do as follows:

- First, copy `DXE0.inc` to `DXEx.inc` (`x` is the ID you set before)

- Second, open `DXEx.inc`

- Third, find `SECTION PE32 = SurfaceDuoPkg/CustomizedBinaries/XXXXX/XXXXX/XXXXX.efi`

- What you need to do now is just edit the path

REMEMBER, **DO NOT REMOVE ANY PARTS IF NOT NECESSARY**

!> WARNING:

	 ! What I want to say is, this step might be really important.
	 ! I once added Xiaomi MIX 3 5G's firmware binaries and tested uefi on QRD 855.
	 ! However, after some tests, its debug board burnt.
	 ! Another QRD also met with the problem.
	 ! I can not determine what caused the death.
	 ! Anyway, it was certainly not caused by PEP, because I haven't installed it.
	 ! So, don't be lazy. Remember to replace the binaries.


## 4. Configure your device-specific binaries
 
Open `Platforms/SurfaceDuoPkg/SurfaceDuo.fdf` and find this part:

```
#
# Choose Binaries Configuration Here.
#

 #MIX3 5G
// ^------ Your device's name

!if $(BUILD_DEVICE_ID) == 0
                       // ^-- Your device's ID.

    !include SurfaceDuoPkg/Include/DXE0.inc
                                   // ^--- Binaries configuration, which is used to set what you want to add and where they are.
                                   //      Set it to the one you just modified.
!endif
```

## 5. You have finished all the work. Just GO and BUILD!

## 6. Additional Step

If UEFI doesn't seem to be booting on your device, you may have to patch dxes.

Check "[Platforms/SurfaceDuoPkg/PatchedBinaries/Readme.md](https://github.com/sunflower2333/MU-sm8150pkg/blob/main/Platforms/SurfaceDuoPkg/PatchedBinaries/Readme.md)" and patch your device's binaries.

