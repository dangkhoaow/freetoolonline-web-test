#!/usr/bin/env node
/** Vendor bhanu2006-24/neon-maze and adapt for freetoolonline iframe ship (fire28). */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test';
const DEST = path.join(ROOT, 'source/web/src/main/webapp/static/games/cyber-neon-maze');
const VENDOR_THREE = path.join(ROOT, 'source/web/src/main/webapp/static/vendor/three');
const BASE = 'https://raw.githubusercontent.com/bhanu2006-24/neon-maze/main';
const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

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
  html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n    <meta name="robots" content="noindex">');
  html = html.replace(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>',
    '<script src="../../vendor/three/three.min.js"></script>'
  );
  html = html.replace(
    'renderer = new THREE.WebGLRenderer({ antialias: true });',
    'renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });'
  );
  html = html.replace('<title>3D Maze Escape - Hyper</title>', '<title>Cyber Neon Maze</title>');
  return html;
}

async function main() {
  fs.mkdirSync(DEST, { recursive: true });
  fs.mkdirSync(VENDOR_THREE, { recursive: true });

  const license = await fetchBuf(`${BASE}/LICENSE`);
  fs.writeFileSync(path.join(DEST, 'LICENSE'), license);
  console.log('vendored LICENSE', license.length);

  const indexBuf = await fetchBuf(`${BASE}/index.html`);
  const adapted = adaptIndex(indexBuf.toString('utf8'));
  fs.writeFileSync(path.join(DEST, 'index.html'), adapted);
  console.log('vendored index.html', adapted.length);

  const threePath = path.join(VENDOR_THREE, 'three.min.js');
  if (!fs.existsSync(threePath)) {
    const three = await fetchBuf(THREE_URL);
    fs.writeFileSync(threePath, three);
    console.log('vendored three.min.js r128', three.length);
  } else {
    console.log('reuse existing three.min.js', fs.statSync(threePath).size);
  }

  fs.writeFileSync(path.join(DEST, 'CREDITS.txt'), `Cyber Neon Maze (adapted from Neon Maze by Bhanu Pratap Saini)
Upstream: https://github.com/bhanu2006-24/neon-maze
License: MIT (see LICENSE)
Adaptations for freetoolonline.com: vendored three.js r128 locally (no CDN), page title rebrand to Cyber Neon Maze, added noindex meta in iframe.
`);
  console.log('fire28 vendor-adapt done ->', DEST);
}

main().catch((e) => { console.error(e); process.exit(1); });
