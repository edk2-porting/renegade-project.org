주의
======================

당신은 `devcfg`을 준비된 이미지로 플래시해야 합니다. 그렇지 않으면 터치스크린이 작동하지 않거나 휴대폰이 부팅되지 않을 수도 있습니다!

 자세하게 알아보려면 [Device Support Status](en/windows/state-frame.html)를 읽어보세요

SimpleInit 설정하기
=========================

안드로이드를 부팅하려면 `simpleinit.static.uefi.cfg` 안에 `dtb_id = 6`이 있어야 합니다.

Evolution X (Android 12)를 쓸 때는 dtbo를 설정하지 않아도 됩니다.

 자세하게 알아보려면 [Multiboot support](en/multiboot.md)를 읽어보세요.
