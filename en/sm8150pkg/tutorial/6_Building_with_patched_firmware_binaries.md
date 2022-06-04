### Building with the newly patched firmware binaries

Make new directories under the `PatchedBinaries` hierarchy for your device:

```
$ cd ~/MU-sm8150pkg
$ mkdir -p Platforms/SurfaceDuoPkg/PatchedBinaries/[YOUR_DEVICE_MAKE]/[YOUR_DEVICE_MODEL]/
$ cp ~/UsbConfigDxe.patched.efi Platforms/SurfaceDuoPkg/PatchedBinaries/[YOUR_DEVICE_MAKE]/[YOUR_DEVICE_MODEL]/UsbConfigDxe.efi
$ cp ~/ButtonsDxe.patched.efi Platforms/SurfaceDuoPkg/PatchedBinaries/[YOUR_DEVICE_MAKE]/[YOUR_DEVICE_MODEL]/ButtonsDxe.efi
$
```

Now, open your device's `Platforms/SurfaceDuoPkg/Include/DXE?.inc` and find `UsbConfigDxe.efi` :

```
    FILE DRIVER = cd823a4d-7dec-4531-ae5d-4134fa4127b8 {
            SECTION DXE_DEPEX = SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-cd823a4d-7dec-4531-ae5d-4134fa4127b8/section0.dxe.depex
            SECTION PE32 = SurfaceDuoPkg/PatchedBinaries/[YOUR_DEVICE_MAKE]/[YOUR_DEVICE_MODEL]/UsbConfigDxe.efi
            SECTION UI = "UsbConfigDxe"
    }
```

Replace the `PE32` path with the path to the patched binary under `PatchedBinaries`:

```
    FILE DRIVER = cd823a4d-7dec-4531-ae5d-4134fa4127b8 {
            SECTION DXE_DEPEX = SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-cd823a4d-7dec-4531-ae5d-4134fa4127b8/section0.dxe.depex
            SECTION PE32 = SurfaceDuoPkg/PatchedBinaries/[YOUR_DEVICE_MAKE]/[YOUR_DEVICE_MODEL]/UsbConfigDxe.efi
            SECTION UI = "UsbConfigDxe"
    }
```

Next, find `ButtonsDxe.efi` :

```
    FILE DRIVER = 5bd181db-0487-4f1a-ae73-820e165611b3 {
            SECTION DXE_DEPEX = SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-cd823a4d-7dec-4531-ae5d-4134fa4127b8/section0.dxe.depex
            SECTION PE32 = SurfaceDuoPkg/PatchedBinaries/[YOUR_DEVICE_MAKE]/[YOUR_DEVICE_MODEL]/UsbConfigDxe.efi
            SECTION UI = "UsbConfigDxe"
    }
```

Then, once more, replace the `PE32` path with the path to the patched binary under `PatchedBinaries`:

```
    FILE DRIVER = 5bd181db-0487-4f1a-ae73-820e165611b3 {
            SECTION DXE_DEPEX = SurfaceDuoPkg/FirmwareBinaries/BOOT.XF.3.0-00527-SM8150LZB-1/volume-0/file-2/section0/section1/volume-0/file-5bd181db-0487-4f1a-ae73-820e165611b3/section0.dxe.depex
            SECTION PE32 = SurfaceDuoPkg/PatchedBinaries/[YOUR_DEVICE_MAKE]/[YOUR_DEVICE_MODEL]/UsbConfigDxe.efi
            SECTION UI = "ButtonsDxe"
    }
```

With this done, you can now proceed to build normally:

```
$ python3 -m venv SurfaceDuo
$ source SurfaceDuo/bin/activate
$ pwsh ./build_releaseinfo.ps1
Stamp build.
$ ./build_uefi.sh
$ ./build.sh [number]
```

# And that's it - now the buttons should work, as should USB FN (for UEFI Mass Storage mode and debugging using WinDbg).
