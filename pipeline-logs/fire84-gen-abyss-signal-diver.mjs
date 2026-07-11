#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'abyss-signal-diver';
const cms = 'abysssignaldiver';
const route = `/games/${slug}.html`;
const date = '2026-07-11';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Abyss Signal Diver - Free Online Underwater Exploration Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Abyss Signal Diver free in the browser: pilot a deep-sea sub, scan with sonar, find the signal source, and carry it to the surface. ~28 KB WebGL2, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `abyss signal diver, underwater browser game, js13k deep sea game, free webgl submarine game`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>Underwater WebGL exploration: steer a sub with WASD and EQ, toggle spotlight (F) and sonar (1), fix hull leaks with G, and recover the signal beacon to the surface.</p>
</div>
<div id="asdWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="asdStage" style="position:relative; width:100%; min-height:520px; background:#0a1218; border-radius:6px; overflow:hidden;">
            <div id="asdLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6edf3; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; color:#6ec8ff;">ABYSS SIGNAL DIVER</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#9db0c5;">JS13K deep-sea WebGL2 game in the browser. Press Play to load about ~28 KB.</p>
                <button id="asdPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="asdStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="asdFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: keyboard controls (WASD, E/Q, F, G, 1/2). Click once for audio.</span>
    </div>
    <style>#asdStage:fullscreen { border-radius:0; } #asdStage iframe { display:block; width:100%; height:560px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Abyss Signal Diver</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-11T18:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a compact WebGL2 sub sim loads in the tab. Explore procedural caverns, track a mysterious signal with sonar, recover the beacon, and surface before air or battery runs out.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Key</th><th>Action</th></tr>
<tr><td>W / S</td><td>Forward / reverse thrust</td></tr>
<tr><td>E / Q</td><td>Rise / dive</td></tr>
<tr><td>A / D</td><td>Turn left / right</td></tr>
<tr><td>F</td><td>Toggle spotlight</td></tr>
<tr><td>1</td><td>Toggle sonar (50 / 100 range)</td></tr>
<tr><td>2</td><td>Toggle signal scan overlay</td></tr>
<tr><td>G</td><td>Fix hull leak when prompted</td></tr>
<tr><td>R</td><td>Drop recovered beacon</td></tr>
<tr><td>Space</td><td>Restart after drowning or win</td></tr>
</table>
<p>Adapted from jagenjo/JS13K2024 Deep13 (MIT, JS13K 2024). Procedural WebGL2 world plus one local head.xbin mesh - zero CDN after load.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var ASD_GAME_URL = 'abyss-signal-diver/index.html';
    function asdStatus(t){ var el=document.getElementById('asdStatus'); if(el) el.textContent=t; }
    function asdInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='asdFrame'; frame.src=ASD_GAME_URL; frame.title='Abyss Signal Diver';
        frame.setAttribute('allow','fullscreen; autoplay'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ asdStatus('Loaded. Click inside for audio; use WASD + E/Q to move.'); });
        var launch=document.getElementById('asdLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('asdStage'), playBtn=document.getElementById('asdPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('asdFullscreenBtn');
        playBtn.addEventListener('click',function(){
            asdStatus('Loading about ~28 KB...'); asdInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>Does Abyss Signal Diver save progress?</summary><p>No. Runs are session-only; there is no localStorage save in the engine.</p></details>
<details class="faq-item"><summary>How do I win?</summary><p>Find the signal beacon underwater, pick it up, then reach the surface (about y=170) while still carrying it.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About 28 KB HTML/JS plus a 176-byte head.xbin mesh asset.</p></details>`);

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
w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Abyss Signal Diver - Step by Step`,
    descEn: `Launch Abyss Signal Diver, steer with WASD and E/Q, use sonar to find the signal, and surface with the beacon.`,
    leadEn: `<b>Click Play, then use W/S thrust, E/Q depth, and sonar (1) to locate the signal beacon before air or battery runs out.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to inject the iframe. Click inside once to enable audio.</p><h2><b>Movement</b></h2><p>W and S add forward and reverse thrust. E and Q rise and dive. A and D turn the sub.</p><h2><b>Tools</b></h2><p>F toggles the spotlight. Press 1 to cycle sonar off, short range, or long range. Press 2 for the signal scan overlay.</p><h2><b>Objective</b></h2><p>Follow the signal to the beacon, pick it up, then reach the surface while carrying it. Press G repeatedly when a hull leak opens.</p><h2><b>Restart</b></h2><p>Press Space after drowning or completing a run.</p>`,
    titlePt: `Como jogar Abyss Signal Diver`,
    titleEs: `Como jugar Abyss Signal Diver`,
    titleVi: `Cach choi Abyss Signal Diver`,
    titleId: `Cara main Abyss Signal Diver`,
    titleDe: `Abyss Signal Diver spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Abyss Signal Diver`,
    descEn: `Short underwater exploration sessions fit quick breaks: one procedural dive with sonar and battery management.`,
    leadEn: `<b>Best for a 10-15 minute break when you want a tiny WebGL sub sim with exploration and resource meters.</b>`,
    bodyEn: `<h2><b>Exploration mood</b></h2><p>Procedural caverns and a sonar ping loop reward careful navigation.</p><h2><b>No account</b></h2><p>Runs in the browser with no login and no save file.</p><h2><b>Keyboard only</b></h2><p>Designed for keyboard controls; mouse click enables audio.</p>`,
    titlePt: `Quando jogar Abyss Signal Diver`,
    titleEs: `Cuando jugar Abyss Signal Diver`,
    titleVi: `Khi nao choi Abyss Signal Diver`,
    titleId: `Kapan main Abyss Signal Diver`,
    titleDe: `Wann Abyss Signal Diver spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Abyss Signal Diver vs Other Browser Games`,
    descEn: `Compare payload size, genre, and session length against other free games on this site.`,
    leadEn: `<b>Abyss Signal Diver is a ~28 KB underwater WebGL explorer, not a racer or card duel.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Abyss Signal Diver</td><td>~28 KB</td><td>Sub exploration, sonar, beacon recovery</td></tr><tr><td>Thirteen Card Duel</td><td>~40 KB</td><td>Turn-based card battle vs CPU</td></tr><tr><td>Pixel Necromancer</td><td>~27 KB</td><td>Spell arena with resurrection</td></tr></table><p>Pick Abyss Signal Diver when you want slow exploration and meter management instead of action or puzzle genres.</p>`,
    titlePt: `Abyss Signal Diver vs outros jogos`,
    titleEs: `Abyss Signal Diver vs otros juegos`,
    titleVi: `Abyss Signal Diver so voi game khac`,
    titleId: `Abyss Signal Diver vs game lain`,
    titleDe: `Abyss Signal Diver vs andere Spiele`,
  },
];

for (const g of guides) {
  for (const [lang] of Object.entries(locales)) {
    const cmsKey = lang === 'en'
      ? `guides${g.kebab.replace(/-/g, '')}`
      : `guides${lang}${g.kebab.replace(/-/g, '')}`;
    const title =
      lang === 'en' ? g.titleEn :
      lang === 'pt' ? g.titlePt :
      lang === 'es' ? g.titleEs :
      lang === 'vi' ? g.titleVi :
      lang === 'id' ? g.titleId : g.titleDe;

    w(join(CMS, `BODYTITLE${cmsKey}.txt`), title);
    w(join(CMS, `BODYDESC${cmsKey}.txt`), g.descEn);
    w(join(CMS, `BODYHTML${cmsKey}.html`), `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Abyss Signal Diver</a> loads about ~28 KB in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`);

    const guideJspDir = lang === 'en' ? JSP_GUIDE : join(JSP_GUIDE, lang);
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

console.log('Generated CMS + JSP for', slug);
