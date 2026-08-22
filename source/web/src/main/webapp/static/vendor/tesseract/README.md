# Vendored: tesseract.js (self-hosted, no CDN, no upload)

In-browser OCR engine for the `image-to-text-ocr` tool page. All files run
entirely client-side (WASM); no image data ever leaves the browser tab.

## Files

| File | Source | Version | Purpose |
|---|---|---|---|
| `tesseract.min.js` | `tesseract.js` npm package, `dist/tesseract.min.js` | 7.0.0 | Main UMD entry (`window.Tesseract`) |
| `worker.min.js` | `tesseract.js` npm package, `dist/worker.min.js` | 7.0.0 | Web Worker script (`workerPath`) |
| `tesseract-core-relaxedsimd-lstm.wasm.js` | `tesseract.js-core` npm package | 7.0.0 | WASM OCR engine, relaxed-SIMD build (current Chromium/Firefox - the variant the v7 worker requests first) |
| `tesseract-core-simd-lstm.wasm.js` | `tesseract.js-core` npm package | 7.0.0 | WASM OCR engine, SIMD build |
| `tesseract-core-lstm.wasm.js` | `tesseract.js-core` npm package | 7.0.0 | WASM OCR engine, non-SIMD fallback |
| `eng.traineddata.gz` | `tessdata_fast` (tesseract-ocr/tessdata_fast, `4.0.0_fast/eng.traineddata.gz`) | 4.0.0_fast | English trained-data model (LSTM), gzip |

Tesseract.js's browser loader (`getCore.js`) auto-selects between the
`-relaxedsimd-lstm`, `-simd-lstm` and `-lstm` core builds via
`wasm-feature-detect`, so all three are kept side by side; only one is
fetched per visitor. 2026-08-22 (ai-local fire20): the original vendoring
paired the v7.0.0 worker with core 6.1.2, which has NO relaxed-SIMD build -
on relaxed-SIMD browsers (current Chromium) the worker requested
`tesseract-core-relaxedsimd-lstm.wasm.js`, got a 404, and OCR died. All
three core builds are now the matching tesseract.js-core 7.0.0 (the version
tesseract.js 7.0.0 pins as ^7.0.0).

## License

- `tesseract.js` (naptha/tesseract.js): Apache-2.0
- `tesseract.js-core` (naptha/tesseract.js-core): Apache-2.0
- `tessdata_fast` (tesseract-ocr/tessdata_fast): Apache-2.0

See `LICENSE` (Apache License 2.0 full text) alongside this README.

## Wiring

`workerPath` / `corePath` / `langPath` all point at this directory
(`/vendor/tesseract`) from the `image-to-text-ocr` BODYJS skeleton — see
`.agent/skills/seo-tool-page-builder/assets/bodyjs-skeletons/image-to-text-ocr.template.html`.
Nothing is fetched from `cdn.jsdelivr.net` or `tessdata.projectnaptha.com` at
runtime; every asset ships from this same-origin path.

## Updating

Re-run the download commands in the seeding commit's history (grep the repo
history for "tesseract-vendor" for the exact URLs pinned above), verify
Apache-2.0 licensing is unchanged upstream, and replace these files in place.
