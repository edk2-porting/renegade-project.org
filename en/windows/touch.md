# Bringing up touchscreen controller

 ```warning::
  Work-In-Progress article
  
  TO-DO: Explain Packages in LPXC, fix weird indents
 ```

 ```important::
  First of all, you need to make sure your DSDT table is not very broken and core drivers such as qcpep gets loaded correctly.
 ```

The following part in DSDT demostrates how to bring up Synaptics touch on Oneplus 6t.

## TSC1 Part


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
                        // Enable the 2.8V regulator on LDO28_A
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
						// Delay 10ms
                        Package (0x02)
                        {
                            "DELAY", 
                            Package (0x01)
                            {
                                10000
                            }
                        }, 
                        // enable the v1p8 GPIO
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
						// enable the 2v8 GPIO
						// not actually a thing on fajita
						// no 1v8 i2c regulator either
						
						// sleep 10ms
                        Package (0x02)
                        {
                            "DELAY", 
                            Package (0x01)
                            {
                                10000
                            }
                        }, 

						// reset the device
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
                        
						// sleep 10ms
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
							// set reset low
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
                        
                        // set v1p8 low
						Package (0x02)
                        {
							// set reset low
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
                        {   // Pin list
                            0x007D
                        }
                    GpioIo (Exclusive, PullNone, 0x0000, 0x0000, IoRestrictionNone,
                        "\\_SB.GIO0", 0x00, ResourceConsumer, ,
                        )
                        {   // Pin list
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
            Method (_S1D, 0, NotSerialized)  // _S1D: S1 Device State
            {
                Return (0x03)
            }

            Method (_S2D, 0, NotSerialized)  // _S2D: S2 Device State
            {
                Return (0x03)
            }

            Method (_S3D, 0, NotSerialized)  // _S3D: S3 Device State
            {
                Return (0x03)
            }

            Method (_PS0, 0, NotSerialized)  // _PS0: Power State 0
            {
                DEID = Buffer (ESNL){}
                DVAL = Zero
                DEID = PGID /* \_SB_.TSC1.PGID */
                If (\_SB.ABD.AVBL)
                {
                    \_SB.PEP0.FLD0 = DBUF /* \_SB_.TSC1.DBUF */
                }
            }

            Method (_PS3, 0, NotSerialized)  // _PS3: Power State 3
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

## I2C Part

```

        Device (IC13)
        {
            Name (_HID, "QCOM0220")  // _HID: Hardware ID
            Alias (\_SB.PSUB, _SUB)
            Name (_UID, 0x0D)  // _UID: Unique ID
            Name (_DEP, Package (0x01)  // _DEP: Dependencies
            {
                \_SB.PEP0
            })
            Name (_CCA, Zero)  // _CCA: Cache Coherency Attribute
            Method (_CRS, 0, NotSerialized)  // _CRS: Current Resource Settings
            {
                Name (RBUF, ResourceTemplate ()
                {
                    Memory32Fixed (ReadWrite,
                        0x00A90000,         // Address Base
                        0x00004000,         // Address Length
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