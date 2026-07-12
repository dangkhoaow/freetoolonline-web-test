#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/unzip-13steps/index.html';
const LICENSE_SRC = '/tmp/src-js13kGames-13-steps-to-escape/LICENSE';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/thirteen-step-escape');

mkdirSync(DEST, { recursive: true });

let html = readFileSync(SRC, 'utf8');
if (!html.includes('noindex')) {
  html = html.replace('<head>', '<head><meta name="robots" content="noindex"><title>Thirteen Step Escape</title>');
}
writeFileSync(join(DEST, 'index.html'), html, 'utf8');
cpSync(LICENSE_SRC, join(DEST, 'LICENSE'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Thirteen Step Escape adapted from js13kGames/13-steps-to-escape (MIT, Copyright 2024 Satanimax / Jonathan Vallet).\n2D pixel puzzle: reach the flag in 13 steps or actions. Push crates, keys, switches, and boulders.\n',
);
console.log('Adapted thirteen-step-escape to', DEST);
