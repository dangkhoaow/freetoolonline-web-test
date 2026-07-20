# web-llm (vendored, self-hosted)

In-browser LLM engine (WebGPU) for the private-ai-chat tool (T8). Vendored to
`/vendor/` like `/vendor/monaco` etc.; no third-party JS CDN at runtime. This is the
standalone bundled ESM `lib/index.js` from the npm package (deps incl. loglevel are
inlined; verified zero bare-specifier imports + zero JS-CDN references).

| Field | Value |
|---|---|
| Package | `@mlc-ai/web-llm` |
| Version | `0.2.84` (pinned; satisfies registry `^0.2.80`) |
| File | `web-llm.js` (standalone ESM, ~6.6 MB) |
| License | Apache-2.0 (see `LICENSE`) |
| Source | npm `@mlc-ai/web-llm@0.2.84` -> `lib/index.js` |
| sha256 (web-llm.js) | `4917bf1b8969ca20a0b74b2773cbc9c14f77ce7427df491cd56c252f9a6070c7` |

## How to load (dynamic ESM import, BASE_PATH-aware)

```js
var base = (typeof BASE_PATH === 'string' ? BASE_PATH : '') + '/vendor/web-llm';
const webllm = await import(base + '/web-llm.js');
const engine = new webllm.MLCEngine();
engine.setInitProgressCallback(r => updateBar(r.progress, r.text)); // r.progress 0..1
await engine.reload('TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC-1k');     // downloads weights from HF/MLC, caches in browser
const stream = await engine.chat.completions.create({ stream: true, messages: [...] });
for await (const chunk of stream) { const d = chunk.choices[0]?.delta?.content || ''; /* append */ }
```

## Runtime model download (intrinsic, caveated)

The LIBRARY is self-hosted here. MODEL WEIGHTS + the model-specific WASM runtime are
fetched on `reload()` from the MLC model registry (`huggingface.co/mlc-ai` +
`raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs`) - hundreds of MB, cached by the
browser (Cache API / IndexedDB `webllm_cache`). This is intrinsic to web-llm (model
weights cannot be repo-vendored) and is surfaced to the reader as a one-time download +
WebGPU-required caveat. Requires WebGPU (`'gpu' in navigator`).

## Re-vendoring / upgrading

```
bash .agent/skills/seo-tool-page-builder/assets/vendor/install-web-llm.sh
```
