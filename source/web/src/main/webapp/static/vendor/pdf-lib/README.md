# pdf-lib (vendored, self-hosted)

In-browser PDF engine for the client-side path of the pdf-tools cluster
(merge / rotate / compress / image-to-pdf) and the heic-to-jpg PDF-output
option. Vendored to `/vendor/` exactly like `/vendor/ffmpeg/` so the site
never loads a third-party CDN (unpkg / jsdelivr / cdnjs are rejected by site
convention).

| Field | Value |
|---|---|
| Package | `pdf-lib` |
| Version | `1.17.1` (pinned) |
| Build | UMD (`dist/pdf-lib.min.js`) - exposes the global `PDFLib` |
| License | MIT (see `LICENSE.md`) |
| Source | `https://registry.npmjs.org/pdf-lib/-/pdf-lib-1.17.1.tgz` |
| sha256 (min) | `0f9a5cad07941f0826586c94e089d89b918c46e5c17cf2d5a3c6f666e3bc694f` |

## How to load (BASE_PATH-aware, mirrors the ffmpeg loader pattern)

```js
var PDFLIB_VENDOR_BASE = (typeof BASE_PATH === 'string' ? BASE_PATH : '') + '/vendor/pdf-lib';
loadScript(PDFLIB_VENDOR_BASE + '/pdf-lib.min.js', function () {
  // window.PDFLib.PDFDocument is now available
});
```

Pure JavaScript - no WASM, no worker, no network at runtime. The whole
engine is the single `pdf-lib.min.js` (525 KB).

## Re-vendoring / upgrading

Run the reproducible install script (deterministic, pinned):

```
bash .agent/skills/seo-tool-page-builder/assets/vendor/install-pdf-lib.sh
```
