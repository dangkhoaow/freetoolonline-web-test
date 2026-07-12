#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/src-blueprint-scan';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/schematic-factory-game');
const LS = 'ftol:schematicfactorygame:';

mkdirSync(DEST, { recursive: true });

for (const f of ['game.js', 'style.css', 'sim-worker.js', 'icon.svg', 'LICENSE']) {
  cpSync(join(SRC, f), join(DEST, f));
}

let html = readFileSync(join(SRC, 'index.html'), 'utf8');
html = html.replace(
  '<meta charset="UTF-8">',
  '<meta charset="UTF-8">\n  <meta name="robots" content="noindex">',
);
html = html.replace(/<meta name="apple-mobile-web-app[^>]*>\n/g, '');
html = html.replace(/<meta property="og:[^>]*>\n/g, '');
html = html.replace(/<meta name="twitter:[^>]*>\n/g, '');
html = html.replace(/<link rel="manifest" href="manifest.json">\n/, '');
html = html.replace(
  '<title>Blueprint · An Incremental Factory</title>',
  '<title>Schematic Factory Line</title>',
);
html = html.replace('<div class="logo">BLUEPRINT</div>', '<div class="logo">SCHEMATIC FACTORY</div>');
writeFileSync(join(DEST, 'index.html'), html, 'utf8');

let js = readFileSync(join(DEST, 'game.js'), 'utf8');
js = js.replace("const SAVE_KEY = 'blueprint.save.v1';", `const SAVE_KEY = '${LS}save.v1';`);
js = js.replace(
  "const SAVE_BACKUP_KEY = 'blueprint.save.v1.backup';",
  `const SAVE_BACKUP_KEY = '${LS}save.v1.backup';`,
);
js = js.replace(
  `    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch((err) => {
          console.warn('[blueprint] sw registration failed', err);
        });
      });
    }`,
  '    // service worker stripped for iframe embed',
);
writeFileSync(join(DEST, 'game.js'), js, 'utf8');

writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Schematic Factory Line adapted from Real-Fruit-Snacks/Blueprint (MIT, Copyright 2026 Real-Fruit-Snacks).\nOriginal engineering-schematic incremental factory game: mine, smelt, assemble, prestige Schematics, publish Patents.\n',
);

console.log('Adapted schematic-factory-game to', DEST);
