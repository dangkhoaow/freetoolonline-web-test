// Thin single-threaded wrapper around the vendored @jsquash/avif WASM encoder
// (Apache-2.0, repackaged from Squoosh App by Jamie Sinclair - see LICENSE +
// README.md). Hand-written for freetoolonline (2026-07-25, new-tool-discovery
// loop) to avoid the upstream encode.js's `wasm-feature-detect` dependency and
// multi-threaded worker path (not vendored here - single-thread is plenty for
// a one-shot in-browser conversion tool). Always loads codec/enc/avif_enc.js
// (the non-multithreaded emscripten build) via instantiateWasm-free default
// loading, which fetches avif_enc.wasm relative to avif_enc.js's own URL.
import initModule from './avif_enc.js';
import { initEmscriptenModule } from './utils.js';
import { defaultOptions } from './meta.js';

let modulePromise = null;
function getModule() {
    if (!modulePromise) modulePromise = initEmscriptenModule(initModule);
    return modulePromise;
}

// imageData: {data: Uint8ClampedArray|Uint8Array, width, height} (an ImageData
// works as-is). Returns an ArrayBuffer of real AVIF-encoded bytes.
export async function encodeAvif(imageData, options) {
    const opts = Object.assign({}, defaultOptions, options || {});
    if (opts.lossless) { opts.quality = 100; opts.qualityAlpha = -1; opts.subsample = 3; }
    const module = await getModule();
    const output = module.encode(new Uint8Array(imageData.data.buffer || imageData.data), imageData.width, imageData.height, opts);
    if (!output) throw new Error('AVIF encoding failed');
    return output.buffer || output;
}
