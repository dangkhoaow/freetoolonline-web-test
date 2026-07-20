# FFmpeg.wasm self-hosted (single-thread runtime on GitHub Pages)

Vendor files for the converter-media-ffmpegwasm BODYJS skeleton.

| File | Source | Approx size |
|---|---|---|
| ffmpeg.js | https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js | 4 KB |
| 814.ffmpeg.js | https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js | 3 KB |
| ffmpeg-core.js | https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js | 112 KB |
| ffmpeg-core.wasm | https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm | 31 MB |

Re-install or upgrade: `bash .agent/skills/seo-tool-page-builder/assets/vendor/install-ffmpeg-core.sh`.

The worker-chunk filename is webpack-bundled and changes when @ffmpeg/ffmpeg
is re-bundled. If a future re-install fails on a 404 for `814.ffmpeg.js`,
fetch the UMD ffmpeg.js, grep for `+".ffmpeg.js"` to find the new chunk id,
and update `FFMPEG_WORKER_CHUNK_ID` at the top of install-ffmpeg-core.sh.

Why single-thread runtime: GitHub Pages cannot set COOP/COEP headers required
for SharedArrayBuffer. The unified `@ffmpeg/core@0.12.x` wasm binary is the
SAME file in single-thread and multi-thread runs — at load time the runtime
auto-detects SharedArrayBuffer availability and degrades to single-thread when
absent. Trade-off: ~2x slower throughput. Acceptable for the
converter-media-ffmpegwasm skeleton's target workloads (audio extraction,
container swap, short GIF conversion). For heavy transcoding (4K re-encode,
codec switching) the page would need COOP/COEP, which is a hosting upgrade
out of scope here; `feasibility-classifier::heavy_video_transcode` routes
those candidates to the backend instead.
