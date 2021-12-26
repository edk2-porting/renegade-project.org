
# edk2-msm8998 Porting Guide

 1. Install Python protobuf and uefi_firmware-parser by executing `pip install --upgrade google-api-python-client uefi_firmware` in terminal
 2. Download [extract_android_ota_payload](https://github.com/cyxx/extract_android_ota_payload/archive/master.zip) and extract the folder inside the archive anywhere
 3. Download any OTA update for your phone
 4. Extract payload.bin to `extract_android_ota_payload-master` folder
 5. Open terminal in the same folder and execute `python3 extract_android_ota_payload.py payload.bin`
 6. Create a text file with nano or something with data:
```
set device=$1
if [ -z $device ]; then
echo error: usage: $0 devicecodename
exit 2
fi

7z x xbl.elf -r -o./xbl > /dev/null 2>&1
7z x ./xbl/11 -r -o./xbl/uefi_fv > /dev/null 2>&1
uefi-firmware-parser -e -b -o ./xbl/fv_extracted ./xbl/uefi_fv/11~ > /dev/null 2>&1
base="0.extracted"
folders=`ls -1d xbl/fv_extracted/volume-8/*/ | grep -v fffffff`

for folder in $folders
do
if ls $folder*.ui 1> /dev/null 2>&1; then
name=`cat $folder*.ui | tr -d '\0'`
if [ -z $name ]; then
continue
else
if ls $folder*.depex 1> /dev/null 2>&1; then
echo "Creating: $name"
mkdir -p $base/$name

cp -rf $folder/section1.pe $base/$name/$name.efi
uuid=`basename $folder | awk -Ffile- {'print $2'}`
echo -ne "\n FILE DRIVER = $uuid { \n\t SECTION DXE_DEPEX = $DEVICE/Binary/$name/$name.depex \n\t SECTION PE32 = $DEVICE/Binary/$name/$name.efi \n\t SECTION UI = \"$name\" \n }\n" >> $base/gen_config.fdf
else
if ls $folder*.pe 1> /dev/null 2>&1; then
echo "Copying $name to $device"
mkdir -p $base/$name
basename $folder > $base/$name/uuid.txt
uuid=`basename $folder | awk -Ffile- {'print $2'}`
echo -ne "\n FILE DRIVER = $uuid { \n\t SECTION PE32 = $DEVICE/Binary/$name/$name.efi \n\t SECTION UI = \"$name\" \n }\n" >> $base/gen_config.fdf
if ls $folder/section0.pe 1> /dev/null 2>&1; then
cp -rf $folder/section0.pe $base/$name/$name.efi
else
cp -rf $folder/section1.pe $base/$name/$name.efi
fi
else
uuid=`basename $folder`
cp -rf $folder/section1.raw $base/$uuid-$name
fi
fi
fi
else
continue
fi
done
```
 and name it as `copy-uefidrivers.sh`
 7. Execute `bash copy-uefidrivers.sh codename-of-your-device`
 10. In a file manager, open `edk2-msm8998/MSM8998Pkg/Binary`, duplicate `nash` folder and rename it to your device's codename
 11. 
 13. Open `edk2-msm8998/MSM8998Pkg` in a file manager
 14. Duplicate `nash.dsc` and `nash.fdf` and rename both to your device's codename
 15. Open the `.dsc` file, replace values 1440 and 2560 with your device's display width and height and save
 16. Open the `.fdf` file, replace every word "nash" with your device's codename and save
 17. Open `edk2-msm8998` and edit `build.sh` with a text editor
 18. Locate device list at the top, add your device's codename and save

 You can now build as usual.

 Make sure to message the Discord or Telegram group in case you are stuck somewhere and if your port is successful, send `edk2-msm8998/MSM8998Pkg/Binary/devicename` folder and `.dsc` and `.fdf` files.
