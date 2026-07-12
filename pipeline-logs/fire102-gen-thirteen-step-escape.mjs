#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'thirteen-step-escape';
const cms = 'thirteenstepescape';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~16 KB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Thirteen Step Escape - Free Online Pixel Puzzle Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Thirteen Step Escape free in the browser: push crates, grab keys, and reach the flag in only 13 steps per level. ${payload} pixel puzzle from js13k 2024, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `thirteen step escape, step limit puzzle game, pixel puzzle browser, crate puzzle online`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>A pixel-art puzzle where every level must be solved in 13 steps or actions: push crates, open locks, trigger switches, and reach the flag before the counter runs out.</p>
</div>
<div id="tseWrapper" class="w3-container" style="background:#111; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="tseStage" style="position:relative; width:100%; min-height:560px; background:#000; border-radius:6px; overflow:hidden;">
            <div id="tseLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e8f4ff; padding:16px;">
                <div style="font:700 22px sans-serif; letter-spacing:1px;">THIRTEEN STEP ESCAPE</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">Pixel puzzle with a hard 13-action limit per level. Press Play to load about ${payload}.</p>
                <button id="tsePlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="tseStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="tseFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#aaccee; margin-left:8px;">WASD or arrows to move; E to undo; R to restart a stuck level.</span>
    </div>
    <style>#tseStage:fullscreen { border-radius:0; } #tseStage iframe { display:block; width:100%; height:620px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Thirteen Step Escape</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T10:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a step-limited pixel puzzle loads in the tab. Reach each flag before your 13 actions run out.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Move</td><td>WASD, arrows, or ZQSD on keyboard</td></tr>
<tr><td>Undo</td><td>Press E to undo the last action</td></tr>
<tr><td>Restart</td><td>Press R if a level is unsolvable</td></tr>
<tr><td>Goal</td><td>Reach the flag within 13 steps or actions</td></tr>
</table>
<p>Adapted from js13kGames/13-steps-to-escape (MIT). Single-file canvas bundle, zero CDN after load.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var TSE_GAME_URL = 'thirteen-step-escape/index.html';
    function tseStatus(t){ var el=document.getElementById('tseStatus'); if(el) el.textContent=t; }
    function tseInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='tseFrame'; frame.src=TSE_GAME_URL; frame.title='Thirteen Step Escape';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ tseStatus('Loaded. Use WASD or arrows inside the frame; you have 13 steps per level.'); });
        var launch=document.getElementById('tseLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('tseStage'), playBtn=document.getElementById('tsePlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('tseFullscreenBtn');
        playBtn.addEventListener('click',function(){
            tseStatus('Loading about ${payload}...'); tseInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>What is the 13-step rule?</summary><p>Each puzzle level allows only 13 steps or actions. Exceed the limit and the level respawns.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} in a single inlined index.html canvas bundle.</p></details>
<details class="faq-item"><summary>Can I undo a move?</summary><p>Yes. Press E inside the game to undo your last action.</p></details>`);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Thirteen Step Escape - Step by Step`,
    descEn: `Launch Thirteen Step Escape, move with WASD, and reach the flag within 13 actions.`,
    leadEn: `<b>Click Play, use WASD or arrows to push crates and open locks, then reach the flag before your 13-step counter runs out.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to load the iframe bundle.</p><h2><b>Movement</b></h2><p>WASD, ZQSD, or arrow keys move your character on the grid.</p><h2><b>Puzzles</b></h2><p>Push crates, collect keys, trigger switches, and roll boulders toward the flag tile.</p><h2><b>Step limit</b></h2><p>Every action counts toward the 13-step cap. Plan routes before you move.</p><h2><b>Undo and restart</b></h2><p>Press E to undo; press R to restart a stuck level.</p>`,
    titlePt: `Como jogar Thirteen Step Escape`,
    titleEs: `Como jugar Thirteen Step Escape`,
    titleVi: `Cach choi Thirteen Step Escape`,
    titleId: `Cara main Thirteen Step Escape`,
    titleDe: `Thirteen Step Escape spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Thirteen Step Escape`,
    descEn: `Short logic puzzles fit players who want a strict step-limit challenge in the browser.`,
    leadEn: `<b>Best for 5-20 minute puzzle sessions when you want a ${payload} step-count brain teaser instead of an arcade shooter or factory idle game.</b>`,
    bodyEn: `<h2><b>Logic focus</b></h2><p>Levels reward planning crates, keys, and switches under a hard action cap.</p><h2><b>Keyboard first</b></h2><p>WASD and arrows work on desktop; gamepad is supported inside the engine.</p><h2><b>Low payload</b></h2><p>About ${payload} loads once behind the Play button.</p>`,
    titlePt: `Quando jogar Thirteen Step Escape`,
    titleEs: `Cuando jugar Thirteen Step Escape`,
    titleVi: `Khi nao choi Thirteen Step Escape`,
    titleId: `Kapan main Thirteen Step Escape`,
    titleDe: `Wann Thirteen Step Escape spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Thirteen Step Escape vs Other Browser Games`,
    descEn: `Compare payload and genre against other free puzzle games on this site.`,
    leadEn: `<b>Thirteen Step Escape is a ${payload} step-limited pixel grid puzzle, not a swipe grid game or stealth horror FPS.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Thirteen Step Escape</td><td>${payload}</td><td>13-action pixel puzzles with crates and keys</td></tr><tr><td>Space Grid Puzzle</td><td>~39 KB</td><td>Tap-and-swipe space grid puzzle</td></tr><tr><td>Cyber Slide Puzzle</td><td>~small</td><td>Sliding tile puzzle</td></tr></table><p>Pick Thirteen Step Escape for strict step-count logic challenges.</p>`,
    titlePt: `Thirteen Step Escape vs outros jogos`,
    titleEs: `Thirteen Step Escape vs otros juegos`,
    titleVi: `Thirteen Step Escape so voi game khac`,
    titleId: `Thirteen Step Escape vs game lain`,
    titleDe: `Thirteen Step Escape vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Thirteen Step Escape</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

function patchSiteData() {
  const path = join(ROOT, 'scripts/site-data.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/thirteen-step-escape.html')) return;
  const guideBlock = `
  // fire102 thirteen-step-escape
  '/guides/how-to-play-thirteen-step-escape.html',
  '/guides/pt/how-to-play-thirteen-step-escape.html',
  '/guides/es/how-to-play-thirteen-step-escape.html',
  '/guides/vi/how-to-play-thirteen-step-escape.html',
  '/guides/id/how-to-play-thirteen-step-escape.html',
  '/guides/de/how-to-play-thirteen-step-escape.html',
  '/guides/thirteen-step-escape-when.html',
  '/guides/pt/thirteen-step-escape-when.html',
  '/guides/es/thirteen-step-escape-when.html',
  '/guides/vi/thirteen-step-escape-when.html',
  '/guides/id/thirteen-step-escape-when.html',
  '/guides/de/thirteen-step-escape-when.html',
  '/guides/thirteen-step-escape-vs-alternatives.html',
  '/guides/pt/thirteen-step-escape-vs-alternatives.html',
  '/guides/es/thirteen-step-escape-vs-alternatives.html',
  '/guides/vi/thirteen-step-escape-vs-alternatives.html',
  '/guides/id/thirteen-step-escape-vs-alternatives.html',
  '/guides/de/thirteen-step-escape-vs-alternatives.html',`;
  text = text.replace(
    "  '/guides/de/space-grid-puzzle-vs-alternatives.html',",
    `  '/guides/de/space-grid-puzzle-vs-alternatives.html',${guideBlock}`,
  );
  text = text.replace(
    "  '/space-grid-puzzle.html': '/games/space-grid-puzzle.html',",
    `  '/space-grid-puzzle.html': '/games/space-grid-puzzle.html',
  '/thirteen-step-escape.html': '/games/thirteen-step-escape.html',`,
  );
  const jspBlock = `
  // fire102 thirteen-step-escape guides
  '/guides/how-to-play-thirteen-step-escape.html': 'guide/how-to-play-thirteen-step-escape.jsp',
  '/guides/pt/how-to-play-thirteen-step-escape.html': 'guide/pt/how-to-play-thirteen-step-escape.jsp',
  '/guides/es/how-to-play-thirteen-step-escape.html': 'guide/es/how-to-play-thirteen-step-escape.jsp',
  '/guides/vi/how-to-play-thirteen-step-escape.html': 'guide/vi/how-to-play-thirteen-step-escape.jsp',
  '/guides/id/how-to-play-thirteen-step-escape.html': 'guide/id/how-to-play-thirteen-step-escape.jsp',
  '/guides/de/how-to-play-thirteen-step-escape.html': 'guide/de/how-to-play-thirteen-step-escape.jsp',
  '/guides/thirteen-step-escape-when.html': 'guide/thirteen-step-escape-when.jsp',
  '/guides/pt/thirteen-step-escape-when.html': 'guide/pt/thirteen-step-escape-when.jsp',
  '/guides/es/thirteen-step-escape-when.html': 'guide/es/thirteen-step-escape-when.jsp',
  '/guides/vi/thirteen-step-escape-when.html': 'guide/vi/thirteen-step-escape-when.jsp',
  '/guides/id/thirteen-step-escape-when.html': 'guide/id/thirteen-step-escape-when.jsp',
  '/guides/de/thirteen-step-escape-when.html': 'guide/de/thirteen-step-escape-when.jsp',
  '/guides/thirteen-step-escape-vs-alternatives.html': 'guide/thirteen-step-escape-vs-alternatives.jsp',
  '/guides/pt/thirteen-step-escape-vs-alternatives.html': 'guide/pt/thirteen-step-escape-vs-alternatives.jsp',
  '/guides/es/thirteen-step-escape-vs-alternatives.html': 'guide/es/thirteen-step-escape-vs-alternatives.jsp',
  '/guides/vi/thirteen-step-escape-vs-alternatives.html': 'guide/vi/thirteen-step-escape-vs-alternatives.jsp',
  '/guides/id/thirteen-step-escape-vs-alternatives.html': 'guide/id/thirteen-step-escape-vs-alternatives.jsp',
  '/guides/de/thirteen-step-escape-vs-alternatives.html': 'guide/de/thirteen-step-escape-vs-alternatives.jsp',
  '/games/thirteen-step-escape.html': 'games/thirteen-step-escape.jsp',`;
  text = text.replace(
    "  '/games/space-grid-puzzle.html': 'games/space-grid-puzzle.jsp',",
    `  '/games/space-grid-puzzle.html': 'games/space-grid-puzzle.jsp',${jspBlock}`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchSeoClusters() {
  const path = join(ROOT, 'scripts/seo-clusters.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/thirteen-step-escape.html')) return;
  text = text.replace(
    "'/games/space-grid-puzzle.html'",
    "'/games/space-grid-puzzle.html', '/games/thirteen-step-escape.html'",
  );
  writeFileSync(path, text, 'utf8');
}

function patchMenu() {
  const path = join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
  let text = readFileSync(path, 'utf8');
  if (text.includes('thirteen-step-escape.html')) return;
  text = text.replace(
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/space-grid-puzzle.html'>Space Grid Puzzle</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/space-grid-puzzle.html'>Space Grid Puzzle</a>
                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/thirteen-step-escape.html'>Thirteen Step Escape</a>`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchRelated() {
  const path = join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
  let text = readFileSync(path, 'utf8');
  if (text.includes('thirteen-step-escape.html')) return;
  text = text.replace(
    `{ title: "Space Grid Puzzle", url: "https://freetoolonline.com/games/space-grid-puzzle.html", include: !1, tags: "games" },`,
    `{ title: "Space Grid Puzzle", url: "https://freetoolonline.com/games/space-grid-puzzle.html", include: !1, tags: "games" },
    { title: "Thirteen Step Escape", url: "https://freetoolonline.com/games/thirteen-step-escape.html", include: !1, tags: "games" },`,
  );
  writeFileSync(path, text, 'utf8');
}

patchSiteData();
patchSeoClusters();
patchMenu();
patchRelated();

console.log('Generated CMS + JSP + route patches for', slug);
