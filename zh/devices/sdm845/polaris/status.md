提示
======================

请务必在启动Windows之前刷写devcfg分区，否则你将无法正常使用触摸屏或启动系统！

阅读[设备支持状态](zh/windows/state-frame.html)以了解详情

SimpleInit配置
=========================

你需要在`simpleinit.static.uefi.cfg`中指定`dtb_id = 6`来启动安卓

至少对于Evolution X (Android 12)，dtbo配置是不需要的

阅读 [多启动支持](zh/multiboot.md) 以了解详细配置