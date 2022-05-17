# 获取驱动日志

!> 目前这是获取驱动日志最简单的方法，若要进一步调试，请阅读微软相关文档。

1. 将 [WOA-Drivers-debug](https://github.com/edk2-porting/WOA-Drivers-debug) 克隆到你的电脑上

2. 从 `WOA-Drivers-debug\reg` 中选择一个注册表文件**在你的手机上**导入，然后重启你的手机

3. 重启后，你可以在 `C:\Renegade\Logfiles\` 中找到etl文件，将它们复制到你的电脑上。

4. 执行以下命令来获取可阅读的日志文件

> 别忘了安装Windows Driver Kit (WDK) 以获取 `tracefmt` 工具

```
tracefmt.exe .\whatever.etl -p D:\PathTo\WOA-Drivers-debug\tmf -o whatever.log
```
