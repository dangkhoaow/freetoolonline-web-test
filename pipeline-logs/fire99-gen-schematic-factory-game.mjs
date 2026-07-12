#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slug = 'schematic-factory-game';
const cms = 'schematicfactorygame';
const route = `/games/${slug}.html`;
const date = '2026-07-12';
const payload = '~456 KB';

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

w(join(CMS, `BODYTITLE${cms}.txt`), `Schematic Factory Line - Free Online Incremental Factory Browser Game`);
w(join(CMS, `BODYDESC${cms}.txt`), `Play Schematic Factory Line free in the browser: mine ore, smelt ingots, assemble circuits, prestige Schematics, and unlock research. ${payload} vanilla JS factory incremental, no install.`);
w(join(CMS, `BODYKW${cms}.txt`), `schematic factory game, browser incremental factory, engineering factory game, idle factory online`);
w(join(CMS, `BODYHTML${cms}.html`), `<div class="w3-container">
    <p>An engineering-schematic incremental factory in the browser tab: buy machines across six tiers, bank Schematics on prestige, unlock the research tree, publish Patents, and exhibit Legacy Marks.</p>
</div>
<div id="sfgWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="sfgStage" style="position:relative; width:100%; min-height:560px; background:#0d3b4f; border-radius:6px; overflow:hidden;">
            <div id="sfgLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e8f4ff; padding:16px;">
                <div style="font:700 22px 'Courier New', monospace; letter-spacing:1px;">SCHEMATIC FACTORY LINE</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#aaccee;">Vanilla JS factory incremental drawn as an engineering sheet. Press Play to load about ${payload}.</p>
                <button id="sfgPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="sfgStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="sfgFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Click or tap machine slots inside the frame; use the gear icon for settings and save export.</span>
    </div>
    <style>#sfgStage:fullscreen { border-radius:0; } #sfgStage iframe { display:block; width:100%; height:620px; border:0; }</style>
</div>`);
w(join(CMS, `BODYWELCOME${cms}.html`), `<h1 class="text-uppercase"><b>Schematic Factory Line</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-12T07:00:00"><b>Last reviewed: ${date}</b></time>
<hr/>
<p>Press Play and a schematic factory incremental loads in the tab. Buy your first ore miner, chain smelters and assemblers, then prestige for Schematics when a run matures.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page to inject the iframe</td></tr>
<tr><td>Factory</td><td>Click affordable machine slots to expand production</td></tr>
<tr><td>Research</td><td>Prestige to unlock the radial research tree tab</td></tr>
<tr><td>Settings</td><td>Gear icon for export/import and accessibility options</td></tr>
<tr><td>Saves</td><td>Progress persists in namespaced localStorage on this device</td></tr>
</table>
<p>Adapted from Real-Fruit-Snacks/Blueprint (MIT). SVG UI icons and Web Audio synth, zero CDN after load.</p>`);
w(join(CMS, `BODYJS${cms}.html`), `<script>
    web.localUpload = false;
    var SFG_GAME_URL = 'schematic-factory-game/index.html';
    function sfgStatus(t){ var el=document.getElementById('sfgStatus'); if(el) el.textContent=t; }
    function sfgInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='sfgFrame'; frame.src=SFG_GAME_URL; frame.title='Schematic Factory Line';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ sfgStatus('Loaded. Click machine slots inside the frame to expand your factory.'); });
        var launch=document.getElementById('sfgLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('sfgStage'), playBtn=document.getElementById('sfgPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('sfgFullscreenBtn');
        playBtn.addEventListener('click',function(){
            sfgStatus('Loading about ${payload}...'); sfgInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);
w(join(CMS, `FAQ${cms}.html`), `<details class="faq-item"><summary>Does Schematic Factory Line save progress?</summary><p>Yes. Saves use namespaced localStorage ftol:schematicfactorygame keys with a rolling backup slot.</p></details>
<details class="faq-item"><summary>How large is the download?</summary><p>About ${payload} across index.html, game.js, style.css, and sim-worker.js.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Expand a six-tier factory, prestige for Schematics, unlock research, then publish Patents and exhibit Legacy Marks.</p></details>`);

w(join(JSP_GAMES, `${slug}.jsp`), jsp);

const guides = [
  {
    kebab: `how-to-play-${slug}`,
    titleEn: `How to Play Schematic Factory Line - Step by Step`,
    descEn: `Launch Schematic Factory Line, buy ore miners, chain machines, and prestige for Schematics.`,
    leadEn: `<b>Click Play, buy affordable machine slots in the Factory tab, let production chain ore to prototypes, then prestige when Schematics unlock research.</b>`,
    bodyEn: `<h2><b>Launch</b></h2><p>Click Play on this page to load the iframe bundle.</p><h2><b>First machines</b></h2><p>Start with tier-one ore miners. Each slot shows cost and owned count.</p><h2><b>Chain tiers</b></h2><p>Unlock smelters, parts, circuits, cores, and prototypes as resources accumulate.</p><h2><b>Prestige</b></h2><p>When offered, prestige banks Schematics for the Research tab radial tree.</p><h2><b>Settings</b></h2><p>Use the gear icon to export saves or adjust accessibility options.</p>`,
    titlePt: `Como jogar Schematic Factory Line`,
    titleEs: `Como jugar Schematic Factory Line`,
    titleVi: `Cach choi Schematic Factory Line`,
    titleId: `Cara main Schematic Factory Line`,
    titleDe: `Schematic Factory Line spielen`,
  },
  {
    kebab: `${slug}-when`,
    titleEn: `When to Play Schematic Factory Line`,
    descEn: `Long-form idle factory sessions fit players who want deep incremental progression in the browser.`,
    leadEn: `<b>Best for 20-60 minute idle sessions when you want a schematic factory loop instead of a short arcade or bullet-hell run.</b>`,
    bodyEn: `<h2><b>Idle depth</b></h2><p>Production continues offline up to eight hours after you leave the tab.</p><h2><b>Meta layers</b></h2><p>Research, Patents, and Legacy Marks reward repeat prestige runs.</p><h2><b>Desktop first</b></h2><p>Mouse and touch both work; the layout scales inside the iframe.</p>`,
    titlePt: `Quando jogar Schematic Factory Line`,
    titleEs: `Cuando jugar Schematic Factory Line`,
    titleVi: `Khi nao choi Schematic Factory Line`,
    titleId: `Kapan main Schematic Factory Line`,
    titleDe: `Wann Schematic Factory Line spielen`,
  },
  {
    kebab: `${slug}-vs-alternatives`,
    titleEn: `Schematic Factory Line vs Other Browser Games`,
    descEn: `Compare payload and genre against other free incrementals on this site.`,
    leadEn: `<b>Schematic Factory Line is a ${payload} multi-tier factory incremental, not a wave-defense castle game or js13k arcade.</b>`,
    bodyEn: `<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Payload</th><th>Focus</th></tr><tr><td>Schematic Factory Line</td><td>${payload}</td><td>Six-tier factory, Schematics prestige, research tree</td></tr><tr><td>Medieval Wall Defense</td><td>~631 KB</td><td>Wave-defense incremental with heroes</td></tr><tr><td>Procedural Horde Game</td><td>~28 KB</td><td>Single-file horde survivor</td></tr></table><p>Pick Schematic Factory Line for deep factory chaining and meta Patents.</p>`,
    titlePt: `Schematic Factory Line vs outros jogos`,
    titleEs: `Schematic Factory Line vs otros juegos`,
    titleVi: `Schematic Factory Line so voi game khac`,
    titleId: `Schematic Factory Line vs game lain`,
    titleDe: `Schematic Factory Line vs andere Spiele`,
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
      `<div class="w3-container w3-margin-top"><h1><b>${title}</b></h1><p><a href="${route}">Schematic Factory Line</a> loads about ${payload} in an iframe.</p><p><time datetime="${date}">Last reviewed: ${date}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;">${g.leadEn}</p></div>${g.bodyEn}<p><a href="/games.html">&larr; Back to games</a></p></div>`,
    );
    const guideJspDir = meta.prefix ? join(JSP_GUIDE, meta.prefix) : JSP_GUIDE;
    w(join(guideJspDir, `${g.kebab}.jsp`), jsp);
  }
}

function patchSiteData() {
  const path = join(ROOT, 'scripts/site-data.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/schematic-factory-game.html')) return;
  const guideBlock = `
  // fire99 schematic-factory-game
  '/guides/how-to-play-schematic-factory-game.html',
  '/guides/pt/how-to-play-schematic-factory-game.html',
  '/guides/es/how-to-play-schematic-factory-game.html',
  '/guides/vi/how-to-play-schematic-factory-game.html',
  '/guides/id/how-to-play-schematic-factory-game.html',
  '/guides/de/how-to-play-schematic-factory-game.html',
  '/guides/schematic-factory-game-when.html',
  '/guides/pt/schematic-factory-game-when.html',
  '/guides/es/schematic-factory-game-when.html',
  '/guides/vi/schematic-factory-game-when.html',
  '/guides/id/schematic-factory-game-when.html',
  '/guides/de/schematic-factory-game-when.html',
  '/guides/schematic-factory-game-vs-alternatives.html',
  '/guides/pt/schematic-factory-game-vs-alternatives.html',
  '/guides/es/schematic-factory-game-vs-alternatives.html',
  '/guides/vi/schematic-factory-game-vs-alternatives.html',
  '/guides/id/schematic-factory-game-vs-alternatives.html',
  '/guides/de/schematic-factory-game-vs-alternatives.html',`;
  text = text.replace(
    "  '/guides/de/neon-cat-chase-vs-alternatives.html',",
    `  '/guides/de/neon-cat-chase-vs-alternatives.html',${guideBlock}`,
  );
  text = text.replace(
    "  '/neon-cat-chase.html': '/games/neon-cat-chase.html',",
    `  '/neon-cat-chase.html': '/games/neon-cat-chase.html',
  '/schematic-factory-game.html': '/games/schematic-factory-game.html',`,
  );
  const jspBlock = `
  // fire99 schematic-factory-game guides
  '/guides/how-to-play-schematic-factory-game.html': 'guide/how-to-play-schematic-factory-game.jsp',
  '/guides/pt/how-to-play-schematic-factory-game.html': 'guide/pt/how-to-play-schematic-factory-game.jsp',
  '/guides/es/how-to-play-schematic-factory-game.html': 'guide/es/how-to-play-schematic-factory-game.jsp',
  '/guides/vi/how-to-play-schematic-factory-game.html': 'guide/vi/how-to-play-schematic-factory-game.jsp',
  '/guides/id/how-to-play-schematic-factory-game.html': 'guide/id/how-to-play-schematic-factory-game.jsp',
  '/guides/de/how-to-play-schematic-factory-game.html': 'guide/de/how-to-play-schematic-factory-game.jsp',
  '/guides/schematic-factory-game-when.html': 'guide/schematic-factory-game-when.jsp',
  '/guides/pt/schematic-factory-game-when.html': 'guide/pt/schematic-factory-game-when.jsp',
  '/guides/es/schematic-factory-game-when.html': 'guide/es/schematic-factory-game-when.jsp',
  '/guides/vi/schematic-factory-game-when.html': 'guide/vi/schematic-factory-game-when.jsp',
  '/guides/id/schematic-factory-game-when.html': 'guide/id/schematic-factory-game-when.jsp',
  '/guides/de/schematic-factory-game-when.html': 'guide/de/schematic-factory-game-when.jsp',
  '/guides/schematic-factory-game-vs-alternatives.html': 'guide/schematic-factory-game-vs-alternatives.jsp',
  '/guides/pt/schematic-factory-game-vs-alternatives.html': 'guide/pt/schematic-factory-game-vs-alternatives.jsp',
  '/guides/es/schematic-factory-game-vs-alternatives.html': 'guide/es/schematic-factory-game-vs-alternatives.jsp',
  '/guides/vi/schematic-factory-game-vs-alternatives.html': 'guide/vi/schematic-factory-game-vs-alternatives.jsp',
  '/guides/id/schematic-factory-game-vs-alternatives.html': 'guide/id/schematic-factory-game-vs-alternatives.jsp',
  '/guides/de/schematic-factory-game-vs-alternatives.html': 'guide/de/schematic-factory-game-vs-alternatives.jsp',
  '/games/schematic-factory-game.html': 'games/schematic-factory-game.jsp',`;
  text = text.replace(
    "  '/games/neon-cat-chase.html': 'games/neon-cat-chase.jsp',",
    `  '/games/neon-cat-chase.html': 'games/neon-cat-chase.jsp',${jspBlock}`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchSeoClusters() {
  const path = join(ROOT, 'scripts/seo-clusters.mjs');
  let text = readFileSync(path, 'utf8');
  if (text.includes('/games/schematic-factory-game.html')) return;
  text = text.replace(
    "'/games/neon-cat-chase.html'",
    "'/games/neon-cat-chase.html', '/games/schematic-factory-game.html'",
  );
  writeFileSync(path, text, 'utf8');
}

function patchMenu() {
  const path = join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
  let text = readFileSync(path, 'utf8');
  if (text.includes('schematic-factory-game.html')) return;
  text = text.replace(
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/neon-cat-chase.html'>Neon Cat Chase</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/neon-cat-chase.html'>Neon Cat Chase</a>
                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/schematic-factory-game.html'>Schematic Factory Line</a>`,
  );
  writeFileSync(path, text, 'utf8');
}

function patchRelated() {
  const path = join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
  let text = readFileSync(path, 'utf8');
  if (text.includes('schematic-factory-game.html')) return;
  text = text.replace(
    `{ title: "Neon Cat Chase", url: "https://freetoolonline.com/games/neon-cat-chase.html", include: !1, tags: "games" },`,
    `{ title: "Neon Cat Chase", url: "https://freetoolonline.com/games/neon-cat-chase.html", include: !1, tags: "games" },
    { title: "Schematic Factory Line", url: "https://freetoolonline.com/games/schematic-factory-game.html", include: !1, tags: "games" },`,
  );
  writeFileSync(path, text, 'utf8');
}

patchSiteData();
patchSeoClusters();
patchMenu();
patchRelated();

console.log('Generated CMS + JSP + route patches for', slug);
