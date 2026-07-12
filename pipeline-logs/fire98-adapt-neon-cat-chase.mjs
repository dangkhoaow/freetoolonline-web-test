#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/ninelives-scan/dist/index.html';
const LICENSE_SRC = '/tmp/ninelives-scan/LICENSE';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/neon-cat-chase');
const LS = 'ftol:neoncatchase:bc9l_';

mkdirSync(DEST, { recursive: true });

let html = readFileSync(SRC, 'utf8');
html = html.replace('<head><meta charset=utf-8>', '<head><meta charset=utf-8>\n<meta name="robots" content="noindex">');
html = html.replace('<title>Black Cat: 9 Lives</title>', '<title>Neon Cat Chase</title>');
html = html.replace('const ns = "bc9l_";', `const ns = "${LS}";`);
html = html.replace(/"BLACK CAT: 9 LIVES"/g, '"NEON CAT CHASE"');
html = html.replace('ctx.fillText("Grab "+LEVELS.target+" cheese to advance.", W/2, H/2);', 'ctx.fillText("Collect "+LEVELS.target+" cheese to advance.", W/2, H/2);');
writeFileSync(join(DEST, 'index.html'), html, 'utf8');

cpSync(LICENSE_SRC, join(DEST, 'LICENSE'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Neon Cat Chase adapted from js13kGames/9-lives (MIT, devynstyles JS13K 2025).\nOriginal neon arcade cat game: collect cheese, dodge dogs, nine lives.\n',
);

console.log('Adapted neon-cat-chase to', DEST);
