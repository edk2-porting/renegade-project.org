Kernel cmdline
======================

## Necessary parameters

```
pd_ignore_unused clk_ignore_unused efi=novamap 
```

- `pd_ignore_unused` 

Keep all power domains already enabled by bootloader on, 
even if no driver has claimed them.

- `clk_ignore_unused` 

Keep boot clocks on, even if no driver has claimed them.

- `efi=novamap` 

SetVirtualAddressMap() is not called after ExitBootServices()

## Optional parameters

```
earlycon=efifb,mem video=efifb:off debug panic=10
```

- `earlycon=efifb,mem`

Enable early kernel messages output on EFI framebuffer.
Very useful and recommended for early kernel debugging.

- `video=efifb:off`

Disable the efifb framebuffer. 
efifb highly affects performance on my phone for unknown reasons.
Disabling it can improve performance.
**Do not disable unless you have an alternative fb such as simplefb**