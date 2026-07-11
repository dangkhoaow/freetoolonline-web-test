#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'sketch-turf-battle';
const cms = 'sketchturfbattle';
const route = `/games/${slug}.html`;
const date = '2026-07-11';
const payload = '~595 KB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Sketch Turf Battle - Free Online Sketch Turf Battle Browser Game`);
w(
  join(CMS, `BODYDESC${cms}.txt`),
  `Play Sketch Turf Battle free in the browser: 3-minute doodle turf wars with paint bombs, four fighters, career and adventure modes. ${payload} Canvas game, no install.`,
);
w(
  join(CMS, `BODYKW${cms}.txt`),
  `sketch turf battle game, browser paint war game, turf coverage game online, free doodle shooter game`,
);
w(
  join(CMS, `BODYHTML${cms}.html`),
  `<div class="w3-container">
    <p>Doodle turf battle: paint the map, splat rivals, and win 3-minute matches across ten stage themes. WASD to move, hold click to spray, right-click for paint bombs, Q for fighter skills.</p>
</div>
<div id="stbWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="stbStage" style="position:relative; width:100%; min-height:520px; background:#f4d9d5; border-radius:6px; overflow:hidden;">
            <div id="stbLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#1c1c1a; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; color:#2f66e0;">SKETCH TURF BATTLE</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#4a4a48;">Canvas turf-paint battle in the browser. Press Play to load about ${payload}.</p>
                <button id="stbPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="stbStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="stbFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: WASD to move; hold click to paint; right-click bomb; Q skill; touch dual-stick on phones.</span>
    </div>
    <style>#stbStage:fullscreen { border-radius:0; } #stbStage iframe { display:block; width:100%; height:560px; border:0; }</style>
</div>`,
);
w(
  join(CMS, `BODYWELCOME${cms}.html`),
  `<h1 class="text-uppercase"><b>Sketch Turf Battle</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-11T20:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a hand-drawn turf war loads in the tab. Pick career or adventure, choose a fighter, and cover the map in your team color before the 3-minute timer ends.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Move</td><td>WASD or arrow keys; touch left stick on mobile</td></tr>
<tr><td>Paint</td><td>Hold left click or drag on the right touch zone</td></tr>
<tr><td>Bomb</td><td>Right click or the bomb touch button</td></tr>
<tr><td>Skill</td><td>Press Q or the Q touch button (2 uses per match)</td></tr>
</table>
<p>Adapted from qxbyte/doodle-slam (MIT). Procedural Web Audio BGM and SFX, local PNG icons, zero CDN after load. Career stars, daily run scores, and settings persist in namespaced localStorage.</p>`,
);
w(
  join(CMS, `BODYJS${cms}.html`),
  `<script>
    web.localUpload = false;
    var STB_GAME_URL = 'sketch-turf-battle/index.html';
    function stbStatus(t){ var el=document.getElementById('stbStatus'); if(el) el.textContent=t; }
    function stbInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='stbFrame'; frame.src=STB_GAME_URL; frame.title='Sketch Turf Battle';
        frame.setAttribute('allow','fullscreen; pointer-lock'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ stbStatus('Loaded. Click inside the frame, then press PLAY on the title screen.'); });
        var launch=document.getElementById('stbLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('stbStage'), playBtn=document.getElementById('stbPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('stbFullscreenBtn');
        playBtn.addEventListener('click',function(){
            stbStatus('Loading about ${payload}...'); stbInjectFrame(stage);
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
  `<details class="faq-item"><summary>Does Sketch Turf Battle save progress?</summary><p>Yes. Career stars, daily run scores, achievements, and settings persist in localStorage under namespaced ftol:sketchturfbattle keys.</p></details>
<details class="faq-item"><summary>What controls does the game use?</summary><p>Keyboard: WASD or arrows to move, hold left click to paint, right click for paint bombs, Q for skills, M to mute. Touch devices get dual virtual sticks plus bomb and skill buttons.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} total across HTML, CSS, JavaScript modules, and PNG icons.</p></details>`,
);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Sketch Turf Battle - Step by Step`,
    descEn: `Launch Sketch Turf Battle, pick career or adventure, choose a fighter, and win 3-minute turf coverage matches.`,
    leadEn: `<b>Click Play, open the title screen inside the frame, pick a mode, then use WASD and hold click to paint turf before time runs out.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page, then click PLAY on the in-game title screen.</p><h2><b>Modes</b></h2><p>Career runs stage and map picks with star challenges. Adventure is a shorter story line with a boss fight.</p><h2><b>Combat</b></h2><p>Move with WASD, hold left click to spray paint, right click to throw paint bombs, and press Q for your fighter skill twice per match.</p><h2><b>Win</b></h2><p>Cover the most ground before the 3-minute timer ends. SLAM TIME in the last 30 seconds enlarges splats.</p>`,
    titlePt: `Como jogar Sketch Turf Battle`,
    titleEs: `Como jugar Sketch Turf Battle`,
    titleVi: `Cach choi Sketch Turf Battle`,
    titleId: `Cara main Sketch Turf Battle`,
    titleDe: `Sketch Turf Battle spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Sketch Turf Battle`,
    descEn: `Short 3-minute turf matches fit quick breaks with career progression and daily run scores.`,
    leadEn: `<b>Best for a 5-20 minute session when you want a paint-war arcade loop without downloads or accounts.</b>`,
    bodyEn: `<h2><b>Quick matches</b></h2><p>Each round lasts 3 minutes with instant restarts from the title screen.</p><h2><b>Progression</b></h2><p>Career stars unlock new stages; daily run tracks your best coverage score for the day.</p><h2><b>Desktop or touch</b></h2><p>Mouse and keyboard work on desktop; phones get dual-stick touch controls.</p>`,
    titlePt: `Quando jogar Sketch Turf Battle`,
    titleEs: `Cuando jugar Sketch Turf Battle`,
    titleVi: `Khi nao choi Sketch Turf Battle`,
    titleId: `Kapan main Sketch Turf Battle`,
    titleDe: `Wann Sketch Turf Battle spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Sketch Turf Battle vs Other Browser Games`,
    descEn: `Compare payload, session length, and mechanics against other free games on this site.`,
    leadEn: `<b>Sketch Turf Battle is a ${payload} Canvas turf-paint shooter with career modes, not a racer or card duel.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Sketch Turf Battle</td><td>${payload}</td><td>3-min turf paint war, 4 fighters, 10 stages</td></tr><tr><td>Inferno Soul Walker</td><td>~17 KB</td><td>WebGL first-person maze explorer</td></tr><tr><td>Medieval Wall Defense</td><td>~631 KB</td><td>Incremental wall defense</td></tr></table><p>Pick Sketch Turf Battle when you want multiplayer-style bot turf wars instead of maze exploration or tower defense.</p>`,
    titlePt: `Sketch Turf Battle vs outros jogos`,
    titleEs: `Sketch Turf Battle vs otros juegos`,
    titleVi: `Sketch Turf Battle so voi game khac`,
    titleId: `Sketch Turf Battle vs game lain`,
    titleDe: `Sketch Turf Battle vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Sketch Turf Battle</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

console.log('Generated CMS + JSP for', slug);
