### Analyzing the firmware binaries

Now let's study the differences between each (unpatched - patched) pair of files, so that we can hopefully see the patch pattern.
For this section, it is highly recommended (though not mandatory) that you have a second monitor, as things can get messy with opening multiple files in Ghidra).

First, go to the workspace directory:

```
$ cd ~/work
$
```

We will start with `UsbConfigDxe.efi`. 

Do a diff on the Surface Duo unpatched-patched pair:

```
$ diff UsbConfigDxe.SDPkg.efi.hex UsbConfigDxe.SDPkg.patched.efi.hex 
1109c1109
< 00005350  2a 02 00 34 68 00 00 f0  01 8d 21 91 e9 03 1f 2a  |*..4h.....!....*|
---
> 00005350  11 00 00 14 68 00 00 f0  01 8d 21 91 e9 03 1f 2a  |....h.....!....*|
1114c1114
< 000053a0  2a 09 60 39 4a 1d 00 53  e8 1f 00 f9 2a 02 00 34  |*.`9J..S....*..4|
---
> 000053a0  2a 09 60 39 4a 1d 00 53  e8 1f 00 f9 11 00 00 14  |*.`9J..S........|
```

This tells us that there are only two differences between those two files, on two lines.
That means that we have two offsets to look at, addresses `00005350` and `00005350` respectively.
The difference stands out: at both offsets, the byte sequence `2a 02 00 34` became `11 00 00 14`. At the first offset, that byte sequence happens to be at the beginning of the line, but at the second offset, it's at the end.

Now, keep in mind that **this byte sequence is NOT! necessarily at the same offset in all versions of the binary! This is a compiled binary - what exists at a given offset depends on the original code.** In some cases, there might even be a very slight difference in the byte sequence. This is why we are studying a pair of files, not just one.

Next, do a diff on the Mi Mix 3 unpatched-patched pair:

```
$ diff UsbConfigDxe.Mix3.efi.hex UsbConfigDxe.Mix3.patched.efi.hex 
943c943
< 000048f0  e8 2b 00 f9 2a 02 00 34  68 00 00 90 01 3d 37 91  |.+..*..4h....=7.|
---
> 000048f0  e8 2b 00 f9 11 00 00 14  68 00 00 90 01 3d 37 91  |.+......h....=7.|
949c949
< 00004950  2a 02 00 34 68 00 00 90  01 6d 38 91 e9 03 1f 2a  |*..4h....m8....*|
---
> 00004950  11 00 00 14 68 00 00 90  01 6d 38 91 e9 03 1f 2a  |....h....m8....*|
```

As we can see, the offsets where the difference is have slightly differed (if you didn't expect that, you didn't read the bolded part above - go re-read it).
However, the byte sequence is the same `2a 02 00 34` becomes `11 00 00 14` in both offsets. In the first offset, the byte sequence is somewhere in the midle of the line, and in the second offset, it's right at the beginning.

Finally, let's see where this byte sequence might exist within our file:

```
$ cat UsbConfigDxe.efi.hex | grep "2a 02 00 34"
000048f0  e8 2b 00 f9 2a 02 00 34  68 00 00 90 01 d5 36 91  |.+..*..4h.....6.|
00004950  2a 02 00 34 68 00 00 90  01 05 38 91 e9 03 1f 2a  |*..4h.....8....*|
```

Now, armed with this information, let's open up all of these files in Ghidra, so that we can methodically apply the patch.

Create a new project in Ghidra as follows:
![](/img/dxe_patching/1.png)
![](/img/dxe_patching/2.png)
![](/img/dxe_patching/3.png)
![](/img/dxe_patching/4.png)

Now, batch-import the differing versions of `UsbConfigDxe.efi` we will be working with:
![](/img/dxe_patching/5.png)
![](/img/dxe_patching/6.png)
![](/img/dxe_patching/7.png)
![No need to change anything here.](/img/dxe_patching/8.png)

![](/img/dxe_patching/9.png)
![](/img/dxe_patching/10.png)

Now, double-click `UsbConfigDxe.efi` (the unpatched version from your device). Ghidra will open up the CodeBrowser, and it will ask you whether you want to analyze the file.


Analysis means that Ghidra will try to deduct as much from the file as it can get away with - it will even give you some nice almost-C code.
This could be helpful, so select Yes. You will then get this screen:

![](/img/dxe_patching/12.png)

Here, just click the Analyze button - the defaults will be more than enough.

Then, Ghidra will crunch away, trying to demystify those hex bytes. Give it a few seconds and it'll be done.	

![](/img/dxe_patching/13.png)

As soon as the progress bar goes away, you will be ready to edit.

![](/img/dxe_patching/14.png)

Before we get going though, one thing to keep in mind: Ghidra's offsets are **virtual addresses**, reflecting the offsets of bytes when the program is loaded to memory, not file addresses, which are the offsets of the bytes in the file.

Therefore, we have to pay attention to the **base address**:

![](/img/dxe_patching/15.png)

In this case (and in most cases, I believe), this address is `00010000`. Therefore, every offset we have found out before should be shifted by that amount - so an offset of `00005350` in-file would become `00015350`.

You can scroll freely until you find the address you want, but there's a quicker way: press the `G` key on the keyboard to bring up this dialog:

![](/img/dxe_patching/16.png)

In here, type the address you want to go to - we will type the address of the original byte sequence (from the last step in the terminal, which was `000048f0` - but when offset by the base address, this would be `000148f0`):

![](/img/dxe_patching/17.png)

Ghidra will take us to the offset:

![](/img/dxe_patching/18.png)

However, you may notice that the offset we were taken to isn't the same exact offset we have read from the hex file - this is because the offset at the beginning of the line in the hex dump is the address of the **first** offset in that line.
But since they're on the same line, they're in the same proximity - look at the couple or so of lines below that ... and, sure thing, there it is:

![](/img/dxe_patching/18-annotated.png)

There it is!

Before we jump to editing, we need to know *what* exactly to put in there by seeing what the original and patched bytes look like in the Surface Duo and/or Mix 3 unpatched-patched pair.

Open up any of the two in Ghidra side-by-side - I'll be going with the Mi Mix 3 pair.
As usual, it will ask you to analyze the file - let it do so.

![](/img/dxe_patching/21.png)

Go to the offset **from the diff between the two files** - in this case, the offset will be `000048f0`, or `000148f0` adjusted for the base address,

We can see that in the original, unpatched file, the original byte sequence `2a 02 00 34` translates into the assembly instruction `cbz w10,0x00014938`, while the patched byte sequence `` translates into `b 0x00014938`:

![](/img/dxe_patching/22.png)
![](/img/dxe_patching/23.png)

Note the difference, then close the two Mix 3 windows.

Let's edit the byte sequence in the **original** file **from your device** (i.e. `UsbConfigDxe.efi`)  by pressing `Ctrl` + `Shift` + `G`, which should put us into edit mode.

![](/img/dxe_patching/20.png)

<details>
<summary>Note</summary>

It will show this dialog the first time you invoke edit mode, as it builds the assembler for the CPU architecture of our phone:
![](/img/dxe_patching/19.png)

But this will only happen once per file.

</details>

Edit the sequence from this:

![](/img/dxe_patching/24.png)

To this:

![](/img/dxe_patching/25.png)

Then, repeat this for the other occurrence of the byte sequence:

![](/img/dxe_patching/26.png)

![](/img/dxe_patching/27.png)

With this, you have successfully patched `UsbConfigDxe.efi` - save and export it as a PE executable. Make sure you append `patched` to the filename to avoid confusion with unpatched files, and **doubly make sure that "Selection" is unchecked!**

![](/img/dxe_patching/28.png)
![](/img/dxe_patching/29.png)
![](/img/dxe_patching/30.png)

Ghidra will print out a report indicating that the export without a problem.

![](/img/dxe_patching/31.png)

**Now, let's repeat the steps above for ButtonsDxe.efi:**

Like before, we will try to find the difference between the unpatched-patched pairs:
```
$ diff ButtonsDxe.SDPkg.efi.hex ButtonsDxe.SDPkg.patched.efi.hex 
731c731
< 00003bb0  30 03 00 34 51 20 80 52  f1 33 00 79 88 02 40 39  |0..4Q .R.3.y..@9|
---
> 00003bb0  30 03 00 34 b1 01 80 52  f1 37 00 79 88 02 40 39  |0..4...R.7.y..@9|

$ diff ./ButtonsDxe.Mix3.efi.hex ./ButtonsDxe.Mix3.patched.efi.hex 
659,660c659,660
< 00003730  05 00 00 14 10 1c 00 12  30 03 00 34 51 20 80 52  |........0..4Q .R|
< 00003740  f1 33 00 79 88 02 40 39  e1 63 00 91 e2 03 1e 32  |.3.y..@9.c.....2|
---
> 00003730  05 00 00 14 10 1c 00 12  30 03 00 34 b1 01 80 52  |........0..4...R|
> 00003740  f1 37 00 79 88 02 40 39  e1 63 00 91 e2 03 1e 32  |.7.y..@9.c.....2|

```
<details>
<summary>You might ask: Why are there two differences in the Mix 3 pair vs. one for the Surface Duo pair?
</summary>

No, this is just illusory.
Remember what we said earlier about the offset at the beginning of the line`hexdump` being the offset of the first instruction on the line?
Both pairs actually have **two** differing byte sequences - it's just that the Surface Duo pair has the two differing sequences on the same line, while the Mix 3 pair has them on two lines.
So, it's just how `hexdump` formats things.

If you want to understand this even better, open up both pairs in Ghidra and see how both translate into assembly language.

</details>

... then locate the original byte sequence in the file we want to patch:
```
$ cat ./ButtonsDxe.efi.hex | grep "51 20 80 52"
$
```

Looks like we have a problem. `grep` cannot find the original byte sequence in the file that we want to patch!
The offset might have differed slightly between the reference file pairs and our file, so let's try to find portions of it:

```
$ cat ./ButtonsDxe.efi.hex | grep "51 20 80 52"
$ cat ./ButtonsDxe.efi.hex | grep "51 20 80"
$ cat ./ButtonsDxe.efi.hex | grep "20 80"
00003730  50 20 80 52 f0 13 00 79  88 02 40 39 e1 23 00 91  |P .R...y..@9.#..|
```

Looks similar enough, and there's one occurrence of it. However, that's by no means conclusive - we have to use Ghidra again to make sure that the assembly code surrounding it is similar to the original file (if it isn't, then that chunk isn't what we want to patch - **tread carefully**).

We'll compare the two files in Ghidra.

First, open up the matched-unmatched pairs from the Surface Duo in Ghidra. Find each offset from the diff, then take note of the assembly code at that offset and neighboring offsets:

![](/img/dxe_patching/32.png)
![](/img/dxe_patching/33.png)

As we can see, `mov w17,#0x102` has become `mov w17,#0xd`, and `strh w17,[sp, #local_68]` has become `strh w17,[sp, #local_68+0x2]` :

```
Original:

        00013bb4 51 20 80 52     mov        w17,#0x102
        00013bb8 f1 33 00 79     strh       w17,[sp, #local_68]
        
Patched:

        00013bb4 b1 01 80 52     mov        w17,#0xd
        00013bb8 f1 37 00 79     strh       w17,[sp, #local_68+0x2]
```

Now, open our file and go to the "suspect" offset:

![](/img/dxe_patching/34.png)

```
Our file:

        00013730 50 20 80 52     mov        w16,#0x102
        00013734 f0 13 00 79     strh       w16,[sp, #local_68]
```

Surprisingly, those instructions in assembly are identical except for `w17` being `w16` here. So, we will edit our assembly instructions to match the ones from the Surface Duo file, but keeping the `w17 -> w16` part as is.
Editing the first line is straightforward enough. But attempting to edit the second line:

![](/img/dxe_patching/35.png)

results in this:

![](/img/dxe_patching/36.png)

**Where did this `#0x8` come from?** And what's `#local_68` ?

Even though Ghidra disassembles the binary, it cannot know the original variable names. Therefore, it uses placeholder variable names, and `#local_68` is simply an example of a placeholder variable name.

In edit mode, the internal representation (or possibly the value) of the variable (which is `#0x8`) is what's shown.

So, to determine what we should edit this line with, we should refer to the unpatched-patched pair.

In the unpatched Surface Duo binary, invoking edit mode on the second line results in this:

![](/img/dxe_patching/37.png)

`strh       w17,[sp, #0x18]`

... while invoking edit mode on the second line in the patched Surface Duo binary (reminder: `strh        w17,[sp, #local_68+0x2]`) results in this:

![](/img/dxe_patching/38.png)
`strh        w17,[sp, #0x1a]`

And given that our original line had `0xa`, that (`0x18 + 0x2 = 0x1a` ... `old value + 0x2 = new`) means that our patch should become like this:

![](/img/dxe_patching/39.png)
```
strh        w16,[sp, #0xa]
```

Now, save and export the binary in PE format, like we have done before:

![](/img/dxe_patching/40.png)
![](/img/dxe_patching/41.png) - filename!
![](/img/dxe_patching/42.png)

With this finally done, let's move to [the final step in this task](en/sm8150pkg/tutorial/6_Building_with_patched_firmware_binaries.md).
