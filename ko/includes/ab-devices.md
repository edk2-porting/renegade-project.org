## A/B 파티션

> 이 디바이스는 A/B 파티션 레이아웃을 사용합니다! 이 가이드를 조심스럽게 읽어주세요.

어떤 경우에는 두 번째 비활성화 슬롯에 아무것도 없거나 당신의 활성화된 슬롯보다 오래된 펌웨어를 포함할 수 있고(당신의 현재 ROM을 포함하는 슬롯), **잠재적인 하드 브릭**을 포함하게 할 수 있습니다. 활성화된 슬롯의 내용을 비활성화된 슬롯으로 옮기면 이런 문제가 생기므로 이런 일이 일어나지 않게 해야 합니다.

!> If you're going to flash EDK2 to a second boot partition, do not rush and prepare your device first. **This step is NOT optional for A/B in this case!**

To do this, sideload the `copy-partitions-20210323_1922.zip` package by doing the following:

1. [여기서](https://files.renegade-project.org/copy-partitions-20210323_1922.zip ':ignore'); `copy-partitions-20210323_1922.zip` 파일을 다운로드하세요
2. `copy-partitions-20210323_1922.zip` 패키지를 사이드 로드하세요:
    * 디바이스에서 리커버리 모드를 사이드 로드로 변경하세요:
      * TWRP: "Advanced"을 선택하고 "ADB Sideload"를 누르고 스와이프하여 사이드로드를 시작하세요
      * 그 외의 리커버리에서는 "Apply from ADB", "Install from ADB" 같은 곳에서 시작해주세요.
    * 호스트에서는 이것을 사용하여 패키지를 사이드로드 해주세요: 
      ```sh
      adb sideload copy-partitions-20210323_1922.zip
      ```
    * 아니면 간단하게 zip 파일을 디바이스로 복사하여 일반적으로 설치해주세요.
3. 안드로이드로 재부팅하고 모든 것이 작동하는지 확인하세요.

여기서는 윈도우를 설치하기 위해 [설치 가이드](ko/windows/Installation-guide.md)로 진행할 수 있습니다. 하지만 **아직 EDK2를 플래시하지 마세**.

만약 윈도우를 설치하고 나서 Fastboot에서 성공적으로 부팅했고 안드로이드도 잘 부팅된다면 (꼭 확인하세요!) 당신은 이제 Fastboot로 재부팅하고 두 번째 슬롯에 EDK2를 플래시할 수 있습니다. 

슬롯 A에 안드로이드가 있다면, 슬롯 B에 EDK를 플래시하세요:

```bash
fastboot flash boot_b boot_DEVICE.img
```

슬롯 B에 안드로이드가 있다면, 슬롯 A에 EDK를 플래시하세요:

```bash
fastboot flash boot_a boot_DEVICE.img
```

플래시 되었으면 그 뒤에 슬롯을 바꾸지 마시고 안드로이드로 한 번만이라도 부팅하세요:

```bash
fastboot reboot
```

### 슬롯 변경

EDK2는 UEFI 부팅 관리자에서 안드로이드와 EDK2를 듀얼 부팅하기 위해 A/B 슬롯을 지원합니다

* 부팅하는 동안 아무 볼륨 키를 눌러 UEFI 메뉴로 진입하세요
* 볼륨 키와 전원 버튼을 사용하여 `Boot Manager` > `Reboot to other slot`으로 이동하세요.

안드로이드에서는 `bootctl` 셸 명령어로 EDK2 슬롯으로 전환할 수 있습니다. (루팅 필요).
