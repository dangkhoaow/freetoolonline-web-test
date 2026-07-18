#!/usr/bin/env node
/** fire149: mirror solo-battlefield from staging worktree to prod */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STAGING = process.env.STAGING_REPO || join(__dirname, '..');
const PROD = process.env.PROD_REPO || '/tmp/fto-gamedrain-fresh';

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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /solobattlefield/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /solo-battlefield/i.test(r));

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
  join(STAGING, 'source/web/src/main/webapp/static/games/solo-battlefield'),
  join(PROD, 'source/web/src/main/webapp/static/games/solo-battlefield'),
);

const pics = readdirSync(join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'))
  .filter((n) => n.startsWith('solobattlefield__'));
for (const n of pics) {
  cpSync(
    join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
    join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
  );
}

for (const [srcRel, destDir] of [
  ['source/web/src/main/webapp/static/img/og/solobattlefield.png', 'source/web/src/main/webapp/static/img/og'],
  ['source/web/src/main/webapp/static/img/icon/solobattlefield-180.png', 'source/web/src/main/webapp/static/img/icon'],
]) {
  const src = join(STAGING, srcRel);
  if (statSync(src, { throwIfNoEntry: false })) {
    const dest = join(PROD, destDir, srcRel.split('/').pop());
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest);
  }
}

function patch(file, ...replacements) {
  const p = join(PROD, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/solo-battlefield.html')) {
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
  // game-discovery-loop-runbook fire149 (2026-07-18): solo-battlefield companion guides
  '/guides/how-to-play-solo-battlefield.html',
  '/guides/solo-battlefield-when.html',
  '/guides/solo-battlefield-vs-alternatives.html',
  '/guides/pt/how-to-play-solo-battlefield.html',
  '/guides/pt/solo-battlefield-when.html',
  '/guides/pt/solo-battlefield-vs-alternatives.html',
  '/guides/es/how-to-play-solo-battlefield.html',
  '/guides/es/solo-battlefield-when.html',
  '/guides/es/solo-battlefield-vs-alternatives.html',
  '/guides/vi/how-to-play-solo-battlefield.html',
  '/guides/vi/solo-battlefield-when.html',
  '/guides/vi/solo-battlefield-vs-alternatives.html',
  '/guides/id/how-to-play-solo-battlefield.html',
  '/guides/id/solo-battlefield-when.html',
  '/guides/id/solo-battlefield-vs-alternatives.html',
  '/guides/de/how-to-play-solo-battlefield.html',
  '/guides/de/solo-battlefield-when.html',
  '/guides/de/solo-battlefield-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire149 (2026-07-18): solo-battlefield companion guides
  '/guides/how-to-play-solo-battlefield.html': 'guide/how-to-play-solo-battlefield.jsp',
  '/guides/solo-battlefield-when.html': 'guide/solo-battlefield-when.jsp',
  '/guides/solo-battlefield-vs-alternatives.html': 'guide/solo-battlefield-vs-alternatives.jsp',
  '/guides/pt/how-to-play-solo-battlefield.html': 'guide/pt/how-to-play-solo-battlefield.jsp',
  '/guides/pt/solo-battlefield-when.html': 'guide/pt/solo-battlefield-when.jsp',
  '/guides/pt/solo-battlefield-vs-alternatives.html': 'guide/pt/solo-battlefield-vs-alternatives.jsp',
  '/guides/es/how-to-play-solo-battlefield.html': 'guide/es/how-to-play-solo-battlefield.jsp',
  '/guides/es/solo-battlefield-when.html': 'guide/es/solo-battlefield-when.jsp',
  '/guides/es/solo-battlefield-vs-alternatives.html': 'guide/es/solo-battlefield-vs-alternatives.jsp',
  '/guides/vi/how-to-play-solo-battlefield.html': 'guide/vi/how-to-play-solo-battlefield.jsp',
  '/guides/vi/solo-battlefield-when.html': 'guide/vi/solo-battlefield-when.jsp',
  '/guides/vi/solo-battlefield-vs-alternatives.html': 'guide/vi/solo-battlefield-vs-alternatives.jsp',
  '/guides/id/how-to-play-solo-battlefield.html': 'guide/id/how-to-play-solo-battlefield.jsp',
  '/guides/id/solo-battlefield-when.html': 'guide/id/solo-battlefield-when.jsp',
  '/guides/id/solo-battlefield-vs-alternatives.html': 'guide/id/solo-battlefield-vs-alternatives.jsp',
  '/guides/de/how-to-play-solo-battlefield.html': 'guide/de/how-to-play-solo-battlefield.jsp',
  '/guides/de/solo-battlefield-when.html': 'guide/de/solo-battlefield-when.jsp',
  '/guides/de/solo-battlefield-vs-alternatives.html': 'guide/de/solo-battlefield-vs-alternatives.jsp',
`;

// Anchor on herd-cats-home (stable). Single-line anchors only.
patch('scripts/site-data.mjs',
  [`  '/guides/de/herd-cats-home-vs-alternatives.html',\n`, `  '/guides/de/herd-cats-home-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/herd-cats-home.html': '/games/herd-cats-home.html',\n`, `  '/herd-cats-home.html': '/games/herd-cats-home.html',\n  '/solo-battlefield.html': '/games/solo-battlefield.html',\n`],
  [`  '/guides/de/herd-cats-home-vs-alternatives.html': 'guide/de/herd-cats-home-vs-alternatives.jsp',\n`, `  '/guides/de/herd-cats-home-vs-alternatives.html': 'guide/de/herd-cats-home-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/herd-cats-home.html': 'games/herd-cats-home.jsp',\n`, `  '/games/herd-cats-home.html': 'games/herd-cats-home.jsp',\n  '/games/solo-battlefield.html': 'games/solo-battlefield.jsp',\n`],
);

{
  const p = join(PROD, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/solo-battlefield.html')) {
    console.log('already patched', p);
  } else {
    const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
    if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
    s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/solo-battlefield.html']`);
    writeFileSync(p, s, 'utf8');
    console.log('patched prod', p, '(tail was', m[0], ')');
  }
}

patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },`, `{ title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },\n    { title: "Solo Battlefield", url: "https://freetoolonline.com/games/solo-battlefield.html", include: !1, tags: "games" },`],
);

patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/herd-cats-home.html'>Herd Cats Home (Cat Herding)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/herd-cats-home.html'>Herd Cats Home (Cat Herding)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/solo-battlefield.html'>Solo Battlefield (Last-Alive Combat)</a>`],
);

{
  const p = join(PROD, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('solobattlefield')) {
    const idx = j.slugs.findIndex((s) => s > 'solobattlefield');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'solobattlefield');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('patched prod', p);
  } else {
    console.log('already enrolled', p);
  }
}

console.log('fire149 prod mirror files ready');
