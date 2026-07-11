#!/usr/bin/env node
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/doodle-slam-scan';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/sketch-turf-battle');
const LS_PREFIX = 'ftol:sketchturfbattle:';

function copyTree(src, dest, skip = new Set(['test', 'sw.js', '.git'])) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    if (skip.has(name)) continue;
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) copyTree(s, d, skip);
    else cpSync(s, d);
  }
}

function patchFile(path, fn) {
  const text = readFileSync(path, 'utf8');
  writeFileSync(path, fn(text), 'utf8');
}

mkdirSync(DEST, { recursive: true });
copyTree(SRC, DEST);

writeFileSync(join(DEST, 'LICENSE'), readFileSync(join(SRC, 'LICENSE'), 'utf8'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Sketch Turf Battle adapted from qxbyte/doodle-slam (MIT, Copyright 2026 Qiang Xue).\nOriginal doodle turf battle implementation - generic paint-war genre.\n',
);

patchFile(join(DEST, 'index.html'), (html) => {
  let out = html;
  out = out.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n<meta name="robots" content="noindex">');
  out = out.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\n/, '');
  out = out.replace(/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\n/, '');
  out = out.replace(/<link href="https:\/\/fonts\.googleapis\.com[^"]+" rel="stylesheet">\n/, '');
  out = out.replace(/<title>DOODLE SLAM!<\/title>/, '<title>Sketch Turf Battle</title>');
  out = out.replace(/aria-label="DOODLE SLAM!"/, 'aria-label="Sketch Turf Battle"');
  out = out.replace(/DOODLE/g, 'SKETCH').replace(/SLAM!/g, 'TURF!');
  return out;
});

patchFile(join(DEST, 'style.css'), (css) =>
  css
    .replace(
      /--font-display: 'Archivo', 'ZCOOL KuaiLe', 'Arial Black', sans-serif;/,
      "--font-display: 'Arial Black', sans-serif;",
    )
    .replace(
      /--font-body: 'Nunito', 'ZCOOL KuaiLe', 'Avenir Next', sans-serif;/,
      "--font-body: system-ui, 'Avenir Next', sans-serif;",
    )
    .replace(
      /--font-hand: 'Patrick Hand', 'ZCOOL KuaiLe', 'Chalkboard SE', cursive;/,
      "--font-hand: 'Chalkboard SE', cursive;",
    ),
);

function walkJs(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkJs(p);
    else if (name.endsWith('.js')) {
      patchFile(p, (js) => {
        let out = js.replace(/doodleSlam\./g, LS_PREFIX);
        if (name === 'game.js' && p.endsWith('js/game.js')) {
          out = out.replace(
            /  \/\/ installable\/offline: register the service worker where allowed[\s\S]*?navigator\.serviceWorker\.register\('sw\.js'\)\.catch\(\(\) => \{\}\);\n  \}/,
            '  // service worker disabled for iframe embed',
          );
        }
        return out;
      });
    }
  }
}
walkJs(join(DEST, 'js'));

console.log('Adapted sketch-turf-battle to', DEST);
