#!/usr/bin/env node
/** fire145: mirror darkline-paws from staging to prod */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STAGING = ROOT;
const PROD = process.env.PROD_REPO || join(ROOT, '..', 'freetoolonline-web');

function walkCopy(base, filter) {
  const srcBase = join(STAGING, base);
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (filter(relative(srcBase, full))) {
        const rel = relative(STAGING, full);
        const dest = join(PROD, rel);
        mkdirSync(dirname(dest), { recursive: true });
        cpSync(full, dest);
      }
    }
  }
  walk(srcBase);
}

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /darklinepaws/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /darkline-paws/i.test(r));

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) copyTree(s, d);
    else cpSync(s, d);
  }
}
copyTree(
  join(STAGING, 'source/web/src/main/webapp/static/games/darkline-paws'),
  join(PROD, 'source/web/src/main/webapp/static/games/darkline-paws'),
);

const pics = readdirSync(join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'))
  .filter((n) => n.startsWith('darklinepaws__'));
for (const n of pics) {
  cpSync(
    join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
    join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
  );
}

function patch(file, ...replacements) {
  const p = join(PROD, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/darkline-paws.html')) {
    console.log('already patched', file);
    return;
  }
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 80)}...`);
    s = s.replace(from, to);
  }
  writeFileSync(p, s, 'utf8');
  console.log('patched prod', file);
}

const guideRoutes = `
  // game-discovery-loop-runbook fire145 (2026-07-18): darkline-paws companion guides
  '/guides/how-to-play-darkline-paws.html',
  '/guides/darkline-paws-when.html',
  '/guides/darkline-paws-vs-alternatives.html',
  '/guides/pt/how-to-play-darkline-paws.html',
  '/guides/pt/darkline-paws-when.html',
  '/guides/pt/darkline-paws-vs-alternatives.html',
  '/guides/es/how-to-play-darkline-paws.html',
  '/guides/es/darkline-paws-when.html',
  '/guides/es/darkline-paws-vs-alternatives.html',
  '/guides/vi/how-to-play-darkline-paws.html',
  '/guides/vi/darkline-paws-when.html',
  '/guides/vi/darkline-paws-vs-alternatives.html',
  '/guides/id/how-to-play-darkline-paws.html',
  '/guides/id/darkline-paws-when.html',
  '/guides/id/darkline-paws-vs-alternatives.html',
  '/guides/de/how-to-play-darkline-paws.html',
  '/guides/de/darkline-paws-when.html',
  '/guides/de/darkline-paws-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire145 (2026-07-18): darkline-paws companion guides
  '/guides/how-to-play-darkline-paws.html': 'guide/how-to-play-darkline-paws.jsp',
  '/guides/darkline-paws-when.html': 'guide/darkline-paws-when.jsp',
  '/guides/darkline-paws-vs-alternatives.html': 'guide/darkline-paws-vs-alternatives.jsp',
  '/guides/pt/how-to-play-darkline-paws.html': 'guide/pt/how-to-play-darkline-paws.jsp',
  '/guides/pt/darkline-paws-when.html': 'guide/pt/darkline-paws-when.jsp',
  '/guides/pt/darkline-paws-vs-alternatives.html': 'guide/pt/darkline-paws-vs-alternatives.jsp',
  '/guides/es/how-to-play-darkline-paws.html': 'guide/es/how-to-play-darkline-paws.jsp',
  '/guides/es/darkline-paws-when.html': 'guide/es/darkline-paws-when.jsp',
  '/guides/es/darkline-paws-vs-alternatives.html': 'guide/es/darkline-paws-vs-alternatives.jsp',
  '/guides/vi/how-to-play-darkline-paws.html': 'guide/vi/how-to-play-darkline-paws.jsp',
  '/guides/vi/darkline-paws-when.html': 'guide/vi/darkline-paws-when.jsp',
  '/guides/vi/darkline-paws-vs-alternatives.html': 'guide/vi/darkline-paws-vs-alternatives.jsp',
  '/guides/id/how-to-play-darkline-paws.html': 'guide/id/how-to-play-darkline-paws.jsp',
  '/guides/id/darkline-paws-when.html': 'guide/id/darkline-paws-when.jsp',
  '/guides/id/darkline-paws-vs-alternatives.html': 'guide/id/darkline-paws-vs-alternatives.jsp',
  '/guides/de/how-to-play-darkline-paws.html': 'guide/de/how-to-play-darkline-paws.jsp',
  '/guides/de/darkline-paws-when.html': 'guide/de/darkline-paws-when.jsp',
  '/guides/de/darkline-paws-vs-alternatives.html': 'guide/de/darkline-paws-vs-alternatives.jsp',
`;

// Anchor on herd-cats-home (stable, always-present per fire142/143 lesson:
// prod tip can lag staging by several fires - anchor on an older/stable
// sibling, not the most-recently-shipped one). Single-line anchors only.
patch('scripts/site-data.mjs',
  [`  '/guides/de/herd-cats-home-vs-alternatives.html',\n`, `  '/guides/de/herd-cats-home-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/herd-cats-home.html': '/games/herd-cats-home.html',\n`, `  '/herd-cats-home.html': '/games/herd-cats-home.html',\n  '/darkline-paws.html': '/games/darkline-paws.html',\n`],
  [`  '/guides/de/herd-cats-home-vs-alternatives.html': 'guide/de/herd-cats-home-vs-alternatives.jsp',\n`, `  '/guides/de/herd-cats-home-vs-alternatives.html': 'guide/de/herd-cats-home-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/herd-cats-home.html': 'games/herd-cats-home.jsp',\n`, `  '/games/herd-cats-home.html': 'games/herd-cats-home.jsp',\n  '/games/darkline-paws.html': 'games/darkline-paws.jsp',\n`],
);

{
  const p = join(PROD, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/darkline-paws.html')) {
    console.log('already patched', p);
  } else {
    const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
    if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
    s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/darkline-paws.html']`);
    writeFileSync(p, s, 'utf8');
    console.log('patched prod', p, '(tail was', m[0], ')');
  }
}

patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },`, `{ title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },\n    { title: "DarkLine Paws", url: "https://freetoolonline.com/games/darkline-paws.html", include: !1, tags: "games" },`],
);

patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/herd-cats-home.html'>Herd Cats Home (Cat Herding)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/herd-cats-home.html'>Herd Cats Home (Cat Herding)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/darkline-paws.html'>DarkLine Paws (3-in-1 Bundle)</a>`],
);

console.log('fire145 prod mirror files ready');
