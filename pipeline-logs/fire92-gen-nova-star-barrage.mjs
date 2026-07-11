#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'nova-star-barrage';
const cms = 'novastarbarrage';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~2 MB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Nova Star Barrage - Free Online Bullet-Hell Browser Game`);
w(
  join(CMS, `BODYDESC${cms}.txt`),
  `Play Nova Star Barrage free in the browser: faction bullet-hell with talent trees, weapon fusion, and endless waves. ${payload} Canvas game, no install.`,
);
w(
  join(CMS, `BODYKW${cms}.txt`),
  `nova star barrage game, browser bullet hell game, faction shooter online, free danmaku game`,
);
w(
  join(CMS, `BODYHTML${cms}.html`),
  `<div class="w3-container">
    <p>Canvas bullet-hell roguelite: pick a ship and faction, spend talent points, fuse weapons, and survive escalating waves with boss fights every 10 levels.</p>
</div>
<div id="nsbWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="nsbStage" style="position:relative; width:100%; min-height:520px; background:#050515; border-radius:6px; overflow:hidden;">
            <div id="nsbLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#fff; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; color:#44ddff;">NOVA STAR BARRAGE</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">Faction bullet-hell in the browser. Press Play to load about ${payload}.</p>
                <button id="nsbPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="nsbStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="nsbFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: mouse or touch to move; weapons auto-fire; I backpack, C status, B shop, 1-6 weapon focus.</span>
    </div>
    <style>#nsbStage:fullscreen { border-radius:0; } #nsbStage iframe { display:block; width:100%; height:560px; border:0; }</style>
</div>`,
);
w(
  join(CMS, `BODYWELCOME${cms}.html`),
  `<h1 class="text-uppercase"><b>Nova Star Barrage</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T04:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a bullet-hell run loads in the tab. Choose a ship, pick a faction, confirm talents and starting weapons, then survive procedural waves with elite fights and bosses.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Setup</td><td>Start Game, pick ship and faction, confirm talents and loadout</td></tr>
<tr><td>Move</td><td>Mouse pointer or touch drag on mobile</td></tr>
<tr><td>Combat</td><td>Weapons auto-fire; number keys 1-6 focus weapon slots</td></tr>
<tr><td>Menus</td><td>I backpack, C status panel, B in-run shop, F fusion panel</td></tr>
</table>
<p>Adapted from WXFffff666/stg-game (MIT). Procedural Canvas rendering and Web Audio SFX, zero CDN after load. Progress, talents, and loadouts persist in namespaced localStorage.</p>`,
);
w(
  join(CMS, `BODYJS${cms}.html`),
  `<script>
    web.localUpload = false;
    var NSB_GAME_URL = 'nova-star-barrage/index.html';
    function nsbStatus(t){ var el=document.getElementById('nsbStatus'); if(el) el.textContent=t; }
    function nsbInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='nsbFrame'; frame.src=NSB_GAME_URL; frame.title='Nova Star Barrage';
        frame.setAttribute('allow','fullscreen; pointer-lock'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ nsbStatus('Loaded. Click Start Game on the title screen inside the frame.'); });
        var launch=document.getElementById('nsbLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('nsbStage'), playBtn=document.getElementById('nsbPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('nsbFullscreenBtn');
        playBtn.addEventListener('click',function(){
            nsbStatus('Loading about ${payload}...'); nsbInjectFrame(stage);
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
  `<details class="faq-item"><summary>Does Nova Star Barrage save progress?</summary><p>Yes. Talents, loadouts, shop purchases, personal bests, and settings persist in localStorage under namespaced ftol:novastarbarrage keys.</p></details>
<details class="faq-item"><summary>What controls does the game use?</summary><p>Desktop: move by pointing the mouse inside the canvas. Mobile: touch drag. Weapons auto-fire. Keys I, C, B, F open backpack, status, shop, and fusion panels; 1-6 focus weapon slots.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} total across HTML and JavaScript modules.</p></details>`,
);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Nova Star Barrage - Step by Step`,
    descEn: `Launch Nova Star Barrage, pick ship and faction, confirm talents and weapons, then survive bullet-hell waves.`,
    leadEn: `<b>Click Play, press Start Game inside the frame, pick a ship and faction, confirm talents and loadout, then move with the mouse to dodge danmaku.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page, then Start Game on the in-game menu.</p><h2><b>Setup</b></h2><p>Select a ship, choose a faction card, spend optional talent points, then confirm your starting weapons.</p><h2><b>Combat</b></h2><p>Move with mouse or touch; weapons fire automatically. Survive waves; bosses appear every 10 levels.</p><h2><b>Progression</b></h2><p>Level up for upgrade picks, fuse weapons at milestones, and spend gold in the in-run shop between waves.</p>`,
    titlePt: `Como jogar Nova Star Barrage`,
    titleEs: `Como jugar Nova Star Barrage`,
    titleVi: `Cach choi Nova Star Barrage`,
    titleId: `Cara main Nova Star Barrage`,
    titleDe: `Nova Star Barrage spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Nova Star Barrage`,
    descEn: `Long-form bullet-hell runs with meta progression fit dedicated arcade sessions.`,
    leadEn: `<b>Best for 15-45 minute sessions when you want deep faction builds and roguelite upgrades, not a quick one-button arcade loop.</b>`,
    bodyEn: `<h2><b>Build depth</b></h2><p>87 factions, talent trees, and weapon fusion reward repeat runs.</p><h2><b>Wave structure</b></h2><p>Endless or challenge modes with elite waves every 5 levels and bosses every 10.</p><h2><b>Desktop first</b></h2><p>Mouse-aim movement works best on desktop; touch controls are supported on phones.</p>`,
    titlePt: `Quando jogar Nova Star Barrage`,
    titleEs: `Cuando jugar Nova Star Barrage`,
    titleVi: `Khi nao choi Nova Star Barrage`,
    titleId: `Kapan main Nova Star Barrage`,
    titleDe: `Wann Nova Star Barrage spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Nova Star Barrage vs Other Browser Shooters`,
    descEn: `Compare payload, session length, and mechanics against other free shooters on this site.`,
    leadEn: `<b>Nova Star Barrage is a ${payload} faction bullet-hell roguelite, not a fixed-bottom arcade shooter or js13k micro game.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Nova Star Barrage</td><td>${payload}</td><td>Faction talents, weapon fusion, endless waves</td></tr><tr><td>Andromeda Star Shooter</td><td>~45 KB</td><td>Fixed-bottom pulse shooter</td></tr><tr><td>Orbital Radius Shooter</td><td>~170 KB</td><td>Orbital twin-stick js13k arena</td></tr></table><p>Pick Nova Star Barrage when you want roguelite bullet-hell depth instead of a minimal retro arcade loop.</p>`,
    titlePt: `Nova Star Barrage vs outros jogos`,
    titleEs: `Nova Star Barrage vs otros juegos`,
    titleVi: `Nova Star Barrage so voi game khac`,
    titleId: `Nova Star Barrage vs game lain`,
    titleDe: `Nova Star Barrage vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Nova Star Barrage</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

console.log('Generated CMS + JSP for', slug);
