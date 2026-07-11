#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'inferno-soul-walker';
const cms = 'infernosoulwalker';
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

w(join(CMS, `BODYTITLE${cms}.txt`), `Inferno Soul Walker - Free Online WebGL Inferno Explorer Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Inferno Soul Walker free in the browser: first-person WebGL maze through infernal structures, collect 13 lost souls, and pull levers. ~17 KB, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `inferno soul walker, webgl browser game, js13k inferno game, free 3d maze game online`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>WebGL inferno explorer: walk in first person with WASD or arrows, interact with Space/E/Enter, and collect 13 souls across a 3D maze of levers and traps.</p>
</div>
<div id="iswWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="iswStage" style="position:relative; width:100%; min-height:520px; background:#1a0a0a; border-radius:6px; overflow:hidden;">
            <div id="iswLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6edf3; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; color:#ff6b4a;">INFERNO SOUL WALKER</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#c5a090;">JS13K WebGL inferno maze in the browser. Press Play to load about ~17 KB.</p>
                <button id="iswPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="iswStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="iswFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: WASD or arrows to move; Space/E to interact; mouse to look.</span>
    </div>
    <style>#iswStage:fullscreen { border-radius:0; } #iswStage iframe { display:block; width:100%; height:560px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Inferno Soul Walker</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-11T20:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a compact WebGL2 inferno maze loads in the tab. Explore twisted 3D structures in first person, pull levers, and recover 13 lost souls to complete the run.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Key</th><th>Action</th></tr>
<tr><td>W / Up</td><td>Move forward</td></tr>
<tr><td>S / Down</td><td>Move backward</td></tr>
<tr><td>A / Left</td><td>Turn / strafe left</td></tr>
<tr><td>D / Right</td><td>Turn / strafe right</td></tr>
<tr><td>Space / E / Enter</td><td>Interact (levers, souls)</td></tr>
<tr><td>Mouse</td><td>Look around (first person)</td></tr>
<tr><td>Escape</td><td>Open menu</td></tr>
</table>
<p>Adapted from SalvatorePreviti/js13k-2022 (MIT, JS13K 2022). Inlined Soundbox music - zero CDN after load.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var ISW_GAME_URL = 'inferno-soul-walker/index.html';
    function iswStatus(t){ var el=document.getElementById('iswStatus'); if(el) el.textContent=t; }
    function iswInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='iswFrame'; frame.src=ISW_GAME_URL; frame.title='Inferno Soul Walker';
        frame.setAttribute('allow','fullscreen; autoplay'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ iswStatus('Loaded. Click inside, then WASD + Space to play.'); });
        var launch=document.getElementById('iswLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('iswStage'), playBtn=document.getElementById('iswPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('iswFullscreenBtn');
        playBtn.addEventListener('click',function(){
            iswStatus('Loading about ~17 KB...'); iswInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>Does Inferno Soul Walker save progress?</summary><p>No. Runs are session-only; there is no localStorage save in the shipped bundle.</p></details>
<details class="faq-item"><summary>How do I win?</summary><p>Collect all 13 lost souls scattered through the inferno maze.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About 17 KB (single roadroller-compressed HTML/JS/WebGL bundle).</p></details>`);

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
    titleEn: `How to Play Inferno Soul Walker - Step by Step`,
    descEn: `Launch Inferno Soul Walker, move with WASD, interact with Space, and collect 13 souls in the WebGL inferno maze.`,
    leadEn: `<b>Click Play, then use WASD or arrow keys to walk the 3D inferno and Space/E to interact with levers and soul pickups.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to inject the iframe. Click inside once so music and input unlock.</p><h2><b>Movement</b></h2><p>W and Up move forward; S and Down move back; A/D or arrows turn and strafe. Move the mouse to look in first person.</p><h2><b>Interact</b></h2><p>Press Space, E, or Enter near levers, doors, and glowing souls.</p><h2><b>Goal</b></h2><p>Find and collect all 13 lost souls across the infernal structures. Escape opens the menu; use Restart to reset.</p>`,
    titlePt: `Como jogar Inferno Soul Walker`,
    titleEs: `Como jugar Inferno Soul Walker`,
    titleVi: `Cach choi Inferno Soul Walker`,
    titleId: `Cara main Inferno Soul Walker`,
    titleDe: `Inferno Soul Walker spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Inferno Soul Walker`,
    descEn: `Short WebGL exploration sessions fit players who want a tiny 3D maze with soul-collection goals.`,
    leadEn: `<b>Best for a 15-20 minute session when you want a compact first-person WebGL explorer without downloads.</b>`,
    bodyEn: `<h2><b>Exploration mood</b></h2><p>Twisted infernal architecture and lever puzzles reward careful navigation.</p><h2><b>No account</b></h2><p>Runs in the browser with no login and no save file.</p><h2><b>Keyboard + mouse</b></h2><p>Designed for keyboard movement with mouse look; touch split controls on mobile.</p>`,
    titlePt: `Quando jogar Inferno Soul Walker`,
    titleEs: `Cuando jugar Inferno Soul Walker`,
    titleVi: `Khi nao choi Inferno Soul Walker`,
    titleId: `Kapan main Inferno Soul Walker`,
    titleDe: `Wann Inferno Soul Walker spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Inferno Soul Walker vs Other Browser Games`,
    descEn: `Compare payload size, genre, and session length against other free games on this site.`,
    leadEn: `<b>Inferno Soul Walker is a ~17 KB WebGL first-person maze collector, not a 2D runner or card duel.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Inferno Soul Walker</td><td>~17 KB</td><td>3D inferno maze, 13 souls, levers</td></tr><tr><td>Abyss Signal Diver</td><td>~28 KB</td><td>Underwater sub exploration + sonar</td></tr><tr><td>Pixel Necromancer</td><td>~27 KB</td><td>2D spell arena with resurrection</td></tr></table><p>Pick Inferno Soul Walker when you want first-person 3D exploration instead of 2D action or underwater sim genres.</p>`,
    titlePt: `Inferno Soul Walker vs outros jogos`,
    titleEs: `Inferno Soul Walker vs otros juegos`,
    titleVi: `Inferno Soul Walker so voi game khac`,
    titleId: `Inferno Soul Walker vs game lain`,
    titleDe: `Inferno Soul Walker vs andere Spiele`,
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
    w(join(CMS, `BODYHTML${cmsKey}.html`), `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Inferno Soul Walker</a> loads about ~17 KB in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`);

    const guideJspDir = lang === 'en' ? JSP_GUIDE : join(JSP_GUIDE, lang);
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

console.log('Generated CMS + JSP for', slug);
