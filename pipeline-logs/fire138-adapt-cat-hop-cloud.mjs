#!/usr/bin/env node
/** fire138: vendor Cat-Hop-Cloud -> static/games/cat-hop-cloud/ */
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/cat-hop-cloud');
const PREFIX = 'ftol:cathopcloud:';

mkdirSync(DEST, { recursive: true });

let html = readFileSync('/tmp/Cat-Hop-Cloud/index.html', 'utf8');
if (!html.includes('<meta name="robots"')) {
  html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">');
}
html = html.replace(/catHopScores_v/g, `${PREFIX}scores_v`);
html = html.replace(/catHopAllScores/g, `${PREFIX}allScores`);
html = html.replace(/catHopUnlocked/g, `${PREFIX}unlocked`);
html = html.replace(/catHopScores/g, `${PREFIX}scores`);
writeFileSync(join(DEST, 'index.html'), html, 'utf8');

cpSync('/tmp/Cat-Hop-Cloud/LICENSE', join(DEST, 'LICENSE'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  `Cat Hop Cloud
Original game: helmedeiros/Cat-Hop-Cloud
Author: Helio Medeiros
License: MIT, Copyright (c) 2025 Helio Medeiros
JS13K-style luck/cloud hop puzzle

FreeToolOnline adaptations: noindex meta on iframe document, localStorage keys namespaced to ${PREFIX}*,
LICENSE shipped next to engine.
`,
  'utf8',
);

const kb = Math.round(Buffer.byteLength(html, 'utf8') / 1024);
console.log(`fire138 adapt: vendored cat-hop-cloud (~${kb}KB index.html)`);
