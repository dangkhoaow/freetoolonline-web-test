# Monaco Editor (vendored, self-hosted)

The editor that powers VS Code, for the in-browser code-editor tool (T7). Vendored
to `/vendor/` like `/vendor/ffmpeg/` etc.; no third-party CDN at runtime. This is the
standard `min/vs` AMD self-host bundle (loaded via `vs/loader.js`).

| Field | Value |
|---|---|
| Package | `monaco-editor` |
| Version | `0.55.1` (pinned) |
| Build | `min/vs` AMD tree (loader.js + editor/editor.main + 80+ lazy-loaded language contributions + workers) |
| Size | ~15 MB / 121 files (the full min/vs bundle - languages lazy-load on demand) |
| License | MIT (see `LICENSE`); third-party notices in `ThirdPartyNotices.txt` |
| Source | `https://registry.npmjs.org/monaco-editor/-/monaco-editor-0.55.1.tgz` |
| sha256 (loader.js) | `35b59df80b41a8b73bf1ceb159b44f040567c2ab53f4e77a3d002d9dc39d55d1` |
| sha256 (editor.main.js) | `e8cd8b34b0cc10759ad5419d6253bcb2b91b539580ab857e46f2af9096d8e348` |

## How to load (classic AMD loader, BASE_PATH-aware)

```js
var MONACO_BASE = (typeof BASE_PATH === 'string' ? BASE_PATH : '') + '/vendor/monaco';
// Workers are resolved from the vs path; for cross-origin safety use a worker shim.
loadScript(MONACO_BASE + '/vs/loader.js', function () {
  window.require.config({ paths: { vs: MONACO_BASE + '/vs' } });
  // self.MonacoEnvironment = { getWorkerUrl: function(){ return <blob worker that importScripts vs/base/worker/workerMain.js>; } };
  window.require(['vs/editor/editor.main'], function () {
    // window.monaco.editor.create(el, { value, language, theme, ... })
  });
});
```

Lazy-load on user interaction (heavy bundle). Languages load on demand when a model's
language is set; missing language files simply mean that language is unavailable (no error).

## Re-vendoring / upgrading

```
bash .agent/skills/seo-tool-page-builder/assets/vendor/install-monaco.sh
```
