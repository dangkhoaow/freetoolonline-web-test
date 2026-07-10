#!/usr/bin/env node
/** Vendor Hamdan-Saddique-ai/Arrow-Escape-Game for freetoolonline iframe ship (fire38). */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test';
const DEST = path.join(ROOT, 'source/web/src/main/webapp/static/games/arrow-dodge-arena');
const BASE = 'https://raw.githubusercontent.com/Hamdan-Saddique-ai/Arrow-Escape-Game/main/Arrow%20Escape%20Game';
const LS_KEY = 'ftol:arrowdodgearena:hs';

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuf(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function adaptIndex(html) {
  html = html.replace(
    '<head>',
    '<head>\n    <meta name="robots" content="noindex">'
  );
  html = html.replace('<title>Arrow Escape Game | Hamdan Saddique</title>', '<title>Arrow Dodge Arena</title>');
  html = html.replace('🎮 Use Arrow Keys to Move', 'Use Arrow Keys to Move');
  return html;
}

function adaptGame(js) {
  js = js.replaceAll("'arrowEscapeHighScore'", `'${LS_KEY}'`);
  js = js.replaceAll('"arrowEscapeHighScore"', `"${LS_KEY}"`);
  return js;
}

async function main() {
  fs.mkdirSync(DEST, { recursive: true });

  const license = await fetchBuf('https://raw.githubusercontent.com/Hamdan-Saddique-ai/Arrow-Escape-Game/main/LICENSE');
  fs.writeFileSync(path.join(DEST, 'LICENSE'), license);

  const html = adaptIndex((await fetchBuf(`${BASE}/index.html`)).toString('utf8'));
  fs.writeFileSync(path.join(DEST, 'index.html'), html);

  const js = adaptGame((await fetchBuf(`${BASE}/game.js`)).toString('utf8'));
  fs.writeFileSync(path.join(DEST, 'game.js'), js);

  const css = await fetchBuf(`${BASE}/style.css`);
  fs.writeFileSync(path.join(DEST, 'style.css'), css);

  fs.writeFileSync(path.join(DEST, 'CREDITS.txt'), `Arrow Dodge Arena (adapted from Arrow Escape Game by Hamdan Saddique)
Upstream: https://github.com/Hamdan-Saddique-ai/Arrow-Escape-Game
License: MIT (see LICENSE)
30-second canvas dodge arcade: arrow keys, red arrow enemies, blue star power-ups.
Adaptations: noindex meta, title rebrand, localStorage namespaced ${LS_KEY}.
`);
  console.log('fire38 vendor-adapt done ->', DEST);
}

main().catch((e) => { console.error(e); process.exit(1); });
