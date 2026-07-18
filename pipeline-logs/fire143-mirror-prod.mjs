#!/usr/bin/env node
/** fire143: mirror boing-cat-platformer from staging to prod */
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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /boingcatplatformer/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /boing-cat-platformer/i.test(r));

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
  join(STAGING, 'source/web/src/main/webapp/static/games/boing-cat-platformer'),
  join(PROD, 'source/web/src/main/webapp/static/games/boing-cat-platformer'),
);

const pics = readdirSync(join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'))
  .filter((n) => n.startsWith('boingcatplatformer__'));
for (const n of pics) {
  cpSync(
    join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
    join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
  );
}

function patch(file, ...replacements) {
  const p = join(PROD, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/boing-cat-platformer.html')) {
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
  // game-discovery-loop-runbook fire143 (2026-07-18): boing-cat-platformer companion guides
  '/guides/how-to-play-boing-cat-platformer.html',
  '/guides/boing-cat-platformer-when.html',
  '/guides/boing-cat-platformer-vs-alternatives.html',
  '/guides/pt/how-to-play-boing-cat-platformer.html',
  '/guides/pt/boing-cat-platformer-when.html',
  '/guides/pt/boing-cat-platformer-vs-alternatives.html',
  '/guides/es/how-to-play-boing-cat-platformer.html',
  '/guides/es/boing-cat-platformer-when.html',
  '/guides/es/boing-cat-platformer-vs-alternatives.html',
  '/guides/vi/how-to-play-boing-cat-platformer.html',
  '/guides/vi/boing-cat-platformer-when.html',
  '/guides/vi/boing-cat-platformer-vs-alternatives.html',
  '/guides/id/how-to-play-boing-cat-platformer.html',
  '/guides/id/boing-cat-platformer-when.html',
  '/guides/id/boing-cat-platformer-vs-alternatives.html',
  '/guides/de/how-to-play-boing-cat-platformer.html',
  '/guides/de/boing-cat-platformer-when.html',
  '/guides/de/boing-cat-platformer-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire143 (2026-07-18): boing-cat-platformer companion guides
  '/guides/how-to-play-boing-cat-platformer.html': 'guide/how-to-play-boing-cat-platformer.jsp',
  '/guides/boing-cat-platformer-when.html': 'guide/boing-cat-platformer-when.jsp',
  '/guides/boing-cat-platformer-vs-alternatives.html': 'guide/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/pt/how-to-play-boing-cat-platformer.html': 'guide/pt/how-to-play-boing-cat-platformer.jsp',
  '/guides/pt/boing-cat-platformer-when.html': 'guide/pt/boing-cat-platformer-when.jsp',
  '/guides/pt/boing-cat-platformer-vs-alternatives.html': 'guide/pt/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/es/how-to-play-boing-cat-platformer.html': 'guide/es/how-to-play-boing-cat-platformer.jsp',
  '/guides/es/boing-cat-platformer-when.html': 'guide/es/boing-cat-platformer-when.jsp',
  '/guides/es/boing-cat-platformer-vs-alternatives.html': 'guide/es/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/vi/how-to-play-boing-cat-platformer.html': 'guide/vi/how-to-play-boing-cat-platformer.jsp',
  '/guides/vi/boing-cat-platformer-when.html': 'guide/vi/boing-cat-platformer-when.jsp',
  '/guides/vi/boing-cat-platformer-vs-alternatives.html': 'guide/vi/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/id/how-to-play-boing-cat-platformer.html': 'guide/id/how-to-play-boing-cat-platformer.jsp',
  '/guides/id/boing-cat-platformer-when.html': 'guide/id/boing-cat-platformer-when.jsp',
  '/guides/id/boing-cat-platformer-vs-alternatives.html': 'guide/id/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/de/how-to-play-boing-cat-platformer.html': 'guide/de/how-to-play-boing-cat-platformer.jsp',
  '/guides/de/boing-cat-platformer-when.html': 'guide/de/boing-cat-platformer-when.jsp',
  '/guides/de/boing-cat-platformer-vs-alternatives.html': 'guide/de/boing-cat-platformer-vs-alternatives.jsp',
`;

// Anchor on herd-cats-home (stable, always-present anchor per fire142 lesson:
// prod tip can lag staging, so anchor on an older/stable sibling, not the
// most-recently-shipped one).
patch('scripts/site-data.mjs',
  [`  '/guides/de/herd-cats-home-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/herd-cats-home-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/herd-cats-home.html': '/games/herd-cats-home.html',\n\n  '/gravity-orbit-golf.html'`, `  '/herd-cats-home.html': '/games/herd-cats-home.html',\n  '/boing-cat-platformer.html': '/games/boing-cat-platformer.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/herd-cats-home-vs-alternatives.html': 'guide/de/herd-cats-home-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/herd-cats-home-vs-alternatives.html': 'guide/de/herd-cats-home-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/herd-cats-home.html': 'games/herd-cats-home.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/herd-cats-home.html': 'games/herd-cats-home.jsp',\n  '/games/boing-cat-platformer.html': 'games/boing-cat-platformer.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch('scripts/seo-clusters.mjs', [`'/games/herd-cats-home.html']`, `'/games/herd-cats-home.html', '/games/boing-cat-platformer.html']`]);

patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },`, `{ title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },\n    { title: "Boing Cat Platformer", url: "https://freetoolonline.com/games/boing-cat-platformer.html", include: !1, tags: "games" },`],
);

patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/herd-cats-home.html'>Herd Cats Home (Cat Herding)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/herd-cats-home.html'>Herd Cats Home (Cat Herding)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/boing-cat-platformer.html'>Boing Cat Platformer (Auto-Run Jump)</a>`],
);

console.log('fire143 prod mirror files ready');
