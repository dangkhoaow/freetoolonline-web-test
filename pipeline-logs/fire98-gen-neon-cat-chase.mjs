#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'neon-cat-chase';
const cms = 'neoncatchase';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~8 KB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Neon Cat Chase - Free Online Neon Arcade Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Neon Cat Chase free in the browser: collect cheese, dodge dogs, and survive with nine lives across neon levels. ${payload} js13k arcade, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `neon cat chase game, browser cat arcade, cheese chase game, js13k arcade online`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>Neon arcade chase: move a black cat to collect cheese pieces, avoid angry dogs, and advance levels. Start with nine lives; every ten points adds a bonus life.</p>
</div>
<div id="nccWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="nccStage" style="position:relative; width:100%; min-height:520px; background:#070016; border-radius:6px; overflow:hidden;">
            <div id="nccLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#fff; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; color:#44ddff;">NEON CAT CHASE</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">js13k neon arcade in the browser. Press Play to load about ${payload}.</p>
                <button id="nccPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="nccStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="nccFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: WASD or arrows to move; Space to start; M toggles chiptune music.</span>
    </div>
    <style>#nccStage:fullscreen { border-radius:0; } #nccStage iframe { display:block; width:100%; height:560px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Neon Cat Chase</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T06:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a neon arcade chase loads in the tab. Press Space on the title screen, then collect ten cheese pieces per level while dodging dogs.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Start</td><td>Press Space or Enter on the title screen</td></tr>
<tr><td>Move</td><td>WASD or arrow keys</td></tr>
<tr><td>Goal</td><td>Collect cheese; avoid red dogs; survive with lives</td></tr>
<tr><td>Music</td><td>Press M to mute chiptune background bleeps</td></tr>
</table>
<p>Adapted from js13kGames/9-lives (MIT). Procedural Canvas art and Web Audio chiptune, zero CDN after load. Best score persists in namespaced localStorage.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var NCC_GAME_URL = 'neon-cat-chase/index.html';
    function nccStatus(t){ var el=document.getElementById('nccStatus'); if(el) el.textContent=t; }
    function nccInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='nccFrame'; frame.src=NCC_GAME_URL; frame.title='Neon Cat Chase';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ nccStatus('Loaded. Press Space on the title screen inside the frame.'); });
        var launch=document.getElementById('nccLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('nccStage'), playBtn=document.getElementById('nccPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('nccFullscreenBtn');
        playBtn.addEventListener('click',function(){
            nccStatus('Loading about ${payload}...'); nccInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>Does Neon Cat Chase save my best score?</summary><p>Yes. Your best score persists in localStorage under namespaced ftol:neoncatchase keys.</p></details>
<details class="faq-item"><summary>What controls does the game use?</summary><p>WASD or arrows move the cat. Space or Enter starts a run from the title screen. M toggles chiptune music.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} in a single self-contained HTML file.</p></details>`);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Neon Cat Chase - Step by Step`,
    descEn: `Launch Neon Cat Chase, press Space to start, move with WASD, collect cheese, and dodge dogs.`,
    leadEn: `<b>Click Play, press Space inside the frame, then use WASD or arrows to grab cheese while avoiding red dogs.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page, then Space on the neon title screen.</p><h2><b>Collect</b></h2><p>Touch yellow cheese triangles to score. Collect ten per level to advance.</p><h2><b>Survive</b></h2><p>Red dogs chase you. Each hit costs one life. Every ten points restores a life up to eighteen.</p><h2><b>Music</b></h2><p>Press M to mute the procedural chiptune loop.</p>`,
    titlePt: `Como jogar Neon Cat Chase`,
    titleEs: `Como jugar Neon Cat Chase`,
    titleVi: `Cach choi Neon Cat Chase`,
    titleId: `Cara main Neon Cat Chase`,
    titleDe: `Neon Cat Chase spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Neon Cat Chase`,
    descEn: `Short neon arcade sessions fit quick breaks between longer games on this site.`,
    leadEn: `<b>Best for 3-10 minute breaks when you want a tiny js13k arcade loop instead of a multi-megabyte RPG or bullet-hell run.</b>`,
    bodyEn: `<h2><b>Micro session</b></h2><p>The entire game is about 8 KB and boots instantly after Play.</p><h2><b>Arcade loop</b></h2><p>Levels escalate dog count and palette. Chasing high scores rewards repeat tries.</p><h2><b>Keyboard first</b></h2><p>Desktop WASD or arrows work best; the canvas scales to your viewport.</p>`,
    titlePt: `Quando jogar Neon Cat Chase`,
    titleEs: `Cuando jugar Neon Cat Chase`,
    titleVi: `Khi nao choi Neon Cat Chase`,
    titleId: `Kapan main Neon Cat Chase`,
    titleDe: `Wann Neon Cat Chase spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Neon Cat Chase vs Other Browser Games`,
    descEn: `Compare payload and genre against other free arcade games on this site.`,
    leadEn: `<b>Neon Cat Chase is an ${payload} js13k cheese-chase arcade, not a bullet-hell shooter or top-down RPG.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Neon Cat Chase</td><td>${payload}</td><td>Collect cheese, dodge dogs, nine lives</td></tr><tr><td>Glow Firefly Cat</td><td>~28 KB</td><td>js13k timing firefly collector</td></tr><tr><td>Pixel Realm RPG</td><td>~3.8 MB</td><td>Top-down RPG with inventory</td></tr></table><p>Pick Neon Cat Chase for a ultra-light neon arcade break.</p>`,
    titlePt: `Neon Cat Chase vs outros jogos`,
    titleEs: `Neon Cat Chase vs otros juegos`,
    titleVi: `Neon Cat Chase so voi game khac`,
    titleId: `Neon Cat Chase vs game lain`,
    titleDe: `Neon Cat Chase vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Neon Cat Chase</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

function patchSiteData() {
  const path = join(ROOT, 'scripts/site-data.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/neon-cat-chase.html')) return;
  const guideBlock = `
  // fire98 neon-cat-chase
  '/guides/how-to-play-neon-cat-chase.html',
  '/guides/pt/how-to-play-neon-cat-chase.html',
  '/guides/es/how-to-play-neon-cat-chase.html',
  '/guides/vi/how-to-play-neon-cat-chase.html',
  '/guides/id/how-to-play-neon-cat-chase.html',
  '/guides/de/how-to-play-neon-cat-chase.html',
  '/guides/neon-cat-chase-when.html',
  '/guides/pt/neon-cat-chase-when.html',
  '/guides/es/neon-cat-chase-when.html',
  '/guides/vi/neon-cat-chase-when.html',
  '/guides/id/neon-cat-chase-when.html',
  '/guides/de/neon-cat-chase-when.html',
  '/guides/neon-cat-chase-vs-alternatives.html',
  '/guides/pt/neon-cat-chase-vs-alternatives.html',
  '/guides/es/neon-cat-chase-vs-alternatives.html',
  '/guides/vi/neon-cat-chase-vs-alternatives.html',
  '/guides/id/neon-cat-chase-vs-alternatives.html',
  '/guides/de/neon-cat-chase-vs-alternatives.html',`;
  text = text.replace(
    "  '/guides/de/pixel-realm-rpg-vs-alternatives.html',",
    `  '/guides/de/pixel-realm-rpg-vs-alternatives.html',${guideBlock}`,
  );
  text = text.replace(
    "  '/pixel-realm-rpg.html': '/games/pixel-realm-rpg.html',",
    `  '/pixel-realm-rpg.html': '/games/pixel-realm-rpg.html',
  '/neon-cat-chase.html': '/games/neon-cat-chase.html',`,
  );
  const jspBlock = `
  // fire98 neon-cat-chase guides
  '/guides/how-to-play-neon-cat-chase.html': 'guide/how-to-play-neon-cat-chase.jsp',
  '/guides/pt/how-to-play-neon-cat-chase.html': 'guide/pt/how-to-play-neon-cat-chase.jsp',
  '/guides/es/how-to-play-neon-cat-chase.html': 'guide/es/how-to-play-neon-cat-chase.jsp',
  '/guides/vi/how-to-play-neon-cat-chase.html': 'guide/vi/how-to-play-neon-cat-chase.jsp',
  '/guides/id/how-to-play-neon-cat-chase.html': 'guide/id/how-to-play-neon-cat-chase.jsp',
  '/guides/de/how-to-play-neon-cat-chase.html': 'guide/de/how-to-play-neon-cat-chase.jsp',
  '/guides/neon-cat-chase-when.html': 'guide/neon-cat-chase-when.jsp',
  '/guides/pt/neon-cat-chase-when.html': 'guide/pt/neon-cat-chase-when.jsp',
  '/guides/es/neon-cat-chase-when.html': 'guide/es/neon-cat-chase-when.jsp',
  '/guides/vi/neon-cat-chase-when.html': 'guide/vi/neon-cat-chase-when.jsp',
  '/guides/id/neon-cat-chase-when.html': 'guide/id/neon-cat-chase-when.jsp',
  '/guides/de/neon-cat-chase-when.html': 'guide/de/neon-cat-chase-when.jsp',
  '/guides/neon-cat-chase-vs-alternatives.html': 'guide/neon-cat-chase-vs-alternatives.jsp',
  '/guides/pt/neon-cat-chase-vs-alternatives.html': 'guide/pt/neon-cat-chase-vs-alternatives.jsp',
  '/guides/es/neon-cat-chase-vs-alternatives.html': 'guide/es/neon-cat-chase-vs-alternatives.jsp',
  '/guides/vi/neon-cat-chase-vs-alternatives.html': 'guide/vi/neon-cat-chase-vs-alternatives.jsp',
  '/guides/id/neon-cat-chase-vs-alternatives.html': 'guide/id/neon-cat-chase-vs-alternatives.jsp',
  '/guides/de/neon-cat-chase-vs-alternatives.html': 'guide/de/neon-cat-chase-vs-alternatives.jsp',
  '/games/neon-cat-chase.html': 'games/neon-cat-chase.jsp',`;
  text = text.replace(
    "  '/games/pixel-realm-rpg.html': 'games/pixel-realm-rpg.jsp',",
    `  '/games/pixel-realm-rpg.html': 'games/pixel-realm-rpg.jsp',${jspBlock}`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchSeoClusters() {
  const path = join(ROOT, 'scripts/seo-clusters.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/neon-cat-chase.html')) return;
  text = text.replace(
    "'/games/pixel-realm-rpg.html'",
    "'/games/pixel-realm-rpg.html', '/games/neon-cat-chase.html'",
  );
  writeFileSync(path, text, 'utf8');
}

function patchMenu() {
  const path = join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
  let text = readFileSync(path, 'utf8');
  if (text.includes('neon-cat-chase.html')) return;
  text = text.replace(
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/pixel-realm-rpg.html'>Pixel Realm RPG</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/pixel-realm-rpg.html'>Pixel Realm RPG</a>
                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/neon-cat-chase.html'>Neon Cat Chase</a>`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchRelated() {
  const path = join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
  let text = readFileSync(path, 'utf8');
  if (text.includes('neon-cat-chase.html')) return;
  text = text.replace(
    `{ title: "Pixel Realm RPG", url: "https://freetoolonline.com/games/pixel-realm-rpg.html", include: !1, tags: "games" },`,
    `{ title: "Pixel Realm RPG", url: "https://freetoolonline.com/games/pixel-realm-rpg.html", include: !1, tags: "games" },
    { title: "Neon Cat Chase", url: "https://freetoolonline.com/games/neon-cat-chase.html", include: !1, tags: "games" },`,
  );
  writeFileSync(path, text, 'utf8');
}

patchSiteData();
patchSeoClusters();
patchMenu();
patchRelated();

console.log('Generated CMS + JSP + route patches for', slug);
