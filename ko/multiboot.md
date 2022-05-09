주의: 번역이 완벽하지 않을 수 있습니다.
Warning: Translation may not be perfect.

# 멀티부팅 지원

`edk2-sdm845`은 SimpleInit를 부팅 관리자로 쓰고 있습니다. 당신은 `simpleinit.static.uefi.cfg`를 `logfs` 파티션에서 수정하여 그것을 설정할 수 있습니다.

SimpleInit이 윈도우를 자동으로 감지할 것이므로 윈도우 부팅 항목을 추가할 필요가 없습니다.

안드로이드를 부팅하려면 `edk2-sdm845`의 버전이 2.0보다 높거나 같아야 합니다.

## 설정 예시

여기에는 Xiaomi Mix 2s를 위한 예시가 있습니다. 또, Evolution X (Android 12) 테스트가 완료되었습니다.

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
                // devicetree ID in boot image, varies by device
                // might get recognized automatically on certain devices and thus not needed
				dtb_id = 6
                // points to the dtbo partition in the locates configuration below, might not be needed
                // dtbo = "#part_dtbo"
                // dtbo ID，varies by device, might not be needed
                // dtbo_id = 6
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
}
```

## 레퍼런스 

[SimpleInit 문서](https://github.com/BigfootACA/simple-init/blob/master/docs/index.md)
