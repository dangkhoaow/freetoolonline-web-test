#!/usr/bin/env node
/** Vendor susam/invaders for freetoolonline iframe ship (fire46). */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test';
const DEST = path.join(ROOT, 'source/web/src/main/webapp/static/games/andromeda-star-shooter');
const HTML_URL = 'https://raw.githubusercontent.com/susam/invaders/main/invaders.html';
const LICENSE_URL = 'https://raw.githubusercontent.com/susam/invaders/main/LICENSE.md';

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).on('error', reject);
  });
}

function adaptHtml(html) {
  html = html.replace('<head>', '<head>\n    <meta name="robots" content="noindex">');
  html = html.replace('<title>Andromeda Invaders</title>', '<title>Andromeda Star Shooter</title>');
  html = html.replace("const NAME = 'Andromeda Invaders'", "const NAME = 'Andromeda Star Shooter'");
  return html;
}

async function main() {
  fs.mkdirSync(DEST, { recursive: true });
  const license = await fetchText(LICENSE_URL);
  fs.writeFileSync(path.join(DEST, 'LICENSE'), license);
  const html = adaptHtml(await fetchText(HTML_URL));
  fs.writeFileSync(path.join(DEST, 'index.html'), html);
  fs.writeFileSync(path.join(DEST, 'CREDITS.txt'), `Andromeda Star Shooter (adapted from Andromeda Invaders by Susam Pal)
Upstream: https://github.com/susam/invaders
License: MIT (see LICENSE)
Single-file canvas fixed-shooter with procedural Web Audio SFX.
Adaptations: noindex meta, title rebrand to Andromeda Star Shooter.
`);
  console.log('fire46 vendor-adapt done ->', DEST);
}

main().catch((e) => { console.error(e); process.exit(1); });
