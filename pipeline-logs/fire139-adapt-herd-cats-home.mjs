#!/usr/bin/env node
/** fire139: vendor WMAR-9 black_cat -> static/games/herd-cats-home/ */
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SRC = '/tmp/wmar-dist';
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/herd-cats-home');
const LS_KEY = 'ftol:herdcathome:CAT';

mkdirSync(DEST, { recursive: true });

let html = readFileSync(join(SRC, 'index.html'), 'utf8');
if (!html.includes('<meta name="robots"')) {
  html = html.replace(
    '<meta name="viewport"',
    '<meta name="robots" content="noindex">\n<meta name="viewport"',
  );
}
writeFileSync(join(DEST, 'index.html'), html, 'utf8');

let js = readFileSync(join(SRC, 'index.js'), 'utf8');
js = js.replace(/f\("CAT"\)/g, `f("${LS_KEY}")`);
js = js.replace(/h="CAT"/g, `h="${LS_KEY}"`);
writeFileSync(join(DEST, 'index.js'), js, 'utf8');

cpSync(join(SRC, 'index.css'), join(DEST, 'index.css'));
cpSync(join(SRC, 't.png'), join(DEST, 't.png'));

writeFileSync(
  join(DEST, 'LICENSE'),
  `MIT License

Copyright (c) 2025 WMAR-9 (js13kGames 2025 entry black_cat)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
  'utf8',
);

writeFileSync(
  join(DEST, 'CREDITS.txt'),
  `Herd Cats Home (upstream: black_cat)
Original game: WMAR-9 / js13kGames 2025 entry black_cat
License: MIT, Copyright (c) 2025 WMAR-9
Isometric multi-cat herding puzzle - lead colored cats home with the black cat

FreeToolOnline adaptations: noindex meta on iframe document, localStorage key CAT namespaced to ${LS_KEY},
LICENSE shipped next to engine.
`,
  'utf8',
);

const totalKb = Math.round(
  (Buffer.byteLength(html, 'utf8') +
    Buffer.byteLength(js, 'utf8') +
    readFileSync(join(SRC, 'index.css')).length +
    readFileSync(join(SRC, 't.png')).length) /
    1024,
);
console.log(`fire139 adapt: vendored herd-cats-home (~${totalKb}KB bundle)`);
