#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'glow-firefly-cat';
const cms = 'glowfireflycat';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~28 KB';

const locales = { en: { prefix: '' }, pt: { prefix: 'pt' }, es: { prefix: 'es' }, vi: { prefix: 'vi' }, id: { prefix: 'id' }, de: { prefix: 'de' } };

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Glow Firefly Cat - Free Online Glow Firefly Cat Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Glow Firefly Cat free in the browser: summon fireflies, time shield bursts, evolve colors, and survive 3 minutes. ${payload} Canvas game, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `glow firefly cat game, browser firefly collector game, js13k game online, free timing shield game`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container"><p>Timing-based firefly collector: click to summon, hold to shield, right-click to repel, and keep the cat curious for 3 minutes.</p></div>
<div id="gfcWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="gfcStage" style="position:relative; width:100%; min-height:520px; background:#101020; border-radius:6px; overflow:hidden;">
            <div id="gfcLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6edf3; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; color:#ffdd00;">GLOW FIREFLY CAT</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#9db0c5;">JS13K firefly timing game in the browser. Press Play to load about ${payload}.</p>
                <button id="gfcPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="gfcStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="gfcFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: click to summon; hold for shield timing; right-click or X to repel; H help; L leaderboard.</span>
    </div>
    <style>#gfcStage:fullscreen { border-radius:0; } #gfcStage iframe { display:block; width:100%; height:560px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Glow Firefly Cat</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T02:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a compact firefly collector loads in the tab. Summon fireflies with clicks, time shield bursts to evolve colors, and survive three minutes.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Summon</td><td>Click or tap near the cat to attract fireflies</td></tr>
<tr><td>Shield</td><td>Hold click and release on the third warning flash for evolution</td></tr>
<tr><td>Repel</td><td>Right-click or press X to drop or repel fireflies</td></tr>
<tr><td>Win</td><td>Keep the cat curious until the 3-minute timer ends</td></tr>
</table>
<p>Adapted from aftongauntlett/js13k-2025 (MIT). Procedural Canvas art and Web Audio - zero CDN after load. Tutorial and local leaderboard persist in namespaced localStorage.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var GFC_GAME_URL = 'glow-firefly-cat/index.html';
    function gfcStatus(t){ var el=document.getElementById('gfcStatus'); if(el) el.textContent=t; }
    function gfcInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='gfcFrame'; frame.src=GFC_GAME_URL; frame.title='Glow Firefly Cat';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ gfcStatus('Loaded. Click inside the frame to begin.'); });
        var launch=document.getElementById('gfcLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('gfcStage'), playBtn=document.getElementById('gfcPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('gfcFullscreenBtn');
        playBtn.addEventListener('click',function(){
            gfcStatus('Loading about ${payload}...'); gfcInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>Does Glow Firefly Cat save progress?</summary><p>Yes. Tutorial completion and the local leaderboard persist in localStorage under namespaced ftol:glowfireflycat keys.</p></details>
<details class="faq-item"><summary>What controls does the game use?</summary><p>Click to summon, hold click for shield timing, right-click or X to repel, H for help, L for leaderboard, and ESC to close overlays.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} total (single roadroller-compressed HTML file).</p></details>`);
w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  { kebab: `how-to-play-${slug}`, titleEn: `How to Play Glow Firefly Cat - Step by Step`, descEn: `Launch Glow Firefly Cat, complete the tutorial, summon fireflies, and time shield bursts to survive 3 minutes.`, leadEn: `<b>Click Play, then click inside the frame to start the tutorial and summon fireflies toward your cursor.</b>`, bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page, then click inside the iframe when prompted.</p><h2><b>Summon</b></h2><p>Click near the cat to attract fireflies into your swarm.</p><h2><b>Shield</b></h2><p>Hold click during the warning flashes and release on the third flash to evolve firefly colors.</p><h2><b>Survive</b></h2><p>Deliver evolved fireflies to keep the cat curious until the 3-minute timer ends.</p>`, titlePt: `Como jogar Glow Firefly Cat`, titleEs: `Como jugar Glow Firefly Cat`, titleVi: `Cach choi Glow Firefly Cat`, titleId: `Cara main Glow Firefly Cat`, titleDe: `Glow Firefly Cat spielen` },
  { kebab: `${slug}-when`, titleEn: `When to Play Glow Firefly Cat`, descEn: `Short 3-minute timing sessions fit calm breaks with a cozy particle collector loop.`, leadEn: `<b>Best for a 5-15 minute session when you want a compact timing game without downloads or accounts.</b>`, bodyEn: `<h2><b>Calm focus</b></h2><p>Shield timing rewards patience more than reflex spam.</p><h2><b>Quick win</b></h2><p>Each run lasts 3 minutes with instant restarts.</p><h2><b>Desktop or touch</b></h2><p>Mouse click and hold works on desktop; tap works on phones.</p>`, titlePt: `Quando jogar Glow Firefly Cat`, titleEs: `Cuando jugar Glow Firefly Cat`, titleVi: `Khi nao choi Glow Firefly Cat`, titleId: `Kapan main Glow Firefly Cat`, titleDe: `Wann Glow Firefly Cat spielen` },
  { kebab: `${slug}-vs-alternatives`, titleEn: `Glow Firefly Cat vs Other Browser Games`, descEn: `Compare payload, session length, and mechanics against other free games on this site.`, leadEn: `<b>Glow Firefly Cat is a ${payload} timing collector with shield evolution, not a turf shooter or maze explorer.</b>`, bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Glow Firefly Cat</td><td>${payload}</td><td>Firefly summon + shield timing + 3-min survival</td></tr><tr><td>Sketch Turf Battle</td><td>~595 KB</td><td>3-min turf paint war with bots</td></tr><tr><td>Pixel Necromancer</td><td>~27 KB</td><td>Spell arena with resurrection</td></tr></table><p>Pick Glow Firefly Cat when you want a cozy timing loop instead of paint wars or spell combat.</p>`, titlePt: `Glow Firefly Cat vs outros jogos`, titleEs: `Glow Firefly Cat vs otros juegos`, titleVi: `Glow Firefly Cat so voi game khac`, titleId: `Glow Firefly Cat vs game lain`, titleDe: `Glow Firefly Cat vs andere Spiele` },
];

for (const g of guides) {
  for (const [lang, meta] of Object.entries(locales)) {
    const cmsKey = meta.prefix ? `guides${meta.prefix}${g.kebab.replace(/-/g, '')}` : `guides${g.kebab.replace(/-/g, '')}`;
    const title = lang === 'en' ? g.titleEn : lang === 'pt' ? g.titlePt : lang === 'es' ? g.titleEs : lang === 'vi' ? g.titleVi : lang === 'id' ? g.titleId : g.titleDe;
    w(join(CMS, `BODYTITLE${cmsKey}.txt`), title);
    w(join(CMS, `BODYDESC${cmsKey}.txt`), g.descEn);
    w(join(CMS, `BODYHTML${cmsKey}.html`), `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Glow Firefly Cat</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`);
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}
console.log('Generated CMS + JSP for', slug);
