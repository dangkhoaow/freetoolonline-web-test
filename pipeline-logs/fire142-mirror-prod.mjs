#!/usr/bin/env node
/** fire142: mirror desk-cat-coder from staging to prod */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STAGING = ROOT;
const PROD = process.env.PROD_REPO || join(ROOT, '..', 'freetoolonline-web');
const FRONTEND = join(ROOT, '..');

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) copyTree(s, d);
    else cpSync(s, d);
  }
}

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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /deskcatcoder/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /desk-cat-coder/i.test(r));
copyTree(
  join(STAGING, 'source/web/src/main/webapp/static/games/desk-cat-coder'),
  join(PROD, 'source/web/src/main/webapp/static/games/desk-cat-coder'),
);
const pics = readdirSync(join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'))
  .filter((n) => n.startsWith('deskcatcoder__'));
for (const n of pics) {
  cpSync(
    join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
    join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
  );
}

function patch(file, ...replacements) {
  const p = join(PROD, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/desk-cat-coder.html')) {
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
  // game-discovery-loop-runbook fire142 (2026-07-18): desk-cat-coder companion guides
  '/guides/how-to-play-desk-cat-coder.html',
  '/guides/desk-cat-coder-when.html',
  '/guides/desk-cat-coder-vs-alternatives.html',
  '/guides/pt/how-to-play-desk-cat-coder.html',
  '/guides/pt/desk-cat-coder-when.html',
  '/guides/pt/desk-cat-coder-vs-alternatives.html',
  '/guides/es/how-to-play-desk-cat-coder.html',
  '/guides/es/desk-cat-coder-when.html',
  '/guides/es/desk-cat-coder-vs-alternatives.html',
  '/guides/vi/how-to-play-desk-cat-coder.html',
  '/guides/vi/desk-cat-coder-when.html',
  '/guides/vi/desk-cat-coder-vs-alternatives.html',
  '/guides/id/how-to-play-desk-cat-coder.html',
  '/guides/id/desk-cat-coder-when.html',
  '/guides/id/desk-cat-coder-vs-alternatives.html',
  '/guides/de/how-to-play-desk-cat-coder.html',
  '/guides/de/desk-cat-coder-when.html',
  '/guides/de/desk-cat-coder-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire142 (2026-07-18): desk-cat-coder companion guides
  '/guides/how-to-play-desk-cat-coder.html': 'guide/how-to-play-desk-cat-coder.jsp',
  '/guides/desk-cat-coder-when.html': 'guide/desk-cat-coder-when.jsp',
  '/guides/desk-cat-coder-vs-alternatives.html': 'guide/desk-cat-coder-vs-alternatives.jsp',
  '/guides/pt/how-to-play-desk-cat-coder.html': 'guide/pt/how-to-play-desk-cat-coder.jsp',
  '/guides/pt/desk-cat-coder-when.html': 'guide/pt/desk-cat-coder-when.jsp',
  '/guides/pt/desk-cat-coder-vs-alternatives.html': 'guide/pt/desk-cat-coder-vs-alternatives.jsp',
  '/guides/es/how-to-play-desk-cat-coder.html': 'guide/es/how-to-play-desk-cat-coder.jsp',
  '/guides/es/desk-cat-coder-when.html': 'guide/es/desk-cat-coder-when.jsp',
  '/guides/es/desk-cat-coder-vs-alternatives.html': 'guide/es/desk-cat-coder-vs-alternatives.jsp',
  '/guides/vi/how-to-play-desk-cat-coder.html': 'guide/vi/how-to-play-desk-cat-coder.jsp',
  '/guides/vi/desk-cat-coder-when.html': 'guide/vi/desk-cat-coder-when.jsp',
  '/guides/vi/desk-cat-coder-vs-alternatives.html': 'guide/vi/desk-cat-coder-vs-alternatives.jsp',
  '/guides/id/how-to-play-desk-cat-coder.html': 'guide/id/how-to-play-desk-cat-coder.jsp',
  '/guides/id/desk-cat-coder-when.html': 'guide/id/desk-cat-coder-when.jsp',
  '/guides/id/desk-cat-coder-vs-alternatives.html': 'guide/id/desk-cat-coder-vs-alternatives.jsp',
  '/guides/de/how-to-play-desk-cat-coder.html': 'guide/de/how-to-play-desk-cat-coder.jsp',
  '/guides/de/desk-cat-coder-when.html': 'guide/de/desk-cat-coder-when.jsp',
  '/guides/de/desk-cat-coder-vs-alternatives.html': 'guide/de/desk-cat-coder-vs-alternatives.jsp',
`;

patch('scripts/site-data.mjs',
  [`  '/guides/de/seasonal-witchcat-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/seasonal-witchcat-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/seasonal-witchcat.html': '/games/seasonal-witchcat.html',\n\n  '/gravity-orbit-golf.html'`, `  '/seasonal-witchcat.html': '/games/seasonal-witchcat.html',\n  '/desk-cat-coder.html': '/games/desk-cat-coder.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/seasonal-witchcat-vs-alternatives.html': 'guide/de/seasonal-witchcat-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/seasonal-witchcat-vs-alternatives.html': 'guide/de/seasonal-witchcat-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/seasonal-witchcat.html': 'games/seasonal-witchcat.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/seasonal-witchcat.html': 'games/seasonal-witchcat.jsp',\n  '/games/desk-cat-coder.html': 'games/desk-cat-coder.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch('scripts/seo-clusters.mjs', [`'/games/seasonal-witchcat.html']`, `'/games/seasonal-witchcat.html', '/games/desk-cat-coder.html']`]);

patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Seasonal Witchcat", url: "https://freetoolonline.com/games/seasonal-witchcat.html", include: !1, tags: "games" },`, `{ title: "Seasonal Witchcat", url: "https://freetoolonline.com/games/seasonal-witchcat.html", include: !1, tags: "games" },\n    { title: "Desk Cat Coder", url: "https://freetoolonline.com/games/desk-cat-coder.html", include: !1, tags: "games" },`],
);

patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/seasonal-witchcat.html'>Seasonal Witchcat (Season Adventure)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/seasonal-witchcat.html'>Seasonal Witchcat (Season Adventure)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/desk-cat-coder.html'>Desk Cat Coder (Stealth Desk)</a>`],
);

console.log('fire142 prod mirror files ready');
