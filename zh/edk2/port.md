# edk2-sdm845 适配指南

 1. 在终端执行`pip install --upgrade google-api-python-client uefi_firmware`以安装Python的模块protobuf和uefi_firmware-parser
 2. 下载[extract_android_ota_payload](https://github.com/cyxx/extract_android_ota_payload/archive/master.zip)并将其解压到任何位置
 3. 下载设备的OTA更新包
 4. 解压payload.bin到`extract_android_ota_payload-master`文件夹
 5. 在相同文件夹打开终端并执行并`python3 extract_android_ota_payload.py payload.bin`
 6. 执行`uefi-firmware-parser -b -e xbl.img`
 7. 进入文件夹`volume-******/file-9e21fd93-9c72-4c15-8c4b-e77f1db2d792`
 8. 执行`7z x -oextracted section0.guid`
 9. 打开UEFITool软件并打开`extracted`文件夹中的文件`section0`
 10. 进入文件夹`edk2-sdm845/sdm845Pkg/Binary`,复制文件夹`dipper`并更名为你的设备代号
 11. 在UEFITool中展开`UEFI image`在volume下操作
 12. 在设备文件夹中对每个文件,请通过以下方式将使用UEFITool其替换为:
	 - 用您要替换的文件相同的名称在UEFITool中展开DXE驱动程序
	 - 如果文件以`.depex`结尾,请右键单击DXE依赖项
	 - 如果文件以`.efi`结尾,请右键单击PE32镜像
	 - 点击`Extract body`
	 - 删除原始文件
	 - 保存要提取的内容,并将其命名为已删除的内容
	 - 如果UEFITool中缺少一部分(例如DXE依赖关系),只需删除该文件
 13. 在文件管理器打开文件夹`edk2-sdm845/sdm845Pkg`
 14. 复制`dipper.dsc`和`dipper.fdf`并更名为你的设备代号(`设备代号.dsc` `设备代号.fdf`)
 15. 打开`设备代号.dsc`文件,使用你的设备的实际屏幕分辨率替换1080(宽)和2248(高)
 16. 打开`设备代号.fdf`文件,将所有"dipper"替换成你的设备代号并保存
 17. 进入文件夹`edk2-sdm845`并使用文本编辑器编辑`build.sh`
 18. 在顶部的数组中添加你的设备代号并保存

 然后现在可以编译并测试使用.

 如果您在某个地方遇到问题,你可以在Discord、Telegram和QQ群中发送消息询问,并发送`edk2-sdm845/sdm845Pkg/Binary/设备代号`文件夹以及.dsc和.fdf文件。若移植成功，亦可发送消息告知。
