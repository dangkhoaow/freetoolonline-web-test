#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/unzip-13th/index.html';
const LICENSE_SRC = '/tmp/src-js13kGames-13th-floor/LICENSE';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/floor-thirteen-horror');

mkdirSync(DEST, { recursive: true });

let body = readFileSync(SRC, 'utf8').trim();
if (!body.startsWith('<!')) {
  body = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Floor Thirteen Horror</title><meta name="viewport" content="initial-scale=1,width=device-width"><style>html,body{margin:0;padding:0;overflow:hidden;background:#000;height:100%;}</style></head><body>${body}</body></html>`;
}
writeFileSync(join(DEST, 'index.html'), body, 'utf8');
cpSync(LICENSE_SRC, join(DEST, 'LICENSE'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Floor Thirteen Horror adapted from js13kGames/13th-floor (MIT, Copyright 2023 Robert Louie).\nStealth horror: explore 13 rooms, find keys, use flashlight F, hide from It.\n',
);
console.log('Adapted floor-thirteen-horror to', DEST);
