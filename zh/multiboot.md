# 多启动支持

目前`edk2-sdm845`内置了SimpleInit作为启动菜单，你可以通过修改`logfs`分区中的`simpleinit.static.uefi.cfg`来进行配置

SimpleInit能自动检测到Windows并生成启动项，所以你不需要添加Windows启动项

你需要使用v2.0或更新版本的`edk2-sdm845`来启动安卓

## 配置样例

下面是小米Mix 2s上的多启动配置样例，在Evolution X (Android 12)下验证通过

```
language = "zh_CN"
logger {
	file_output = "@part_logfs:\\simpleinit.log"
    use_console = false
}
boot {
    // 默认启动项，请先删除simpleinit.uefi.cfg中的boot.default配置
	default = "android"
	configs {
        // 安卓配置样例
		android {
			mode = 8
			desc = "Android"
			show = true
			enabled = true
			icon = "distributor-logo-android.svg"
			extra {
				use_uefi = false
                // 指向下方locates配置中的启动分区
				abootimg = "#part_boot"
                // boot镜像中的设备树model值，因设备而异，某些设备上能自动识别，从而不需要该项
				dtb_model = "Xiaomi Technologies, Inc. Polaris P2 v2.1"
                // 指向下方locates配置中的dtbo分区，某些时候可能不需要
                // dtbo = "#part_dtbo"
                // dtbo id，因设备而异，某些时候可能不需要
                // dtbo_id = 6
			}
		}

		// Windows PE配置样例
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

        // Recovery配置样例
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
        // Linux主线内核配置样例
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
        // 从文件启动安卓配置样例
		android-img {
			mode = 8
			desc = "Boot Android From File"
			show = true
			enabled = true
			icon = "distributor-logo-android.svg"
			extra {
				use_uefi = false
                // 从esp分区中的boot.img启动
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
        // 分区名
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

## 参考文档

[SimpleInit Docs](https://github.com/BigfootACA/simple-init/blob/master/docs/index.md)
