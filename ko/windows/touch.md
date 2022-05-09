# 터치스크린 컨트롤러 활성화

 ```경고::
  미완성 글
  
  해야 하는 것: LPXC에 있는 패키지 설명하기, 이상한 들여쓰기 고치기
 ```

 ```중요::
  제일 먼저 당신의 DSDT 테이블이 너무 많이 망가지지 않게 하고 qcpep같은 핵심 드라이버가 제대로 로딩되게 해야 합니다.
 ```

DSDT의 부은은 어떻게 Oneplus 6t에서 시냅스 터치를 활성화시키는지 보여줍니다. 

## TSC1 부분


```

        Scope (\_SB.PEP0)
        {
            Method (LPMX, 0, NotSerialized)
            {
                Return (LPXC)
            }

            Name (LPXC, Package (0x01)
            {
                Package (0x04)
                {
                    "DEVICE", 
                    "\\_SB.TSC1", 
                    Package (0x0B)
                    {
                        "DSTATE", 
                        Zero, 
                        // 2.8V 조정기를 LDO28_A에서 활성화하기
                        Package (0x02)
						{
							"PMICVREGVOTE", 
							Package (0x06)
							{
								"PPP_RESOURCE_ID_LDO28_A", 
								One, 
								2856000, 
								One, 
								0x07, 
								Zero
							}
						},
						// 10ms 지연
                        Package (0x02)
                        {
                            "DELAY", 
                            Package (0x01)
                            {
                                10000
                            }
                        }, 
                        // v1p8 GPIO 활성화
                        Package (0x02)
                        {
                            "TLMMGPIO", 
                            Package (0x06)
                            {
                                88, 
                                One, 
                                Zero, 
                                One, 
                                Zero, 
                                Zero
                            }
                        }, 
						// 2v8 GPIO 활성화
						// fajita에선 별 것이 아닙니다
						// 또한 1v8 i2c 조정기도 없음
						
						// 10ms동안 절전
                        Package (0x02)
                        {
                            "DELAY", 
                            Package (0x01)
                            {
                                10000
                            }
                        }, 

						// 디바이스 초기화
						Package (0x02)
                        {
                            "TLMMGPIO", 
                            Package (0x06)
                            {
                                99, 
                                One, 
                                Zero, 
                                One, 
                                Zero, 
                                Zero
                            }
                        }, 
                        
						// 10ms동안 절전
                        Package (0x02)
                        {
                            "DELAY", 
                            Package (0x01)
                            {
                                10000
                            }
                        }, 
                        
						Package (0x02)
                        {
                            "TLMMGPIO", 
                            Package (0x06)
                            {
                                99, 
                                Zero, 
                                Zero, 
                                One, 
                                Zero, 
                                Zero
                            }
                        }, 
                        
                        Package (0x02)
                        {
                            "DELAY", 
                            Package (0x01)
                            {
                                10000
                            }
                        }, 
                        
						Package (0x02)
                        {
                            "TLMMGPIO", 
                            Package (0x06)
                            {
                                99, 
                                One, 
                                Zero, 
                                One, 
                                Zero, 
                                Zero
                            }
                        }, 
                    }, 

                    Package (0x04)
                    {
                        "DSTATE", 
                        0x03, 
						Package (0x02)
                        {
							// 리셋 핀 끄기
                            "TLMMGPIO", 
                            Package (0x06)
                            {
                                99, 
                                Zero, 
                                Zero, 
                                One, 
                                Zero, 
                                Zero
                            },                            
                        },
                        
                        // v1p8 low
						Package (0x02)
                        {
							// 리셋 핀 끄기
                            "TLMMGPIO", 
                            Package (0x06)
                            {
                                88, 
                                Zero, 
                                Zero, 
                                One, 
                                Zero, 
                                Zero
                            },                            
                        },
                    }
                }
            })
        }

```

```

        Device (TSC1)
        {
            Name (_HID, "MSHW1003")  // _HID: Hardware ID
            Name (_UID, One)  // _UID: Unique ID
            Name (_DEP, Package (0x03)  // _DEP: Dependencies
            {
                \_SB.PEP0,
                \_SB.GIO0, 
                \_SB.IC13
            })
            Method (_CRS, 0, NotSerialized)  // _CRS: Current Resource Settings
            {
                Name (RBUF, ResourceTemplate ()
                {
                    I2cSerialBusV2 (0x0020, ControllerInitiated, 0x00061A80,
                        AddressingMode7Bit, "\\_SB.IC13",
                        0x00, ResourceConsumer, , Exclusive,
                        )
                    GpioInt (Edge, ActiveLow, ExclusiveAndWake, PullUp, 0x0000,
                        "\\_SB.GIO0", 0x00, ResourceConsumer, ,
                        )
                        {   // 핀 목록 
                            0x007D
                        }
                    GpioIo (Exclusive, PullNone, 0x0000, 0x0000, IoRestrictionNone,
                        "\\_SB.GIO0", 0x00, ResourceConsumer, ,
                        )
                        {   // 핀 목록 
                            0x0063
                        }
                })
                Return (RBUF) /* \_SB_.TSC1._CRS.RBUF */
            }
            

            Name (PGID, Buffer (0x0A)
            {
                "\\_SB.TSC1"
            })
            Name (DBUF, Buffer (DBFL){})
            CreateByteField (DBUF, Zero, STAT)
            CreateByteField (DBUF, 0x02, DVAL)
            CreateField (DBUF, 0x18, 0xA0, DEID)
            Method (_S1D, 0, NotSerialized)  // _S1D: S1 기기 상태
            {
                Return (0x03)
            }

            Method (_S2D, 0, NotSerialized)  // _S2D: S2 기기 상태
            {
                Return (0x03)
            }

            Method (_S3D, 0, NotSerialized)  // _S3D: S3 기기 상태
            {
                Return (0x03)
            }

            Method (_PS0, 0, NotSerialized)  // _PS0: 전원 상태 0
            {
                DEID = Buffer (ESNL){}
                DVAL = Zero
                DEID = PGID /* \_SB_.TSC1.PGID */
                If (\_SB.ABD.AVBL)
                {
                    \_SB.PEP0.FLD0 = DBUF /* \_SB_.TSC1.DBUF */
                }
            }

            Method (_PS3, 0, NotSerialized)  // _PS3: 전원 상태 3
            {
                DEID = Buffer (ESNL){}
                DVAL = 0x03
                DEID = PGID /* \_SB_.TSC1.PGID */
                If (\_SB.ABD.AVBL)
                {
                    \_SB.PEP0.FLD0 = DBUF /* \_SB_.TSC1.DBUF */
                }
            }
        }

```

## I2C 부분

```

        Device (IC13)
        {
            Name (_HID, "QCOM0220")  // _HID: 하드웨어 ID
            Alias (\_SB.PSUB, _SUB)
            Name (_UID, 0x0D)  // _UID: 구분 ID
            Name (_DEP, Package (0x01)  // _DEP: 종속물
            {
                \_SB.PEP0
            })
            Name (_CCA, Zero)  // _CCA: 캐시 일관성 속성
            Method (_CRS, 0, NotSerialized)  // _CRS: 현재 리소스 설정
            {
                Name (RBUF, ResourceTemplate ()
                {
                    Memory32Fixed (ReadWrite,
                        0x00A90000,         // 기초 주소
                        0x00004000,         // 주소 길이
                        )
                    Interrupt (ResourceConsumer, Level, ActiveHigh, Exclusive, ,, )
                    {
                        0x00000185,
                    }
                })
                Return (RBUF) /* \_SB_.IC13._CRS.RBUF */
            }
        }
```        
