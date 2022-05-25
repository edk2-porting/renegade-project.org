# Multiboot support

`edk2-sdm845` has SimpleInit as boot manager. You can configure it by modifying `simpleinit.static.uefi.cfg` in `logfs` partition

SimpleInit will detect Windows automatically, so there's no need to add Windows boot entry

To boot Android, you'll need `edk2-sdm845` Version 2.0+

## Configuration examples

Here is a configuration example for Xiaomi Mix 2s, which has been tested with Evolution X (Android 12)

```
language = "en_US.UTF-8"
logger {
	file_output = "@part_logfs:\\simpleinit.log"
    use_console = false
}
boot {
    // Default boot option，please remove the `boot.default` key found in `simpleinit.uefi.cfg` first
	default = "android"
	configs {
        // Example of booting to Android
		android {
			mode = 8
			desc = "Android"
			show = true
			enabled = true
			icon = "distributor-logo-android.svg"
			extra {
				use_uefi = false
                // points to the boot partition in the locates configuration below
				abootimg = "#part_boot"
                // device model in boot image devicetree, varies by device
                // might get recognized automatically on certain devices and thus not needed
				dtb_model = "Xiaomi Technologies, Inc. Polaris P2 v2.1"
                // points to the dtbo partition in the locates configuration below, might not be needed
                // dtbo = "#part_dtbo"
                // dtbo ID，varies by device, might not be needed
                // dtbo_id = 6
			}
		}
		// Example of booting to Windows PE
		pe {
			mode = 9
			desc = "Windows PE"
			show = true
			enabled = true
			icon = "distributor-logo-windows.svg"
			extra {
				efi_file = "@part_pe:\\efi\\boot\\bootaa64.efi"
			}
		}
        // Example of booting to recovery
		recovery {
			mode = 8
			desc = "Recovery"
			show = true
			enabled = true
			icon = "twrp.png"
			extra {
				use_uefi = false
				abootimg = "#part_rec"
				dtb_id = 6
			}
		}
        // Example of booting Linux mainline kernel
		mainline {
			mode = 8
			desc = "Linux Mainline"
			show = true
			enabled = true
			icon = "linux.svg"
			extra {
				use_uefi = true
				kernel = "@part_esp:\\Image"
				dtb = "@part_esp:\\sdm845-xiaomi-polaris.dtb"
				skip_kernel_fdt_cmdline = true
				update_splash = false
				initrd = "@part_esp:\\initrd.img"
				cmdline = "efi=novamap clk_ignore_unused pd_ignore_unused video=efifb:off root=/dev/sda25"
			}
		}
        // Example of booting Android kernel from image file
		android-img {
			mode = 8
			desc = "Boot Android From File"
			show = true
			enabled = true
			icon = "distributor-logo-android.svg"
			extra {
				use_uefi = false
                // Boot from boot.img located in esp partition
				abootimg = "@part_esp:\\boot.img"
				dtb_id = 6
                // dtbo = "#part_dtbo"
                // dtbo_id = 6
			}
		}
	}
}
locates {
	part_boot {
		by_disk_label = "gpt"
        // Partition name
		by_gpt_name = "boot"
	}
	part_dtbo {
		by_disk_label = "gpt"
		by_gpt_name = "dtbo"
	}
	part_system {
		by_disk_label = "gpt"
		by_gpt_name = "system"
	}
	part_logfs {
		by_disk_label = "gpt"
		by_gpt_name = "logfs"
	}
	part_rec {
		by_disk_label = "gpt"
		by_gpt_name = "recovery"
	}
	part_esp {
		by_disk_label = "gpt"
		by_gpt_name = "esp"
	}
	part_pe {
		by_disk_label = "gpt"
		by_gpt_name = "pe"
	}

}
```

## Reference docs

[SimpleInit Docs](https://github.com/BigfootACA/simple-init/blob/master/docs/index.md)

