#!/usr/bin/env node
/** fire150: mirror feast-night from staging worktree to prod */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STAGING = process.env.STAGING_REPO || join(__dirname, '..');
const PROD = process.env.PROD_REPO || '/tmp/fto-fire150-prod';

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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /feastnight/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /feast-night/i.test(r));

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
  join(STAGING, 'source/web/src/main/webapp/static/games/feast-night'),
  join(PROD, 'source/web/src/main/webapp/static/games/feast-night'),
);

const pics = readdirSync(join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'))
  .filter((n) => n.startsWith('feastnight__'));
for (const n of pics) {
  cpSync(
    join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
    join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
  );
}

for (const [srcRel, destDir] of [
  ['source/web/src/main/webapp/static/img/og/feastnight.png', 'source/web/src/main/webapp/static/img/og'],
  ['source/web/src/main/webapp/static/img/icon/feastnight-180.png', 'source/web/src/main/webapp/static/img/icon'],
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
  if (s.includes('/games/feast-night.html') && !file.includes('header-pictogram')) {
    console.log('already patched', file);
    return;
  }
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 80)}`);
    s = s.replace(from, to);
  }
  writeFileSync(p, s, 'utf8');
  console.log('patched prod', file);
}

const guideRoutes = `
  // game-discovery-loop-runbook fire150 (2026-07-18): feast-night companion guides
  '/guides/how-to-play-feast-night.html',
  '/guides/feast-night-when.html',
  '/guides/feast-night-vs-alternatives.html',
  '/guides/pt/how-to-play-feast-night.html',
  '/guides/pt/feast-night-when.html',
  '/guides/pt/feast-night-vs-alternatives.html',
  '/guides/es/how-to-play-feast-night.html',
  '/guides/es/feast-night-when.html',
  '/guides/es/feast-night-vs-alternatives.html',
  '/guides/vi/how-to-play-feast-night.html',
  '/guides/vi/feast-night-when.html',
  '/guides/vi/feast-night-vs-alternatives.html',
  '/guides/id/how-to-play-feast-night.html',
  '/guides/id/feast-night-when.html',
  '/guides/id/feast-night-vs-alternatives.html',
  '/guides/de/how-to-play-feast-night.html',
  '/guides/de/feast-night-when.html',
  '/guides/de/feast-night-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire150 (2026-07-18): feast-night companion guides
  '/guides/how-to-play-feast-night.html': 'guide/how-to-play-feast-night.jsp',
  '/guides/feast-night-when.html': 'guide/feast-night-when.jsp',
  '/guides/feast-night-vs-alternatives.html': 'guide/feast-night-vs-alternatives.jsp',
  '/guides/pt/how-to-play-feast-night.html': 'guide/pt/how-to-play-feast-night.jsp',
  '/guides/pt/feast-night-when.html': 'guide/pt/feast-night-when.jsp',
  '/guides/pt/feast-night-vs-alternatives.html': 'guide/pt/feast-night-vs-alternatives.jsp',
  '/guides/es/how-to-play-feast-night.html': 'guide/es/how-to-play-feast-night.jsp',
  '/guides/es/feast-night-when.html': 'guide/es/feast-night-when.jsp',
  '/guides/es/feast-night-vs-alternatives.html': 'guide/es/feast-night-vs-alternatives.jsp',
  '/guides/vi/how-to-play-feast-night.html': 'guide/vi/how-to-play-feast-night.jsp',
  '/guides/vi/feast-night-when.html': 'guide/vi/feast-night-when.jsp',
  '/guides/vi/feast-night-vs-alternatives.html': 'guide/vi/feast-night-vs-alternatives.jsp',
  '/guides/id/how-to-play-feast-night.html': 'guide/id/how-to-play-feast-night.jsp',
  '/guides/id/feast-night-when.html': 'guide/id/feast-night-when.jsp',
  '/guides/id/feast-night-vs-alternatives.html': 'guide/id/feast-night-vs-alternatives.jsp',
  '/guides/de/how-to-play-feast-night.html': 'guide/de/how-to-play-feast-night.jsp',
  '/guides/de/feast-night-when.html': 'guide/de/feast-night-when.jsp',
  '/guides/de/feast-night-vs-alternatives.html': 'guide/de/feast-night-vs-alternatives.jsp',
`;

// Prefer solo-battlefield anchors; fall back to herd-cats-home if prod lacks fire149.
{
  const site = readFileSync(join(PROD, 'scripts/site-data.mjs'), 'utf8');
  const hasSolo = site.includes("/games/solo-battlefield.html");
  if (hasSolo) {
    patch('scripts/site-data.mjs',
      [`  '/guides/de/solo-battlefield-vs-alternatives.html',\n`, `  '/guides/de/solo-battlefield-vs-alternatives.html',\n${guideRoutes}`],
      [`  '/solo-battlefield.html': '/games/solo-battlefield.html',\n`, `  '/solo-battlefield.html': '/games/solo-battlefield.html',\n  '/feast-night.html': '/games/feast-night.html',\n`],
      [`  '/guides/de/solo-battlefield-vs-alternatives.html': 'guide/de/solo-battlefield-vs-alternatives.jsp',\n`, `  '/guides/de/solo-battlefield-vs-alternatives.html': 'guide/de/solo-battlefield-vs-alternatives.jsp',\n${guideJsp}`],
      [`  '/games/solo-battlefield.html': 'games/solo-battlefield.jsp',\n`, `  '/games/solo-battlefield.html': 'games/solo-battlefield.jsp',\n  '/games/feast-night.html': 'games/feast-night.jsp',\n`],
    );
    patch('source/web/src/main/webapp/static/script/related-tools.js',
      [`{ title: "Solo Battlefield", url: "https://freetoolonline.com/games/solo-battlefield.html", include: !1, tags: "games" },`, `{ title: "Solo Battlefield", url: "https://freetoolonline.com/games/solo-battlefield.html", include: !1, tags: "games" },\n    { title: "Feast Night", url: "https://freetoolonline.com/games/feast-night.html", include: !1, tags: "games" },`],
    );
    patch('source/static/src/main/webapp/resources/view/l-menu.html',
      [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/solo-battlefield.html'>Solo Battlefield (Last-Alive Combat)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/solo-battlefield.html'>Solo Battlefield (Last-Alive Combat)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/feast-night.html'>Feast Night (Medieval Soul FPS)</a>`],
    );
  } else {
    throw new Error('prod missing solo-battlefield anchors - refresh prod tip first');
  }
}

{
  const p = join(PROD, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/feast-night.html')) {
    console.log('already patched', p);
  } else {
    const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
    if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
    s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/feast-night.html']`);
    writeFileSync(p, s, 'utf8');
    console.log('patched prod', p, '(tail was', m[0], ')');
  }
}

{
  const p = join(PROD, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('feastnight')) {
    const idx = j.slugs.findIndex((s) => s > 'feastnight');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'feastnight');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('patched prod', p);
  } else {
    console.log('already enrolled', p);
  }
}

console.log('fire150 prod mirror files ready');
