#!/usr/bin/env node
/** fire143: vendor + adapt makeclassicgames/BoingKat -> /games/boing-cat-platformer.html */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // web-test
const SRC = process.env.SRC_REPO || '/tmp/fire143-boingkat';
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/boing-cat-platformer');

if (!existsSync(SRC)) throw new Error(`source repo missing: ${SRC}`);

mkdirSync(DEST, { recursive: true });
mkdirSync(join(DEST, 'js'), { recursive: true });
mkdirSync(join(DEST, 'assets'), { recursive: true });

// --- verbatim vendor (unmodified upstream files) ---
// NOTE: kontra.min.mjs is renamed to kontra.min.js (byte-identical content).
// GitHub Pages (both staging + prod hosts here) has a known history of
// serving .mjs as application/octet-stream, which browsers refuse to
// execute as a module script under strict MIME checking (confirmed via
// ENGINE_PROVE_FAIL on the unrenamed vendor). No other shipped game in this
// repo ships a .mjs file - .js is the established safe convention.
cpSync(join(SRC, 'js/kontra.min.mjs'), join(DEST, 'js/kontra.min.js'));
cpSync(join(SRC, 'js/zzfx.js'), join(DEST, 'js/zzfx.js'));
let levelDataJs = readFileSync(join(SRC, 'js/levelData.js'), 'utf8')
  .replace(`from "./kontra.min.mjs"`, `from "./kontra.min.js"`);
if (levelDataJs.includes('.mjs')) throw new Error('levelData.js still references .mjs');
writeFileSync(join(DEST, 'js/levelData.js'), levelDataJs, 'utf8');
let playerJs = readFileSync(join(SRC, 'js/player.js'), 'utf8')
  .replace(`from "./kontra.min.mjs"`, `from "./kontra.min.js"`);
if (playerJs.includes('.mjs')) throw new Error('player.js still references .mjs');
writeFileSync(join(DEST, 'js/player.js'), playerJs, 'utf8');
cpSync(join(SRC, 'assets/player_sheet.png'), join(DEST, 'assets/player_sheet.png'));
cpSync(join(SRC, 'assets/tilescat.png'), join(DEST, 'assets/tilescat.png'));

// --- level1/2/3.json -> plain ES modules (drop `with {type:'json'}` import
// attribute so the engine works on browsers without JSON-module-attribute
// support; zero gameplay change, same tile data). ---
for (const n of [1, 2, 3]) {
  const json = readFileSync(join(SRC, `js/level${n}.json`), 'utf8');
  // re-serialize through JSON.parse/stringify to normalize whitespace and
  // guarantee valid JS-embeddable JSON (defends against trailing commas etc).
  const obj = JSON.parse(json);
  writeFileSync(join(DEST, `js/level${n}.js`), `export default ${JSON.stringify(obj)};\n`, 'utf8');
}

// --- game.js: swap json-module imports for the plain .js modules above,
// and rebrand the title-screen text (only in-engine literal string). ---
let gameJs = readFileSync(join(SRC, 'js/game.js'), 'utf8');
gameJs = gameJs
  .replace(`from './kontra.min.mjs'`, `from './kontra.min.js'`)
  .replace(`import level1 from './level1.json' with {type: 'json'};`, `import level1 from './level1.js';`)
  .replace(`import level2 from './level2.json' with {type: 'json'};`, `import level2 from './level2.js';`)
  .replace(`import level3 from './level3.json' with {type: 'json'};`, `import level3 from './level3.js';`)
  .replace(`text: 'Boing Kat\\nPress Space to Start',`, `text: 'Boing Cat\\nPress Space to Start',`);
// Targeted checks only (a leading /* ... Boing Kat - A simple platformer ...
// */ attribution comment intentionally stays untouched, same as other fires
// keep upstream attribution comments in vendored engine files).
if (gameJs.includes('.json') || gameJs.includes('.mjs')) throw new Error('game.js adaptation incomplete: residual .json/.mjs import');
if (!gameJs.includes(`text: 'Boing Cat\\nPress Space to Start',`)) {
  throw new Error('game.js adaptation incomplete: title-screen rebrand missing');
}
writeFileSync(join(DEST, 'js/game.js'), gameJs, 'utf8');

// --- index.html: add noindex (house convention for vendored engine pages),
// rebrand <title>, keep the fixed 640x480 canvas + sky-blue styling as-is. ---
let indexHtml = readFileSync(join(SRC, 'index.html'), 'utf8');
indexHtml = indexHtml
  .replace('<title>Boing Kat</title>', '<title>Boing Cat</title>')
  .replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta name="robots" content="noindex">',
  );
if (!indexHtml.includes('noindex') || indexHtml.includes('Boing Kat')) {
  throw new Error('index.html adaptation incomplete');
}
writeFileSync(join(DEST, 'index.html'), indexHtml, 'utf8');

// --- LICENSE (verbatim MIT text from upstream) ---
cpSync(join(SRC, 'LICENSE'), join(DEST, 'LICENSE'));

// --- CREDITS.txt ---
writeFileSync(join(DEST, 'CREDITS.txt'), `Boing Cat Platformer - vendored + adapted for FreeToolOnline (game-discovery-loop-runbook fire143, 2026-07-18).

Upstream: makeclassicgames/BoingKat (also tagged js13k-geomKat in package.json)
https://github.com/makeclassicgames/BoingKat
License: MIT, Copyright (c) 2025 Make Classic Games (see LICENSE).

Team (per upstream Readme.md):
- Programming: Zerasul (https://github.com/zerasul) with help from Banus10 (https://github.com/TheBanusco10)
- Graphics: Maxi_oscar
- Made for the JS13K Games Jam; levels designed with Tiled (https://www.mapeditor.org/)

Vendored third-party libraries (already bundled by upstream, unmodified here):
- Kontra.js by Steven Lambert - MIT - https://straker.github.io/kontra/
- ZzFX by Frank Force - MIT - https://github.com/KilledByAPixel/ZzFX

Adaptations made in this build:
- Rebranded title-screen text and <title> from "Boing Kat" to "Boing Cat".
- Converted level1.json/level2.json/level3.json into plain ES modules
  (export default {...}) so the engine no longer relies on the JSON
  import-attribute syntax (\`with {type:'json'}\`), for broader static-host
  browser compatibility. Tile data is byte-identical; no gameplay change.
- Renamed kontra.min.mjs to kontra.min.js (byte-identical content; only the
  extension changed, plus the 3 import specifiers that reference it). GitHub
  Pages has served .mjs as application/octet-stream in the past, which
  browsers refuse to execute as an ES module under strict MIME checking.
- Added <meta name="robots" content="noindex"> (this iframe-only engine page
  is not meant to be indexed; the canonical URL is /games/boing-cat-platformer.html).
- No CDN, no analytics, no localStorage in the upstream code; none added here.
`, 'utf8');

console.log('fire143 vendor complete ->', DEST);
