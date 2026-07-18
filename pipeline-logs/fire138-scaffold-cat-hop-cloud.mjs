#!/usr/bin/env node
/** fire138: scaffold cat-hop-cloud CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SKILL = join(ROOT, '..', '.agent/skills/tool-cathopcloud');
const DATE = '2026-07-18';
const LS_PREFIX = 'ftol:cathopcloud:';

const JSP_WRAPPER = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page
customStyle='\${pageStyle}'
browserTitle='\${pageBodyTitle}'
keyword='\${pageBodyKeyword}'
description='\${pageBodyDesc}'>

<freetoolonline:loading/>
\${pageBodyHTML}
<freetoolonline:welcome welcomeTest='\${pageBodyWelcome}'/>
<freetoolonline:share-btns></freetoolonline:share-btns>
\${pageBodyJS}
</freetoolonline:page>
`;

function w(rel, content) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, 'utf8');
}

function cmsTxt(slug, prefix, text) {
  w(`source/static/src/main/webapp/resources/view/CMS/${prefix}${slug}.txt`, text + '\n');
}
function cmsHtml(slug, prefix, html) {
  w(`source/static/src/main/webapp/resources/view/CMS/${prefix}${slug}.html`, html + '\n');
}

const FAQ_STYLE = `<style>
    details.faq-item { margin: 8px 0; border-bottom: 1px solid #e0e0e0; padding: 6px 0; }
    details.faq-item > summary { list-style: none; cursor: pointer; padding: 8px 0 8px 28px; position: relative; font-weight: 600; }
    details.faq-item > summary::-webkit-details-marker { display: none; }
    details.faq-item > summary::before { content: '>'; position: absolute; left: 8px; top: 8px; transition: transform 0.15s ease; color: #555; font-size: 0.9em; }
    details.faq-item[open] > summary::before { transform: rotate(90deg); }
    details.faq-item > summary:hover { color: #1a73e8; }
    details.faq-item > p, details.faq-item > div { padding: 0 8px 8px 28px; margin: 0; }
</style>`;

cmsTxt('cathopcloud', 'BODYTITLE', 'Cat Hop Cloud - Free Online Luck Cloud Hop Puzzle');
cmsTxt('cathopcloud', 'BODYDESC', 'Cat Hop Cloud - free browser luck puzzle: hop numbered clouds, spend luck equal to jump distance, visit checkpoints, return to cloud 0. Keyboard 1-9, ~25 KB, no install.');
cmsTxt('cathopcloud', 'BODYKW', 'cat hop cloud game, luck cloud puzzle, browser hop puzzle, js13k cloud game, checkpoint puzzle, free online cat puzzle');

cmsHtml('cathopcloud', 'BODYHTML', `<div class="w3-container">
    <p>Cat Hop Cloud is a luck-management hop puzzle in the browser: your black cat hops numbered clouds in a ring, spending luck equal to each jump distance. Visit every required checkpoint, then return to cloud 0 with luck remaining. About ~25 KB after Play, no install, no account.</p>
    <p>Prefer a poker combo instead? Try <a href="/games/mystic-card-paw.html">Mystic Card Paw</a>.</p>
</div>

<div id="chcWrapper" class="w3-container" style="background:#87CEEB; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="chcStage" style="position:relative; width:100%; aspect-ratio:4/3; min-height:480px; background:#87CEEB; border-radius:6px; overflow:hidden;">
            <div id="chcLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#222; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#333;">CAT HOP CLOUD</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#444;">Hop numbered clouds, spend luck on each jump, hit every checkpoint, then land back on cloud 0. From helmedeiros/Cat-Hop-Cloud (MIT). About ~25 KB downloads once when you press Play.</p>
                <button id="chcPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#555; max-width:480px; margin-top:12px;">Keyboard only: press 1-9 to jump that many clouds forward. Each jump costs luck equal to the distance. Press I for the level menu, R to reset. Best on desktop with a keyboard.</p>
            </div>
        </div>
        <div id="chcStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="chcFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Level scores and unlocks save locally under ${LS_PREFIX}* keys in your browser.</span>
    </div>
    <style>
        #chcStage:fullscreen { border-radius: 0; }
        #chcStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('cathopcloud', 'BODYWELCOME', `<p>Welcome to Cat Hop Cloud - a free browser luck hop puzzle you can play without an account or install. Press Play to load the ~25 KB canvas engine in a same-origin iframe, pick a level from the menu, then press number keys 1 through 9 to jump that many clouds forward around the ring. Each jump costs luck equal to the distance; thunder clouds drain extra luck, wind clouds add a free +1 on your next hop, lucky clouds restore +5, checkpoints must be visited before you win, and one-way clouds force your next jump to distance 2. After turn 5 each hop also costs +1 extra luck. Win by returning to cloud 0 with luck remaining after every required checkpoint is checked. Level bests and unlocks persist locally. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('cathopcloud', 'BODYJS', `<script>
    web.localUpload = false;
    var CHC_GAME_URL = 'cat-hop-cloud/index.html';
    function chcStatus(text) {
        var el = document.getElementById('chcStatus');
        if (el) el.textContent = text;
    }
    function chcInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'chcFrame';
        frame.src = CHC_GAME_URL;
        frame.title = 'Cat Hop Cloud game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            chcStatus('Game loaded. Pick a level, then press 1-9 to hop clouds. Press I for instructions, R to reset.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('chcLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('chcStage');
        var playBtn = document.getElementById('chcPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('chcFullscreenBtn');
        playBtn.addEventListener('click', function () {
            chcStatus('Loading the game (about 25 KB, one time - then cached)...');
            chcInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('chcFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('cathopcloud', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Cat Hop Cloud?</summary><p>A luck hop puzzle on a ring of numbered clouds. You spend luck equal to each jump distance (keys 1-9), dodge thunder clouds, use wind and lucky boosts, visit every required checkpoint, then return to cloud 0 with luck left to win.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Keyboard only inside the iframe. Press 1-9 to jump that many clouds forward. Press R to reset the current level. Press I to toggle the level menu and instructions overlay. Pick a level from the grid before you start hopping.</p></details>
<details class="faq-item"><summary>What do the cloud colors mean?</summary><p>Mint = safe. Pink thunder = -2 luck on landing. Cyan wind = your next jump gets +1 distance free. Yellow lucky = +5 luck. Purple checkpoint = must visit (! turns green when done). Orange one-way = your next jump is forced to distance 2.</p></details>
<details class="faq-item"><summary>How does luck work?</summary><p>Each jump costs luck equal to the number key you press. After turn 5, every jump also costs +1 extra luck. You lose when luck hits zero. You win by landing on cloud 0 after visiting all required checkpoints with luck remaining and at least two moves made.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>Yes. Top three scores per level and unlocked levels save locally under ${LS_PREFIX}scores_v2.0.0 (versioned keys). Older upstream catHop keys are not read on this site build.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ~25 KB of HTML and inline JavaScript after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>The engine is keyboard-first. Touch can open the level menu buttons, but number-key hops need a hardware or on-screen keyboard. Desktop or laptop is the best experience.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Cat-Hop-Cloud by Helio Medeiros (helmedeiros/Cat-Hop-Cloud) under the MIT license. This site build adds noindex on the iframe, namespaces localStorage to ${LS_PREFIX}*, and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/cat-hop-cloud.jsp', JSP_WRAPPER);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Cat Hop Cloud - Step by Step</b></h1>
<p>The <a href="/games/cat-hop-cloud.html">Cat Hop Cloud</a> page loads a ~25 KB luck hop puzzle in an iframe. Hop numbered clouds, manage luck, hit checkpoints, return to cloud 0. Press Play on this page to start.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press a number key 1-9 to jump that many clouds forward; each jump costs luck equal to the distance.</b></p></div>
<h2><b>Step 1 - press Play and pick a level</b></h2><p>Press Play to inject the iframe (~25 KB). Click a level name in the grid (Tutorial unlocks first). Upstream is helmedeiros/Cat-Hop-Cloud (MIT).</p>
<h2><b>Step 2 - read the cloud ring</b></h2><p>Clouds sit in a circle numbered 0 through N-1. Your black cat starts on cloud 0. The HUD shows current luck (energy) top-left and level name top-center.</p>
<h2><b>Step 3 - hop with number keys</b></h2><p>Press 1-9 to jump that many clouds forward modulo the ring size. Jump cost equals the key you pressed. Wind adds +1 to your next hop distance; one-way clouds force your next hop to distance 2.</p>
<h2><b>Step 4 - handle cloud types</b></h2><p>Thunder (-2 luck), wind (+1 next hop), lucky (+5 luck), checkpoint (must visit), one-way (next hop locked to 2). After turn 5 each hop also costs +1 extra luck.</p>
<h2><b>Step 5 - visit every checkpoint</b></h2><p>Purple checkpoints show ! until visited (then green check). The HUD tracks checkpoints visited vs required. You cannot win until all required checkpoints are checked.</p>
<h2><b>Step 6 - return to cloud 0</b></h2><p>After every required checkpoint is visited, land on cloud 0 with luck remaining and at least two moves to win. Remaining luck becomes your score; top three scores per level save locally.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>~25 KB</td><td>single index.html</td></tr><tr><td>Input</td><td>keyboard 1-9, R, I</td><td>no touch hop keys</td></tr><tr><td>Saves</td><td>scores + unlocks</td><td>${LS_PREFIX}scores_v2.0.0</td></tr><tr><td>Resolution</td><td>800 x 600</td><td>canvas #c</td></tr></table>
<p>See <a href="/guides/cat-hop-cloud-when.html">when to play</a>, <a href="/guides/cat-hop-cloud-vs-alternatives.html">comparisons</a>, and <a href="/games/mystic-card-paw.html">Mystic Card Paw</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Cat Hop Cloud</b></h1>
<p><a href="/games/cat-hop-cloud.html">Cat Hop Cloud</a> fits short breaks where you want a turn-based luck puzzle - about ~25 KB after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>Quick planning puzzles</b></h2><p>Each level is a small ring of clouds. You plan hop distances, checkpoint order, and luck spend before you run out.</p>
<h2><b>When you like resource trade-offs</b></h2><p>Wind boosts, lucky clouds, and turn penalties after move 5 force you to ration luck across the whole route back to cloud 0.</p>
<h2><b>When to pick another game</b></h2><p>Want pointer poker combos? Use <a href="/games/mystic-card-paw.html">Mystic Card Paw</a>. Want arcade street crossing? Use <a href="/games/unlucky-crossing.html">Unlucky Crossing</a>.</p>
<p>See <a href="/guides/how-to-play-cat-hop-cloud.html">how to play</a> and <a href="/guides/cat-hop-cloud-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cat Hop Cloud vs Alternatives</b></h1>
<p><a href="/games/cat-hop-cloud.html">Cat Hop Cloud</a> is a keyboard luck hop puzzle with checkpoints and ten levels. Compare it with two other free browser cat games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Cat Hop Cloud</td><td>~25 KB</td><td>Keyboard 1-9, R, I</td><td>${LS_PREFIX}scores_v2.0.0</td></tr>
<tr><td><a href="/games/mystic-card-paw.html">Mystic Card Paw</a></td><td>~36 KB</td><td>Click cards + ability buttons</td><td>ftol:mysticcardpaw:highScore</td></tr>
<tr><td><a href="/games/unlucky-crossing.html">Unlucky Crossing</a></td><td>~72 KB</td><td>WASD / arrows + touch</td><td>none</td></tr>
</table>
<p>Pick Cat Hop Cloud for turn-based luck routing on a cloud ring. Pick Mystic Card Paw for poker combos. Pick Unlucky Crossing for infinite street rows.</p>
<p>See <a href="/guides/how-to-play-cat-hop-cloud.html">how to play</a> and <a href="/guides/cat-hop-cloud-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-cat-hop-cloud', slug: 'guideshowtoplaycathopcloud', enTitle: 'How to Play Cat Hop Cloud - Step by Step', enDesc: 'How to play Cat Hop Cloud: hop numbered clouds, spend luck on jump distance, visit checkpoints, return to cloud 0, ~25 KB browser puzzle.', html: howToEn },
  { route: 'cat-hop-cloud-when', slug: 'guidescathopcloudwhen', enTitle: 'When to Play Cat Hop Cloud', enDesc: 'When Cat Hop Cloud fits: luck hop puzzle, checkpoints, keyboard 1-9 controls, ~25 KB.', html: whenEn },
  { route: 'cat-hop-cloud-vs-alternatives', slug: 'guidescathopcloudvsalternatives', enTitle: 'Cat Hop Cloud vs Alternatives', enDesc: 'Compare Cat Hop Cloud with Mystic Card Paw and Unlucky Crossing - download size, input, saves.', html: vsEn },
];

const locales = [
  { code: '', prefix: '' },
  { code: 'pt', prefix: 'pt' },
  { code: 'es', prefix: 'es' },
  { code: 'vi', prefix: 'vi' },
  { code: 'id', prefix: 'id' },
  { code: 'de', prefix: 'de' },
];

for (const g of guides) {
  for (const loc of locales) {
    const routePath = loc.prefix ? `/guides/${loc.prefix}/${g.route}.html` : `/guides/${g.route}.html`;
    const jspPath = loc.prefix ? `guide/${loc.prefix}/${g.route}.jsp` : `guide/${g.route}.jsp`;
    w(`source/web/src/main/webapp/WEB-INF/jsp/${jspPath}`, JSP_WRAPPER);

    let cmsSlug;
    if (!loc.prefix) {
      cmsSlug = g.slug;
    } else if (g.route === 'how-to-play-cat-hop-cloud') {
      cmsSlug = `guides${loc.prefix}howtoplaycathopcloud`;
    } else if (g.route === 'cat-hop-cloud-when') {
      cmsSlug = `guides${loc.prefix}cathopcloudwhen`;
    } else {
      cmsSlug = `guides${loc.prefix}cathopcloudvsalternatives`;
    }

    const howTitles = {
      pt: [`Como jogar Cat Hop Cloud`, `Como jogar Cat Hop Cloud: nuvens numeradas, sorte, checkpoints, ~25 KB.`],
      es: [`Como jugar Cat Hop Cloud`, `Como jugar Cat Hop Cloud: nubes numeradas, suerte, checkpoints, ~25 KB.`],
      vi: [`Cach choi Cat Hop Cloud`, `Huong dan Cat Hop Cloud: nhay may, quan ly may man, checkpoint, ~25 KB.`],
      id: [`Cara main Cat Hop Cloud`, `Panduan Cat Hop Cloud: lompat awan, kelola keberuntungan, checkpoint, ~25 KB.`],
      de: [`Cat Hop Cloud spielen`, `Cat Hop Cloud spielen: Wolken-Hops, Glueckspunkte, Checkpoints, ~25 KB.`],
    };
    const whenTitles = {
      pt: [`Quando jogar Cat Hop Cloud`, `Quando Cat Hop Cloud encaixa: puzzle de sorte, ~25 KB.`],
      es: [`Cuando jugar Cat Hop Cloud`, `Cuando jugar Cat Hop Cloud: rompecabezas de suerte, ~25 KB.`],
      vi: [`Khi nao choi Cat Hop Cloud`, `Khi nao choi Cat Hop Cloud: giai do may man, ~25 KB.`],
      id: [`Kapan main Cat Hop Cloud`, `Kapan main Cat Hop Cloud: teka-teki keberuntungan, ~25 KB.`],
      de: [`Wann Cat Hop Cloud spielen`, `Wann Cat Hop Cloud spielen: kurze Gluecksrouten, ~25 KB.`],
    };
    const vsTitles = {
      pt: [`Cat Hop Cloud vs alternativas`, `Compare Cat Hop Cloud com Mystic Card Paw e Unlucky Crossing.`],
      es: [`Cat Hop Cloud vs alternativas`, `Compara Cat Hop Cloud con Mystic Card Paw y Unlucky Crossing.`],
      vi: [`Cat Hop Cloud vs lua chon khac`, `So sanh Cat Hop Cloud voi Mystic Card Paw va Unlucky Crossing.`],
      id: [`Cat Hop Cloud vs alternatif`, `Bandingkan Cat Hop Cloud dengan Mystic Card Paw dan Unlucky Crossing.`],
      de: [`Cat Hop Cloud vs Alternativen`, `Cat Hop Cloud vs Mystic Card Paw und Unlucky Crossing vergleichen.`],
    };

    let title, desc;
    if (!loc.code) {
      title = g.enTitle;
      desc = g.enDesc;
    } else if (g.route.includes('how-to-play')) {
      [title, desc] = howTitles[loc.code];
    } else if (g.route.includes('when')) {
      [title, desc] = whenTitles[loc.code];
    } else {
      [title, desc] = vsTitles[loc.code];
    }

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser luck puzzle on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/cat-hop-cloud.html">Cat Hop Cloud</a> laedt ein ~25 KB Gluecks-Hop-Raetsel im iframe. Tasten 1-9 springen Wolken; jeder Sprung kostet Glueck in Hoehe der Distanz. Checkpoints besuchen, dann Wolke 0.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Steuerung: Tastatur 1-9, R Reset, I Menue. Speichert lokal unter ${LS_PREFIX}scores_v2.0.0. Engine MIT (helmedeiros/Cat-Hop-Cloud).</p>
<p><a href="${routePath}">Diese Sprachversion</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/cat-hop-cloud.html">Cat Hop Cloud</a> loads a ~25 KB luck hop puzzle in an iframe. Press 1-9 to jump numbered clouds; each jump costs luck equal to the distance. Visit checkpoints, then return to cloud 0.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Keyboard 1-9, R reset, I menu. Saves locally under ${LS_PREFIX}scores_v2.0.0. Engine MIT (helmedeiros/Cat-Hop-Cloud).</p>
<p><a href="${routePath}">This locale guide</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

w('source/web/src/main/webapp/static/img/illustrations/mini-pictogram/cathopcloud__e2b7c4f1.svg', `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-chc-title svg-minipictogram-chc-desc">
  <title id="svg-minipictogram-chc-title">Cat Hop Cloud</title>
  <desc id="svg-minipictogram-chc-desc">Luck cloud hop puzzle game</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#5ECFFF" aria-hidden="true"/>
  <ellipse cx="22" cy="28" rx="14" ry="8" fill="#fff" opacity="0.95"/>
  <ellipse cx="42" cy="36" rx="12" ry="7" fill="#fff" opacity="0.9"/>
  <ellipse cx="32" cy="22" rx="10" ry="6" fill="#fff"/>
  <text x="32" y="24" text-anchor="middle" font-family="monospace" font-size="8" font-weight="700" fill="#333">0</text>
  <ellipse cx="48" cy="22" rx="6" ry="4" fill="#111"/>
  <path d="M44 18 L46 12 L48 18 Z" fill="#111"/>
  <path d="M50 18 L52 12 L54 18 Z" fill="#111"/>
  <text x="32" y="58" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="6" font-weight="700" letter-spacing="0.3" fill="#1a365d">CHC</text>
</svg>`);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-cathopcloud
description: |
  Ground-truth for /games/cat-hop-cloud.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire138) from helmedeiros/Cat-Hop-Cloud at
  static/games/cat-hop-cloud/.
---

# tool-cathopcloud - /games/cat-hop-cloud.html

## Identity

- **Route**: /games/cat-hop-cloud.html
- **Slug**: \`cat-hop-cloud\` (CMS: \`cathopcloud\`)
- **Cluster**: games
- **Aliases**: /cat-hop-cloud.html

## Reader task

Hop numbered clouds in a ring, spending luck equal to each jump distance, visit every required checkpoint, then return to cloud 0 with luck remaining to clear ten strategic levels.

## Processing model

**client-side-only** - single-file canvas engine (~25 KB index.html inline JS), same-origin iframe. No CDN, no analytics, no external fonts at runtime. Engine HTML is noindex; canonical URL is /games/cat-hop-cloud.html. One 800x600 canvas (#c) plus DOM level menu overlay.

## License analysis

- Upstream: helmedeiros/Cat-Hop-Cloud, **MIT, Copyright (c) 2025 Helio Medeiros** (LICENSE vendored).
- Original js13k-style luck/cloud hop puzzle; not a commercial clone.
- localStorage score/unlock keys namespaced to \`${LS_PREFIX}*\` (upstream used catHopScores_v*, catHopAllScores, catHopUnlocked).
- Adaptations: noindex meta, LICENSE + CREDITS shipped, all localStorage keys prefixed.
- Clean ELIGIBLE; no operator adjudication.

## Reader-benefit framing menu

- V1: Press 1-9 to jump that many clouds forward around the numbered ring.
- V2: Each jump costs luck equal to the key pressed (distance cost).
- V3: Thunder clouds (-2 luck), wind clouds (+1 next hop distance), lucky clouds (+5 luck), checkpoints (must visit), one-way clouds (force next hop to distance 2).
- V4: After turn 5, every jump also costs +1 extra luck (turn penalty).
- V5: Win by landing on cloud 0 with luck remaining after all required checkpoints visited and at least two moves made.
- V6: Press R to reset the current level; press I to toggle the level menu and instructions overlay.
- V7: Ten levels unlock sequentially; top three scores per level save locally under \`${LS_PREFIX}scores_v2.0.0\`.
- V8: Level select grid shows best luck score and turn count per cleared level.
- V9: About ~25 KB after Play; keyboard only (no touch hop keys).
- V10: Adapted from Cat-Hop-Cloud by Helio Medeiros (MIT); ships LICENSE + CREDITS.

## Implemented features

- Circular cloud ring with color-coded cloud types and numbered positions.
- Black cat sprite drawn on the active cloud.
- Level menu with unlock progression and per-level scoreboard (top 3).
- Version archive UI for prior score format (v2.0.0 current).
- Turn counter HUD with penalty warning after turn 5.
- Checkpoint progress indicator (visited/required).

## Anti-claims

- Does NOT use a server backend or CDN at runtime.
- Does NOT use pointer/touch hop controls (keyboard 1-9, R, I only).
- Does NOT include pointer-lock or gamepad controls.
- Is NOT a branded clone of a commercial franchise (original cloud hop puzzle).
- Does NOT ship audio.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire138 scaffold: CMS + JSP + pictogram + SKILL written');
