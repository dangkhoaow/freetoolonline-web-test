#!/usr/bin/env node
/** fire157: mirror thirteen-case-files from staging worktree to prod */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STAGING = process.env.STAGING_REPO || join(__dirname, '..');
const PROD = process.env.PROD_REPO || '/tmp/fto-fire157-prod';

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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /thirteencasefiles/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /thirteen-case-files/i.test(r));

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
  join(STAGING, 'source/web/src/main/webapp/static/games/thirteen-case-files'),
  join(PROD, 'source/web/src/main/webapp/static/games/thirteen-case-files'),
);

const pics = readdirSync(join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'))
  .filter((n) => n.startsWith('thirteencasefiles__'));
for (const n of pics) {
  cpSync(
    join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
    join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
  );
}

for (const [srcRel, destDir] of [
  ['source/web/src/main/webapp/static/img/og/thirteencasefiles.png', 'source/web/src/main/webapp/static/img/og'],
  ['source/web/src/main/webapp/static/img/icon/thirteencasefiles-180.png', 'source/web/src/main/webapp/static/img/icon'],
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
  if (s.includes('/games/thirteen-case-files.html') && !file.includes('header-pictogram')) {
    console.log('already patched', file);
    return;
  }
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 120)}`);
    s = s.replace(from, to);
  }
  writeFileSync(p, s, 'utf8');
  console.log('patched prod', file);
}

const guideRoutes = `
  // game-discovery-loop-runbook fire157 (2026-07-20): thirteencasefiles companion guides
  '/guides/how-to-play-thirteen-case-files.html',
  '/guides/thirteen-case-files-when.html',
  '/guides/thirteen-case-files-vs-alternatives.html',
  '/guides/pt/how-to-play-thirteen-case-files.html',
  '/guides/pt/thirteen-case-files-when.html',
  '/guides/pt/thirteen-case-files-vs-alternatives.html',
  '/guides/es/how-to-play-thirteen-case-files.html',
  '/guides/es/thirteen-case-files-when.html',
  '/guides/es/thirteen-case-files-vs-alternatives.html',
  '/guides/vi/how-to-play-thirteen-case-files.html',
  '/guides/vi/thirteen-case-files-when.html',
  '/guides/vi/thirteen-case-files-vs-alternatives.html',
  '/guides/id/how-to-play-thirteen-case-files.html',
  '/guides/id/thirteen-case-files-when.html',
  '/guides/id/thirteen-case-files-vs-alternatives.html',
  '/guides/de/how-to-play-thirteen-case-files.html',
  '/guides/de/thirteen-case-files-when.html',
  '/guides/de/thirteen-case-files-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire157 (2026-07-20): thirteencasefiles companion guides
  '/guides/how-to-play-thirteen-case-files.html': 'guide/how-to-play-thirteen-case-files.jsp',
  '/guides/thirteen-case-files-when.html': 'guide/thirteen-case-files-when.jsp',
  '/guides/thirteen-case-files-vs-alternatives.html': 'guide/thirteen-case-files-vs-alternatives.jsp',
  '/guides/pt/how-to-play-thirteen-case-files.html': 'guide/pt/how-to-play-thirteen-case-files.jsp',
  '/guides/pt/thirteen-case-files-when.html': 'guide/pt/thirteen-case-files-when.jsp',
  '/guides/pt/thirteen-case-files-vs-alternatives.html': 'guide/pt/thirteen-case-files-vs-alternatives.jsp',
  '/guides/es/how-to-play-thirteen-case-files.html': 'guide/es/how-to-play-thirteen-case-files.jsp',
  '/guides/es/thirteen-case-files-when.html': 'guide/es/thirteen-case-files-when.jsp',
  '/guides/es/thirteen-case-files-vs-alternatives.html': 'guide/es/thirteen-case-files-vs-alternatives.jsp',
  '/guides/vi/how-to-play-thirteen-case-files.html': 'guide/vi/how-to-play-thirteen-case-files.jsp',
  '/guides/vi/thirteen-case-files-when.html': 'guide/vi/thirteen-case-files-when.jsp',
  '/guides/vi/thirteen-case-files-vs-alternatives.html': 'guide/vi/thirteen-case-files-vs-alternatives.jsp',
  '/guides/id/how-to-play-thirteen-case-files.html': 'guide/id/how-to-play-thirteen-case-files.jsp',
  '/guides/id/thirteen-case-files-when.html': 'guide/id/thirteen-case-files-when.jsp',
  '/guides/id/thirteen-case-files-vs-alternatives.html': 'guide/id/thirteen-case-files-vs-alternatives.jsp',
  '/guides/de/how-to-play-thirteen-case-files.html': 'guide/de/how-to-play-thirteen-case-files.jsp',
  '/guides/de/thirteen-case-files-when.html': 'guide/de/thirteen-case-files-when.jsp',
  '/guides/de/thirteen-case-files-vs-alternatives.html': 'guide/de/thirteen-case-files-vs-alternatives.jsp',
`;

{
  const site = readFileSync(join(PROD, 'scripts/site-data.mjs'), 'utf8');
  if (!site.includes('/games/roller-maze-escape.html')) throw new Error('prod missing rollermaze anchors');
  patch('scripts/site-data.mjs',
    [`  '/guides/de/roller-maze-escape-vs-alternatives.html',\n`, `  '/guides/de/roller-maze-escape-vs-alternatives.html',\n${guideRoutes}`],
    [`  '/roller-maze-escape.html': '/games/roller-maze-escape.html',\n`, `  '/roller-maze-escape.html': '/games/roller-maze-escape.html',\n  '/thirteen-case-files.html': '/games/thirteen-case-files.html',\n`],
    [`  '/guides/de/roller-maze-escape-vs-alternatives.html': 'guide/de/roller-maze-escape-vs-alternatives.jsp',\n`, `  '/guides/de/roller-maze-escape-vs-alternatives.html': 'guide/de/roller-maze-escape-vs-alternatives.jsp',\n${guideJsp}`],
    [`  '/games/roller-maze-escape.html': 'games/roller-maze-escape.jsp',\n`, `  '/games/roller-maze-escape.html': 'games/roller-maze-escape.jsp',\n  '/games/thirteen-case-files.html': 'games/thirteen-case-files.jsp',\n`],
  );
  patch('source/web/src/main/webapp/static/script/related-tools.js',
    [`{ title: "Rollermaze", url: "https://freetoolonline.com/games/roller-maze-escape.html", include: !1, tags: "games" },`, `{ title: "Rollermaze", url: "https://freetoolonline.com/games/roller-maze-escape.html", include: !1, tags: "games" },\n    { title: "Thirteen Case Files", url: "https://freetoolonline.com/games/thirteen-case-files.html", include: !1, tags: "games" },`],
  );
  patch('source/static/src/main/webapp/resources/view/l-menu.html',
    [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/roller-maze-escape.html'>Rollermaze (Maze Escape)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/roller-maze-escape.html'>Rollermaze (Maze Escape)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/thirteen-case-files.html'>Thirteen Case Files (Detective Puzzle)</a>`],
  );
}

{
  const p = join(PROD, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/thirteen-case-files.html')) {
    console.log('already patched', p);
  } else {
    const needle = "'/games/roller-maze-escape.html']";
    if (!s.includes(needle)) {
      const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
      if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
      s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/thirteen-case-files.html']`);
    } else {
      s = s.replace(needle, "'/games/roller-maze-escape.html', '/games/thirteen-case-files.html']");
    }
    writeFileSync(p, s, 'utf8');
    console.log('patched prod', p);
  }
}

{
  const p = join(PROD, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('thirteencasefiles')) {
    const idx = j.slugs.findIndex((s) => s > 'thirteencasefiles');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'thirteencasefiles');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('patched prod', p);
  } else {
    console.log('already enrolled', p);
  }
}

console.log('fire157 prod mirror files ready');
