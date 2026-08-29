ONNX Runtime Web 1.29.0 (vendored)
==================================

Source: https://www.npmjs.com/package/onnxruntime-web (Microsoft, MIT - see LICENSE)

Files kept (the WebGPU build only - it also contains the WASM fallback):

- `ort.webgpu.min.js` - UMD bundle, loads via a plain `<script src>` and exposes `window.ort`
- `ort-wasm-simd-threaded.asyncify.mjs` + `.wasm` - the artifact this bundle
  actually requests at runtime (verified against 1.29.0 - earlier releases asked
  for the `.jsep.` names); used by BOTH the `webgpu` and the `wasm` provider

Consumer: `/utility-tools/text-to-speech.html` (BODYJStexttospeech.html) runs the
Supertonic 3 neural TTS model set entirely in the reader's browser. The page sets

    ort.env.wasm.wasmPaths = <BASE_PATH>/vendor/onnxruntime-web/
    ort.env.wasm.numThreads = 1

`numThreads = 1` is deliberate: multi-threaded WASM needs cross-origin isolation
(COOP/COEP response headers) which GitHub Pages cannot send, so the threaded
worker path would fail. WebGPU is tried first and does the heavy lifting on
capable browsers; WASM single-thread is the fallback.

The model weights are NOT here - they are ~398 MB and live on the asset CDN at
`https://gh-static.freetool.online/supertonic/v3/` (see the `supertonic/` build in
the ftol-vm-assets repo).

To upgrade: `npm pack onnxruntime-web@<version>`, copy the same four files, and
re-run the page's smoke test at 390 + 1440.
