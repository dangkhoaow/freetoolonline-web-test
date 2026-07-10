#!/usr/bin/env node
/** Vendor xcontcom/neuroparticles 11x11 mode for freetoolonline iframe ship (fire32). */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test';
const DEST = path.join(ROOT, 'source/web/src/main/webapp/static/games/neural-particle-life');
const BASE = 'https://raw.githubusercontent.com/xcontcom/neuroparticles/main';

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
    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n<meta name="robots" content="noindex">\n<meta name="viewport" content="width=device-width, initial-scale=1">'
  );
  html = html.replace('<title>Neuroparticles</title>', '<title>Neural Particle Life</title>');
  html = html.replace(
    /<div><br \/><b><a href="https:\/\/github\.com\/xcontcom\/neuroparticles">[^<]+<\/a><\/b><\/div>\s*/,
    ''
  );
  return html;
}

async function main() {
  fs.mkdirSync(DEST, { recursive: true });

  const license = await fetchBuf(`${BASE}/LICENSE`);
  fs.writeFileSync(path.join(DEST, 'LICENSE'), license);
  console.log('vendored LICENSE', license.length);

  const htmlBuf = await fetchBuf(`${BASE}/11x11.html`);
  const adapted = adaptIndex(htmlBuf.toString('utf8'));
  fs.writeFileSync(path.join(DEST, 'index.html'), adapted);
  console.log('vendored index.html', adapted.length);

  const js = await fetchBuf(`${BASE}/11x11.js`);
  fs.writeFileSync(path.join(DEST, '11x11.js'), js);
  console.log('vendored 11x11.js', js.length);

  const css = await fetchBuf(`${BASE}/style.css`);
  fs.writeFileSync(path.join(DEST, 'style.css'), css);
  console.log('vendored style.css', css.length);

  fs.writeFileSync(path.join(DEST, 'CREDITS.txt'), `Neural Particle Life (adapted from Neuroparticles by Serhii Herasymov)
Upstream: https://github.com/xcontcom/neuroparticles
License: MIT (see LICENSE)
Shipped mode: 11x11 single-channel artificial life simulation (2000 neural-network agents on a toroidal grid).
Adaptations for freetoolonline.com: noindex meta in iframe, page title rebrand, removed external GitHub footer link.
`);
  console.log('fire32 vendor-adapt done ->', DEST);
}

main().catch((e) => { console.error(e); process.exit(1); });
