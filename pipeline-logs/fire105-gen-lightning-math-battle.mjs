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

const slug = 'lightning-math-battle';
const cms = 'lightningmathbattle';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~1.29 MB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Lightning Math Battle - Free Online Math Quiz Action Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Lightning Math Battle free in the browser: answer math problems to charge lightning strikes across eight practice modes and four difficulty tiers. ${payload} Canvas action game, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `lightning math battle, browser math game, math quiz action game, educational browser game`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>A browser math-quiz action game: pick a practice mode, choose a difficulty, then tap correct answers to charge lightning strikes against on-screen monsters.</p>
</div>
<div id="lmbWrapper" class="w3-container" style="background:#070b22; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="lmbStage" style="position:relative; width:100%; min-height:560px; background:#000; border-radius:6px; overflow:hidden;">
            <div id="lmbLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e8f4ff; padding:16px;">
                <div style="font:700 22px monospace; letter-spacing:1px;">LIGHTNING MATH BATTLE</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">Eight practice modes and four difficulty tiers. Press Play to load about ${payload}.</p>
                <button id="lmbPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="lmbStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="lmbFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#aaccee; margin-left:8px;">Tap or click answer buttons inside the frame; use the mute toggle in the game corner.</span>
    </div>
    <style>#lmbStage:fullscreen { border-radius:0; } #lmbStage iframe { display:block; width:100%; height:620px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Lightning Math Battle</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T17:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a math-quiz action game loads in the tab. Pick one of eight practice modes, choose Easy through Boss, then answer multiple-choice problems to charge lightning strikes.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Mode</td><td>Pick Add and Subtract, Times Tables, or six other practice modes</td></tr>
<tr><td>Difficulty</td><td>Tap Easy, Medium, Hard, or Boss</td></tr>
<tr><td>Answer</td><td>Tap one of the four answer buttons at the bottom</td></tr>
<tr><td>Progress</td><td>Best stars and scores persist in namespaced localStorage</td></tr>
</table>
<p>Adapted from pasuay/thunder-math (MIT). Canvas 2D plus vendored three.js lightning overlay, zero CDN after load.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var LMB_GAME_URL = 'lightning-math-battle/index.html';
    function lmbStatus(t){ var el=document.getElementById('lmbStatus'); if(el) el.textContent=t; }
    function lmbInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='lmbFrame'; frame.src=LMB_GAME_URL; frame.title='Lightning Math Battle';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ lmbStatus('Loaded. Pick a mode and difficulty inside the frame, then tap answers.'); });
        var launch=document.getElementById('lmbLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('lmbStage'), playBtn=document.getElementById('lmbPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('lmbFullscreenBtn');
        playBtn.addEventListener('click',function(){
            lmbStatus('Loading about ${payload}...'); lmbInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>How many practice modes are included?</summary><p>Eight modes cover addition and subtraction, times tables, place value, patterns, counting, number bonds, money, and number lines.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} for the single adapted index.html bundle.</p></details>
<details class="faq-item"><summary>Does progress save?</summary><p>Yes. Best stars and review facts persist in namespaced localStorage ftol:lightningmathbattle keys on this device.</p></details>`);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Lightning Math Battle - Step by Step`,
    descEn: `Launch Lightning Math Battle, pick a practice mode, choose a difficulty, and tap correct answers.`,
    leadEn: `<b>Click Play, pick a practice mode and Easy/Medium/Hard/Boss inside the iframe, then tap one of the four answer buttons for each math problem.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to load the iframe bundle.</p><h2><b>Pick a mode</b></h2><p>Choose from eight practice modes such as Add and Subtract or Times Tables.</p><h2><b>Set difficulty</b></h2><p>Tap Easy, Medium, Hard, or Boss to start a run.</p><h2><b>Answer</b></h2><p>Tap or click one of the four answer buttons at the bottom of the frame.</p><h2><b>Strike</b></h2><p>Correct answers charge lightning strikes against on-screen monsters.</p>`,
    titlePt: `Como jogar Lightning Math Battle`,
    titleEs: `Como jugar Lightning Math Battle`,
    titleVi: `Cach choi Lightning Math Battle`,
    titleId: `Cara main Lightning Math Battle`,
    titleDe: `Lightning Math Battle spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Lightning Math Battle`,
    descEn: `Short math practice sessions fit students and adults who want quiz drills with arcade feedback.`,
    leadEn: `<b>Best for quick math practice when you want eight modes and four difficulty tiers in one ${payload} browser bundle.</b>`,
    bodyEn: `<h2><b>Study breaks</b></h2><p>Five-minute runs reinforce addition, multiplication, and place value.</p><h2><b>Classroom warm-up</b></h2><p>Modes cover counting, number bonds, and number lines for varied ages.</p><h2><b>Score chasing</b></h2><p>Star ratings and best scores persist locally for repeat attempts.</p>`,
    titlePt: `Quando jogar Lightning Math Battle`,
    titleEs: `Cuando jugar Lightning Math Battle`,
    titleVi: `Khi nao choi Lightning Math Battle`,
    titleId: `Kapan main Lightning Math Battle`,
    titleDe: `Wann Lightning Math Battle spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Lightning Math Battle vs Other Browser Games`,
    descEn: `Compare payload and genre against other free games on this site.`,
    leadEn: `<b>Lightning Math Battle is a ${payload} math-quiz action game, not a stealth horror or voxel FPS title.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Lightning Math Battle</td><td>${payload}</td><td>Math quiz plus lightning combat</td></tr><tr><td>Thirteen Step Escape</td><td>~16 KB</td><td>Step-limit puzzle</td></tr><tr><td>Neural Particle Life</td><td>~19 KB</td><td>Evolution simulation</td></tr></table><p>Pick Lightning Math Battle for educational arcade math with eight practice modes.</p>`,
    titlePt: `Lightning Math Battle vs outros jogos`,
    titleEs: `Lightning Math Battle vs otros juegos`,
    titleVi: `Lightning Math Battle so voi game khac`,
    titleId: `Lightning Math Battle vs game lain`,
    titleDe: `Lightning Math Battle vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Lightning Math Battle</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

function patchSiteData() {
  const path = join(ROOT, 'scripts/site-data.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/lightning-math-battle.html')) return;
  const guideBlock = `
  // fire105 lightning-math-battle
  '/guides/how-to-play-lightning-math-battle.html',
  '/guides/pt/how-to-play-lightning-math-battle.html',
  '/guides/es/how-to-play-lightning-math-battle.html',
  '/guides/vi/how-to-play-lightning-math-battle.html',
  '/guides/id/how-to-play-lightning-math-battle.html',
  '/guides/de/how-to-play-lightning-math-battle.html',
  '/guides/lightning-math-battle-when.html',
  '/guides/pt/lightning-math-battle-when.html',
  '/guides/es/lightning-math-battle-when.html',
  '/guides/vi/lightning-math-battle-when.html',
  '/guides/id/lightning-math-battle-when.html',
  '/guides/de/lightning-math-battle-when.html',
  '/guides/lightning-math-battle-vs-alternatives.html',
  '/guides/pt/lightning-math-battle-vs-alternatives.html',
  '/guides/es/lightning-math-battle-vs-alternatives.html',
  '/guides/vi/lightning-math-battle-vs-alternatives.html',
  '/guides/id/lightning-math-battle-vs-alternatives.html',
  '/guides/de/lightning-math-battle-vs-alternatives.html',`;
  text = text.replace(
    "  '/guides/de/voxel-fps-arena-vs-alternatives.html',",
    `  '/guides/de/voxel-fps-arena-vs-alternatives.html',${guideBlock}`,
  );
  text = text.replace(
    "  '/voxel-fps-arena.html': '/games/voxel-fps-arena.html',",
    `  '/voxel-fps-arena.html': '/games/voxel-fps-arena.html',
  '/lightning-math-battle.html': '/games/lightning-math-battle.html',`,
  );
  const jspBlock = `
  // fire105 lightning-math-battle guides
  '/guides/how-to-play-lightning-math-battle.html': 'guide/how-to-play-lightning-math-battle.jsp',
  '/guides/pt/how-to-play-lightning-math-battle.html': 'guide/pt/how-to-play-lightning-math-battle.jsp',
  '/guides/es/how-to-play-lightning-math-battle.html': 'guide/es/how-to-play-lightning-math-battle.jsp',
  '/guides/vi/how-to-play-lightning-math-battle.html': 'guide/vi/how-to-play-lightning-math-battle.jsp',
  '/guides/id/how-to-play-lightning-math-battle.html': 'guide/id/how-to-play-lightning-math-battle.jsp',
  '/guides/de/how-to-play-lightning-math-battle.html': 'guide/de/how-to-play-lightning-math-battle.jsp',
  '/guides/lightning-math-battle-when.html': 'guide/lightning-math-battle-when.jsp',
  '/guides/pt/lightning-math-battle-when.html': 'guide/pt/lightning-math-battle-when.jsp',
  '/guides/es/lightning-math-battle-when.html': 'guide/es/lightning-math-battle-when.jsp',
  '/guides/vi/lightning-math-battle-when.html': 'guide/vi/lightning-math-battle-when.jsp',
  '/guides/id/lightning-math-battle-when.html': 'guide/id/lightning-math-battle-when.jsp',
  '/guides/de/lightning-math-battle-when.html': 'guide/de/lightning-math-battle-when.jsp',
  '/guides/lightning-math-battle-vs-alternatives.html': 'guide/lightning-math-battle-vs-alternatives.jsp',
  '/guides/pt/lightning-math-battle-vs-alternatives.html': 'guide/pt/lightning-math-battle-vs-alternatives.jsp',
  '/guides/es/lightning-math-battle-vs-alternatives.html': 'guide/es/lightning-math-battle-vs-alternatives.jsp',
  '/guides/vi/lightning-math-battle-vs-alternatives.html': 'guide/vi/lightning-math-battle-vs-alternatives.jsp',
  '/guides/id/lightning-math-battle-vs-alternatives.html': 'guide/id/lightning-math-battle-vs-alternatives.jsp',
  '/guides/de/lightning-math-battle-vs-alternatives.html': 'guide/de/lightning-math-battle-vs-alternatives.jsp',
  '/games/lightning-math-battle.html': 'games/lightning-math-battle.jsp',`;
  text = text.replace(
    "  '/games/voxel-fps-arena.html': 'games/voxel-fps-arena.jsp',",
    `  '/games/voxel-fps-arena.html': 'games/voxel-fps-arena.jsp',${jspBlock}`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchSeoClusters() {
  const path = join(ROOT, 'scripts/seo-clusters.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/lightning-math-battle.html')) return;
  text = text.replace(
    "'/games/voxel-fps-arena.html'",
    "'/games/voxel-fps-arena.html', '/games/lightning-math-battle.html'",
  );
  writeFileSync(path, text, 'utf8');
}

function patchMenu() {
  const path = join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
  let text = readFileSync(path, 'utf8');
  if (text.includes('lightning-math-battle.html')) return;
  text = text.replace(
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/voxel-fps-arena.html'>Voxel FPS Arena</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/voxel-fps-arena.html'>Voxel FPS Arena</a>
                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/lightning-math-battle.html'>Lightning Math Battle</a>`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchRelated() {
  const path = join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
  let text = readFileSync(path, 'utf8');
  if (text.includes('lightning-math-battle.html')) return;
  text = text.replace(
    `{ title: "Voxel FPS Arena", url: "https://freetoolonline.com/games/voxel-fps-arena.html", include: !1, tags: "games" },`,
    `{ title: "Voxel FPS Arena", url: "https://freetoolonline.com/games/voxel-fps-arena.html", include: !1, tags: "games" },
    { title: "Lightning Math Battle", url: "https://freetoolonline.com/games/lightning-math-battle.html", include: !1, tags: "games" },`,
  );
  writeFileSync(path, text, 'utf8');
}

patchSiteData();
patchSeoClusters();
patchMenu();
patchRelated();

await patchCloudFront301({
  frontendRoot: FRONTEND,
  aliasUrl: '/lightning-math-battle.html',
  canonicalUrl: '/games/lightning-math-battle.html',
  runDate: '20260712-fire105',
});

console.log('Generated CMS + JSP + route patches for', slug);
