# edk2-sdm845 Porting Guide

 1. Install Python protobuf and uefi_firmware-parser by executing `pip install --upgrade google-api-python-client uefi_firmware` in terminal
 2. Download [extract_android_ota_payload](https://github.com/cyxx/extract_android_ota_payload/archive/master.zip) and extract the folder inside the archive anywhere
 3. Download any OTA update for your phone
 4. Extract payload.bin to `extract_android_ota_payload-master` folder
 5. Open terminal in the same folder and execute `python3 extract_android_ota_payload.py payload.bin`
 6. Execute `uefi-firmware-parser -b -e xbl.img`
 7. Change directory to `volume-******/file-9e21fd93-9c72-4c15-8c4b-e77f1db2d792`
 8. Execute `7z x -oextracted section0.guid`
 9. Open UEFITool and open the file `section0` in folder `extracted`
 10. In a file manager, open `edk2-sdm845/sdm845Pkg/Binary`, duplicate `dipper` folder and rename it to your device's codename
 11. In UEFITool, expand `UEFI image` and the volume underneath
 12. For each file in your device's folder replace it with UEFITool by:
     - expanding the DXE Driver in UEFITool with the same name as the file you are replacing
     - in case of file that ends with `.depex` right clicking on DXE dependency
     - in case of file that ends with `.efi` right clicking on PE32 Image
     - clicking `Extract body`
     - deleting the original file
     - saving the one you are extracting and naming it same as the deleted one
     - In case a part (ex. DXE Dependency) is missing in UEFITool, just delete that file
 13. Open `edk2-sdm845/sdm845Pkg` in a file manager
 14. Duplicate `dipper.dsc` and `dipper.fdf` and rename both to your device's codename
 15. Open the `.dsc` file, replace values 1080 and 2248 with your device's display width and height and save
 16. Open the `.fdf` file, replace every word "dipper" with your device's codename and save
 17. Open `edk2-sdm845` and edit `build.sh` with a text editor
 18. Locate device list at the top, add your device's codename and save

 You can now build as usual.

 Make sure to message the Discord or Telegram group in case you are stuck somewhere and if your port is successful, send `edk2-sdm845/sdm845Pkg/Binary/devicename` folder and `.dsc` and `.fdf` files.
