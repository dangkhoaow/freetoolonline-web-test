#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC_DIR = '/tmp/q1k3-unzip';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/voxel-fps-arena');

mkdirSync(DEST, { recursive: true });

let html = readFileSync(join(SRC_DIR, 'index.html'), 'utf8');
if (!html.includes('noindex')) {
  html = html.replace(
    '<head>',
    '<head><meta name="robots" content="noindex"><meta name="viewport" content="initial-scale=1,width=device-width"><title>Voxel FPS Arena</title>',
  );
}
writeFileSync(join(DEST, 'index.html'), html, 'utf8');
cpSync(join(SRC_DIR, 'l'), join(DEST, 'l'));
cpSync(join(SRC_DIR, 'm'), join(DEST, 'm'));
writeFileSync(
  join(DEST, 'LICENSE'),
  readFileSync('/tmp/q1k3-LICENSE.md', 'utf8'),
);
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Voxel FPS Arena adapted from js13kGames/q1k3 (MIT, Copyright 2021 Dominic Szablewski / phoboslab).\nWebGL voxel FPS: 2 levels, 5 enemy types, 3 weapons, dynamic lighting.\nMusic by Andy Loesch (no-fate.net) embedded in compo build.\n',
);
console.log('Adapted voxel-fps-arena to', DEST);
