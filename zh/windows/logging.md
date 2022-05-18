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

## Tip: Driver provider GUID

| Module                           | Description              | GUID                                 | 850  | 7180/7125 |
| -------------------------------- | ------------------------ | ------------------------------------ | ---- | --------- |
| ANXUcmCxCD                       | ANXUcmCxCDTraceGuid      | d1b2534b-5c1e-464d-975d-0431576740fe | ✓    |           |
| ConnectionManagerClientDLL       | dplTrace                 | B5C69B66-28A2-49F7-B658-1BE48F298C86 | ✓    |           |
| QcIMSDataDaemon                  | same                     | same                                 | ✓    |           |
| QcIMSQMIDaemon                   | same                     | same                                 | ✓    |           |
| RCS                              | same                     | same                                 | ✓    |           |
| libadsprpc/libcdsprpc/libsdsprpc | FastRPCUserTrace         | 09533D70-822C-4A34-B3AA-970714567089 | ✓    |           |
| ProxyAPO                         | AUDIO_APO_DRIVER         | A0F8425A-DAAD-486D-BDC6-4A24CB136B6F | ✓    | ✓         |
| QC_BT_BLEAPI_TEST                | QCBLElibTraceGuid        | 045AE7B3-B4B5-4483-A1D5-D53D7E8EA008 | ✓    |           |
| qca11ad                          | CtlGuid                  | 28405352-DCA3-494A-A122-42A7B12ABF65 | ✓    |           |
| qcabd                            | AbdTrace                 | BB4567AF-65A2-4F4A-B791-12D024B65966 | ✓    | ✓         |
| qcadc                            | AdcTrace                 | 033C84E6-CC87-444E-A911-6F9C1B41548B | ✓    | ✓         |
| qcadcm                           | WppDbg                   | 55F4DAF3-7F96-4638-837B-6A5232DF0FC1 | ✓    | ✓         |
|                                  | TraceDebug               | 1C2B2962-2C8A-4BD0-9E6A-022BE277C9E4 | ✓    | ✓         |
| qcadsprpc                        | FastRPCTrace             | 09533D70-822C-4A34-B3AA-970714567089 | ✓    | ✓         |
| qcadsprpcd                       | AdsprpcdTrace            | A94637FC-5099-4134-94E7-BAD9DD9FAF3C |      | ✓         |
| qcauddev                         | TraceDebug               | D3D7C968-4842-4C61-994E-2AAD4DBA2C18 | ✓    | ✓         |
| qcaudminiport                    | AUDIO_DRIVER             | B92C2819-2DAA-4804-BC96-720A82209897 | ✓    | ✓         |
| qcbattminiclass                  | PmicBatteryMiniclass     | 97413f1d-5298-4884-94eb-6fefbc0ac4a7 | ✓    | ✓         |
| qcbattmngr                       | BattMngrTrace            | 4A651CBB-7073-495F-9984-A2AE76C9EB58 | ✓    |           |
| qcbtfmuart                       | qca_shb_wpp              | C484A08D-41CE-4CD6-AF73-06F987827ACE | ✓    | ✓         |
| qcccidbridge                     | CcidbrgTrace             | D28DAA6A-6063-47EE-BB4D-5CE18F61C754 |      | ✓         |
| qccdi                            | CDITrace                 | 4b02d255-8053-4fa7-8f5b-66139f7ebe73 |      | ✓         |
| qcdatabus                        | DBUSWPP                  | 786748D7-3C8D-4E37-911A-C60FB8FB348D | ✓    |           |
| QCDiagBridge                     | QcdbTrace                | 06F6B256-D87F-4F3B-BC94-07B471EBB957 | ✓    | ✓         |
| qcdiagcsi                        | DiagCSITrace             | 5AB48ED9-AAFE-40A2-84CF-DBD60690E80D | ✓    | ✓         |
| QCDiagKernelLogging              | QcDiagKernelLoggingTrace | C9EDE2A5-D9F5-458f-A618-2E86C5DAADA1 | ✓    |           |
| qcdiaglogging                    | QcDiagLoggingDllTrace    | 268E0F69-3158-4375-B05F-32B82E74AD3E | ✓    |           |
| qcdiagrouter                     | DiagRouterTrace          | 9CBA380D-42BA-45DB-94F0-AC310885CE4E | ✓    | ✓         |
| qcdplbridge                      | DplbrgTrace              | 749F79BE-BF41-431F-8366-E06B309BA1B1 | ✓    | ✓         |
| qcdx11 um                        | dx11Trace                | B770C40B-693B-452B-92E1-207B14C403DA | ✓    | ✓         |
| qcdx12 um                        | dx12Trace                | 0CC81B61-D1B4-4A2F-9253-9FE25448B470 | ✓    | ✓         |
| qcdxkm                           | QdiKmdTrace              | E55D560E-55FA-47C3-A3EC-2AA0C319C2EF | ✓    | ✓         |
|                                  | GpuKmdTrace              | AF531841-DA56-4E11-87EE-1D4F673BC873 | ✓    | ✓         |
| QcEUD                            | QcEUDTraceGuid           | D15F23FF-6EE1-406B-ADD6-4AC396DEE296 | ✓    | ✓         |
| qcfactory                        | QcFactoryTraceGuid       | 24a15e86-f503-40f6-acde-6375a624bbb5 | ✓    | ✓         |
| Qcfgbcl                          | fgbclTrace               | E528B6D3-4B45-44D2-AA9E-589BF570B994 | ✓    | ✓         |
| qcglink                          | GlinkTraceErrGuid        | e98045ad-4058-444c-a751-97157605bbf8 | ✓    | ✓         |
|                                  | GlinkTraceGuid           | c37a7356-c3d3-45a7-b991-01c0403e5918 | ✓    | ✓         |
| qcgnss                           | GpsTraceGuid             | 8AC657C6-6FCE-4904-93BC-E631ED8134BB | ✓    | ✓         |
| qcgpi                            | GpiTracer                | F0EEE77F-2B57-43A3-82E9-20F0F02331E1 | ✓    | ✓         |
| qcgpio                           | QcGpioTraceGuid          | 302c57a4-26d4-4ec3-B754-29025DCD164B | ✓    | ✓         |
| qcgsi                            | GSITRACE                 | 3B188E03-4FA9-7425-20E0-C89CF50C9573 | ✓    | ✓         |
| qchdcpumd                        | CtlGuid                  | 28EE579B-CF67-43b6-9D19-8930E7AAA131 | ✓    | ✓         |
| qchwnhaptics                     | HwnHapticsTrace          | 03096FC8-5F52-427A-9E71-F121E1EFE6F1 | ✓    |           |
| qchwnled                         | hwnledTraceGuid          | 1B23D121-227A-4CA9-A143-BAF9205EF142 | ✓    | ✓         |
| qci2c                            | PbcTraceGuid             | EF49A24A-40CD-46D0-8A8A-3623B7A18969 | ✓    | ✓         |
| qcImproveTouch                   | touchtrace               | D9601424-B217-439F-AE21-869814FB78E8 | ✓    |           |
| qcimssink                        | qimssinktrace            | 6761AB32-CADA-468C-874F-6B1EF2DD8874 | ✓    |           |
| qcimssrc                         | qcimssrcTrace            | 89C0E8F2-4EAB-426A-B707-52F53FC17614 | ✓    |           |
| qciommu/qcsmmu                   | SmmuTrace                | cf6bfd48-e161-4949-96d5-8647cfc488c8 | ✓    | ✓         |
| qciommu                          | SmmuTrace                | C1C2BFB3-0542-4352-9D2B-C8515A674A97 |      | ✓         |
| qcipa                            | IPATRACE                 | 367DC0A5-4DE5-4142-C7D4-E29C47275A6C | ✓    | ✓         |
| qcipcrouter                      | IPCRouterTraceCtrlGuid   | 0076be32-0be5-4df7-a923-a19945d66ab0 | ✓    | ✓         |
|                                  | IPCRouterTraceErrGuid    | 500cfd06-5db8-49e3-9e1c-1613cf51d308 | ✓    | ✓         |
|                                  | IPCRouterTracePktGuid    | 5767b83a-4578-4020-8db1-c26cb6e88a49 | ✓    | ✓         |
| qckmbam                          | BamTraceGuid             | 5C443E1C-6949-4E39-A898-2020331C8F90 | ✓    | ✓         |
| qclinklocal                      | DATAIFAPILIB             | 013EE145-0DA9-4C83-93AA-09D71DA3625B | ✓    | ✓         |
|                                  | LinklocalWPP             | B950DFE2-7772-45CD-8432-5C2183ECF48B | ✓    |           |
| QCListenSoundModel               | CntrlQCSounModelDll      | 435B6D64-B9CE-4DB5-BAF6-11060BC7656F | ✓    | ✓         |
| QcLteCoexMgr                     | WlagTrace                | EA888489-DA55-4C45-9463-E789D758B6F2 | ✓    | ✓         |
| qcmbb                            | MBBWPP                   | 36797C31-A122-43DB-B296-36AB887335C3 | ✓    | ✓         |
| qcmbbsrvc                        | FdoTrace                 | D5E0C4D1-478D-4140-9A44-EFB8B882C022 | ✓    |           |
| qcmbrg                           | MbrgTracer               | cdef430e-1881-4bc4-b281-c477253e4b17 | ✓    | ✓         |
| qcpdsr                           | PDSRTrace                | 8626d8e5-081f-48d7-a01a-040ef269652b | ✓    | ✓         |
| qcpep                            | RpmhTrace                | 2C89C855-6301-41F9-BF56-63416DFE9CA9 | ✓    | ✓         |
|                                  | PepAopTrace              | 77776ABB-0FA4-426d-B95B-2E02A583BD19 |      | ✓         |
|                                  | UlogTrace                | F4F985AD-8617-4D42-B21B-28E3105C0CAA | ✓    | ✓         |
|                                  | PEPBCLTrace              | 2A2D4F18-5DCB-4277-AF1B-7416408DCA55 | ✓    | ✓         |
|                                  | PEPCOREBSPTrace          | CA218504-C8B7-421D-A5F3-F932CB62BC30 | ✓    | ✓         |
|                                  | PEPDCVSTrace             | D179D27F-322A-4EBF-B209-FBC860D05812 | ✓    | ✓         |
|                                  | PEPThermalTrace          | 155F8C3F-FD86-40A4-B059-4160B29A4223 | ✓    | ✓         |
|                                  | PEPIdleTrace             | 8789CFBB-E215-463F-A4A2-906DD6F0250C | ✓    | ✓         |
|                                  | PEPDevicePowerMgmt       | 39D7D81E-7C75-493F-B7A0-3171AF1AB3E2 | ✓    | ✓         |
|                                  | CprTrace                 | EA4AC5EE-4FBC-48FC-BCC1-E58D6F5429AF | ✓    | ✓         |
|                                  | PppTrace                 | 4747672D-8C2C-4B4C-A8B0-9A23F41549FF | ✓    | ✓         |
|                                  | PepTrace                 | a577097e-09a7-43ca-a409-685f78c4efb7 | ✓    | ✓         |
|                                  | RpelibTrace              | A77E292C-44CF-4821-907A-93AC09231A2D | ✓    | ✓         |
| qcpil                            | PilTrace                 | 4B2AE6CB-2AFC-4251-8DF6-55939744250F | ✓    | ✓         |
|                                  | ElfParserTrace           | C1FE9AE2-F88D-443F-B40C-1BB32AE012A2 | ✓    | ✓         |
| qcpmic3p                         | Pmic3PTrace              | 3AD272A6-6C75-4A0D-8599-95D3131370EF | ✓    |           |
| qcpmic                           | PmicKmdfTrace            | 23A49036-9AE1-4D2F-B167-16849DD6040D | ✓    | ✓         |
| QcPmicApps                       | PmicAppsTrace            | D46834A3-5940-43A3-B007-44E86420AC21 | ✓    | ✓         |
| qcpmicEIC                        | PmicEICTrace             | 3AD272A6-6C75-4A0D-8599-95D3131370EF | ✓    |           |
| qcpmicglink                      | PmicGlinkTrace           | 3804DC7C-C7BC-457D-8386-DB0BCB690358 |      | ✓         |
| qcpmicgpio                       | PmicGpioTrace            | 5BBED14F-3671-4598-AD2F-A9B6BCD3824D | ✓    | ✓         |
| qcpmictcc                        | BifTrace                 | 9cab7ef0-9c6f-4c3a-a5ac-ff2e59e181ec | ✓    |           |
| qcqdss                           | qdssTrace                | fc0a1d4b-d5db-44cc-9ee5-07fd56ee5787 |      | ✓         |
| qcquadspi                        | QualcommQSpiTrace        | 19C72EFC-FE22-47F6-B6A0-F25577B6205B |      | ✓         |
| QcRCSPresSvc                     | RcsWni                   | 8CE11738-35C9-4FBC-9A6C-1EEA44177F58 | ✓    |           |
| qcremoteat                       | FdoTrace                 | 0E1402ED-3DCA-487D-8E64-91E1A5663F54 | ✓    | ✓         |
| qcremoteatsrvc                   | FdoTrace                 | 1EECC841-9F7C-44E2-8E9B-986ACF2173A2 | ✓    | ✓         |
| qcremotefs                       | RFSTrace                 | 583DA23E-3DA2-4DB2-8295-F8212C8C2511 | ✓    | ✓         |
| qcrevrmnet                       | RevRmnetTrace            | 25E8F35D-45C0-41D6-91D3-996CAF7FBE41 | ✓    | ✓         |
| qcrmnetbridge                    | RmnbrgTrace              | 7980CAA5-0DAA-4954-A39C-93B2B4707DD4 | ✓    | ✓         |
| qcRng                            | qcRng                    | 106F3429-2453-425B-81BA-DA8010BC3884 | ✓    |           |
| qcrpen                           | RpenTrace                | 7311d40c-ce4f-496f-a563-f72d7bc9d92f | ✓    | ✓         |
| qcscm                            | SCMTrace                 | BC491612-4CA5-4489-A3EA-8DDE1F3B268E | ✓    | ✓         |
| qcsecurity                       | QcSecurityTrace          | 7141986B-4E2B-4894-9922-8F1264A8A8BC |      | ✓         |
| qcSensors                        | SensorsClxTrace          | 44D2526D-EF8B-4336-B5E0-FBDB88CA10C0 | ✓    |           |
| qcshutdownsvc                    | MyDriver1Trace           | de6c1d2d-861a-4248-a8f3-e236c4f16a19 | ✓    | ✓         |
| qcslimbus                        | SlimBusTrace             | C951B320-B923-4F26-A9BA-DA30550F2136 | ✓    | ✓         |
| QcSOCPartition                   | QcSOCPartitionTrace      | 7637b3ab-0bb6-42d9-aa7a-ac32c0327991 |      | ✓         |
| qcsp                             | spcomTrace               | 73be740a-72e0-4aec-b044-54fa6c2b1633 | ✓    |           |
| qcspi                            | QualcommSpiTrace         | CE0458F5-EE40-403A-AF35-A3E7FACC2BD0 | ✓    | ✓         |
| qcspmi                           | qcspmiTrace              | c1de55d4-9831-472f-a17d-3500da9c7fa8 | ✓    | ✓         |
| qcsubsys                         | SubSysTrace              | 8601DCB7-CA1A-48B7-91B4-E113B7D2A655 | ✓    | ✓         |
| qcsyscache                       | SmmuTrace                | 055E96F6-823F-4F94-8954-A12ABD1B339D | ✓    | ✓         |
| QcTftpKmdf                       | QCTFTPTrace              | 8cb2c430-3aa3-455e-a4c4-328719e67055 | ✓    | ✓         |
| QcTrEE                           | TrEETrace                | DE3B1201-A1DF-478A-9062-E443CDABF070 | ✓    | ✓         |
| qcuart                           | QualcommUartTrace        | CE22E47E-2675-49C8-9D20-790BDACA429B | ✓    | ✓         |
| qcusbc                           | QcUsbCTraceGuid          | 246E500B-1764-4427-ADD6-3C998B71F899 | ✓    |           |
| qcusbcucsi                       | QcUsbCTraceGuid          | 3168776E-0E5B-4B63-8F92-9D6C1B395166 | ✓    | ✓         |
| QcUsbFnSs                        | QcUsbFnTraceGuid         | 82D869FE-8FFA-4AAD-B4F9-86160083CC68 | ✓    |           |
| QcUsbFnSsFilter                  | UsbFnSsTrace             | 6FD2F1A8-C3D9-4A72-B122-30C6AD3E0A5F | ✓    | ✓         |
| qcviddec mft                     | qcviddecmftTrace         | 7D41DBE7-CEF1-45fC-A4C9-45580223FB43 | ✓    |           |
| qcvidenc mft                     | qveTrace                 | CEA35F95-03DB-4f70-A5C2-25E3ACA61E2A | ✓    | ✓         |
| qcvidenc um                      | qcvidencumTrace          | F805AFCE-F65F-4F5E-9B6D-6AC067876850 | ✓    | ✓         |
| QcWICEncoder                     | CamWicTrace              | EB6A9DDE-6F7E-4117-BE9E-541CEBB998BD | ✓    |           |
| QcXhciFilter                     | XhciTrace                | 11ED5F0A-0200-42AF-B5DF-B8BEC02C9624 | ✓    | ✓         |
| qSarMgr                          | qsarMgrTraceGuid         | ba8b8ca7-ad28-4983-967c-6fd34c36acf8 | ✓    | ✓         |
| qsocketipcrum                    | QsocketIPCRUmTrace       | FFC49484-393B-4AF2-92C4-ABEEA6B95322 | ✓    |           |
| ufnserialclass                   | UfnSerialClassTrace      | D5393B53-8AAE-40B1-938B-C207E999605F | ✓    | ✓         |
| wifinotifiersrvc                 | WNWPP                    | AFCB9E8B-375B-457C-919C-89BAAAE2D2F0 | ✓    | ✓         |
| WMRil                            | WMRilTrace               | 4773847C-C3A9-47c7-9A2E-18FC84EFEE16 | ✓    |           |
|                                  |                          |                                      |      |           |

