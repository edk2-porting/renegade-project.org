# Mu-SM8150pkg, a port of Microsoft "Project Mu" UEFI for Snapdragon 855 devices

This project aims to provide a port of [Project Mu](https://blogs.windows.com/windowsdeveloper/2018/12/19/%E2%80%AFintroducing-project-mu/) UEFI firmware that could boot Windows, Linux, and potentially other OSes on commodity hardware with the Snapdragon 855, building on the work done by WOA-Project's [SurfaceDuoPkg](https://github.com/WOA-Project/SurfaceDuoPkg).

Even though [modern Android devices have UEFI as a part of the boot chain](http://worthdoingbadly.com/qcomxbl), that firmware is unfortunately limited in what it can do, as well as being signed on production-fused devices. Hop over to [edk2-sdm845 overview](en/edk2/Overview) to see how we're solving this problem!

We hope that you're interested, since all of this potential sits behind a pretty simple and straightforward build process. And to make things even easier, we have provided a zero-to-hero guide that documents the whole process.

By the time you go through this guide, we do expect that you would be able to build a UEFI image for most phones running a Snapdragon 855 SoC.

Hope you enjoy the ride!

[Click here to get started.](en/sm8150pkg/tutorial/1_Prerequisites_Bootloader_binary_extraction.md)
