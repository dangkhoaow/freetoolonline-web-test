#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'space-grid-puzzle';
const cms = 'spacegridpuzzle';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~39 KB';

const locales = {
  en: { prefix: '', label: 'EN' },
  pt: { prefix: 'pt', label: 'PT' },
  es: { prefix: 'es', label: 'ES' },
  vi: { prefix: 'vi', label: 'VI' },
  id: { prefix: 'id', label: 'ID' },
  de: { prefix: 'de', label: 'DE' },
};

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

const jsp = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page customStyle='\${pageStyle}' browserTitle='\${pageBodyTitle}' keyword='\${pageBodyKeyword}' description='\${pageBodyDesc}'>
\t<freetoolonline:loading/>
\t\${pageBodyHTML}
\t<freetoolonline:welcome welcomeTest='\${pageBodyWelcome}'/>
\t<freetoolonline:share-btns></freetoolonline:share-btns>
\t\${pageBodyJS}
</freetoolonline:page>
`;

w(join(CMS, `BODYTITLE${cms}.txt`), `Space Grid Puzzle - Free Online Space Puzzle Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Space Grid Puzzle free in the browser: tap grid squares, clear neutron stars, and solve space-themed levels. ${payload} canvas puzzle from js13k 2021, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `space grid puzzle, browser puzzle game, space puzzle online, js13k puzzle game`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>A space-themed grid puzzle in the browser tab: tap squares to interact, swipe left to skip a level, swipe right to reset or revisit earlier puzzles.</p>
</div>
<div id="sgpWrapper" class="w3-container" style="background:#0E181B; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="sgpStage" style="position:relative; width:100%; min-height:560px; background:#0E181B; border-radius:6px; overflow:hidden;">
            <div id="sgpLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e8f4ff; padding:16px;">
                <div style="font:700 22px sans-serif; letter-spacing:1px;">SPACE GRID PUZZLE</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">Canvas grid puzzle with black holes and neutron stars. Press Play to load about ${payload}.</p>
                <button id="sgpPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="sgpStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="sgpFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#aaccee; margin-left:8px;">Tap squares inside the frame; swipe left to skip, swipe right to reset.</span>
    </div>
    <style>#sgpStage:fullscreen { border-radius:0; } #sgpStage iframe { display:block; width:100%; height:620px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Space Grid Puzzle</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T08:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a space grid puzzle loads in the tab. Tap squares to clear the board, then swipe to move between levels.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Tap</td><td>Click or tap a square to interact with that cell</td></tr>
<tr><td>Skip</td><td>Swipe left to skip the current puzzle</td></tr>
<tr><td>Reset</td><td>Swipe right to reset or return to earlier levels</td></tr>
<tr><td>Saves</td><td>Progress persists in namespaced localStorage on this device</td></tr>
</table>
<p>Adapted from Quinten/black-hole-square (MIT, js13k 2021). Single-file canvas bundle, zero CDN after load.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var SGP_GAME_URL = 'space-grid-puzzle/index.html';
    function sgpStatus(t){ var el=document.getElementById('sgpStatus'); if(el) el.textContent=t; }
    function sgpInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='sgpFrame'; frame.src=SGP_GAME_URL; frame.title='Space Grid Puzzle';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ sgpStatus('Loaded. Tap squares inside the frame; swipe left to skip a level.'); });
        var launch=document.getElementById('sgpLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('sgpStage'), playBtn=document.getElementById('sgpPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('sgpFullscreenBtn');
        playBtn.addEventListener('click',function(){
            sgpStatus('Loading about ${payload}...'); sgpInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>Does Space Grid Puzzle save progress?</summary><p>Yes. Saves use namespaced localStorage ftol:spacegridpuzzle keys on this device.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} in a single inlined index.html canvas bundle.</p></details>
<details class="faq-item"><summary>How do I control the game?</summary><p>Tap squares to interact. Swipe left to skip a puzzle; swipe right to reset or revisit earlier levels.</p></details>`);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Space Grid Puzzle - Step by Step`,
    descEn: `Launch Space Grid Puzzle, tap grid squares, and swipe between levels.`,
    leadEn: `<b>Click Play, tap squares on the canvas grid, then swipe left to skip or swipe right to reset when a level stalls.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to load the iframe bundle.</p><h2><b>Tap squares</b></h2><p>Each tap affects the selected cell - clear neutron stars and black holes from the grid.</p><h2><b>Swipe left</b></h2><p>Skip the current puzzle when you want to try the next level.</p><h2><b>Swipe right</b></h2><p>Reset the active puzzle or return to earlier levels.</p><h2><b>Saves</b></h2><p>Progress is stored in namespaced localStorage on this browser.</p>`,
    titlePt: `Como jogar Space Grid Puzzle`,
    titleEs: `Como jugar Space Grid Puzzle`,
    titleVi: `Cach choi Space Grid Puzzle`,
    titleId: `Cara main Space Grid Puzzle`,
    titleDe: `Space Grid Puzzle spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Space Grid Puzzle`,
    descEn: `Short puzzle sessions fit players who want a compact space-themed grid challenge in the browser.`,
    leadEn: `<b>Best for 5-15 minute puzzle breaks when you want a ${payload} canvas game instead of a long incremental or racer session.</b>`,
    bodyEn: `<h2><b>Quick sessions</b></h2><p>Levels are bite-sized grid puzzles you can finish in a few minutes.</p><h2><b>Touch or mouse</b></h2><p>Tap on mobile; click on desktop. Swipe gestures work on touch screens.</p><h2><b>Low payload</b></h2><p>About ${payload} loads once behind the Play button.</p>`,
    titlePt: `Quando jogar Space Grid Puzzle`,
    titleEs: `Cuando jugar Space Grid Puzzle`,
    titleVi: `Khi nao choi Space Grid Puzzle`,
    titleId: `Kapan main Space Grid Puzzle`,
    titleDe: `Wann Space Grid Puzzle spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Space Grid Puzzle vs Other Browser Games`,
    descEn: `Compare payload and genre against other free puzzle and arcade games on this site.`,
    leadEn: `<b>Space Grid Puzzle is a ${payload} single-file canvas grid puzzle, not a factory incremental or 3D visualizer.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Space Grid Puzzle</td><td>${payload}</td><td>Tap-and-swipe grid puzzle with space theme</td></tr><tr><td>Schematic Factory Line</td><td>~456 KB</td><td>Six-tier factory incremental</td></tr><tr><td>Neon Cat Chase</td><td>~13 KB</td><td>js13k arcade chase</td></tr></table><p>Pick Space Grid Puzzle for compact grid logic puzzles with swipe navigation.</p>`,
    titlePt: `Space Grid Puzzle vs outros jogos`,
    titleEs: `Space Grid Puzzle vs otros juegos`,
    titleVi: `Space Grid Puzzle so voi game khac`,
    titleId: `Space Grid Puzzle vs game lain`,
    titleDe: `Space Grid Puzzle vs andere Spiele`,
  },
];

for (const g of guides) {
  for (const [lang, meta] of Object.entries(locales)) {
    const cmsKey = meta.prefix
      ? `guides${meta.prefix}${g.kebab.replace(/-/g, '')}`
      : `guides${g.kebab.replace(/-/g, '')}`;
    const title =
      lang === 'en' ? g.titleEn :
      lang === 'pt' ? g.titlePt :
      lang === 'es' ? g.titleEs :
      lang === 'vi' ? g.titleVi :
      lang === 'id' ? g.titleId : g.titleDe;
    w(join(CMS, `BODYTITLE${cmsKey}.txt`), title);
    w(join(CMS, `BODYDESC${cmsKey}.txt`), g.descEn);
    w(
      join(CMS, `BODYHTML${cmsKey}.html`),
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Space Grid Puzzle</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

function patchSiteData() {
  const path = join(ROOT, 'scripts/site-data.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/space-grid-puzzle.html')) return;
  const guideBlock = `
  // fire101 space-grid-puzzle
  '/guides/how-to-play-space-grid-puzzle.html',
  '/guides/pt/how-to-play-space-grid-puzzle.html',
  '/guides/es/how-to-play-space-grid-puzzle.html',
  '/guides/vi/how-to-play-space-grid-puzzle.html',
  '/guides/id/how-to-play-space-grid-puzzle.html',
  '/guides/de/how-to-play-space-grid-puzzle.html',
  '/guides/space-grid-puzzle-when.html',
  '/guides/pt/space-grid-puzzle-when.html',
  '/guides/es/space-grid-puzzle-when.html',
  '/guides/vi/space-grid-puzzle-when.html',
  '/guides/id/space-grid-puzzle-when.html',
  '/guides/de/space-grid-puzzle-when.html',
  '/guides/space-grid-puzzle-vs-alternatives.html',
  '/guides/pt/space-grid-puzzle-vs-alternatives.html',
  '/guides/es/space-grid-puzzle-vs-alternatives.html',
  '/guides/vi/space-grid-puzzle-vs-alternatives.html',
  '/guides/id/space-grid-puzzle-vs-alternatives.html',
  '/guides/de/space-grid-puzzle-vs-alternatives.html',`;
  text = text.replace(
    "  '/guides/de/schematic-factory-game-vs-alternatives.html',",
    `  '/guides/de/schematic-factory-game-vs-alternatives.html',${guideBlock}`,
  );
  text = text.replace(
    "  '/schematic-factory-game.html': '/games/schematic-factory-game.html',",
    `  '/schematic-factory-game.html': '/games/schematic-factory-game.html',
  '/space-grid-puzzle.html': '/games/space-grid-puzzle.html',`,
  );
  const jspBlock = `
  // fire101 space-grid-puzzle guides
  '/guides/how-to-play-space-grid-puzzle.html': 'guide/how-to-play-space-grid-puzzle.jsp',
  '/guides/pt/how-to-play-space-grid-puzzle.html': 'guide/pt/how-to-play-space-grid-puzzle.jsp',
  '/guides/es/how-to-play-space-grid-puzzle.html': 'guide/es/how-to-play-space-grid-puzzle.jsp',
  '/guides/vi/how-to-play-space-grid-puzzle.html': 'guide/vi/how-to-play-space-grid-puzzle.jsp',
  '/guides/id/how-to-play-space-grid-puzzle.html': 'guide/id/how-to-play-space-grid-puzzle.jsp',
  '/guides/de/how-to-play-space-grid-puzzle.html': 'guide/de/how-to-play-space-grid-puzzle.jsp',
  '/guides/space-grid-puzzle-when.html': 'guide/space-grid-puzzle-when.jsp',
  '/guides/pt/space-grid-puzzle-when.html': 'guide/pt/space-grid-puzzle-when.jsp',
  '/guides/es/space-grid-puzzle-when.html': 'guide/es/space-grid-puzzle-when.jsp',
  '/guides/vi/space-grid-puzzle-when.html': 'guide/vi/space-grid-puzzle-when.jsp',
  '/guides/id/space-grid-puzzle-when.html': 'guide/id/space-grid-puzzle-when.jsp',
  '/guides/de/space-grid-puzzle-when.html': 'guide/de/space-grid-puzzle-when.jsp',
  '/guides/space-grid-puzzle-vs-alternatives.html': 'guide/space-grid-puzzle-vs-alternatives.jsp',
  '/guides/pt/space-grid-puzzle-vs-alternatives.html': 'guide/pt/space-grid-puzzle-vs-alternatives.jsp',
  '/guides/es/space-grid-puzzle-vs-alternatives.html': 'guide/es/space-grid-puzzle-vs-alternatives.jsp',
  '/guides/vi/space-grid-puzzle-vs-alternatives.html': 'guide/vi/space-grid-puzzle-vs-alternatives.jsp',
  '/guides/id/space-grid-puzzle-vs-alternatives.html': 'guide/id/space-grid-puzzle-vs-alternatives.jsp',
  '/guides/de/space-grid-puzzle-vs-alternatives.html': 'guide/de/space-grid-puzzle-vs-alternatives.jsp',
  '/games/space-grid-puzzle.html': 'games/space-grid-puzzle.jsp',`;
  text = text.replace(
    "  '/games/schematic-factory-game.html': 'games/schematic-factory-game.jsp',",
    `  '/games/schematic-factory-game.html': 'games/schematic-factory-game.jsp',${jspBlock}`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchSeoClusters() {
  const path = join(ROOT, 'scripts/seo-clusters.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/space-grid-puzzle.html')) return;
  text = text.replace(
    "'/games/schematic-factory-game.html'",
    "'/games/schematic-factory-game.html', '/games/space-grid-puzzle.html'",
  );
  writeFileSync(path, text, 'utf8');
}

function patchMenu() {
  const path = join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
  let text = readFileSync(path, 'utf8');
  if (text.includes('space-grid-puzzle.html')) return;
  text = text.replace(
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/schematic-factory-game.html'>Schematic Factory Line</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/schematic-factory-game.html'>Schematic Factory Line</a>
                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/space-grid-puzzle.html'>Space Grid Puzzle</a>`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchRelated() {
  const path = join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
  let text = readFileSync(path, 'utf8');
  if (text.includes('space-grid-puzzle.html')) return;
  text = text.replace(
    `{ title: "Schematic Factory Line", url: "https://freetoolonline.com/games/schematic-factory-game.html", include: !1, tags: "games" },`,
    `{ title: "Schematic Factory Line", url: "https://freetoolonline.com/games/schematic-factory-game.html", include: !1, tags: "games" },
    { title: "Space Grid Puzzle", url: "https://freetoolonline.com/games/space-grid-puzzle.html", include: !1, tags: "games" },`,
  );
  writeFileSync(path, text, 'utf8');
}

patchSiteData();
patchSeoClusters();
patchMenu();
patchRelated();

console.log('Generated CMS + JSP + route patches for', slug);
