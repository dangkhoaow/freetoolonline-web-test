#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { patchCloudFront301 } from '../../.agent/skills/seo-tool-page-builder/scripts/lib/patch-cloudfront-301.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FRONTEND = join(ROOT, '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'precision-bounce-loop';
const cms = 'precisionbounceloop';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~1.2 MB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Precision Bounce Loop - Free Online Timing Arcade Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Precision Bounce Loop free in the browser: keep a ball bouncing on a moving tablet with WASD or arrow keys and combo scoring. ${payload} Leafer canvas game, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `precision bounce loop, browser timing game, tablet bounce arcade, combo bounce game`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>A timing arcade game: move a tablet with keyboard controls to keep a ball bouncing, build combos, and survive the two-minute timer.</p>
</div>
<div id="pblWrapper" class="w3-container" style="background:#1a1a2e; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="pblStage" style="position:relative; width:100%; min-height:560px; background:#000; border-radius:6px; overflow:hidden;">
            <div id="pblLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e8f4ff; padding:16px;">
                <div style="font:700 22px sans-serif; letter-spacing:1px;">PRECISION BOUNCE LOOP</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">Move the tablet and keep the ball bouncing for combo points. Press Play to load about ${payload}.</p>
                <button id="pblPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="pblStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="pblFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#aaccee; margin-left:8px;">Inside the frame: Space to start; WASD or arrows to move the tablet.</span>
    </div>
    <style>#pblStage:fullscreen { border-radius:0; } #pblStage iframe { display:block; width:100%; height:620px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Precision Bounce Loop</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T19:30:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a Leafer canvas timing game loads in the tab. Press Space on the title screen, then use WASD or arrow keys to slide the tablet under the bouncing ball.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Start</td><td>Press Space on the title screen inside the frame</td></tr>
<tr><td>Move</td><td>WASD or arrow keys slide the tablet</td></tr>
<tr><td>Combo</td><td>Center bounces earn higher combo tips</td></tr>
<tr><td>Timer</td><td>Survive until the two-minute countdown ends to win</td></tr>
</table>
<p>Adapted from Horean0574/iBouncy (MIT). Vite-built bundle with bundled fonts and images, zero CDN after load.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var PBL_GAME_URL = 'precision-bounce-loop/index.html';
    function pblStatus(t){ var el=document.getElementById('pblStatus'); if(el) el.textContent=t; }
    function pblInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='pblFrame'; frame.src=PBL_GAME_URL; frame.title='Precision Bounce Loop';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ pblStatus('Loaded. Press Space inside the frame to start, then move the tablet with WASD or arrows.'); });
        var launch=document.getElementById('pblLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('pblStage'), playBtn=document.getElementById('pblPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('pblFullscreenBtn');
        playBtn.addEventListener('click',function(){
            pblStatus('Loading about ${payload}...'); pblInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>How do I start a run?</summary><p>Press Space on the title screen inside the iframe after clicking Play on this page.</p></details>
<details class="faq-item"><summary>Which keys move the tablet?</summary><p>Use arrow keys or W, A, S, and D inside the iframe.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} across index.html, assets, fonts, and images.</p></details>`);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Precision Bounce Loop - Step by Step`,
    descEn: `Launch Precision Bounce Loop, press Space to start, and move the tablet with keyboard controls.`,
    leadEn: `<b>Click Play, press Space inside the iframe to start, then use WASD or arrow keys to slide the tablet under the bouncing ball.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to load the iframe bundle.</p><h2><b>Start</b></h2><p>Press Space on the title screen inside the frame.</p><h2><b>Move</b></h2><p>Use arrow keys or WASD to slide the tablet left and right.</p><h2><b>Combo</b></h2><p>Center your bounces for higher combo tips on the score panel.</p><h2><b>Win</b></h2><p>Keep bouncing until the two-minute timer reaches zero.</p>`,
    titlePt: `Como jogar Precision Bounce Loop`,
    titleEs: `Como jugar Precision Bounce Loop`,
    titleVi: `Cach choi Precision Bounce Loop`,
    titleId: `Cara main Precision Bounce Loop`,
    titleDe: `Precision Bounce Loop spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Precision Bounce Loop`,
    descEn: `Short timing sessions fit players who want keyboard reflex practice in the browser.`,
    leadEn: `<b>Best for two-minute combo-chasing sessions when you want tablet-bounce timing instead of an endless auto-runner.</b>`,
    bodyEn: `<h2><b>Reflex warm-up</b></h2><p>Quick runs test how well you track a bouncing ball.</p><h2><b>Combo practice</b></h2><p>Center bounces reward higher combo scores.</p><h2><b>Keyboard focus</b></h2><p>Desktop WASD or arrow controls are the primary input inside the iframe.</p>`,
    titlePt: `Quando jogar Precision Bounce Loop`,
    titleEs: `Cuando jugar Precision Bounce Loop`,
    titleVi: `Khi nao choi Precision Bounce Loop`,
    titleId: `Kapan main Precision Bounce Loop`,
    titleDe: `Wann Precision Bounce Loop spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Precision Bounce Loop vs Other Browser Games`,
    descEn: `Compare payload and genre against other free arcade games on this site.`,
    leadEn: `<b>Precision Bounce Loop is a ${payload} tablet-bounce timing game, not a step puzzle or math quiz title.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Precision Bounce Loop</td><td>${payload}</td><td>Tablet bounce timing with combos</td></tr><tr><td>Pixel Spike Run</td><td>~25 KB</td><td>Endless jump reflex</td></tr><tr><td>Lightning Math Battle</td><td>~1.29 MB</td><td>Math quiz action</td></tr></table><p>Pick Precision Bounce Loop for active tablet positioning and combo scoring.</p>`,
    titlePt: `Precision Bounce Loop vs outros jogos`,
    titleEs: `Precision Bounce Loop vs otros juegos`,
    titleVi: `Precision Bounce Loop so voi game khac`,
    titleId: `Precision Bounce Loop vs game lain`,
    titleDe: `Precision Bounce Loop vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Precision Bounce Loop</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

function patchSiteData() {
  const path = join(ROOT, 'scripts/site-data.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/precision-bounce-loop.html')) return;
  const guideBlock = `
  // fire106 precision-bounce-loop
  '/guides/how-to-play-precision-bounce-loop.html',
  '/guides/pt/how-to-play-precision-bounce-loop.html',
  '/guides/es/how-to-play-precision-bounce-loop.html',
  '/guides/vi/how-to-play-precision-bounce-loop.html',
  '/guides/id/how-to-play-precision-bounce-loop.html',
  '/guides/de/how-to-play-precision-bounce-loop.html',
  '/guides/precision-bounce-loop-when.html',
  '/guides/pt/precision-bounce-loop-when.html',
  '/guides/es/precision-bounce-loop-when.html',
  '/guides/vi/precision-bounce-loop-when.html',
  '/guides/id/precision-bounce-loop-when.html',
  '/guides/de/precision-bounce-loop-when.html',
  '/guides/precision-bounce-loop-vs-alternatives.html',
  '/guides/pt/precision-bounce-loop-vs-alternatives.html',
  '/guides/es/precision-bounce-loop-vs-alternatives.html',
  '/guides/vi/precision-bounce-loop-vs-alternatives.html',
  '/guides/id/precision-bounce-loop-vs-alternatives.html',
  '/guides/de/precision-bounce-loop-vs-alternatives.html',`;
  text = text.replace(
    "  '/guides/de/lightning-math-battle-vs-alternatives.html',",
    `  '/guides/de/lightning-math-battle-vs-alternatives.html',${guideBlock}`,
  );
  text = text.replace(
    "  '/lightning-math-battle.html': '/games/lightning-math-battle.html',",
    `  '/lightning-math-battle.html': '/games/lightning-math-battle.html',
  '/precision-bounce-loop.html': '/games/precision-bounce-loop.html',`,
  );
  const jspBlock = `
  // fire106 precision-bounce-loop guides
  '/guides/how-to-play-precision-bounce-loop.html': 'guide/how-to-play-precision-bounce-loop.jsp',
  '/guides/pt/how-to-play-precision-bounce-loop.html': 'guide/pt/how-to-play-precision-bounce-loop.jsp',
  '/guides/es/how-to-play-precision-bounce-loop.html': 'guide/es/how-to-play-precision-bounce-loop.jsp',
  '/guides/vi/how-to-play-precision-bounce-loop.html': 'guide/vi/how-to-play-precision-bounce-loop.jsp',
  '/guides/id/how-to-play-precision-bounce-loop.html': 'guide/id/how-to-play-precision-bounce-loop.jsp',
  '/guides/de/how-to-play-precision-bounce-loop.html': 'guide/de/how-to-play-precision-bounce-loop.jsp',
  '/guides/precision-bounce-loop-when.html': 'guide/precision-bounce-loop-when.jsp',
  '/guides/pt/precision-bounce-loop-when.html': 'guide/pt/precision-bounce-loop-when.jsp',
  '/guides/es/precision-bounce-loop-when.html': 'guide/es/precision-bounce-loop-when.jsp',
  '/guides/vi/precision-bounce-loop-when.html': 'guide/vi/precision-bounce-loop-when.jsp',
  '/guides/id/precision-bounce-loop-when.html': 'guide/id/precision-bounce-loop-when.jsp',
  '/guides/de/precision-bounce-loop-when.html': 'guide/de/precision-bounce-loop-when.jsp',
  '/guides/precision-bounce-loop-vs-alternatives.html': 'guide/precision-bounce-loop-vs-alternatives.jsp',
  '/guides/pt/precision-bounce-loop-vs-alternatives.html': 'guide/pt/precision-bounce-loop-vs-alternatives.jsp',
  '/guides/es/precision-bounce-loop-vs-alternatives.html': 'guide/es/precision-bounce-loop-vs-alternatives.jsp',
  '/guides/vi/precision-bounce-loop-vs-alternatives.html': 'guide/vi/precision-bounce-loop-vs-alternatives.jsp',
  '/guides/id/precision-bounce-loop-vs-alternatives.html': 'guide/id/precision-bounce-loop-vs-alternatives.jsp',
  '/guides/de/precision-bounce-loop-vs-alternatives.html': 'guide/de/precision-bounce-loop-vs-alternatives.jsp',
  '/games/precision-bounce-loop.html': 'games/precision-bounce-loop.jsp',`;
  text = text.replace(
    "  '/games/lightning-math-battle.html': 'games/lightning-math-battle.jsp',",
    `  '/games/lightning-math-battle.html': 'games/lightning-math-battle.jsp',${jspBlock}`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchSeoClusters() {
  const path = join(ROOT, 'scripts/seo-clusters.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/precision-bounce-loop.html')) return;
  text = text.replace(
    "'/games/lightning-math-battle.html'",
    "'/games/lightning-math-battle.html', '/games/precision-bounce-loop.html'",
  );
  writeFileSync(path, text, 'utf8');
}

function patchMenu() {
  const path = join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
  let text = readFileSync(path, 'utf8');
  if (text.includes('precision-bounce-loop.html')) return;
  text = text.replace(
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/lightning-math-battle.html'>Lightning Math Battle</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/lightning-math-battle.html'>Lightning Math Battle</a>
                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/precision-bounce-loop.html'>Precision Bounce Loop</a>`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchRelated() {
  const path = join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
  let text = readFileSync(path, 'utf8');
  if (text.includes('precision-bounce-loop.html')) return;
  text = text.replace(
    `{ title: "Lightning Math Battle", url: "https://freetoolonline.com/games/lightning-math-battle.html", include: !1, tags: "games" },`,
    `{ title: "Lightning Math Battle", url: "https://freetoolonline.com/games/lightning-math-battle.html", include: !1, tags: "games" },
    { title: "Precision Bounce Loop", url: "https://freetoolonline.com/games/precision-bounce-loop.html", include: !1, tags: "games" },`,
  );
  writeFileSync(path, text, 'utf8');
}

patchSiteData();
patchSeoClusters();
patchMenu();
patchRelated();

await patchCloudFront301({
  frontendRoot: FRONTEND,
  aliasUrl: '/precision-bounce-loop.html',
  canonicalUrl: '/games/precision-bounce-loop.html',
  runDate: '20260712-fire106',
});

console.log('Generated CMS + JSP + route patches for', slug);
