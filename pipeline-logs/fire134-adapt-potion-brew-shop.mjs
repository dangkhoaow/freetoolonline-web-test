#!/usr/bin/env node
/** fire134: vendor js13k-2025-black-cat docs build as potion-brew-shop */
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/potion-brew-shop');
const SRC = '/tmp/js13k-2025-black-cat/docs';

mkdirSync(DEST, { recursive: true });
cpSync('/tmp/js13k-2025-black-cat/LICENSE', join(DEST, 'LICENSE'));
cpSync(join(SRC, 'i.js'), join(DEST, 'i.js'));

writeFileSync(
  join(DEST, 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Potion Brew Shop</title>
<style>*{margin:0;padding:0;user-select:none}html{background:#111;height:100%}body{align-items:center;display:flex;height:100%;justify-content:center;overflow:hidden}canvas{background:#26192c}.p{cursor:pointer}</style>
</head>
<body>
<script src="i.js"></script>
</body>
</html>
`,
  'utf8',
);

writeFileSync(
  join(DEST, 'CREDITS.txt'),
  `Potion Brew Shop
Upstream: sebadorn/js13k-2025-black-cat (GitHub)
Author: Sebastian Dorn
License: MIT (see LICENSE)
JS13K 2025 entry - point-and-click potion shop puzzle.
Audio: kitten meow by AlexMurphy53 (freesound.org, embedded in build); ZzFX synth.
Adapted for FreeToolOnline: noindex meta, English iframe title.
`,
  'utf8',
);

console.log('fire134 engine adapted at', DEST);
