# vm-images - Linux Online VM images

Build pipeline for the disk images behind the site's **Linux Online** tool page
(`/utility-tools/linux-online.html`), which runs real 32-bit Alpine Linux in the
reader's browser via the vendored [v86](https://github.com/copy/v86) emulator.

These assets are deliberately NOT part of the site build: they are published as
**GitHub Release assets** on this repository (tag `vm-assets-<VERSION>`) and the
tool page downloads them on demand, then caches them in the reader's IndexedDB.
Nothing here lands in `dist/`.

## What gets built

| Image | Contents | Boot |
|---|---|---|
| `terminal` | Alpine (32-bit x86) + OpenRC + vim/nano/htop, auto-login root on the VGA console | direct kernel boot (`vmlinuz` + `initramfs`), raw ext4 `image.img` |
| `desktop` | terminal base + Xorg (vesa) + eudev + dbus + Xfce, auto-login -> `startx` on tty1 | same |

Each image also gets a **boot-state snapshot** (`state.bin.gz`): CI boots the
image headless under Node v86, waits for the ready marker on the serial
console, syncs, saves the machine state, and proves a restored copy still
answers. The tool page restores this state for a seconds-fast start.

`manifest.json` describes every asset (bytes, sha256, memory size, cmdline);
the tool page fetches it first.

## Layout

- `terminal/Dockerfile`, `desktop/Dockerfile` - image definitions (build context is `vm-images/`)
- `common/` - shared inittab + motd
- `scripts/build-image.sh` - docker build/export -> `mke2fs -d` raw ext4 + kernel extraction
- `scripts/snapshot.mjs` - headless Node v86 boot -> ready marker -> save_state -> restore-verify
- `scripts/package-release.sh` + `scripts/make-manifest.mjs` - gzip, sha256, manifest
- `.github/workflows/vm-images.yml` - runs it all on pushes touching `vm-images/`, publishes the release

## Versioning

Bump `VERSION` (v1, v2, ...) to publish under a NEW tag - saved reader sessions
embed the image version, and the tool page refuses to restore a session into a
different image version, so never mutate a tag's assets after readers depend on
them (re-running the workflow on the same VERSION re-uploads with `--clobber`;
only do that before the corresponding tool page ships).

## Provenance + licenses

- Base OS: [Alpine Linux](https://alpinelinux.org/) 3.24, i386 - packages under
  their respective open-source licenses (MIT/GPL/BSD/...); package list is in the
  Dockerfiles. Redistribution of built images is permitted by Alpine.
- Emulator runtime used by CI: `v86` npm 0.5.424 (BSD 2-Clause).
- BIOS blobs fetched pinned from copy/v86 (SeaBIOS: LGPL; Bochs VGABios: LGPL) -
  sha256-verified in the workflow.
- No proprietary software, no distro trademarks or artwork are included in the
  images; the hostname and MOTD are house copy.

## Iterating

Push a change under `vm-images/` (through the deploy-lease helper as always) or
trigger `vm-images` via workflow_dispatch. Debug levers: kernel `cmdline` in
`scripts/snapshot.mjs` + `manifest`, ready markers/timeouts in the PROFILES
table of `snapshot.mjs`, package set in the Dockerfiles.
