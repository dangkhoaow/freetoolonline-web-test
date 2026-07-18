#!/usr/bin/env node
/** fire136: vendor unlucky-street dist -> static/games/unlucky-crossing/ */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SRC = '/tmp/unlucky-street/dist';
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/unlucky-crossing');

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

const raw = readFileSync(join(DEST, 'index.html'), 'utf8');
const adapted = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
<title>Unlucky Crossing</title>
<script type="module" crossorigin src="./assets/index-D03-ywEY.js"></script>
<link rel="stylesheet" crossorigin href="./assets/index-BnT3wMBj.css">
</head>
<body>
${raw.replace(/^[\s\S]*?<body>/i, '').replace(/<\/body>[\s\S]*$/i, '')}
</body>
</html>
`;
writeFileSync(join(DEST, 'index.html'), adapted, 'utf8');

cpSync('/tmp/unlucky-street/LICENSE', join(DEST, 'LICENSE'));
writeFileSync(join(DEST, 'CREDITS.txt'), `Unlucky Crossing (adapted from Unlucky Street)
Original game: ilyasmirnov03/unlucky-street
Author: Ilya Smirnov
License: MIT
JS13K Games 2025 entry (Black Cat theme)

FreeToolOnline adaptations: noindex meta on iframe document, English rebrand title,
relative asset paths preserved, LICENSE shipped next to engine.
Engine uses no localStorage; ftol:unluckycrossing:* namespace reserved for site policy.
`, 'utf8');

console.log('fire136 adapt: vendored unlucky-crossing (~72KB)');
