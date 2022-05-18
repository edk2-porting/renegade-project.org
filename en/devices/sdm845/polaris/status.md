Notice
======================

You need to flash `devcfg` partition with the provided image, otherwise touchscreen won't work, or the phone won't boot!

Read [Device Support Status](en/windows/state-frame.html) to know more about details

SimpleInit Configuration
=========================

!> MIUI based on Android 10 won't boot currently

To boot Android, you need to manually set `dtb_model` in `simpleinit.static.uefi.cfg`

the correct value could be obtained from `/sys/firmware/devicetree/base/model`

dtbo configuration is not needed, at least for Evolution X (Android 12)

Read [Multiboot support](en/multiboot.md) for details