transformers.js 3.8.1 (vendored)
===============================

Source: https://www.npmjs.com/package/@huggingface/transformers (Hugging Face,
Apache-2.0 - see LICENSE)

Files kept:

- `transformers.min.js` - the BUNDLED web ESM build (ONNX Runtime Web is inlined).
  Load it with a dynamic `import()` from a classic script. Note: `transformers.web.min.js`
  is NOT self-contained (it imports the bare specifier `onnxruntime-web/webgpu`) and
  fails in a plain browser without an import map - do not vendor that one.
- `ort-wasm-simd-threaded.jsep.mjs` + `.wasm` - the ONNX Runtime WASM artifact this
  build requests. Point `env.backends.onnx.wasm.wasmPaths` at this directory so the
  page never fetches a runtime from a third-party CDN (the library's default is
  jsdelivr).

Consumer: `/utility-tools/meeting-notes-taker.html` (BODYJSmeetingnotestaker.html)
transcribes a recorded meeting with Whisper base entirely in the reader's browser:

    env.allowLocalModels = false
    env.remoteHost = 'https://gh-static.freetool.online/whisper/'
    env.remotePathTemplate = '{model}/'
    env.backends.onnx.wasm.wasmPaths = <BASE_PATH>/vendor/transformers/
    pipeline('automatic-speech-recognition', 'whisper-base', { dtype: 'q8', device: 'wasm' | 'webgpu' })

**Version pin rationale (verified 2026-08-29):** on 4.2.0 the whisper-base int8 AND
q8 exports both fail at session creation with `qdq_actions.cc:137
TransposeDQWeightsForMatMulNBits Missing required scale`. 3.8.1 (ORT 1.22-dev) loads
the q8 pair and transcribed an 11 s clip in 6.5 s headless on WASM. Re-run that check
before bumping either the library or the model dtype.

The model weights are NOT here - they are ~78 MB and live on the asset CDN at
`https://gh-static.freetool.online/whisper/whisper-base/` (see the `whisper/` build in
the ftol-vm-assets repo).
