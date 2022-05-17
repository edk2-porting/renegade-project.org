# Driver logging

!> Currently this guide shows the easiest way to get log from drivers. For further debugging, you should refer to Microsoft documents.

1. Clone [WOA-Drivers-debug](https://github.com/edk2-porting/WOA-Drivers-debug) on your computer

2. Import a registry file in the `WOA-Drivers-debug\reg` folder **on your phone**, and reboot your phone

3. After rebooting, you'll find etl files in `C:\Renegade\Logfiles\`. Copy them to your computer.

4. Run the following command to get readable log file

> Remember to install Windows Driver Kit (WDK) to get `tracefmt` tool

```
tracefmt.exe .\whatever.etl -p D:\PathTo\WOA-Drivers-debug\tmf -o whatever.log
```

