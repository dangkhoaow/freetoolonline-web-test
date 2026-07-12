#!/usr/bin/env node
import { cpSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/src-vimmonsters';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/vim-motion-academy');
const LS = 'ftol:vimmotionacademy:';
const SAVE_KEY = `${LS}save-v1`;
const META_KEY = `${LS}meta-v1`;

const TOP = new Set(['index.html', 'src', 'assets']);

function copyTree(src, dest, root = false) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    if (root && !TOP.has(name)) continue;
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) copyTree(s, d);
    else cpSync(s, d);
  }
}

function patchFile(path, fn) {
  const text = readFileSync(path, 'utf8');
  writeFileSync(path, fn(text), 'utf8');
}

rmSync(DEST, { recursive: true, force: true });
copyTree(SRC, DEST, true);

patchFile(join(DEST, 'index.html'), (html) => {
  let out = html;
  out = out.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n    <meta name="robots" content="noindex">',
  );
  out = out.replace(/VimMonsters Academy/g, 'Vim Motion Academy');
  out = out.replace(
    'aria-label="VimMonsters Academy game screen"',
    'aria-label="Vim Motion Academy game screen"',
  );
  return out;
});

patchFile(join(DEST, 'src/game.js'), (text) => {
  let out = text;
  out = out.replace(
    'const SAVE_KEY = "vimmonsters-academy-save-v1";',
    `const SAVE_KEY = "${SAVE_KEY}";`,
  );
  out = out.replace(
    'const META_KEY = "vimmonsters-academy-meta-v1";',
    `const META_KEY = "${META_KEY}";`,
  );
  out = out.replace(
    'ctx.fillText("Loading VimMonsters Academy...", 280, 350);',
    'ctx.fillText("Loading Vim Motion Academy...", 280, 350);',
  );
  if (!out.includes('function staticHostFetch')) {
    out = out.replace(
      '  const SAVE_KEY =',
      `  function staticHostFetch(url, options) {
    if (typeof url === "string" && url.includes("/api/")) {
      return Promise.resolve({
        ok: false,
        status: 404,
        json: async () => ({}),
      });
    }
    return window.fetch(url, options);
  }

  const SAVE_KEY =`,
    );
  }
  out = out.replace('fetchImpl: window.fetch.bind(window),', 'fetchImpl: staticHostFetch,');
  return out;
});

patchFile(join(DEST, 'src/bitmap-assets.js'), (text) => text.replace(/\.\.\/assets\//g, './assets/'));

writeFileSync(join(DEST, 'LICENSE'), readFileSync(join(SRC, 'LICENSE'), 'utf8'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Vim Motion Academy adapted from error311/vimmonsters-academy (MIT, Copyright 2026 VimMonsters Academy contributors).\nBrowser canvas RPG that teaches Vim motions through overworld exploration, drills, and turn-based creature battles.\nNot affiliated with Vim or any Vim trademark holder.\n',
);

console.log('Adapted vim-motion-academy to', DEST);
