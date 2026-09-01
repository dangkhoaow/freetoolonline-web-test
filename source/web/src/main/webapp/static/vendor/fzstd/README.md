# fzstd (vendored)

Pure-JavaScript Zstandard (`.zst`) **decompressor**. No WASM binary, no worker,
no network - a single small JS module that runs entirely in the browser.

- **Source**: npm `fzstd@0.1.1` (`npm pack fzstd`)
- **Upstream**: https://github.com/101arrowz/fzstd
- **License**: MIT (Arjun Barrett) - see `LICENSE`
- **Size**: UMD ~8.4 KB, ESM ~24 KB (unminified)

## Files

| File | Build | Use |
|---|---|---|
| `fzstd.mjs` | ESM (`esm/index.mjs`) | Lazy `import()` from the tool skeleton. Exports `decompress`, `Decompress`, `ZstdErrorCode`. |
| `fzstd.min.js` | UMD (`umd/index.js`) | Classic `<script>` fallback; defines global `fzstd`. |

## API

```js
import { decompress } from '/vendor/fzstd/fzstd.mjs';
const original = decompress(zstBytes);   // Uint8Array -> Uint8Array (single-shot)
// streaming: new fzstd.Decompress((chunk, final) => { ... }).push(bytes, true)
```

## Verified

`decompress()` was verified against a real `zstd -19` fixture: a 13,572-byte
input compressed to 477 bytes and decompressed back to the exact original bytes
(byte-for-byte match) under Node using this exact vendored build. Re-run:

```bash
zstd -19 -f orig.txt -o orig.txt.zst
node --input-type=module -e '
import { readFileSync } from "node:fs";
import { decompress } from "./fzstd.mjs";
const out = decompress(new Uint8Array(readFileSync("orig.txt.zst")));
const orig = new Uint8Array(readFileSync("orig.txt"));
console.log("match:", out.length===orig.length && out.every((b,i)=>b===orig[i]));
'
```

Consumed by the `zstd-extractor` tool skeleton
(`archive_js_zstd` entry in `verified-browser-impl-registry.mjs`).
