#!/usr/bin/env node
/** fire151: mirror rune-keeper from staging worktree to prod */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STAGING = process.env.STAGING_REPO || join(__dirname, '..');
const PROD = process.env.PROD_REPO || '/tmp/fto-fire151-prod';

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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /runekeeper/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /rune-keeper/i.test(r));

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
  join(STAGING, 'source/web/src/main/webapp/static/games/rune-keeper'),
  join(PROD, 'source/web/src/main/webapp/static/games/rune-keeper'),
);

const pics = readdirSync(join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'))
  .filter((n) => n.startsWith('runekeeper__'));
for (const n of pics) {
  cpSync(
    join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
    join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
  );
}

for (const [srcRel, destDir] of [
  ['source/web/src/main/webapp/static/img/og/runekeeper.png', 'source/web/src/main/webapp/static/img/og'],
  ['source/web/src/main/webapp/static/img/icon/runekeeper-180.png', 'source/web/src/main/webapp/static/img/icon'],
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
  if (s.includes('/games/rune-keeper.html') && !file.includes('header-pictogram')) {
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
  // game-discovery-loop-runbook fire151 (2026-07-19): rune-keeper companion guides
  '/guides/how-to-play-rune-keeper.html',
  '/guides/rune-keeper-when.html',
  '/guides/rune-keeper-vs-alternatives.html',
  '/guides/pt/how-to-play-rune-keeper.html',
  '/guides/pt/rune-keeper-when.html',
  '/guides/pt/rune-keeper-vs-alternatives.html',
  '/guides/es/how-to-play-rune-keeper.html',
  '/guides/es/rune-keeper-when.html',
  '/guides/es/rune-keeper-vs-alternatives.html',
  '/guides/vi/how-to-play-rune-keeper.html',
  '/guides/vi/rune-keeper-when.html',
  '/guides/vi/rune-keeper-vs-alternatives.html',
  '/guides/id/how-to-play-rune-keeper.html',
  '/guides/id/rune-keeper-when.html',
  '/guides/id/rune-keeper-vs-alternatives.html',
  '/guides/de/how-to-play-rune-keeper.html',
  '/guides/de/rune-keeper-when.html',
  '/guides/de/rune-keeper-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire151 (2026-07-19): rune-keeper companion guides
  '/guides/how-to-play-rune-keeper.html': 'guide/how-to-play-rune-keeper.jsp',
  '/guides/rune-keeper-when.html': 'guide/rune-keeper-when.jsp',
  '/guides/rune-keeper-vs-alternatives.html': 'guide/rune-keeper-vs-alternatives.jsp',
  '/guides/pt/how-to-play-rune-keeper.html': 'guide/pt/how-to-play-rune-keeper.jsp',
  '/guides/pt/rune-keeper-when.html': 'guide/pt/rune-keeper-when.jsp',
  '/guides/pt/rune-keeper-vs-alternatives.html': 'guide/pt/rune-keeper-vs-alternatives.jsp',
  '/guides/es/how-to-play-rune-keeper.html': 'guide/es/how-to-play-rune-keeper.jsp',
  '/guides/es/rune-keeper-when.html': 'guide/es/rune-keeper-when.jsp',
  '/guides/es/rune-keeper-vs-alternatives.html': 'guide/es/rune-keeper-vs-alternatives.jsp',
  '/guides/vi/how-to-play-rune-keeper.html': 'guide/vi/how-to-play-rune-keeper.jsp',
  '/guides/vi/rune-keeper-when.html': 'guide/vi/rune-keeper-when.jsp',
  '/guides/vi/rune-keeper-vs-alternatives.html': 'guide/vi/rune-keeper-vs-alternatives.jsp',
  '/guides/id/how-to-play-rune-keeper.html': 'guide/id/how-to-play-rune-keeper.jsp',
  '/guides/id/rune-keeper-when.html': 'guide/id/rune-keeper-when.jsp',
  '/guides/id/rune-keeper-vs-alternatives.html': 'guide/id/rune-keeper-vs-alternatives.jsp',
  '/guides/de/how-to-play-rune-keeper.html': 'guide/de/how-to-play-rune-keeper.jsp',
  '/guides/de/rune-keeper-when.html': 'guide/de/rune-keeper-when.jsp',
  '/guides/de/rune-keeper-vs-alternatives.html': 'guide/de/rune-keeper-vs-alternatives.jsp',
`;

{
  const site = readFileSync(join(PROD, 'scripts/site-data.mjs'), 'utf8');
  if (!site.includes('/games/feast-night.html')) throw new Error('prod missing feast-night anchors');
  patch('scripts/site-data.mjs',
    [`  '/guides/de/feast-night-vs-alternatives.html',\n`, `  '/guides/de/feast-night-vs-alternatives.html',\n${guideRoutes}`],
    [`  '/feast-night.html': '/games/feast-night.html',\n`, `  '/feast-night.html': '/games/feast-night.html',\n  '/rune-keeper.html': '/games/rune-keeper.html',\n`],
    [`  '/guides/de/feast-night-vs-alternatives.html': 'guide/de/feast-night-vs-alternatives.jsp',\n`, `  '/guides/de/feast-night-vs-alternatives.html': 'guide/de/feast-night-vs-alternatives.jsp',\n${guideJsp}`],
    [`  '/games/feast-night.html': 'games/feast-night.jsp',\n`, `  '/games/feast-night.html': 'games/feast-night.jsp',\n  '/games/rune-keeper.html': 'games/rune-keeper.jsp',\n`],
  );
  patch('source/web/src/main/webapp/static/script/related-tools.js',
    [`{ title: "Feast Night", url: "https://freetoolonline.com/games/feast-night.html", include: !1, tags: "games" },`, `{ title: "Feast Night", url: "https://freetoolonline.com/games/feast-night.html", include: !1, tags: "games" },\n    { title: "Rune Keeper", url: "https://freetoolonline.com/games/rune-keeper.html", include: !1, tags: "games" },`],
  );
  patch('source/static/src/main/webapp/resources/view/l-menu.html',
    [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/feast-night.html'>Feast Night (Medieval Soul FPS)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/feast-night.html'>Feast Night (Medieval Soul FPS)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/rune-keeper.html'>Rune Keeper (Draw-to-Move Arena)</a>`],
  );
}

{
  const p = join(PROD, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/rune-keeper.html')) {
    console.log('already patched', p);
  } else {
    const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
    if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
    s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/rune-keeper.html']`);
    writeFileSync(p, s, 'utf8');
    console.log('patched prod', p, '(tail was', m[0], ')');
  }
}

{
  const p = join(PROD, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('runekeeper')) {
    const idx = j.slugs.findIndex((s) => s > 'runekeeper');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'runekeeper');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('patched prod', p);
  } else {
    console.log('already enrolled', p);
  }
}

console.log('fire151 prod mirror files ready');
