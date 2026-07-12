#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'floor-thirteen-horror';
const cms = 'floorthirteenhorror';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~17 KB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Floor Thirteen Horror - Free Online Stealth Horror Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Floor Thirteen Horror free in the browser: explore 13 rooms, find keys, use your flashlight, and hide from It. ${payload} WebGL stealth horror from js13k 2024, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `floor thirteen horror, stealth horror browser game, flashlight horror game, js13k horror online`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>A stealth horror game on the 13th floor: visit numbered rooms with your key, search with a flashlight, and hide when It approaches.</p>
</div>
<div id="fthWrapper" class="w3-container" style="background:#111; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="fthStage" style="position:relative; width:100%; min-height:560px; background:#000; border-radius:6px; overflow:hidden;">
            <div id="fthLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e8f4ff; padding:16px;">
                <div style="font:700 22px sans-serif; letter-spacing:1px;">FLOOR THIRTEEN HORROR</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">WebGL stealth horror with flashlight and hiding. Press Play to load about ${payload}.</p>
                <button id="fthPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="fthStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="fthFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#aaccee; margin-left:8px;">WASD to move; mouse to look; F for flashlight; E or click to interact.</span>
    </div>
    <style>#fthStage:fullscreen { border-radius:0; } #fthStage iframe { display:block; width:100%; height:620px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Floor Thirteen Horror</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T12:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a stealth horror game loads in the tab. Find keys room by room until you reach Room 1313.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Move</td><td>WASD to walk the 13th floor</td></tr>
<tr><td>Look</td><td>Mouse to turn and scan rooms</td></tr>
<tr><td>Flashlight</td><td>Press F to light dark corners</td></tr>
<tr><td>Hide</td><td>When It sees you, run and break line of sight</td></tr>
</table>
<p>Adapted from js13kGames/13th-floor (MIT). Single-file WebGL bundle, zero CDN after load.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var FTH_GAME_URL = 'floor-thirteen-horror/index.html';
    function fthStatus(t){ var el=document.getElementById('fthStatus'); if(el) el.textContent=t; }
    function fthInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='fthFrame'; frame.src=FTH_GAME_URL; frame.title='Floor Thirteen Horror';
        frame.setAttribute('allow','fullscreen; pointer-lock'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ fthStatus('Loaded. Click inside the frame, then use WASD and mouse to explore.'); });
        var launch=document.getElementById('fthLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('fthStage'), playBtn=document.getElementById('fthPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('fthFullscreenBtn');
        playBtn.addEventListener('click',function(){
            fthStatus('Loading about ${payload}...'); fthInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>What is the goal?</summary><p>Find the key in each room and reach Room 1313 on the 13th floor without letting It catch you.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} in a single inlined WebGL index.html bundle.</p></details>
<details class="faq-item"><summary>How do I use the flashlight?</summary><p>Press F inside the game to toggle the flashlight and search dark rooms.</p></details>`);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Floor Thirteen Horror - Step by Step`,
    descEn: `Launch Floor Thirteen Horror, explore rooms with WASD, and hide from It with your flashlight.`,
    leadEn: `<b>Click Play, use WASD to move and the mouse to look, press F for the flashlight, and find each room key without letting It catch you.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to load the iframe bundle.</p><h2><b>Movement</b></h2><p>WASD walks the 13th floor; mouse turns your view.</p><h2><b>Keys</b></h2><p>Go to the room number on your current key, find the next key inside, and repeat.</p><h2><b>Flashlight</b></h2><p>Press F to search dark corners for items and doors.</p><h2><b>Stealth</b></h2><p>Watch for It's light, break line of sight, and hide when spotted.</p>`,
    titlePt: `Como jogar Floor Thirteen Horror`,
    titleEs: `Como jugar Floor Thirteen Horror`,
    titleVi: `Cach choi Floor Thirteen Horror`,
    titleId: `Cara main Floor Thirteen Horror`,
    titleDe: `Floor Thirteen Horror spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Floor Thirteen Horror`,
    descEn: `Short horror sessions fit players who want a stealth flashlight game in the browser.`,
    leadEn: `<b>Best for 10-30 minute tension runs when you want a ${payload} WebGL horror game instead of a puzzle or FPS session.</b>`,
    bodyEn: `<h2><b>Stealth focus</b></h2><p>Rooms reward careful movement, listening, and breaking line of sight.</p><h2><b>Mouse look</b></h2><p>Desktop mouse and keyboard are the primary controls inside the iframe.</p><h2><b>Low payload</b></h2><p>About ${payload} loads once behind the Play button.</p>`,
    titlePt: `Quando jogar Floor Thirteen Horror`,
    titleEs: `Cuando jugar Floor Thirteen Horror`,
    titleVi: `Khi nao choi Floor Thirteen Horror`,
    titleId: `Kapan main Floor Thirteen Horror`,
    titleDe: `Wann Floor Thirteen Horror spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Floor Thirteen Horror vs Other Browser Games`,
    descEn: `Compare payload and genre against other free horror and puzzle games on this site.`,
    leadEn: `<b>Floor Thirteen Horror is a ${payload} WebGL stealth horror game, not a step-limit puzzle or factory incremental.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Floor Thirteen Horror</td><td>${payload}</td><td>Flashlight stealth across 13 rooms</td></tr><tr><td>Thirteen Step Escape</td><td>~16 KB</td><td>13-action pixel grid puzzle</td></tr><tr><td>Inferno Soul Walker</td><td>~small</td><td>Action horror survivor</td></tr></table><p>Pick Floor Thirteen Horror for slow stealth and hiding mechanics.</p>`,
    titlePt: `Floor Thirteen Horror vs outros jogos`,
    titleEs: `Floor Thirteen Horror vs otros juegos`,
    titleVi: `Floor Thirteen Horror so voi game khac`,
    titleId: `Floor Thirteen Horror vs game lain`,
    titleDe: `Floor Thirteen Horror vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Floor Thirteen Horror</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

function patchSiteData() {
  const path = join(ROOT, 'scripts/site-data.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/floor-thirteen-horror.html')) return;
  const guideBlock = `
  // fire103 floor-thirteen-horror
  '/guides/how-to-play-floor-thirteen-horror.html',
  '/guides/pt/how-to-play-floor-thirteen-horror.html',
  '/guides/es/how-to-play-floor-thirteen-horror.html',
  '/guides/vi/how-to-play-floor-thirteen-horror.html',
  '/guides/id/how-to-play-floor-thirteen-horror.html',
  '/guides/de/how-to-play-floor-thirteen-horror.html',
  '/guides/floor-thirteen-horror-when.html',
  '/guides/pt/floor-thirteen-horror-when.html',
  '/guides/es/floor-thirteen-horror-when.html',
  '/guides/vi/floor-thirteen-horror-when.html',
  '/guides/id/floor-thirteen-horror-when.html',
  '/guides/de/floor-thirteen-horror-when.html',
  '/guides/floor-thirteen-horror-vs-alternatives.html',
  '/guides/pt/floor-thirteen-horror-vs-alternatives.html',
  '/guides/es/floor-thirteen-horror-vs-alternatives.html',
  '/guides/vi/floor-thirteen-horror-vs-alternatives.html',
  '/guides/id/floor-thirteen-horror-vs-alternatives.html',
  '/guides/de/floor-thirteen-horror-vs-alternatives.html',`;
  text = text.replace(
    "  '/guides/de/thirteen-step-escape-vs-alternatives.html',",
    `  '/guides/de/thirteen-step-escape-vs-alternatives.html',${guideBlock}`,
  );
  text = text.replace(
    "  '/thirteen-step-escape.html': '/games/thirteen-step-escape.html',",
    `  '/thirteen-step-escape.html': '/games/thirteen-step-escape.html',
  '/floor-thirteen-horror.html': '/games/floor-thirteen-horror.html',`,
  );
  const jspBlock = `
  // fire103 floor-thirteen-horror guides
  '/guides/how-to-play-floor-thirteen-horror.html': 'guide/how-to-play-floor-thirteen-horror.jsp',
  '/guides/pt/how-to-play-floor-thirteen-horror.html': 'guide/pt/how-to-play-floor-thirteen-horror.jsp',
  '/guides/es/how-to-play-floor-thirteen-horror.html': 'guide/es/how-to-play-floor-thirteen-horror.jsp',
  '/guides/vi/how-to-play-floor-thirteen-horror.html': 'guide/vi/how-to-play-floor-thirteen-horror.jsp',
  '/guides/id/how-to-play-floor-thirteen-horror.html': 'guide/id/how-to-play-floor-thirteen-horror.jsp',
  '/guides/de/how-to-play-floor-thirteen-horror.html': 'guide/de/how-to-play-floor-thirteen-horror.jsp',
  '/guides/floor-thirteen-horror-when.html': 'guide/floor-thirteen-horror-when.jsp',
  '/guides/pt/floor-thirteen-horror-when.html': 'guide/pt/floor-thirteen-horror-when.jsp',
  '/guides/es/floor-thirteen-horror-when.html': 'guide/es/floor-thirteen-horror-when.jsp',
  '/guides/vi/floor-thirteen-horror-when.html': 'guide/vi/floor-thirteen-horror-when.jsp',
  '/guides/id/floor-thirteen-horror-when.html': 'guide/id/floor-thirteen-horror-when.jsp',
  '/guides/de/floor-thirteen-horror-when.html': 'guide/de/floor-thirteen-horror-when.jsp',
  '/guides/floor-thirteen-horror-vs-alternatives.html': 'guide/floor-thirteen-horror-vs-alternatives.jsp',
  '/guides/pt/floor-thirteen-horror-vs-alternatives.html': 'guide/pt/floor-thirteen-horror-vs-alternatives.jsp',
  '/guides/es/floor-thirteen-horror-vs-alternatives.html': 'guide/es/floor-thirteen-horror-vs-alternatives.jsp',
  '/guides/vi/floor-thirteen-horror-vs-alternatives.html': 'guide/vi/floor-thirteen-horror-vs-alternatives.jsp',
  '/guides/id/floor-thirteen-horror-vs-alternatives.html': 'guide/id/floor-thirteen-horror-vs-alternatives.jsp',
  '/guides/de/floor-thirteen-horror-vs-alternatives.html': 'guide/de/floor-thirteen-horror-vs-alternatives.jsp',
  '/games/floor-thirteen-horror.html': 'games/floor-thirteen-horror.jsp',`;
  text = text.replace(
    "  '/games/thirteen-step-escape.html': 'games/thirteen-step-escape.jsp',",
    `  '/games/thirteen-step-escape.html': 'games/thirteen-step-escape.jsp',${jspBlock}`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchSeoClusters() {
  const path = join(ROOT, 'scripts/seo-clusters.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/floor-thirteen-horror.html')) return;
  text = text.replace(
    "'/games/thirteen-step-escape.html'",
    "'/games/thirteen-step-escape.html', '/games/floor-thirteen-horror.html'",
  );
  writeFileSync(path, text, 'utf8');
}

function patchMenu() {
  const path = join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
  let text = readFileSync(path, 'utf8');
  if (text.includes('floor-thirteen-horror.html')) return;
  text = text.replace(
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/thirteen-step-escape.html'>Thirteen Step Escape</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/thirteen-step-escape.html'>Thirteen Step Escape</a>
                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/floor-thirteen-horror.html'>Floor Thirteen Horror</a>`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchRelated() {
  const path = join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
  let text = readFileSync(path, 'utf8');
  if (text.includes('floor-thirteen-horror.html')) return;
  text = text.replace(
    `{ title: "Thirteen Step Escape", url: "https://freetoolonline.com/games/thirteen-step-escape.html", include: !1, tags: "games" },`,
    `{ title: "Thirteen Step Escape", url: "https://freetoolonline.com/games/thirteen-step-escape.html", include: !1, tags: "games" },
    { title: "Floor Thirteen Horror", url: "https://freetoolonline.com/games/floor-thirteen-horror.html", include: !1, tags: "games" },`,
  );
  writeFileSync(path, text, 'utf8');
}

patchSiteData();
patchSeoClusters();
patchMenu();
patchRelated();

console.log('Generated CMS + JSP + route patches for', slug);
