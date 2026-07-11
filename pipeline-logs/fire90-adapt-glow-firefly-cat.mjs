#!/usr/bin/env node
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/nyx-felis-scan';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/glow-firefly-cat');
const LS = 'ftol:glowfireflycat:';

mkdirSync(DEST, { recursive: true });

let index = readFileSync(join(SRC, 'index.html'), 'utf8');
index = index.replace('<meta charset=utf-8>', '<meta charset=utf-8>\n<meta name="robots" content="noindex">');
index = index.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\n/, '');
index = index.replace(/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\n/, '');
index = index.replace(/<link href="https:\/\/fonts\.googleapis\.com[^"]+" rel="stylesheet">\n\n/, '');
index = index.replace(/<!-- Firebase SDK[\s\S]*?<!-- Firebase Initialization[^]*?\n\n/, '');
index = index.replace(/<title>js13k-2025: Nyx Felis and Lampyris<\/title>/, '<title>Glow Firefly Cat</title>');
writeFileSync(join(SRC, 'index.html'), index);

let main = readFileSync(join(SRC, 'main.js'), 'utf8');
main = main.replace(/const FIREBASE_CONFIG[\s\S]*?firebaseEnabled = false;\n  \}\n\}/,
  'let firebaseEnabled = false; // Firebase stripped for static iframe ship');
main = main.replace(/'tutorialComplete'/g, `'${LS}tutorialComplete'`);
main = main.replace(/'firefly_leaderboard'/g, `'${LS}leaderboard'`);
writeFileSync(join(SRC, 'main.js'), main);

execSync('npm run build', { cwd: SRC, stdio: 'inherit' });

const built = readFileSync(join(SRC, 'dist/index.html'), 'utf8');
writeFileSync(join(DEST, 'index.html'), built);
cpSync(join(SRC, 'README.md'), join(DEST, 'CREDITS.txt'));
writeFileSync(join(DEST, 'LICENSE'), 'MIT License\nCopyright (c) Afton Gauntlett\n\nAdapted as Glow Firefly Cat for freetoolonline.com iframe embed.\n');
console.log('Adapted glow-firefly-cat to', DEST, 'size', built.length);
