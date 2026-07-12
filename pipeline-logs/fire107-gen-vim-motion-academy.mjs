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

const slug = 'vim-motion-academy';
const cms = 'vimmotionacademy';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~350 KB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Vim Motion Academy - Free Online Vim Tutorial RPG Browser Game`);
w(
  join(CMS, `BODYDESC${cms}.txt`),
  `Play Vim Motion Academy free in the browser: learn h j k l and Vim commands through creature training, drills, and turn-based battles. ${payload} Canvas ES-module game, no install.`,
);
w(
  join(CMS, `BODYKW${cms}.txt`),
  `vim motion academy, learn vim game, vim tutorial browser game, vim keys practice game`,
);
w(
  join(CMS, `BODYHTML${cms}.html`),
  `<div class="w3-container">
    <p>An educational canvas RPG: explore maps, complete motion drills, and battle creatures while practicing real Vim keys like h, j, k, l, w, b, and f.</p>
</div>
<div id="vmaWrapper" class="w3-container" style="background:#0f1f33; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="vmaStage" style="position:relative; width:100%; min-height:560px; background:#10233c; border-radius:6px; overflow:hidden;">
            <div id="vmaLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#fff7da; padding:16px;">
                <div style="font:700 22px monospace; letter-spacing:1px;">VIM MOTION ACADEMY</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">Creature training where every lesson is a Vim motion. Press Play to load about ${payload}.</p>
                <button id="vmaPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="vmaStatus" style="font:400 14px sans-serif; color:#aaccee; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="vmaFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#aaccee; margin-left:8px;">Inside the frame: h j k l move; o opens VimTree; : opens commands; m toggles audio.</span>
    </div>
    <style>#vmaStage:fullscreen { border-radius:0; } #vmaStage iframe { display:block; width:100%; height:720px; border:0; }</style>
</div>`,
);
w(
  join(CMS, `BODYWELCOME${cms}.html`),
  `<h1 class="text-uppercase"><b>Vim Motion Academy</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T21:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a canvas RPG loads in the tab. Pick a starter creature, then explore the Home Row House map using Vim motion keys instead of arrow keys.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Starter</td><td>Use j/k to focus a creature, Enter to confirm</td></tr>
<tr><td>Move</td><td>h j k l navigate the overworld</td></tr>
<tr><td>Drills</td><td>Follow on-screen motion prompts in lesson tiles</td></tr>
<tr><td>Battle</td><td>Type the shown Vim keys to attack in turn-based fights</td></tr>
<tr><td>Tree</td><td>Press o to open the in-game VimTree panel</td></tr>
</table>
<p>Adapted from error311/vimmonsters-academy (MIT). ES modules with local PNG sprites, zero CDN after load. Saves and leaderboard meta persist in namespaced localStorage.</p>`,
);
w(
  join(CMS, `BODYJS${cms}.html`),
  `<script>
    web.localUpload = false;
    var VMA_GAME_URL = 'vim-motion-academy/index.html';
    function vmaStatus(t){ var el=document.getElementById('vmaStatus'); if(el) el.textContent=t; }
    function vmaInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='vmaFrame'; frame.src=VMA_GAME_URL; frame.title='Vim Motion Academy';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ vmaStatus('Loaded. Use j/k and Enter to pick a starter inside the frame.'); });
        var launch=document.getElementById('vmaLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('vmaStage'), playBtn=document.getElementById('vmaPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('vmaFullscreenBtn');
        playBtn.addEventListener('click',function(){
            vmaStatus('Loading about ${payload}...'); vmaInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`,
);
w(
  join(CMS, `FAQ${cms}.html`),
  `<details class="faq-item"><summary>Do I need arrow keys?</summary><p>No. Movement uses Vim keys h, j, k, and l inside the iframe. The game teaches motions through drills and battles.</p></details>
<details class="faq-item"><summary>Does progress save?</summary><p>Yes. Run progress and local leaderboard meta persist under ftol:vimmotionacademy localStorage keys in your browser.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} across HTML, ES modules, and local sprite PNGs.</p></details>`,
);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Vim Motion Academy - Step by Step`,
    descEn: `Launch Vim Motion Academy, pick a starter, move with h j k l, and complete motion drills and battles.`,
    leadEn: `<b>Click Play, press Enter to confirm a starter inside the iframe, then explore with h j k l and follow on-screen Vim motion prompts.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to load the iframe bundle.</p><h2><b>Starter</b></h2><p>Use j and k to cycle starter creatures, then Enter to confirm.</p><h2><b>Overworld</b></h2><p>Move with h j k l. Press o for VimTree and : for command mode.</p><h2><b>Drills</b></h2><p>Step on lesson tiles and type the requested keys (w, b, f, etc.).</p><h2><b>Battles</b></h2><p>In fights, type the highlighted Vim keys quickly to attack.</p>`,
    titlePt: `Como jogar Vim Motion Academy`,
    titleEs: `Como jugar Vim Motion Academy`,
    titleVi: `Cach choi Vim Motion Academy`,
    titleId: `Cara main Vim Motion Academy`,
    titleDe: `Vim Motion Academy spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Vim Motion Academy`,
    descEn: `Short learning sessions fit developers who want playful Vim key practice instead of dry cheat sheets.`,
    leadEn: `<b>Best for 10-30 minute sessions when you want muscle memory for Vim motions wrapped in an RPG loop.</b>`,
    bodyEn: `<h2><b>Beginner Vim</b></h2><p>Home Row House lessons introduce h j k l before advanced motions.</p><h2><b>Drill focus</b></h2><p>Targeted tiles teach w, b, f, and command mode without leaving the game.</p><h2><b>Desktop keyboard</b></h2><p>The 960x720 canvas expects a physical keyboard inside the iframe.</p>`,
    titlePt: `Quando jogar Vim Motion Academy`,
    titleEs: `Cuando jugar Vim Motion Academy`,
    titleVi: `Khi nao choi Vim Motion Academy`,
    titleId: `Kapan main Vim Motion Academy`,
    titleDe: `Wann Vim Motion Academy spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Vim Motion Academy vs Other Browser Games`,
    descEn: `Compare payload and genre against other free games on this site.`,
    leadEn: `<b>Vim Motion Academy is a ${payload} educational RPG focused on Vim keys, not a reflex arcade or math quiz title.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Vim Motion Academy</td><td>${payload}</td><td>Vim motion drills in an RPG</td></tr><tr><td>Code Quest</td><td>~light</td><td>Programming puzzles</td></tr><tr><td>Pixel Realm RPG</td><td>~3.8 MB</td><td>Top-down exploration RPG</td></tr></table><p>Pick Vim Motion Academy when you want keyboard muscle memory for editor motions.</p>`,
    titlePt: `Vim Motion Academy vs outros jogos`,
    titleEs: `Vim Motion Academy vs otros juegos`,
    titleVi: `Vim Motion Academy so voi game khac`,
    titleId: `Vim Motion Academy vs game lain`,
    titleDe: `Vim Motion Academy vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Vim Motion Academy</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

function patchSiteData() {
  const path = join(ROOT, 'scripts/site-data.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/vim-motion-academy.html')) return;
  const guideBlock = `
  // fire107 vim-motion-academy
  '/guides/how-to-play-vim-motion-academy.html',
  '/guides/pt/how-to-play-vim-motion-academy.html',
  '/guides/es/how-to-play-vim-motion-academy.html',
  '/guides/vi/how-to-play-vim-motion-academy.html',
  '/guides/id/how-to-play-vim-motion-academy.html',
  '/guides/de/how-to-play-vim-motion-academy.html',
  '/guides/vim-motion-academy-when.html',
  '/guides/pt/vim-motion-academy-when.html',
  '/guides/es/vim-motion-academy-when.html',
  '/guides/vi/vim-motion-academy-when.html',
  '/guides/id/vim-motion-academy-when.html',
  '/guides/de/vim-motion-academy-when.html',
  '/guides/vim-motion-academy-vs-alternatives.html',
  '/guides/pt/vim-motion-academy-vs-alternatives.html',
  '/guides/es/vim-motion-academy-vs-alternatives.html',
  '/guides/vi/vim-motion-academy-vs-alternatives.html',
  '/guides/id/vim-motion-academy-vs-alternatives.html',
  '/guides/de/vim-motion-academy-vs-alternatives.html',`;
  text = text.replace(
    "  '/guides/de/precision-bounce-loop-vs-alternatives.html',",
    `  '/guides/de/precision-bounce-loop-vs-alternatives.html',${guideBlock}`,
  );
  text = text.replace(
    "  '/precision-bounce-loop.html': '/games/precision-bounce-loop.html',",
    `  '/precision-bounce-loop.html': '/games/precision-bounce-loop.html',
  '/vim-motion-academy.html': '/games/vim-motion-academy.html',`,
  );
  const jspBlock = `
  // fire107 vim-motion-academy guides
  '/guides/how-to-play-vim-motion-academy.html': 'guide/how-to-play-vim-motion-academy.jsp',
  '/guides/pt/how-to-play-vim-motion-academy.html': 'guide/pt/how-to-play-vim-motion-academy.jsp',
  '/guides/es/how-to-play-vim-motion-academy.html': 'guide/es/how-to-play-vim-motion-academy.jsp',
  '/guides/vi/how-to-play-vim-motion-academy.html': 'guide/vi/how-to-play-vim-motion-academy.jsp',
  '/guides/id/how-to-play-vim-motion-academy.html': 'guide/id/how-to-play-vim-motion-academy.jsp',
  '/guides/de/how-to-play-vim-motion-academy.html': 'guide/de/how-to-play-vim-motion-academy.jsp',
  '/guides/vim-motion-academy-when.html': 'guide/vim-motion-academy-when.jsp',
  '/guides/pt/vim-motion-academy-when.html': 'guide/pt/vim-motion-academy-when.jsp',
  '/guides/es/vim-motion-academy-when.html': 'guide/es/vim-motion-academy-when.jsp',
  '/guides/vi/vim-motion-academy-when.html': 'guide/vi/vim-motion-academy-when.jsp',
  '/guides/id/vim-motion-academy-when.html': 'guide/id/vim-motion-academy-when.jsp',
  '/guides/de/vim-motion-academy-when.html': 'guide/de/vim-motion-academy-when.jsp',
  '/guides/vim-motion-academy-vs-alternatives.html': 'guide/vim-motion-academy-vs-alternatives.jsp',
  '/guides/pt/vim-motion-academy-vs-alternatives.html': 'guide/pt/vim-motion-academy-vs-alternatives.jsp',
  '/guides/es/vim-motion-academy-vs-alternatives.html': 'guide/es/vim-motion-academy-vs-alternatives.jsp',
  '/guides/vi/vim-motion-academy-vs-alternatives.html': 'guide/vi/vim-motion-academy-vs-alternatives.jsp',
  '/guides/id/vim-motion-academy-vs-alternatives.html': 'guide/id/vim-motion-academy-vs-alternatives.jsp',
  '/guides/de/vim-motion-academy-vs-alternatives.html': 'guide/de/vim-motion-academy-vs-alternatives.jsp',
  '/games/vim-motion-academy.html': 'games/vim-motion-academy.jsp',`;
  text = text.replace(
    "  '/games/precision-bounce-loop.html': 'games/precision-bounce-loop.jsp',",
    `  '/games/precision-bounce-loop.html': 'games/precision-bounce-loop.jsp',${jspBlock}`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchSeoClusters() {
  const path = join(ROOT, 'scripts/seo-clusters.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/vim-motion-academy.html')) return;
  text = text.replace(
    "'/games/precision-bounce-loop.html'",
    "'/games/precision-bounce-loop.html', '/games/vim-motion-academy.html'",
  );
  writeFileSync(path, text, 'utf8');
}

function patchMenu() {
  const path = join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
  let text = readFileSync(path, 'utf8');
  if (text.includes('vim-motion-academy.html')) return;
  text = text.replace(
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/precision-bounce-loop.html'>Precision Bounce Loop</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/precision-bounce-loop.html'>Precision Bounce Loop</a>
                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/vim-motion-academy.html'>Vim Motion Academy</a>`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchRelated() {
  const path = join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
  let text = readFileSync(path, 'utf8');
  if (text.includes('vim-motion-academy.html')) return;
  text = text.replace(
    `{ title: "Precision Bounce Loop", url: "https://freetoolonline.com/games/precision-bounce-loop.html", include: !1, tags: "games" },`,
    `{ title: "Precision Bounce Loop", url: "https://freetoolonline.com/games/precision-bounce-loop.html", include: !1, tags: "games" },
    { title: "Vim Motion Academy", url: "https://freetoolonline.com/games/vim-motion-academy.html", include: !1, tags: "games" },`,
  );
  writeFileSync(path, text, 'utf8');
}

patchSiteData();
patchSeoClusters();
patchMenu();
patchRelated();

await patchCloudFront301({
  frontendRoot: FRONTEND,
  aliasUrl: '/vim-motion-academy.html',
  canonicalUrl: '/games/vim-motion-academy.html',
  runDate: '20260712-fire107',
});

console.log('Generated CMS + JSP + route patches for', slug);
