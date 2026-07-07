# Linux Online - desktop image (32-bit Alpine + Xorg + Xfce for the v86 emulator).
# Build context is vm-images/ (see scripts/build-image.sh).
FROM --platform=linux/386 public.ecr.aws/docker/library/alpine:3.24

RUN apk add --no-cache mkinitfs \
 && echo 'features="base ata ext4 virtio"' > /etc/mkinitfs/mkinitfs.conf \
 && apk add --no-cache linux-virt \
 && apk add --no-cache openrc agetty vim nano htop \
 && test -x /sbin/agetty \
 && test -f /boot/vmlinuz-virt \
 && test -f /boot/initramfs-virt

# X stack: vesa driver (v86 exposes a Bochs-VBE SVGA card), eudev so the
# server auto-detects the emulated PS/2 keyboard and mouse.
RUN apk add --no-cache eudev udev-init-scripts udev-init-scripts-openrc \
 && apk add --no-cache xorg-server xf86-video-vesa xf86-input-libinput xinit \
 && apk add --no-cache dbus dbus-x11 xfce4 xfce4-terminal mousepad ttf-dejavu \
 && test -x /usr/bin/startxfce4 \
 && test -x /usr/bin/Xorg

RUN rc-update add devfs sysinit \
 && rc-update add dmesg sysinit \
 && rc-update add udev sysinit \
 && rc-update add udev-trigger sysinit \
 && rc-update add udev-settle sysinit \
 && rc-update add hostname boot \
 && rc-update add swclock boot \
 && rc-update add sysctl boot \
 && rc-update add bootmisc boot \
 && rc-update add dbus default \
 && rc-update add local default \
 && rc-update add killprocs shutdown \
 && rc-update add mount-ro shutdown \
 && rc-update add savecache shutdown

COPY common/inittab /etc/inittab
COPY common/motd /etc/motd
COPY desktop/xorg.conf /etc/X11/xorg.conf
COPY desktop/xinitrc /root/.xinitrc
COPY desktop/profile /root/.profile
COPY desktop/xfwm4.xml /root/.config/xfce4/xfconf/xfce-perchannel-xml/xfwm4.xml
COPY desktop/ftol-ready.desktop /etc/xdg/autostart/ftol-ready.desktop
RUN echo linux-online > /etc/hostname \
 && passwd -d root \
 && printf '/dev/sda\t/\text4\trw,noatime 0 1\n' > /etc/fstab
