#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/src-thunder-math';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/lightning-math-battle');
const LS = 'ftol:lightningmathbattle:';

mkdirSync(DEST, { recursive: true });

let html = readFileSync(join(SRC, 'index.html'), 'utf8');
html = html.replace(
  '<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">',
  '',
);
html = html.replaceAll("'Press Start 2P'", 'monospace');
html = html.replace(
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>',
  '<script src="../../vendor/three/three.min.js"></script>',
);
html = html.replace('<title>Thunder Math</title>', '<title>Lightning Math Battle</title>');
html = html.replace(
  '<meta charset="utf-8">',
  '<meta charset="utf-8">\n<meta name="robots" content="noindex">',
);
html = html.replaceAll('window.localStorage.getItem("tm_" + k)', `window.localStorage.getItem("${LS}" + k)`);
html = html.replaceAll('window.localStorage.setItem("tm_" + k, v)', `window.localStorage.setItem("${LS}" + k, v)`);
html = html.replace('window.localStorage.removeItem("tm_fx")', `window.localStorage.removeItem("${LS}fx")`);
html = html.replace('window.localStorage.getItem("tm_lowfx")', `window.localStorage.getItem("${LS}lowfx")`);
html = html.replace('window.localStorage.removeItem("tm_lowfx")', `window.localStorage.removeItem("${LS}lowfx")`);

writeFileSync(join(DEST, 'index.html'), html, 'utf8');
cpSync(join(SRC, 'LICENSE'), join(DEST, 'LICENSE'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Lightning Math Battle adapted from pasuay/thunder-math (MIT, Copyright 2026 Pashur Au Yeung).\nBrowser math-quiz action game with Canvas 2D playfield and WebGL lightning overlay.\nEight practice modes and four difficulty tiers with local high-score persistence.\n',
);

console.log('Adapted lightning-math-battle to', DEST, 'size', html.length);
