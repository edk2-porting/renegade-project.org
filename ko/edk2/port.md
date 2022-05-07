# edk2-sdm845 포팅 가이드 (구식)

 1. Python protobuf와 uefi_firmware-parser를 터미널에서 `pip install --upgrade google-api-python-client uefi_firmware`을 실행하여 설치한다.
 2. [extract_android_ota_payload](https://github.com/cyxx/extract_android_ota_payload/archive/master.zip)를 다운로드하고 아카이브 안에 있는 폴더를 아무데나 추출한다.
 3. 당신의 휴대폰을 위한 아무 OTA 업데이트를 실행한다.
 4. payload.bin를 `extract_android_ota_payload-master` 폴더에 추출한다.
 5. 터미널을 같은 폴더에서 실행하고 거기에서 `python3 extract_android_ota_payload.py payload.bin`을 실행한다.
 6. `uefi-firmware-parser -b -e xbl.img`를 실행한다.
 7. 디렉토리를 `volume-******/file-9e21fd93-9c72-4c15-8c4b-e77f1db2d792`로 변경한다.
 8. `7z x -oextracted section0.guid`를 실행한다.
 9. UEFITool을 열고 `section0` 파일을 `extracted` 폴더 안에서 실행한다.
 10. 파일 관리자 안에서 `edk2-sdm845/sdm845Pkg/Binary`를 열고 `dipper` 폴더를 복사하고 또 이름을 당신의 디바이스 모델명으로 변경한다.
 11. UEFITool에서 `UEFI image`와 아래에 있는 볼륨을 확장한다.
 12. 당신의 디바이스 폴더 안에 있는 각각의 파일을 UEFITool로 변경하기 위하여:
     - UEFITool 안에 있는 DXE Driver를 당신이 변경하는 파일과 같은 이름으로 확장한다.
     - 파일이 `.depex` 확장자로 끝나는 경우 `.depex` DXE 의존을 우클릭한다.
     - 파일이 `.efi` 확장자로 끝나는 경우 PE32 이미지를 우클릭한다.
     - `Extract body`를 클릭한다.
     - 원본 파일을 삭제한다.
     - 당신이 추출하고 삭제된 것과 같은 이름을 지어 다른 파일을 저장한다.
     - ( 예) DXE Dependency)가 UEFITool에 없는 경우 그냥 그 파일을 삭제한다.
 13. `edk2-sdm845/sdm845Pkg`를 파일 관리자에서 연다.
 14. `dipper.dsc`와 `dipper.fdf`를 복사하고 둘 다 당신의 디바이스 모델명으로 이름을 바꾼다.
 15. `.dsc` 파일을 열고 값 1080과 2248을 당신의 디바이스의 폭과 높이로 바꾼 뒤 저장한다.
 16. `.fdf` 파일을 열고 모든 "dipper"을 당신의 디바이스 모델명으로 바꾼 뒤 저장한다.
 17. `edk2-sdm845`를 열고 `build.sh`를 텍스트 편집기로 수정한다.
 18. 디바이스 목록을 맨 위에 위치하고 당신의 디바이스 모델명을 추가한 뒤 저장한다.

당신은 이제 평소처럼 빌드할 수 있습니다.

 만약 어딘가에 당신이 갇혔고 만약 당신의 포팅이 성공적이었으면 꼭 Discord 또는 Telegram group에 `edk2-sdm845/sdm845Pkg/Binary/devicename` 폴더와 `.dsc`, `.fdf` 파일들을 .
