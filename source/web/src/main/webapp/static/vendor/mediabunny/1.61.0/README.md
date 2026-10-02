# Mediabunny 1.61.0 (self-hosted, used by /video-tools/video-merger.html)

| File | Source | sha256 |
|---|---|---|
| mediabunny.min.mjs | https://cdn.jsdelivr.net/npm/mediabunny@1.61.0/dist/bundles/mediabunny.min.mjs (unmodified) | fa696c53494b6b09a8b310ec51e3c44a59e79513234fb832255a38c686162009 |
| aac-encoder.min.mjs | https://cdn.jsdelivr.net/npm/@mediabunny/aac-encoder@1.61.0/dist/bundles/mediabunny-aac-encoder.min.mjs (one modification, see below) | upstream 85f0fd9a9b55e619cdc00fcebf082da97c6d3fbbb63a616ee938330ff6997cdb, as shipped 7b1a4ee3775083fc3e4b9ed6918cc5d40a340109acd476cf6d438a50bb0264ee |
| LICENSE | https://cdn.jsdelivr.net/npm/mediabunny@1.61.0/LICENSE (identical in both packages) | - |

- License: Mozilla Public License 2.0 (MPL-2.0) for both packages. The AAC encoder package
  embeds FFmpeg's native AAC encoder compiled to WebAssembly; that component is licensed under
  the GNU LGPL 2.1 or later (FFmpeg source: https://ffmpeg.org/download.html). Upstream source:
  https://github.com/Vanilagy/mediabunny (tag v1.61.0).
- The only modification: the AAC encoder bundle imports its peer as the bare module specifier
  `"mediabunny"`, which browsers cannot resolve without an import map. The two occurrences of
  `from"mediabunny"` were rewritten to `from"./mediabunny.min.mjs"`, so both files share one
  module instance when loaded from this directory. No other byte changed. Reproduce with:
  `sed 's#from"mediabunny"#from"./mediabunny.min.mjs"#g' mediabunny-aac-encoder.min.mjs > aac-encoder.min.mjs`
- Loaded lazily by the page with dynamic `import()` (ES modules). Nothing here runs on page load.
- Upgrading: download the new version into a new `<version>/` directory, re-apply the specifier
  rewrite, update the hashes above, and point the page's `VM_LIB_BASE` constant at the new path.
