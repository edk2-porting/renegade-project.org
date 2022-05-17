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

## Tip: Driver provider GUID

| Module                           | Description                    | GUID                                 |
| -------------------------------- | ------------------------------ | ------------------------------------ |
| ANXUcmCxCD                       | ANXUcmCxCDTraceGuid            | d1b2534b-5c1e-464d-975d-0431576740fe |
| ConnectionManagerClientDLL       | dplTrace                       | B5C69B66-28A2-49F7-B658-1BE48F298C86 |
| QcIMSDataDaemon                  | same                           | same                                 |
| QcIMSQMIDaemon                   | same                           | same                                 |
| libadsprpc/libcdsprpc/libsdsprpc | FastRPCUserTrace               | 09533D70-822C-4A34-B3AA-970714567089 |
| ProxyAPO                         | CTLGUID_AUDIO_APO_DRIVER       | A0F8425A-DAAD-486D-BDC6-4A24CB136B6F |
| QC_BT_BLEAPI_TEST                | QCBLElibTraceGuid              | 045AE7B3-B4B5-4483-A1D5-D53D7E8EA008 |
| qca11ad850                       | CtlGuid                        | 28405352-DCA3-494A-A122-42A7B12ABF65 |
| qcabd850                         | AbdTrace                       | BB4567AF-65A2-4F4A-B791-12D024B65966 |
| qcadc850                         | AdcTrace                       | 033C84E6-CC87-444E-A911-6F9C1B41548B |
| qcadcm850                        | WppDbg                         | 55F4DAF3-7F96-4638-837B-6A5232DF0FC1 |
|                                  | TraceDebug                     | 1C2B2962-2C8A-4BD0-9E6A-022BE277C9E4 |
| qcadsprpc850                     | FastRPCTrace                   | 09533D70-822C-4A34-B3AA-970714567089 |
| qcauddev850                      | TraceDebug                     | D3D7C968-4842-4C61-994E-2AAD4DBA2C18 |
| qcaudminiport850                 | CTLGUID_AUDIO_DRIVER_1         | B92C2819-2DAA-4804-BC96-720A82209897 |
| qcbattminiclass850               | PmicBatteryMiniclassDriverGuid | 97413f1d-5298-4884-94eb-6fefbc0ac4a7 |
| qcbattmngr850                    | BattMngrTrace                  | 4A651CBB-7073-495F-9984-A2AE76C9EB58 |
| qcbtfmuart850                    | qca_shb_wpp                    | C484A08D-41CE-4CD6-AF73-06F987827ACE |
| qcdatabus850                     | DBUSWPP                        | 786748D7-3C8D-4E37-911A-C60FB8FB348D |
| QCDiagBridge850                  | QcdbTrace                      | 06F6B256-D87F-4F3B-BC94-07B471EBB957 |
| qcdiagcsi850                     | DiagCSITrace                   | 5AB48ED9-AAFE-40A2-84CF-DBD60690E80D |
| QCDiagKernelLogging              | QcDiagKernelLoggingTrace       | C9EDE2A5-D9F5-458f-A618-2E86C5DAADA1 |
| qcdiaglogging                    | QcDiagLoggingDllTrace          | 268E0F69-3158-4375-B05F-32B82E74AD3E |
| qcdiagrouter850                  | DiagRouterTrace                | 9CBA380D-42BA-45DB-94F0-AC310885CE4E |
| qcdplbridge850                   | DplbrgTrace                    | 749F79BE-BF41-431F-8366-E06B309BA1B1 |
| qcdx11 um850                     | dx11Trace                      | B770C40B-693B-452B-92E1-207B14C403DA |
| qcdx12 um850                     | dx12Trace                      | 0CC81B61-D1B4-4A2F-9253-9FE25448B470 |
| qcdxkm850                        | QdiKmdTrace                    | E55D560E-55FA-47C3-A3EC-2AA0C319C2EF |
|                                  | GpuKmdTrace                    | AF531841-DA56-4E11-87EE-1D4F673BC873 |
| QcEUD850                         | QcEUDTraceGuid                 | D15F23FF-6EE1-406B-ADD6-4AC396DEE296 |
| qcfactory                        | QcFactoryTraceGuid             | 24a15e86-f503-40f6-acde-6375a624bbb5 |
| Qcfgbcl850                       | fgbclTrace                     | E528B6D3-4B45-44D2-AA9E-589BF570B994 |
| qcglink850                       | GlinkTraceErrGuid              | e98045ad-4058-444c-a751-97157605bbf8 |
|                                  | GlinkTraceGuid                 | c37a7356-c3d3-45a7-b991-01c0403e5918 |
| qcgnss                           | GpsTraceGuid                   | 8AC657C6-6FCE-4904-93BC-E631ED8134BB |
| qcgpi850                         | GpiTracer                      | F0EEE77F-2B57-43A3-82E9-20F0F02331E1 |
| qcgpio                           | QcGpioTraceGuid                | 302c57a4-26d4-4ec3-B754-29025DCD164B |
| qcgsi850                         | GSITRACE                       | 3B188E03-4FA9-7425-20E0-C89CF50C9573 |
| qchdcpumd850                     | CtlGuid                        | 28EE579B-CF67-43b6-9D19-8930E7AAA131 |
| qchwnhaptics850                  | HwnHapticsTrace                | 03096FC8-5F52-427A-9E71-F121E1EFE6F1 |
| qchwnled850                      | hwnledTraceGuid                | 1B23D121-227A-4CA9-A143-BAF9205EF142 |
| qci2c850                         | PbcTraceGuid                   | EF49A24A-40CD-46D0-8A8A-3623B7A18969 |
| qcImproveTouch850                | touchtrace                     | D9601424-B217-439F-AE21-869814FB78E8 |
| qcimssink850                     | qimssinktrace                  | 6761AB32-CADA-468C-874F-6B1EF2DD8874 |
| qcimssrc850                      | qcimssrcTrace                  | 89C0E8F2-4EAB-426A-B707-52F53FC17614 |
| qciommu850/qcsmmu850             | SmmuTrace                      | cf6bfd48-e161-4949-96d5-8647cfc488c8 |
| qcipa850                         | IPATRACE                       | 367DC0A5-4DE5-4142-C7D4-E29C47275A6C |
| qcipcrouter850                   | IPCRouterTraceCtrlGuid         | 0076be32-0be5-4df7-a923-a19945d66ab0 |
|                                  | IPCRouterTraceErrGuid          | 500cfd06-5db8-49e3-9e1c-1613cf51d308 |
|                                  | IPCRouterTracePktGuid          | 5767b83a-4578-4020-8db1-c26cb6e88a49 |
| qckmbam850                       | BamTraceGuid                   | 5C443E1C-6949-4E39-A898-2020331C8F90 |
| qclinklocal850                   | DATAIFAPILIB                   | 013EE145-0DA9-4C83-93AA-09D71DA3625B |
|                                  | LinklocalWPP                   | B950DFE2-7772-45CD-8432-5C2183ECF48B |
| QCListenSoundModel               | CntrlQCSounModelDll            | 435B6D64-B9CE-4DB5-BAF6-11060BC7656F |
| QcLteCoexMgr850                  | WlagTrace                      | EA888489-DA55-4C45-9463-E789D758B6F2 |
| qcmbb850                         | MBBWPP                         | 36797C31-A122-43DB-B296-36AB887335C3 |
| qcmbbsrvc850                     | FdoTrace                       | D5E0C4D1-478D-4140-9A44-EFB8B882C022 |
| qcmbrg850                        | MbrgTracer                     | cdef430e-1881-4bc4-b281-c477253e4b17 |
| qcpdsr850                        | PDSRTrace                      | 8626d8e5-081f-48d7-a01a-040ef269652b |
| qcpep850                         | RpmhTraceGuid0                 | 2C89C855-6301-41F9-BF56-63416DFE9CA9 |
|                                  | UlogTraceGuid0                 | F4F985AD-8617-4D42-B21B-28E3105C0CAA |
|                                  | PEPBCLTraceGUID                | 2A2D4F18-5DCB-4277-AF1B-7416408DCA55 |
|                                  | PEPCOREBSPTraceGUID            | CA218504-C8B7-421D-A5F3-F932CB62BC30 |
|                                  | PEPDCVSTraceGUID               | D179D27F-322A-4EBF-B209-FBC860D05812 |
|                                  | PEPThermalTraceGUID            | 155F8C3F-FD86-40A4-B059-4160B29A4223 |
|                                  | PEPIdleTraceGUID               | 8789CFBB-E215-463F-A4A2-906DD6F0250C |
|                                  | PEPDevicePowerMgmtFrmwk        | 39D7D81E-7C75-493F-B7A0-3171AF1AB3E2 |
|                                  | CprTraceGuid0                  | EA4AC5EE-4FBC-48FC-BCC1-E58D6F5429AF |
|                                  | PppTraceGuid                   | 4747672D-8C2C-4B4C-A8B0-9A23F41549FF |
|                                  | PepTraceGuid0                  | a577097e-09a7-43ca-a409-685f78c4efb7 |
|                                  | RpelibTraceGuid                | A77E292C-44CF-4821-907A-93AC09231A2D |
| qcpil850                         | PilTrace                       | 4B2AE6CB-2AFC-4251-8DF6-55939744250F |
|                                  | ElfParserTraceGuid             | C1FE9AE2-F88D-443F-B40C-1BB32AE012A2 |
| qcpmic3p850                      | Pmic3PTrace                    | 3AD272A6-6C75-4A0D-8599-95D3131370EF |
| qcpmic850                        | PmicKmdfTrace                  | 23A49036-9AE1-4D2F-B167-16849DD6040D |
| QcPmicApps850                    | PmicAppsTrace                  | D46834A3-5940-43A3-B007-44E86420AC21 |
| qcpmicEIC850                     | PmicEICTrace                   | 3AD272A6-6C75-4A0D-8599-95D3131370EF |
| qcpmicgpio850                    | PmicGpioTrace                  | 5BBED14F-3671-4598-AD2F-A9B6BCD3824D |
| qcpmictcc850                     | BifTrace                       | 9cab7ef0-9c6f-4c3a-a5ac-ff2e59e181ec |
| QcRCSPresSvc                     | RcsWni                         | 8CE11738-35C9-4FBC-9A6C-1EEA44177F58 |
| qcremoteat850                    | FdoTrace                       | 0E1402ED-3DCA-487D-8E64-91E1A5663F54 |
| qcremoteatsrvc850                | FdoTrace                       | 1EECC841-9F7C-44E2-8E9B-986ACF2173A2 |
| qcremotefs850                    | RFSTrace                       | 583DA23E-3DA2-4DB2-8295-F8212C8C2511 |
| qcrevrmnet                       | RevRmnetTrace                  | 25E8F35D-45C0-41D6-91D3-996CAF7FBE41 |
| qcrmnetbridge850                 | RmnbrgTrace                    | 7980CAA5-0DAA-4954-A39C-93B2B4707DD4 |
| qcRng850                         | qcRng                          | 106F3429-2453-425B-81BA-DA8010BC3884 |
| qcrpen850                        | RpenTraceGuid                  | 7311d40c-ce4f-496f-a563-f72d7bc9d92f |
| qcscm850                         | SCMTraceGuid                   | BC491612-4CA5-4489-A3EA-8DDE1F3B268E |
| qcSensors850                     | SensorsClxTraceGuid            | 44D2526D-EF8B-4336-B5E0-FBDB88CA10C0 |
| qcshutdownsvc850                 | MyDriver1TraceGuid             | de6c1d2d-861a-4248-a8f3-e236c4f16a19 |
| qcslimbus850                     | SlimBusTraceGuid               | C951B320-B923-4F26-A9BA-DA30550F2136 |
| qcsp                             | spcomTraceGuid                 | 73be740a-72e0-4aec-b044-54fa6c2b1633 |
| qcspi850                         | QualcommSpiTraceGuid           | CE0458F5-EE40-403A-AF35-A3E7FACC2BD0 |
| qcspmi850                        | qcspmiTraceGuid                | c1de55d4-9831-472f-a17d-3500da9c7fa8 |
| qcsubsys850                      | SubSysTrace                    | 8601DCB7-CA1A-48B7-91B4-E113B7D2A655 |
| qcsyscache850                    | SmmuTrace                      | 055E96F6-823F-4F94-8954-A12ABD1B339D |
| QcTftpKmdf850                    | QCTFTPTraceGUID                | 8cb2c430-3aa3-455e-a4c4-328719e67055 |
| QcTrEE850                        | TrEETrace                      | DE3B1201-A1DF-478A-9062-E443CDABF070 |
| qcuart850                        | QualcommUartTraceGuid          | CE22E47E-2675-49C8-9D20-790BDACA429B |
| qcusbc850                        | QcUsbCTraceGuid                | 246E500B-1764-4427-ADD6-3C998B71F899 |
| qcusbcucsi850                    | QcUsbCTraceGuid                | 3168776E-0E5B-4B63-8F92-9D6C1B395166 |
| QcUsbFnSs850                     | QcUsbFnTraceGuid               | 82D869FE-8FFA-4AAD-B4F9-86160083CC68 |
| QcUsbFnSsFilter850               | UsbFnSsTrace                   | 6FD2F1A8-C3D9-4A72-B122-30C6AD3E0A5F |
| To be filled                     |                                |                                      |

