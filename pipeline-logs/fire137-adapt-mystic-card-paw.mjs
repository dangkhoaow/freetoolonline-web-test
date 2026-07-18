#!/usr/bin/env node
/** fire137: vendor js13k Poker Mysterio dist -> static/games/mystic-card-paw/ */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SRC = '/tmp/poker-mysterio/dist';
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/mystic-card-paw');
const LS_KEY = 'ftol:mysticcardpaw:highScore';

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) copyTree(s, d);
    else cpSync(s, d);
  }
}

copyTree(SRC, DEST);

const rawHtml = readFileSync(join(DEST, 'index.html'), 'utf8');
const scriptMatch = rawHtml.match(/src="\.\/assets\/([^"]+\.js)"/);
if (!scriptMatch) throw new Error('no assets script in index.html');
const jsFile = scriptMatch[1];

const adaptedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="robots" content="noindex">
<meta name="color-scheme" content="light dark">
<title>Mystic Card Paw</title>
<style>
body { margin:0; padding:0; background:#0f5f3f; overflow:hidden; user-select:none; -webkit-user-select:none; display:flex; align-items:center; justify-content:center; min-height:100vh; }
#board { position:relative; display:flex; justify-content:center; align-items:center; flex-wrap:wrap; z-index:1; }
canvas { display:block; touch-action:none; -webkit-touch-callout:none; -webkit-tap-highlight-color:transparent; image-rendering:pixelated; }
@media (orientation: portrait){ #board{flex-direction:column;} #canvas-main{order:2;} #canvas-aux{order:1;} }
@media (orientation: landscape){ #board{flex-direction:row;} #canvas-main{order:2;} #canvas-aux{order:1;} }
*{ touch-action:manipulation; }
.plasma-bg { position:fixed; inset:0; width:100vw; height:100vh; z-index:0; pointer-events:none; image-rendering:pixelated; }
@media (prefers-reduced-motion: reduce){ .plasma-bg { display:none; } }
</style>
<script type="module" crossorigin src="./assets/${jsFile}"></script>
</head>
<body>
<canvas id="canvas-bg" width="512" height="240" class="plasma-bg"></canvas>
<div id="board">
<canvas width="256" height="240" id="canvas-aux"></canvas>
<canvas width="256" height="240" id="canvas-main"></canvas>
</div>
</body>
</html>
`;
writeFileSync(join(DEST, 'index.html'), adaptedHtml, 'utf8');

const jsPath = join(DEST, 'assets', jsFile);
let js = readFileSync(jsPath, 'utf8');
if (js.includes('serviceWorker')) {
  js = js.replace(/navigator\.serviceWorker[^;]*;?/g, '');
}
if (!js.includes('pokerHighScore')) throw new Error('pokerHighScore not found in bundle');
js = js.replace(/pokerHighScore/g, LS_KEY);
writeFileSync(jsPath, js, 'utf8');

cpSync('/tmp/poker-mysterio/LICENSE', join(DEST, 'LICENSE'));
writeFileSync(join(DEST, 'CREDITS.txt'), `Mystic Card Paw (adapted from Poker Mysterio)
Original game: ZYXPlay/js13k-2025
Author: ZYXPlay
License: MIT, Copyright (c) 2025 ZYXPlay
JS13K Games 2025 entry (Black Cat theme)

FreeToolOnline adaptations: noindex meta on iframe document, English rebrand title Mystic Card Paw,
localStorage key namespaced to ${LS_KEY}, relative asset paths preserved, LICENSE shipped next to engine.
`, 'utf8');

let total = 0;
function sizeTree(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) sizeTree(p);
    else total += statSync(p).size;
  }
}
sizeTree(DEST);
console.log(`fire137 adapt: vendored mystic-card-paw (~${Math.round(total / 1024)}KB)`);
