# heic-to (vendored, self-hosted)

In-browser HEIC/HEIF decoder for the client-side fallback of the heic-to-jpg
tool (E4 enrichment). Wraps libheif compiled to WebAssembly. Vendored to
`/vendor/` like `/vendor/ffmpeg/` + `/vendor/pdf-lib/` + `/vendor/pdfjs/`; no
third-party CDN at runtime.

| Field | Value |
|---|---|
| Package | `heic-to` |
| Version | `1.5.2` (pinned) |
| Build | `dist/iife/heic-to.js` - IIFE, exposes the global `HeicTo` (works with classic `loadScript`) |
| WASM | libheif WASM is base64-INLINED in the IIFE (self-contained; no separate `.wasm` to host); the worker is created from an inlined Blob |
| License | LGPL-3.0 (libheif/heic-to) - see `LICENSE`. Vendored unmodified as a separate, replaceable file (LGPL-compliant for a website). |
| Source | `https://registry.npmjs.org/heic-to/-/heic-to-1.5.2.tgz` |
| sha256 | `976f23cac9d435e3c3d9d8757c3975d1f56ae995581461b3a8ace66e07e4640e` |

## How to load (BASE_PATH-aware) + use

```js
var HEICTO_VENDOR_BASE = (typeof BASE_PATH === 'string' ? BASE_PATH : '') + '/vendor/heic-to';
loadScript(HEICTO_VENDOR_BASE + '/heic-to.js', function () {
  // window.HeicTo is now available
  // HeicTo.isHeic(file) -> Promise<boolean>
  // HeicTo({ blob: file, type: 'image/jpeg', quality: 0.9 }) -> Promise<Blob>
});
```

Self-contained (WASM + worker inlined). One-time ~2.9 MB download on first use;
decode runs entirely in the browser (no upload).

## Re-vendoring / upgrading

```
bash .agent/skills/seo-tool-page-builder/assets/vendor/install-heic-to.sh
```
