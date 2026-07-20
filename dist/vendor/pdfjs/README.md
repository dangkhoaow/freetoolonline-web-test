# pdf.js (pdfjs-dist, vendored, self-hosted)

In-browser PDF page renderer for the client-side path of the pdf-to-image tool
(and any future PDF-rasterizing feature). pdf-lib CANNOT rasterize PDF pages -
pdf.js renders a page to a `<canvas>`, which is then exported to JPG/PNG. Vendored
to `/vendor/` like `/vendor/ffmpeg/` + `/vendor/pdf-lib/`; no third-party CDN.

| Field | Value |
|---|---|
| Package | `pdfjs-dist` |
| Version | `3.11.174` (pinned - last line with a classic UMD build) |
| Build | `legacy/build` UMD - exposes the global `pdfjsLib` (works with classic `loadScript`, no ES-module shim) |
| License | Apache-2.0 (Mozilla Foundation) - see `LICENSE` |
| Source | `https://registry.npmjs.org/pdfjs-dist/-/pdfjs-dist-3.11.174.tgz` |
| sha256 (pdf.min.js) | `978fd1b2d134a98e98966186a97777bebf87d8e770dadab1ece3687e21a5aa6c` |
| sha256 (pdf.worker.min.js) | `38cde5311957b86bc3669f93e7d2566de333a90055ed6635bef60d9bf00e96f2` |

## Why v3 (not v4)

The source freetool.online uses pdfjs-dist `^4.10.38`, which is ESM-only (no UMD
global). freetoolonline loads libraries with a classic `loadScript()` (non-module),
so the last version with a UMD `legacy/build` is `3.11.174`. The render API
(`getDocument` -> `page.render` -> `canvas.toDataURL`) is identical, so v3 is a
faithful, simpler fit.

## How to load (BASE_PATH-aware; worker self-hosted, NOT cdnjs)

```js
var PDFJS_VENDOR_BASE = (typeof BASE_PATH === 'string' ? BASE_PATH : '') + '/vendor/pdfjs';
loadScript(PDFJS_VENDOR_BASE + '/pdf.min.js', function () {
  // window.pdfjsLib is now available
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_VENDOR_BASE + '/pdf.worker.min.js';
  // pdfjsLib.getDocument({ data: arrayBuffer }) ...
});
```

The worker MUST point at the vendored `/vendor/pdfjs/pdf.worker.min.js` - never the
cdnjs CDN the source used (site self-hosted / no-third-party-CDN convention).

## Re-vendoring / upgrading

```
bash .agent/skills/seo-tool-page-builder/assets/vendor/install-pdfjs.sh
```
