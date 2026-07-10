#!/usr/bin/env node
/** Vendor thegamerbay/neon-dopamine for freetoolonline iframe ship (fire35). */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test';
const DEST = path.join(ROOT, 'source/web/src/main/webapp/static/games/neon-surge-loop');
const BASE = 'https://raw.githubusercontent.com/thegamerbay/neon-dopamine/main';

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
  html = html.replace('<title>Neon Surge: Dopamine Loop</title>', '<title>Neon Surge Loop</title>');
  html = html.replace('href="style.css?v=2"', 'href="style.css"');
  html = html.replace('src="src/main.js?v=2"', 'src="src/main.js"');
  return html;
}

async function main() {
  fs.mkdirSync(path.join(DEST, 'src'), { recursive: true });

  const license = await fetchBuf(`${BASE}/LICENSE`);
  fs.writeFileSync(path.join(DEST, 'LICENSE'), license);
  console.log('vendored LICENSE', license.length);

  const htmlBuf = await fetchBuf(`${BASE}/index.html`);
  const adapted = adaptIndex(htmlBuf.toString('utf8'));
  fs.writeFileSync(path.join(DEST, 'index.html'), adapted);
  console.log('vendored index.html', adapted.length);

  const js = await fetchBuf(`${BASE}/src/main.js`);
  fs.writeFileSync(path.join(DEST, 'src/main.js'), js);
  console.log('vendored src/main.js', js.length);

  const css = await fetchBuf(`${BASE}/style.css`);
  fs.writeFileSync(path.join(DEST, 'style.css'), css);
  console.log('vendored style.css', css.length);

  fs.writeFileSync(path.join(DEST, 'CREDITS.txt'), `Neon Surge Loop (adapted from Neon Surge: Dopamine Loop by Artem Ryazanov)
Upstream: https://github.com/thegamerbay/neon-dopamine
License: MIT (see LICENSE)
Shipped as a canvas roguelite wave shooter with mouse-move steering, auto-fire, XP level-up cards, and procedural Web Audio SFX.
Adaptations for freetoolonline.com: noindex meta in iframe, page title rebrand to Neon Surge Loop.
`);
  console.log('fire35 vendor-adapt done ->', DEST);
}

main().catch((e) => { console.error(e); process.exit(1); });
