#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/src-black-hole-square/public/index.html';
const LICENSE_SRC = '/tmp/src-black-hole-square/LICENSE';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/space-grid-puzzle');
const LS = 'ftol:spacegridpuzzle:';

mkdirSync(DEST, { recursive: true });

let html = readFileSync(SRC, 'utf8');
html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex">');
html = html.replace('<title>Black Hole Square</title>', '<title>Space Grid Puzzle</title>');
html = html.replace(/<link rel="manifest" href="manifest\.json">/, '');
html = html.replace(/<meta name="monetization"[^>]*>/, '');
html = html.replace(/"u2":"Black Hole Square"/, `"u2":"${LS}save"`);
html = html.replace(
  /,"serviceWorker"in navigator&&window\.addEventListener\("load",\(e=>\{navigator\.serviceWorker\.register\("\.\/sw\.js"\)\.then\(\(e=>\{\}\),\(e=>\{\}\)\)\}\)\)/,
  '',
);
writeFileSync(join(DEST, 'index.html'), html, 'utf8');
cpSync(LICENSE_SRC, join(DEST, 'LICENSE'));
cpSync('/tmp/src-black-hole-square/public/icon.png', join(DEST, 'icon.png'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Space Grid Puzzle adapted from Quinten/black-hole-square (MIT, js13k 2021).\nOriginal space-themed grid puzzle: tap squares, swipe to skip or reset levels.\n',
);
console.log('Adapted space-grid-puzzle to', DEST);
