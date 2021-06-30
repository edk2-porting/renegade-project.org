Preface
=======

## What?

**`edk2-sdm845`** is a project which enables you to load any AArch64 EFI-compatible OS/application, such as Windows, Linux etc *(more precisely, they're Windows Boot Manager and GNU Grub)* on your sdm845 mobile devices.

To be honest, I'd rather call it a piece of **broken** *software* than regard it as *firmware* or *bootloader*, as its functionality is extremely limited. You cannot interact with it at runtime at all. Also, it relies on binary executables from Qualcomm. The use of those files is of doubtful legality. **You have been warned.**

## When?

*Thanks to COVID-19*, I made enough leisure time to spend on my computer, which opened up the possibility for me to discover a Github Repository called *edk2-sagit*. I rapidly became intoxicated with the possibility of running a fully-functional Windows Desktop on my phone. So I set about working on my port.

During the process, I was particularly fortunate that I came across some people who had the same ambition as mine, such as *NekokeCore, RedStonee, Evsio0n*... Even though some of us were high school students who were short of time and knowledge, we still went on out of interest. We knew nothing about QCOM platform, AArch64 architecture, Linux kernel internals, even nothing about programming *(eg. myself)*. But there's no problem at all.

Afterwards a Telegram/Discord group was created for English-speaking guys. Many people were friendly and deserved the credit for offering a helping hand, specifically *imbushuo, fxsheep, NTAuthority, Lemon_Ice, TAO_Croatia*... Again, thank you so much for your help.

## Why?

Never ask me anything like "what's the point of it". I would only tell you:
**`Because it's fun`** 

And it's simply appealing that a phone can be used as a laptop, even with decent speed. Some of the models, such as *Smartisan R1*, even have the capability of DisplayPort output and USB3.1 Gen2, which makes it competent in handling some real-life tasks.

By the way, the support for sdm845 in mainline Linux is evolving rapidly. Currently, it's probably the best supported QCOM platform. There does exist problems. But people from Linaro are working hard to get everything working. Maybe in the future we'll be able to do triple boot on our phone.

## Hey qcom!

Part of the reason why the implementation is so broken is that it doesn't contain any Qualcomm source code (aka. BSP) which is confidential. *NTAuthority's* port *should* contain qcom's code. So he couldn't release either cource code or build artifacts to the public. Although this project makes use of qcom blobs to enable UFS functionality, I still don't think it's really `bad`.

*Do you agree with me, Qualcomm?*

## How?
 