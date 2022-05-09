# 윈도우 설치 가이드

**이 가이드는 USB가 작동하는 기기만을 위한 것입니다!**

[디바이스태지원 상태](ko/windows/state-frame.html) 를 확인해주세요.

### 도구 다운로드

다음 파일들을 당신의 USB에 다운로드하세요:

1. Windows PE 다운로드
   
   [20h2pe_new.zip](https://pan.baidu.com/s/1Pgaz-bdTiOKFXGAxgYCX6A)
   
   Password：1234
    
2. dism++ 다운로드

   [Dism++](https://github.com/Chuyu-Team/Dism-Multi-language/releases)

3. SDM845 드라이버 다운로드
   
   [Releases · edk2-porting/WOA-Drivers · GitHub](https://github.com/edk2-porting/WOA-Drivers/releases)

4. 윈도우 10 arm64 iso 다운로드

   [UUP dump](https://uupdump.net/?lang=en-us)

5. UEFI 다운로드

   [Releases · edk2-porting/edk2-sdm845 · GitHub](https://github.com/edk2-porting/edk2-sdm845/releases)

6. parted 다운로드
   
   [parted](https://pwdx.lanzoux.com/iUgSEmkrlmh)

7. 텍스트 파일을 만드세요. 명령어 복사 붙여넣기에 필요할 수 있습니다.

   ```sh
   diskpart
   select disk 0
   list part
   select part 17    # 17 is the number of your ESP partition
   assign letter=Y
   exit
   
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} testsigning on
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} nointegritychecks on
   
   shutdown -s -t 0
   ```

### 사전 설치

몇몇 기기들은 추가 작업이 필요할 것입니다. 시작하기 전에 *디바이스* 섹션에서 당신의 기기를 확인해주세요.

### 파티션 만들기

휴대폰에서 TWRP 리커버리에 진입한 뒤에 PC와 연결하세요.

관리자 권한으로 명령 프롬프트를 연 뒤에 실행하세요:

```sh
adb push parted /sdcard/
adb shell
```

1. 재파티션기기기

   다음의 파티션 레이아웃 명령줄은 OnePlus 6T 128GB를 위한 예시입니다. 
   당신의 디바이스 또는 환경 설정을 위해 범위를 변경해야 할 것입니다.

   !> 이 과정이 잘못되면 기기가 피해를 입을 수 있습니다. 만약 실수를 해서 기기가 벽돌이 되였다면 9008로 기기를 복원해주세요.

   > 경고: `#` 다음의 글씨는 무시하세요. 그냥 주석입니다.

   ```sh
   cp /sdcard/parted /sbin/ && chmod 755 /sbin/parted
   umount /data && umount /sdcard
   parted /dev/block/sda
   rm 17                           # 유저 데이터 삭제
   mkpart esp fat32 6559MB 7000MB    # 441 MB
   mkpart pe fat32 7000MB 10000MB    # 3 GB
   mkpart win ntfs 10000MB 70GB      # 61,680 MB ( 61.68 GB )
   mkpart userdata ext4 70GB 125GB   # 56,320 MB ( 56.32 GB )
   set 17 esp on                   # 활성 파티션으로 마킹하기
   quit
   ```

2. 새 파티션 포맷하기

   ```sh
   mkfs.fat -F32 -s1 /dev/block/by-name/pe
   mkfs.fat -F32 -s1 /dev/block/by-name/esp
   mkfs.ntfs -f /dev/block/by-name/win
   mke2fs -t ext4 /dev/block/by-name/userdata
   ```

3. PE 파티션을 `/mnt`로 마운트하기

   ```sh
   mount /dev/block/by-name/pe /mnt
   ```

4. 디바이스의 OTG 단자에 USB를 연결하고 PE를 복사하기

   ```
   cp -r /usbstorage/20h2pe_new/* /mnt
   ```

5. TWRP를 이용하여 시스템으로 재부팅하기

   안드로이드를 먼저 부팅해보세요. 작동한다면 계속 진행할 수 있습니다.

### 윈도우 설치하기

기기를 Fastboot 모드로 재부팅하세요.

1. UEFI 부팅

   ```sh
   fastboot boot boot-DEVICE.img
   ```

2. 윈도우 PE 진입

   당신의 ESP 파티션에 Y자를 할당하세요:

   ```sh
   diskpart
   select disk 0
   list part
   select part 17    # 17은 당신의 ESP 파티션의 번호입니다
   assign letter=Y
   exit
   ```

3. 윈도우 ARM64 설치하기
   
   dism++를 열고 윈도우를 설치하세요:

   1. File을 클릭하교 Apply Image를 클릭하세요.
   2. 당신의 윈도우 ISO 파일을 선택하세요.
   3. `C:\` 루트를 선택하세요. (만약 `C:\`가 PE 파티션이라면 `D:\`) 윈도우가 설치될 디스크입니다.
   4. `Add Boot`를 체크하세요.
   5. `OK`를 누르고 이미지가 적용될 때까지 기다리세요.
   
   드라이버 설치하기:

   1. 위에 있는 새 윈도우 설치를 선택하고 `Open session`을 클릭하세요.
   2. `Control Panel`에 있는 `Drivers`에 들어가세요.
   3. `Add`를 누르고 SDM845 드라이버 폴더를 선택하세요.
   4. 드라이버가 설치될 때까지 기다리세요.

4. 테스트 서명 모드 켜기

   ```sh
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} testsigning on
   bcdedit /store Y:\efi\microsoft\boot\bcd /set {Default} nointegritychecks on
   ```

5. UEFI로 재부팅하고 당신의 윈도우를 즐기세요!

   ```sh
   shutdown -s -t 0
   ```
