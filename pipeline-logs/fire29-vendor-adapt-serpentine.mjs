#!/usr/bin/env node
/** Vendor S-SUJAN-S/serpentine-game and adapt for freetoolonline iframe ship (fire29). */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test';
const DEST = path.join(ROOT, 'source/web/src/main/webapp/static/games/serpentine-3d');
const BASE = 'https://raw.githubusercontent.com/S-SUJAN-S/serpentine-game/main';
const SLUG = 'serpentine3d';

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
  html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n  <meta name="robots" content="noindex">');
  html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*>\n?/g, '');
  html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[^>]*>\n?/g, '');
  html = html.replace(/<link rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com[^>]+>\n?/g, '');
  html = html.replace(/<noscript><link href="https:\/\/fonts\.googleapis\.com[^>]+><\/noscript>\n?/g, '');
  html = html.replace(
    /<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js"[^>]*><\/script>/,
    '<script src="../../vendor/three/three.min.js"></script>'
  );
  html = html.replace(
    "const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });",
    'const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });'
  );
  html = html.replace(
    "--font-display: 'Orbitron', monospace;",
    '--font-display: system-ui, sans-serif;'
  );
  html = html.replace(
    "--font-mono:    'Share Tech Mono', monospace;",
    '--font-mono: ui-monospace, monospace;'
  );
  html = html.replace(/font-family: 'Orbitron', monospace;/g, 'font-family: var(--font-display);');
  html = html.replace("PFX: 'serpentine_',", `PFX: 'ftol:${SLUG}:',`);
  html = html.replace(
    '<title>Serpentine — 3D Snake Game | Play Free in Browser</title>',
    '<title>Serpentine 3D</title>'
  );
  return html;
}

async function main() {
  fs.mkdirSync(DEST, { recursive: true });
  const license = await fetchBuf(`${BASE}/LICENSE`);
  fs.writeFileSync(path.join(DEST, 'LICENSE'), license);
  const indexBuf = await fetchBuf(`${BASE}/index.html`);
  const adapted = adaptIndex(indexBuf.toString('utf8'));
  fs.writeFileSync(path.join(DEST, 'index.html'), adapted);
  fs.writeFileSync(path.join(DEST, 'CREDITS.txt'), `Serpentine 3D (adapted from Serpentine by S-SUJAN-S)
Upstream: https://github.com/S-SUJAN-S/serpentine-game
License: MIT (see LICENSE)
Adaptations for freetoolonline.com: vendored three.js r128 locally (no CDN), Google Fonts removed (system-ui fallbacks), localStorage namespaced ftol:${SLUG}:*, added noindex meta in iframe.
`);
  console.log('fire29 vendor-adapt done', adapted.length, 'bytes ->', DEST);
}

main().catch((e) => { console.error(e); process.exit(1); });
