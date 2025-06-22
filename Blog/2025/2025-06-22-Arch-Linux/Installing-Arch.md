## Installing Arch Linx

I think it best to create separate partitions for each dir required, should disaster arise on a particular partition, other parts of the Linux installs are hopefully not effected. 

I also plan to use GRUB as the boot loader post Arch install so /boot and / aka root will use ext4. Feel free to look into other boot loader and pair up file systems for them to your needs. Use this [URL](https://wiki.archlinux.org/title/File_systems) to see key differences and uses in FileSystems for an Arch install.

This will also be a UEFI w/ GPT type install on Intel x86_64 hardware. Bios and MBR required dir will differ and are not covered in this guide. Check your hardware to ensure you can follow along.


## <u>Install USB</u>

Download a torrent downloader of your choice and  download the Arch install .iso from archlinux.com and write it to a usb.

Connecting to the Internet Via USB ISO

Connect a ethernet cable to the device and you will have network connectivity. If you can't or want to use wifi, to connect to the internet use iwctl.

sudo iwctl

View the name of your wifi connection. It should output one or more devices. Take note of its name, in the name collum ie wlan0. 

device list

Use your wifi connection name to brows nearby SSIDs. This will output WiFi SSID names.

station DeviceNameHere get-networks

Then pick an NetworkName to connect to. It always best practice to use a private/password protect/trusted network. That said, if you must connect to a passwordless SSID, ensure it does not have a captive portal as you can't accept its EULA from the CMD line.

station DeviceNameHere connect NetworkNameHere

Be sure to use " " around your SSID name should it have spaces.

To test your connection, type exit to leave iwctl, then ping Arch Linux's website.

ping archlinux.org


## <u>Battery Monitoring</u>

Additionally as there is no GUI and may be on a laptop, you can install acpi to monitor a laptops battery percentage.

pacman -Sy acpi

Then use the acpi cmd to see its %.

acpi


## <u>Creating /boot partition</u>

lsblk to list disks

fdisk /dev/disknamehere

Type g for new GPT partition as this is for a UEFI install

Then while still in fdisk, type n for a new partition.

Select 1 as we will make the /boot partition first

Press enter when asked for starting sector size to accept the default starting size

For ending sector size enter  +1G  to create the partition size as 1GB.

If prompted about signature, remove it.

If successful it will output "created a new partition…"

If you notice, it stated it changed the file system to Linux file system. We will need to change that.

Again, while in fdisk, press t to change the /boot type.

Then select the /boot partition, 1, the first we made, enter it's number, 1

It should now state it went from Linux FileSystem to EFI.

While still in fdisk, type write to write the changes.

Fdisk will have brought you back to the install USB.

Now use mkfs to initialize the partition: Again as this is for a EFI system we will use fat32.

Type mkfs.fat -F32 /dev/nvme0n1p1  as /boot should be fat32 to ensure there are no bootloader issues.


## <u>Creating /swap partition</u>

The swap partition (or swap file) provides virtual memory when the physical RAM is full. It can be used for various purposes such as hibernation, managing memory-intensive applications, and improving overall system stability. Here are some factors to consider when sizing your swap space:

Note, though /swap can be created/expanded later if you don't utilize all of your disk's free space. Here are a few things to consider when picking a /swap partition size. Also

General Guidelines for Swap Space

    - Less than 4 GB of RAM: Swap should be at least equal to the amount of RAM.

    - 4 GB to 8 GB of RAM: Swap should be equal to the amount of RAM.

    - More than 8 GB of RAM: Swap can be half the size of the RAM or even less, depending on your usage.

Considerations

    - Hibernation: If you plan to use hibernation, your swap space should be at least as large as your RAM to store the system state.

    - Heavy Usage: For systems with heavy memory usage (e.g., running virtual machines, large applications), having more swap can be beneficial.

Use fdisk again to create the /swap but use mkswap to initialize /swap and X is the partition number you assigned it when creating it. Note, the -L is for creating a label when initializing the /swap partition.

Go back into fdisk, 

n for new,

Select 2 for partition number

Press enter when asked for starting sector size to accept the default starting size

For ending sector size enter  +XG  to create the partition to your needs.

It again stated it changed the file system to Linux file system.

Press t to change the /swap partition type to swap with t.

Then select the /swap partition, 2, enter it's number, 19.

It should now state it went from Linux FileSystem to swap.

While still in fdisk, type write to write the changes.

Back at the cmd line create the file system for the /swap, mkswap -L SWAP /dev/nvme0n1p2

lsblk -f will show the swap label.


## <u>Creating a / or root partition</u>

The root directory (/) is where the core of your operating system resides, including system files, libraries, and essential software. When determining its size, consider the following factors:

Basic System Requirements:

Arch Linux itself does not require much space. A minimal installation can fit within a couple of gigabytes.

Installed Software:

Think about the additional software you'll install. Development tools, desktop environments, and other applications can quickly add up.

User Data:

If you plan to store user data, such as documents, downloads, and media files, on the root file system, you'll need to allocate more space.

Updates and Packages:

Consider the space required for updates and new packages. Arch Linux frequently updates its packages, and these updates can occupy significant space over time.

Log Files:

System logs can accumulate over time. Ensure that there's enough space to accommodate them.

Buffer Space:

Having a buffer of free space helps avoid running out of space unexpectedly. Aim for at least 20% free space to maintain system stability and performance.

A ballpark size for / could be 30-50 but depends on your use. Below are a few other things to keep in mind when creating /.

Back at fdisk, n for new

3 for the third partition

Press enter when asked for starting sector size to accept the default starting size

The max size of this partition is up to you. You use all the remaining space and just press enter to use the default or you could specify a size in GB now and expand it later as you needed.

As always, it again stated it changed the file system to Linux file system. In this case this is fine as I plan to use ext4.

Write the changes.

Back on the cmd line create the file system on /      mkfs.ext4 /dev/nvme0n1p3

Mounting File Systems and Enabling Swap

Now we need to mount /

mount /dev/nvme0n1p3 /mnt

If swap was created, enable it now.

swapon /dev/nvmeon1p2


## <u>Install Arch!!!</u>

While connected to a network run the installer.

pacstrap /mnt base linux linux-firmware

You should start seeing the installer's progress bar(s). You might see warrnings over missing firmware but this will need downloaded manually after the install. You should also see it skiped chroot.

Create the fstab

Fstab is the file system table located in /ect/fstab. This tells the system how to mount the different file systems we have created so they are usable. The cmd below will add the partitions into the fstab file. The -U leverages the UUID's (identifiers) of the partitions we created.

genfstab -U /mnt >> /mnt/etc/fstab

While still in the install iso, run the following and check to ensure all the file systems you created are shown.

cat /mnt/etc/fstab

It should output our /swap and ext file system partitions in two lines.


## <u>Installing Additional Tools and Configurations</u>

As the USB iso is still inserted, if we were to install anything else it would be in the "recovery environment". To ensure we install the tools to our new OS, we need to chroot into the file systems. 

To charoot in simply type the following,

arch-chroot /mnt

You should notice the cmdline went from colored to not.

As I have used the ext4 file system on a partition, ill install the e2fsprogs tool. To see what user space utility you might need based on the file system you have picked see this Arch KB.

pacman -S e2fsprogs

Installing dosfstools to our arch install:

pacman -S dosfstools

Acpi:

pacman -S acpi

A network manager based on your needs.

pacman -S networkmanager

A console text editor,

pacman -S nano

Install sudo if required to give other user accounts sudo vs just the root account.

pacman -S sudo

Another one I like is the less cmd. It will stop output of cmds when it reached the end of the screen and allows you to press the space bar to view the next section vs how some cmd output runs off the page.

pacman -S less

Set the time zone. Note, L is used for ln in the cmd below. Also take notice of the space from the timezone below New_York and /ect/localtime. Be sure to set it to your country and time zone.

ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

Now lets sync the bio clock with our timezone.

hwclock --systohc

Create the localization file and modify it to where you are. Think of localization as language.

locale-gen

Use your text editor you installed and uncomment/ delete the # in front of your region.

nano /etc/locale.gen

A example would for Chicago time zone/-8 would be to uncomment en_US.UTF-8

Be sure to write and close your change in the text file. For nano, use the write out option. This will write the change. The ^ is the ctrl key that needs pressed before O to write out. It will then prompt you to confirm the file name to write, just leave it as is as changing it will break localization. Confirm the default name with enter.

Then close nano with ^X. You should be back in the chroot cmdline.

Now lets set the keyboard layout with our text editor.

nano /ect/vconsole.conf

There should be nothing in this file, so add your layout ie,

KEYMAP=us

Be sure to write the change!

Now lets name the device with our text editor.

nano /etc/hostname

Type the name as you wish in the file ie arch-laptop-01 and write the file and close the text editor again. Note you can use - but do not use capital letters or _ in the name.

Set the root password. This is the build in administrator account. ***DO NOT LOOSE THIS password!!!!*** Type,

passwd

Then your password.

Now we need to edit the hosts file,

nano /etc/hosts

Below the two commenced out existing lines write the following. Ensure to put your actual host's name from above step below.

127.0.0.1     localhost
::1                 localhost
127.0.1.1    hostnamehere.localdomain     hostnamehere

Save & exit.

Create additional non root users users as needed,

useradd -m drew

Give the accnt a password

passwd drew

Then add the user groups as you see fit.

usermod -aG wheel,aduio.video.optical,storage drew

Add user to the sudo-er files to be abkle to leverage sudo in addition to being in the wheel group. Note, nano is what I downloaded to edit files.

EDITOR=nano visudo

Scroll down till you see a line stating ## Uncomment to allow members of group wheel to execute any command.

Do just that, remove the # by %wheel ALL=(ALL:ALL) ALL

Be sure to save.


## <u>Install the Grub Bootloader</u>

As we are still chroot'ed in our Arch install, run the following to install GRUB on an intel based system. Start by re-mounting the UEFI file system.

Download grub and the UEFI boot manager with,

pacman -S grub

pacman -S efibootmgr

pacman -S os-prober

pacman -S mtools

If you have not already

pacman -S dosfstools

Now make the efi boot dir,

mkdir /boot/EFI

Now mount your efi boot partition.

mount /dev/nvme0n1p1 /boot/EFI

Note if you see mount: (hint) your fstab has been modified, by systemd still ses the old version; use 'systemctl daemon-reload' to reload, just ignore it.

Then install Grub,

grub-install --target=x86_64-efi --bootloader-id=grub_uefi --recheck

It should state no errors reported. Then generate the config file for GRUB.

grub-mkconfig -o /boot/grub/grub.cfg

This should output a few things and state its done.

Before exiting the chroot and rebooting, install & configure Networkmanager if you have not already with,

pacman -S networkmanager

systemctl enable NetworkManager

Now type exit to leave charoot

Then unmount with umount. Note L is the flag in the cmd below.

umount -l /mnt

Now reboot and pull the install media out enjoy your install of Arch!!!













