#!/usr/bin/env node
/** fire156: mirror rollermaze from staging worktree to prod */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STAGING = process.env.STAGING_REPO || join(__dirname, '..');
const PROD = process.env.PROD_REPO || '/tmp/fto-fire156-prod';

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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /rollermaze/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /roller-maze-escape/i.test(r));

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
  join(STAGING, 'source/web/src/main/webapp/static/games/roller-maze-escape'),
  join(PROD, 'source/web/src/main/webapp/static/games/roller-maze-escape'),
);

const pics = readdirSync(join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'))
  .filter((n) => n.startsWith('rollermazeescape__'));
for (const n of pics) {
  cpSync(
    join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
    join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram', n),
  );
}

for (const [srcRel, destDir] of [
  ['source/web/src/main/webapp/static/img/og/rollermazeescape.png', 'source/web/src/main/webapp/static/img/og'],
  ['source/web/src/main/webapp/static/img/icon/rollermazeescape-180.png', 'source/web/src/main/webapp/static/img/icon'],
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
  if (s.includes('/games/roller-maze-escape.html') && !file.includes('header-pictogram')) {
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
  // game-discovery-loop-runbook fire156 (2026-07-20): rollermaze companion guides
  '/guides/how-to-play-roller-maze-escape.html',
  '/guides/roller-maze-escape-when.html',
  '/guides/roller-maze-escape-vs-alternatives.html',
  '/guides/pt/how-to-play-roller-maze-escape.html',
  '/guides/pt/roller-maze-escape-when.html',
  '/guides/pt/roller-maze-escape-vs-alternatives.html',
  '/guides/es/how-to-play-roller-maze-escape.html',
  '/guides/es/roller-maze-escape-when.html',
  '/guides/es/roller-maze-escape-vs-alternatives.html',
  '/guides/vi/how-to-play-roller-maze-escape.html',
  '/guides/vi/roller-maze-escape-when.html',
  '/guides/vi/roller-maze-escape-vs-alternatives.html',
  '/guides/id/how-to-play-roller-maze-escape.html',
  '/guides/id/roller-maze-escape-when.html',
  '/guides/id/roller-maze-escape-vs-alternatives.html',
  '/guides/de/how-to-play-roller-maze-escape.html',
  '/guides/de/roller-maze-escape-when.html',
  '/guides/de/roller-maze-escape-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire156 (2026-07-20): rollermaze companion guides
  '/guides/how-to-play-roller-maze-escape.html': 'guide/how-to-play-roller-maze-escape.jsp',
  '/guides/roller-maze-escape-when.html': 'guide/roller-maze-escape-when.jsp',
  '/guides/roller-maze-escape-vs-alternatives.html': 'guide/roller-maze-escape-vs-alternatives.jsp',
  '/guides/pt/how-to-play-roller-maze-escape.html': 'guide/pt/how-to-play-roller-maze-escape.jsp',
  '/guides/pt/roller-maze-escape-when.html': 'guide/pt/roller-maze-escape-when.jsp',
  '/guides/pt/roller-maze-escape-vs-alternatives.html': 'guide/pt/roller-maze-escape-vs-alternatives.jsp',
  '/guides/es/how-to-play-roller-maze-escape.html': 'guide/es/how-to-play-roller-maze-escape.jsp',
  '/guides/es/roller-maze-escape-when.html': 'guide/es/roller-maze-escape-when.jsp',
  '/guides/es/roller-maze-escape-vs-alternatives.html': 'guide/es/roller-maze-escape-vs-alternatives.jsp',
  '/guides/vi/how-to-play-roller-maze-escape.html': 'guide/vi/how-to-play-roller-maze-escape.jsp',
  '/guides/vi/roller-maze-escape-when.html': 'guide/vi/roller-maze-escape-when.jsp',
  '/guides/vi/roller-maze-escape-vs-alternatives.html': 'guide/vi/roller-maze-escape-vs-alternatives.jsp',
  '/guides/id/how-to-play-roller-maze-escape.html': 'guide/id/how-to-play-roller-maze-escape.jsp',
  '/guides/id/roller-maze-escape-when.html': 'guide/id/roller-maze-escape-when.jsp',
  '/guides/id/roller-maze-escape-vs-alternatives.html': 'guide/id/roller-maze-escape-vs-alternatives.jsp',
  '/guides/de/how-to-play-roller-maze-escape.html': 'guide/de/how-to-play-roller-maze-escape.jsp',
  '/guides/de/roller-maze-escape-when.html': 'guide/de/roller-maze-escape-when.jsp',
  '/guides/de/roller-maze-escape-vs-alternatives.html': 'guide/de/roller-maze-escape-vs-alternatives.jsp',
`;

{
  const site = readFileSync(join(PROD, 'scripts/site-data.mjs'), 'utf8');
  if (!site.includes('/games/quantum-shift.html')) throw new Error('prod missing quantum-shift anchors');
  patch('scripts/site-data.mjs',
    [`  '/guides/de/quantum-shift-vs-alternatives.html',\n`, `  '/guides/de/quantum-shift-vs-alternatives.html',\n${guideRoutes}`],
    [`  '/quantum-shift.html': '/games/quantum-shift.html',\n`, `  '/quantum-shift.html': '/games/quantum-shift.html',\n  '/roller-maze-escape.html': '/games/roller-maze-escape.html',\n`],
    [`  '/guides/de/quantum-shift-vs-alternatives.html': 'guide/de/quantum-shift-vs-alternatives.jsp',\n`, `  '/guides/de/quantum-shift-vs-alternatives.html': 'guide/de/quantum-shift-vs-alternatives.jsp',\n${guideJsp}`],
    [`  '/games/quantum-shift.html': 'games/quantum-shift.jsp',\n`, `  '/games/quantum-shift.html': 'games/quantum-shift.jsp',\n  '/games/roller-maze-escape.html': 'games/roller-maze-escape.jsp',\n`],
  );
  patch('source/web/src/main/webapp/static/script/related-tools.js',
    [`{ title: "Quantum Shift", url: "https://freetoolonline.com/games/quantum-shift.html", include: !1, tags: "games" },`, `{ title: "Quantum Shift", url: "https://freetoolonline.com/games/quantum-shift.html", include: !1, tags: "games" },\n    { title: "Rollermaze", url: "https://freetoolonline.com/games/roller-maze-escape.html", include: !1, tags: "games" },`],
  );
  patch('source/static/src/main/webapp/resources/view/l-menu.html',
    [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/quantum-shift.html'>Quantum Shift (Particle Puzzle)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/quantum-shift.html'>Quantum Shift (Particle Puzzle)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/roller-maze-escape.html'>Rollermaze (Maze Escape)</a>`],
  );
}

{
  const p = join(PROD, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/roller-maze-escape.html')) {
    console.log('already patched', p);
  } else {
    const needle = "'/games/quantum-shift.html']";
    if (!s.includes(needle)) {
      const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
      if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
      s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/roller-maze-escape.html']`);
    } else {
      s = s.replace(needle, "'/games/quantum-shift.html', '/games/roller-maze-escape.html']");
    }
    writeFileSync(p, s, 'utf8');
    console.log('patched prod', p);
  }
}

{
  const p = join(PROD, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('rollermazeescape')) {
    const idx = j.slugs.findIndex((s) => s > 'rollermazeescape');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'rollermazeescape');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('patched prod', p);
  } else {
    console.log('already enrolled', p);
  }
}

console.log('fire156 prod mirror files ready');
