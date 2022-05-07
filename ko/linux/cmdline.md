커널 명령줄
======================

## 필수 매개변수

```
pd_ignore_unused clk_ignore_unused efi=novamap 
```

- `pd_ignore_unused` 

아무 드라이버가 그것을 얻지 않았더라도
모든 전원 도메인이 부트로더에 의해 활성화되게 하세요. 

- `clk_ignore_unused` 

아무 드라이버가 그것을 얻지 않았더라도 부팅 클럭을 활성화하세요.

- `efi=novamap` 

SetVirtualAddressMap()가 ExitBootServices() 다음에 불러들여지지 않습니다

## 선택 매개변수

```
earlycon=efifb,mem video=efifb:off debug panic=10
```

- `earlycon=efifb,mem`

EFI 프레임버퍼에서 초기 커널 메시지를 활성화하세요.
아주 유용하고 초기 커널 디버깅에 권장됩니다.

- `video=efifb:off`

efifb 프레임버퍼를 비활성화하세요. 
efifb가 제 휴대폰 성능에 알 수 없는 이유로 영향을 줍니다.
이것을 비활성화하면 성능이 상향될 수 있습니다.
**simplefb같은 대체 프레임버퍼가 없는 이상 비활성화하지 마세요**
