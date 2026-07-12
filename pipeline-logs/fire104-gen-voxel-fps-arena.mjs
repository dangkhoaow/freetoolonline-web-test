#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'voxel-fps-arena';
const cms = 'voxelfpsarena';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~18 KB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Voxel FPS Arena - Free Online WebGL Shooter Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Voxel FPS Arena free in the browser: a compact WebGL voxel shooter with 2 levels, 3 weapons, and dynamic lighting. ${payload} js13k FPS bundle, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `voxel fps arena, browser fps game, webgl shooter online, js13k fps`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>A compact WebGL voxel first-person shooter: explore two levels, switch weapons, and fight five enemy types with mouse look and WASD movement.</p>
</div>
<div id="vfaWrapper" class="w3-container" style="background:#111; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="vfaStage" style="position:relative; width:100%; min-height:560px; background:#000; border-radius:6px; overflow:hidden;">
            <div id="vfaLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e8f4ff; padding:16px;">
                <div style="font:700 22px sans-serif; letter-spacing:1px;">VOXEL FPS ARENA</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">WebGL voxel shooter with 2 levels and 3 weapons. Press Play to load about ${payload}.</p>
                <button id="vfaPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="vfaStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="vfaFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#aaccee; margin-left:8px;">WASD to move; mouse to aim; LMB attack; Space or RMB jump; Q/E to switch weapons.</span>
    </div>
    <style>#vfaStage:fullscreen { border-radius:0; } #vfaStage iframe { display:block; width:100%; height:620px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Voxel FPS Arena</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T14:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a WebGL voxel FPS loads in the tab. Clear two compact levels with three weapons and dynamic lighting.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Move</td><td>WASD or arrow keys</td></tr>
<tr><td>Aim</td><td>Mouse look inside the frame</td></tr>
<tr><td>Attack</td><td>Left mouse button</td></tr>
<tr><td>Jump</td><td>Space or right mouse button</td></tr>
<tr><td>Weapons</td><td>Q and E or mouse wheel</td></tr>
</table>
<p>Adapted from js13kGames/q1k3 (MIT). Compo bundle with index.html plus map files, zero CDN after load.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var VFA_GAME_URL = 'voxel-fps-arena/index.html';
    function vfaStatus(t){ var el=document.getElementById('vfaStatus'); if(el) el.textContent=t; }
    function vfaInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='vfaFrame'; frame.src=VFA_GAME_URL; frame.title='Voxel FPS Arena';
        frame.setAttribute('allow','fullscreen; pointer-lock'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ vfaStatus('Loaded. Click inside the frame, then use WASD and mouse to play.'); });
        var launch=document.getElementById('vfaLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('vfaStage'), playBtn=document.getElementById('vfaPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('vfaFullscreenBtn');
        playBtn.addEventListener('click',function(){
            vfaStatus('Loading about ${payload}...'); vfaInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>How many levels are included?</summary><p>The compo build ships with 2 levels and 5 enemy types.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} across index.html and bundled map data files.</p></details>
<details class="faq-item"><summary>Which weapons can I use?</summary><p>Three weapons are available; switch with Q/E or the mouse wheel.</p></details>`);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Voxel FPS Arena - Step by Step`,
    descEn: `Launch Voxel FPS Arena, move with WASD, aim with the mouse, and clear two WebGL levels.`,
    leadEn: `<b>Click Play, click inside the iframe for mouse look, then use WASD to move, LMB to attack, and Space to jump.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to load the iframe bundle.</p><h2><b>Movement</b></h2><p>WASD or arrow keys walk the level.</p><h2><b>Combat</b></h2><p>Left mouse button fires; Q/E or mouse wheel switches weapons.</p><h2><b>Jump</b></h2><p>Space or right mouse button jumps over gaps and obstacles.</p><h2><b>Fullscreen</b></h2><p>Use the Fullscreen button if the page scrolls when you change weapons.</p>`,
    titlePt: `Como jogar Voxel FPS Arena`,
    titleEs: `Como jugar Voxel FPS Arena`,
    titleVi: `Cach choi Voxel FPS Arena`,
    titleId: `Cara main Voxel FPS Arena`,
    titleDe: `Voxel FPS Arena spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Voxel FPS Arena`,
    descEn: `Short FPS sessions fit players who want a lightweight WebGL shooter in the browser.`,
    leadEn: `<b>Best for quick arena runs when you want a ${payload} voxel FPS instead of a puzzle or stealth horror session.</b>`,
    bodyEn: `<h2><b>Action focus</b></h2><p>Two compact levels reward movement, aiming, and weapon swaps.</p><h2><b>Mouse look</b></h2><p>Desktop mouse and keyboard are the primary controls inside the iframe.</p><h2><b>Low payload</b></h2><p>About ${payload} loads once behind the Play button.</p>`,
    titlePt: `Quando jogar Voxel FPS Arena`,
    titleEs: `Cuando jugar Voxel FPS Arena`,
    titleVi: `Khi nao choi Voxel FPS Arena`,
    titleId: `Kapan main Voxel FPS Arena`,
    titleDe: `Wann Voxel FPS Arena spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Voxel FPS Arena vs Other Browser Games`,
    descEn: `Compare payload and genre against other free shooter and puzzle games on this site.`,
    leadEn: `<b>Voxel FPS Arena is a ${payload} WebGL voxel shooter, not a step-limit puzzle or stealth horror game.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Voxel FPS Arena</td><td>${payload}</td><td>WebGL voxel FPS with 3 weapons</td></tr><tr><td>Andromeda Star Shooter</td><td>~small</td><td>Top-down space shooter</td></tr><tr><td>Floor Thirteen Horror</td><td>~17 KB</td><td>Flashlight stealth horror</td></tr></table><p>Pick Voxel FPS Arena for first-person aiming and weapon swaps in a tiny bundle.</p>`,
    titlePt: `Voxel FPS Arena vs outros jogos`,
    titleEs: `Voxel FPS Arena vs otros juegos`,
    titleVi: `Voxel FPS Arena so voi game khac`,
    titleId: `Voxel FPS Arena vs game lain`,
    titleDe: `Voxel FPS Arena vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Voxel FPS Arena</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

function patchSiteData() {
  const path = join(ROOT, 'scripts/site-data.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/voxel-fps-arena.html')) return;
  const guideBlock = `
  // fire104 voxel-fps-arena
  '/guides/how-to-play-voxel-fps-arena.html',
  '/guides/pt/how-to-play-voxel-fps-arena.html',
  '/guides/es/how-to-play-voxel-fps-arena.html',
  '/guides/vi/how-to-play-voxel-fps-arena.html',
  '/guides/id/how-to-play-voxel-fps-arena.html',
  '/guides/de/how-to-play-voxel-fps-arena.html',
  '/guides/voxel-fps-arena-when.html',
  '/guides/pt/voxel-fps-arena-when.html',
  '/guides/es/voxel-fps-arena-when.html',
  '/guides/vi/voxel-fps-arena-when.html',
  '/guides/id/voxel-fps-arena-when.html',
  '/guides/de/voxel-fps-arena-when.html',
  '/guides/voxel-fps-arena-vs-alternatives.html',
  '/guides/pt/voxel-fps-arena-vs-alternatives.html',
  '/guides/es/voxel-fps-arena-vs-alternatives.html',
  '/guides/vi/voxel-fps-arena-vs-alternatives.html',
  '/guides/id/voxel-fps-arena-vs-alternatives.html',
  '/guides/de/voxel-fps-arena-vs-alternatives.html',`;
  text = text.replace(
    "  '/guides/de/floor-thirteen-horror-vs-alternatives.html',",
    `  '/guides/de/floor-thirteen-horror-vs-alternatives.html',${guideBlock}`,
  );
  text = text.replace(
    "  '/floor-thirteen-horror.html': '/games/floor-thirteen-horror.html',",
    `  '/floor-thirteen-horror.html': '/games/floor-thirteen-horror.html',
  '/voxel-fps-arena.html': '/games/voxel-fps-arena.html',`,
  );
  const jspBlock = `
  // fire104 voxel-fps-arena guides
  '/guides/how-to-play-voxel-fps-arena.html': 'guide/how-to-play-voxel-fps-arena.jsp',
  '/guides/pt/how-to-play-voxel-fps-arena.html': 'guide/pt/how-to-play-voxel-fps-arena.jsp',
  '/guides/es/how-to-play-voxel-fps-arena.html': 'guide/es/how-to-play-voxel-fps-arena.jsp',
  '/guides/vi/how-to-play-voxel-fps-arena.html': 'guide/vi/how-to-play-voxel-fps-arena.jsp',
  '/guides/id/how-to-play-voxel-fps-arena.html': 'guide/id/how-to-play-voxel-fps-arena.jsp',
  '/guides/de/how-to-play-voxel-fps-arena.html': 'guide/de/how-to-play-voxel-fps-arena.jsp',
  '/guides/voxel-fps-arena-when.html': 'guide/voxel-fps-arena-when.jsp',
  '/guides/pt/voxel-fps-arena-when.html': 'guide/pt/voxel-fps-arena-when.jsp',
  '/guides/es/voxel-fps-arena-when.html': 'guide/es/voxel-fps-arena-when.jsp',
  '/guides/vi/voxel-fps-arena-when.html': 'guide/vi/voxel-fps-arena-when.jsp',
  '/guides/id/voxel-fps-arena-when.html': 'guide/id/voxel-fps-arena-when.jsp',
  '/guides/de/voxel-fps-arena-when.html': 'guide/de/voxel-fps-arena-when.jsp',
  '/guides/voxel-fps-arena-vs-alternatives.html': 'guide/voxel-fps-arena-vs-alternatives.jsp',
  '/guides/pt/voxel-fps-arena-vs-alternatives.html': 'guide/pt/voxel-fps-arena-vs-alternatives.jsp',
  '/guides/es/voxel-fps-arena-vs-alternatives.html': 'guide/es/voxel-fps-arena-vs-alternatives.jsp',
  '/guides/vi/voxel-fps-arena-vs-alternatives.html': 'guide/vi/voxel-fps-arena-vs-alternatives.jsp',
  '/guides/id/voxel-fps-arena-vs-alternatives.html': 'guide/id/voxel-fps-arena-vs-alternatives.jsp',
  '/guides/de/voxel-fps-arena-vs-alternatives.html': 'guide/de/voxel-fps-arena-vs-alternatives.jsp',
  '/games/voxel-fps-arena.html': 'games/voxel-fps-arena.jsp',`;
  text = text.replace(
    "  '/games/floor-thirteen-horror.html': 'games/floor-thirteen-horror.jsp',",
    `  '/games/floor-thirteen-horror.html': 'games/floor-thirteen-horror.jsp',${jspBlock}`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchSeoClusters() {
  const path = join(ROOT, 'scripts/seo-clusters.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/voxel-fps-arena.html')) return;
  text = text.replace(
    "'/games/floor-thirteen-horror.html'",
    "'/games/floor-thirteen-horror.html', '/games/voxel-fps-arena.html'",
  );
  writeFileSync(path, text, 'utf8');
}

function patchMenu() {
  const path = join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
  let text = readFileSync(path, 'utf8');
  if (text.includes('voxel-fps-arena.html')) return;
  text = text.replace(
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/floor-thirteen-horror.html'>Floor Thirteen Horror</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/floor-thirteen-horror.html'>Floor Thirteen Horror</a>
                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/voxel-fps-arena.html'>Voxel FPS Arena</a>`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchRelated() {
  const path = join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
  let text = readFileSync(path, 'utf8');
  if (text.includes('voxel-fps-arena.html')) return;
  text = text.replace(
    `{ title: "Floor Thirteen Horror", url: "https://freetoolonline.com/games/floor-thirteen-horror.html", include: !1, tags: "games" },`,
    `{ title: "Floor Thirteen Horror", url: "https://freetoolonline.com/games/floor-thirteen-horror.html", include: !1, tags: "games" },
    { title: "Voxel FPS Arena", url: "https://freetoolonline.com/games/voxel-fps-arena.html", include: !1, tags: "games" },`,
  );
  writeFileSync(path, text, 'utf8');
}

patchSiteData();
patchSeoClusters();
patchMenu();
patchRelated();

console.log('Generated CMS + JSP + route patches for', slug);
