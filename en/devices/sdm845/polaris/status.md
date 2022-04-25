Notice
======================

You need to flash `devcfg` partition with the provided image, otherwise touchscreen won't work, or the phone won't boot!

Read [Device Support Status](en/windows/state-frame.html) to know more about details

SimpleInit Configuration
=========================

To boot Android, you'll need `dtb_id = 6` in `simpleinit.static.uefi.cfg`

dtbo configuration is not needed, at least for Evolution X (Android 12)

Read [Multiboot support](en/multiboot.md) for details