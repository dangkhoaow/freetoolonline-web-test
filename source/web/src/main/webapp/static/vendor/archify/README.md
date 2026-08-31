# archify browser bundles

Built by .agent/skills/_lib/build-archify-vendor.mjs from
https://github.com/tt-a1i/archify at revision 5de7275fe87a66a19d52a4d9b0b3a4f2a5a90115 (MIT, see LICENSE - the licence
covers the engine code compiled into render-*.js and the example JSON files).

- render-<type>.js: ESM bundle of the upstream renderer with node:fs/path/url
  aliased to in-memory shims. Importing the bundle performs ONE render:
  set globalThis.__archifyVfs (Map with '/vfs/input.json' and
  '/vfs/assets/template.html') before import, read globalThis.__archifyOut
  after. Re-render by importing again through a fresh Blob URL - the upstream
  scripts execute at module top level by design.
- validator.js: exports validateSchema(type, diagram); throws a diagnostics
  error with per-path messages. Used by the page for live JSON validation and
  for the language-model retry loop.
- template.html: the upstream self-contained viewer shell the bundles fill in.
- The brand "capture from URL" feature is stubbed out (it needs raw sockets);
  the ~2900 built-in brand marks work because they are compiled into the
  bundles.
