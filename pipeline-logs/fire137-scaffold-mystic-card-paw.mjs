#!/usr/bin/env node
/** fire137: scaffold mystic-card-paw CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SKILL = join(ROOT, '..', '.agent/skills/tool-mysticcardpaw');
const DATE = '2026-07-18';

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

cmsTxt('mysticcardpaw', 'BODYTITLE', 'Mystic Card Paw - Free Online Black Cat Poker Puzzle Game');
cmsTxt('mysticcardpaw', 'BODYDESC', 'Mystic Card Paw - free browser card puzzle: click five cards into poker combos, use cat abilities pounce purr hiss scratch, chase a high score. Pointer click dual canvas, ~36 KB, no install.');
cmsTxt('mysticcardpaw', 'BODYKW', 'mystic card paw game, black cat poker puzzle, browser card combo game, js13k poker game, cat abilities card game, free online poker puzzle');

cmsHtml('mysticcardpaw', 'BODYHTML', `<div class="w3-container">
    <p>Mystic Card Paw is a black-cat poker puzzle in the browser: click cards from your hand into a five-card combo row, score standard poker hands, and spend one-use cat abilities on the side panel. Chase a local high score until the deck runs out. About ~36 KB after Play, no install, no account.</p>
    <p>Prefer a street-crossing arcade? Try <a href="/games/unlucky-crossing.html">Unlucky Crossing</a>.</p>
</div>

<div id="mcpWrapper" class="w3-container" style="background:#0f1a14; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="mcpStage" style="position:relative; width:100%; aspect-ratio:16/9; min-height:480px; background:#0f5f3f; border-radius:6px; overflow:hidden;">
            <div id="mcpLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#c9a227;">MYSTIC CARD PAW</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Build poker hands with a mischievous black cat dealer. Pounce, purr, hiss, and scratch tilt fate before the deck empties. From ZYXPlay/js13k-2025 (MIT, JS13K 2025). About ~36 KB downloads once when you press Play.</p>
                <button id="mcpPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Click or tap cards on the main canvas; ability buttons live on the side canvas. Tap the title screen once to start. Best on desktop or tablet with a pointer.</p>
            </div>
        </div>
        <div id="mcpStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="mcpFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">High score saves locally as ftol:mysticcardpaw:highScore in your browser.</span>
    </div>
    <style>
        #mcpStage:fullscreen { border-radius: 0; }
        #mcpStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('mysticcardpaw', 'BODYWELCOME', `<p>Welcome to Mystic Card Paw - a free browser black-cat poker puzzle you can play without an account or install. Press Play to load the ~36 KB dual-canvas engine in a same-origin iframe, then tap the title screen to deal your first hand. Click cards from the bottom row into the center combo line; when five cards sit in the combo, the engine scores a standard poker hand and adds points. One-use abilities on the auxiliary canvas let you pounce (swap a combo card with the deck top), purr (peek at the next draw), hiss (redeal your hand at a score penalty), or scratch (burn deck cards and bias the next draw). Your best run score persists locally. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('mysticcardpaw', 'BODYJS', `<script>
    web.localUpload = false;
    var MCP_GAME_URL = 'mystic-card-paw/index.html';
    function mcpStatus(text) {
        var el = document.getElementById('mcpStatus');
        if (el) el.textContent = text;
    }
    function mcpInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'mcpFrame';
        frame.src = MCP_GAME_URL;
        frame.title = 'Mystic Card Paw game';
        frame.setAttribute('allow', 'fullscreen; autoplay');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            mcpStatus('Game loaded. Tap the title screen on the main canvas to start, then click cards to build a five-card combo.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('mcpLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('mcpStage');
        var playBtn = document.getElementById('mcpPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('mcpFullscreenBtn');
        playBtn.addEventListener('click', function () {
            mcpStatus('Loading the game (about 36 KB, one time - then cached)...');
            mcpInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('mcpFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('mysticcardpaw', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Mystic Card Paw?</summary><p>A black-cat poker puzzle. You click cards from a five-card hand into a center combo row. When five cards fill the combo, the engine evaluates a standard poker hand and adds score points. The run ends when fewer than five cards remain between hand and deck.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Pointer click or tap only. On the title screen, click the main canvas once to start. During play, click cards on the main canvas to move them into the combo row. Ability buttons (Pounce, Purr, Hiss, Scratch) sit on the auxiliary canvas beside the cat sprite. Long-press or hover an ability for its tooltip.</p></details>
<details class="faq-item"><summary>What do the cat abilities do?</summary><p>Pounce replaces one combo card with the deck top (click Pounce, then a combo card). Purr peeks at the next deck card. Hiss redeals your hand but applies a 20 percent score penalty on the next combo. Scratch burns the top three deck cards and biases the next draw toward black suits.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>Only your high score saves locally under ftol:mysticcardpaw:highScore. Each new run starts from the title screen with a fresh deck and one charge of each ability.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ~36 KB of HTML and JavaScript after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Yes. Portrait stacks the two 256 by 240 canvases vertically; landscape places them side by side. Touch taps map to canvas coordinates for cards and ability buttons.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from js13k-2025 by ZYXPlay (ZYXPlay/js13k-2025) under the MIT license. This site build renames the title, adds noindex on the iframe, namespaces the high-score key, and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/mystic-card-paw.jsp', JSP_WRAPPER);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Mystic Card Paw - Step by Step</b></h1>
<p>The <a href="/games/mystic-card-paw.html">Mystic Card Paw</a> page loads a ~36 KB dual-canvas poker puzzle in an iframe. Build five-card combos, spend cat abilities, and chase a high score. Press Play on this page to start.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Click cards from your hand into the combo row until five sit in the center; the engine scores the poker hand and draws replacements.</b></p></div>
<h2><b>Step 1 - press Play on this page</b></h2><p>Press Play to inject the iframe (~36 KB). Wait for the plasma background and orbiting title cards, then tap anywhere on the main canvas to deal. Upstream is ZYXPlay/js13k-2025 (MIT, JS13K 2025).</p>
<h2><b>Step 2 - read the dual canvases</b></h2><p>The main canvas (256 by 240) shows your hand, the deck, combo row, and card particles. The auxiliary canvas shows the wagging cat, score HUD, and four ability buttons.</p>
<h2><b>Step 3 - play cards into the combo</b></h2><p>Click a card in your bottom hand to slide it into the center combo line. Each played card draws a replacement from the deck when possible. Fill all five combo slots to trigger scoring.</p>
<h2><b>Step 4 - score poker hands</b></h2><p>Standard poker ranks apply: pair through royal flush with fixed point values (for example pair 100, flush 500, royal flush 1000). Hiss applies a 20 percent penalty on the next scored combo only.</p>
<h2><b>Step 5 - use cat abilities once each</b></h2><p>Pounce: click the button, then a combo card to swap with the deck top. Purr: peek at the next draw. Hiss: redeal your hand. Scratch: burn three deck cards and tilt the next draw toward black suits. Each ability starts with one charge per run.</p>
<h2><b>Step 6 - chase the high score</b></h2><p>The run ends when hand plus deck cannot fill another five-card combo. Beat your stored high score (saved locally) before the deck runs dry.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>~36 KB</td><td>index.html + assets/</td></tr><tr><td>Input</td><td>pointer click / tap</td><td>main + aux canvases</td></tr><tr><td>Saves</td><td>high score only</td><td>ftol:mysticcardpaw:highScore</td></tr><tr><td>Resolution</td><td>256 x 240 each</td><td>dual canvas + plasma bg</td></tr></table>
<p>See <a href="/guides/mystic-card-paw-when.html">when to play</a>, <a href="/guides/mystic-card-paw-vs-alternatives.html">comparisons</a>, and <a href="/games/potion-brew-shop.html">Potion Brew Shop</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Mystic Card Paw</b></h1>
<p><a href="/games/mystic-card-paw.html">Mystic Card Paw</a> fits short breaks where you want a score-chase card puzzle with light strategy - about ~36 KB after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>Quick poker combo sessions</b></h2><p>Each combo decision takes seconds: pick which hand cards to commit, then optionally spend an ability before the five-card evaluation.</p>
<h2><b>When you like ability trade-offs</b></h2><p>One charge each of pounce, purr, hiss, and scratch forces timing: save pounce for a weak combo card, or hiss early to hunt a flush.</p>
<h2><b>When to pick another game</b></h2><p>Want keyboard typing instead of cards? Use <a href="/games/cat-typing-race.html">Cat Typing Race</a>. Want click potions? Use <a href="/games/potion-brew-shop.html">Potion Brew Shop</a>.</p>
<p>See <a href="/guides/how-to-play-mystic-card-paw.html">how to play</a> and <a href="/guides/mystic-card-paw-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Mystic Card Paw vs Alternatives</b></h1>
<p><a href="/games/mystic-card-paw.html">Mystic Card Paw</a> is a dual-canvas poker combo puzzle with one-use cat abilities and a local high score. Compare it with two other free browser cat games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Mystic Card Paw</td><td>~36 KB</td><td>Click cards + ability buttons</td><td>ftol:mysticcardpaw:highScore</td></tr>
<tr><td><a href="/games/potion-brew-shop.html">Potion Brew Shop</a></td><td>~32 KB</td><td>Click ingredients on canvas</td><td>none</td></tr>
<tr><td><a href="/games/unlucky-crossing.html">Unlucky Crossing</a></td><td>~72 KB</td><td>WASD / arrows + touch</td><td>none</td></tr>
</table>
<p>Pick Mystic Card Paw for poker-hand scoring and deck-management abilities. Pick Potion Brew Shop for timed ingredient orders. Pick Unlucky Crossing for infinite street rows.</p>
<p>See <a href="/guides/how-to-play-mystic-card-paw.html">how to play</a> and <a href="/guides/mystic-card-paw-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-mystic-card-paw', slug: 'guideshowtoplaymysticcardpaw', enTitle: 'How to Play Mystic Card Paw - Step by Step', enDesc: 'How to play Mystic Card Paw: click cards into poker combos, cat abilities pounce purr hiss scratch, high score, ~36 KB browser puzzle.', html: howToEn },
  { route: 'mystic-card-paw-when', slug: 'guidesmysticcardpawwhen', enTitle: 'When to Play Mystic Card Paw', enDesc: 'When Mystic Card Paw fits: poker combo puzzle, cat abilities, dual canvas click controls, ~36 KB.', html: whenEn },
  { route: 'mystic-card-paw-vs-alternatives', slug: 'guidesmysticcardpawvsalternatives', enTitle: 'Mystic Card Paw vs Alternatives', enDesc: 'Compare Mystic Card Paw with Potion Brew Shop and Unlucky Crossing - download size, input, saves.', html: vsEn },
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
    } else if (g.route === 'how-to-play-mystic-card-paw') {
      cmsSlug = `guides${loc.prefix}howtoplaymysticcardpaw`;
    } else if (g.route === 'mystic-card-paw-when') {
      cmsSlug = `guides${loc.prefix}mysticcardpawwhen`;
    } else {
      cmsSlug = `guides${loc.prefix}mysticcardpawvsalternatives`;
    }

    const howTitles = {
      pt: [`Como jogar Mystic Card Paw`, `Como jogar Mystic Card Paw: combos de poker, habilidades do gato, ~36 KB.`],
      es: [`Como jugar Mystic Card Paw`, `Como jugar Mystic Card Paw: combos de poker, habilidades del gato, ~36 KB.`],
      vi: [`Cach choi Mystic Card Paw`, `Huong dan Mystic Card Paw: combo poker, ky nang meo, ~36 KB.`],
      id: [`Cara main Mystic Card Paw`, `Panduan Mystic Card Paw: combo poker, kemampuan kucing, ~36 KB.`],
      de: [`Mystic Card Paw spielen`, `Mystic Card Paw spielen: Poker-Kombos, Katzen-Faehigkeiten, ~36 KB.`],
    };
    const whenTitles = {
      pt: [`Quando jogar Mystic Card Paw`, `Quando Mystic Card Paw encaixa: puzzle de cartas, ~36 KB.`],
      es: [`Cuando jugar Mystic Card Paw`, `Cuando jugar Mystic Card Paw: rompecabezas de cartas, ~36 KB.`],
      vi: [`Khi nao choi Mystic Card Paw`, `Khi nao choi Mystic Card Paw: giai do bai, ~36 KB.`],
      id: [`Kapan main Mystic Card Paw`, `Kapan main Mystic Card Paw: teka-teki kartu, ~36 KB.`],
      de: [`Wann Mystic Card Paw spielen`, `Wann Mystic Card Paw spielen: kurze Poker-Kombos, ~36 KB.`],
    };
    const vsTitles = {
      pt: [`Mystic Card Paw vs alternativas`, `Compare Mystic Card Paw com Potion Brew Shop e Unlucky Crossing.`],
      es: [`Mystic Card Paw vs alternativas`, `Compara Mystic Card Paw con Potion Brew Shop y Unlucky Crossing.`],
      vi: [`Mystic Card Paw vs lua chon khac`, `So sanh Mystic Card Paw voi Potion Brew Shop va Unlucky Crossing.`],
      id: [`Mystic Card Paw vs alternatif`, `Bandingkan Mystic Card Paw dengan Potion Brew Shop dan Unlucky Crossing.`],
      de: [`Mystic Card Paw vs Alternativen`, `Mystic Card Paw vs Potion Brew Shop und Unlucky Crossing vergleichen.`],
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
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser card puzzle on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/mystic-card-paw.html">Mystic Card Paw</a> laedt ein ~36 KB Poker-Raetsel im iframe. Klicken Sie Karten in die Combo-Reihe. Vier Katzen-Faehigkeiten je einmal pro Lauf.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Steuerung: Klick auf Haupt- und Hilfs-Canvas. Highscore speichert lokal unter ftol:mysticcardpaw:highScore. Engine MIT (ZYXPlay/js13k-2025, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/mystic-card-paw.html">Mystic Card Paw</a> loads a ~36 KB poker combo puzzle in an iframe. Click cards into a five-card combo row and use pounce, purr, hiss, and scratch abilities once each per run.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Dual 256 by 240 canvases; high score saves locally. Engine MIT (ZYXPlay/js13k-2025, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

w('source/web/src/main/webapp/static/img/illustrations/mini-pictogram/mysticcardpaw__b4e7c2a8.svg', `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-mcp-title svg-minipictogram-mcp-desc">
  <title id="svg-minipictogram-mcp-title">Mystic Card Paw</title>
  <desc id="svg-minipictogram-mcp-desc">Black cat poker card puzzle game</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#0f5f3f" aria-hidden="true"/>
  <rect x="14" y="16" width="18" height="26" rx="3" fill="#f5f5f5" stroke="#222" stroke-width="1.5"/>
  <text x="23" y="32" text-anchor="middle" font-family="Georgia, serif" font-size="14" font-weight="700" fill="#c00">A</text>
  <rect x="32" y="22" width="18" height="26" rx="3" fill="#1a1a1a" stroke="#444" stroke-width="1.5" transform="rotate(8 41 35)"/>
  <ellipse cx="42" cy="48" rx="10" ry="6" fill="#111" stroke="#888" stroke-width="1"/>
  <circle cx="38" cy="44" r="2" fill="#c9a227"/>
  <circle cx="46" cy="44" r="2" fill="#c9a227"/>
  <text x="32" y="58" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="6" font-weight="700" letter-spacing="0.3" fill="#FFFFFF">MCP</text>
</svg>`);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-mysticcardpaw
description: |
  Ground-truth for /games/mystic-card-paw.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire137) from ZYXPlay/js13k-2025 at
  static/games/mystic-card-paw/.
---

# tool-mysticcardpaw - /games/mystic-card-paw.html

## Identity

- **Route**: /games/mystic-card-paw.html
- **Slug**: \`mystic-card-paw\` (CMS: \`mysticcardpaw\`)
- **Cluster**: games
- **Aliases**: /mystic-card-paw.html

## Reader task

Build five-card poker combos from a dealt hand, score standard poker ranks for points, spend one-use black-cat abilities (pounce, purr, hiss, scratch) to tilt the deck, and chase a local high score until the deck cannot fill another combo.

## Processing model

**client-side-only** - JS13K Vite bundle (~36 KB: index.html + assets/index-*.js with inlined spritesheet), same-origin iframe. No CDN, no analytics, no external fonts at runtime. Engine HTML is noindex; canonical URL is /games/mystic-card-paw.html. Dual gameplay canvases at internal 256x240 (main: cards/deck/combo; aux: cat sprite, score HUD, ability buttons) plus optional 512x240 plasma background canvas. CSS scales canvases responsively; portrait stacks, landscape side-by-side.

## License analysis

- Upstream: ZYXPlay/js13k-2025, **MIT, Copyright (c) 2025 ZYXPlay** (LICENSE vendored).
- Original js13k 2025 Black Cat theme poker puzzle; not a commercial clone (generic poker + cat superstition theme).
- Spritesheet cat.png bundled/inlined in js13k build; ZzFX procedural audio.
- localStorage high score patched to \`ftol:mysticcardpaw:highScore\` (upstream used pokerHighScore).
- Adaptations: noindex meta, English rebrand Mystic Card Paw on iframe title, LICENSE + CREDITS shipped, js13k build omits PWA service worker.
- Clean ELIGIBLE; no operator adjudication.

## Reader-benefit framing menu

- V1: Click cards from the bottom hand into the center combo row (max five cards).
- V2: When five combo cards sit in the row, the engine evaluates a standard poker hand and adds score (pair 100 through royal flush 1000).
- V3: Pounce replaces one combo card with the deck top (click Pounce, then a combo card); one charge per run.
- V4: Purr peeks at the next deck card; Hiss redeals your hand and applies a 20 percent score penalty on the next combo only; Scratch burns top three deck cards and biases the next draw toward black suits.
- V5: Each ability (pounce, purr, hiss, scratch) starts with one charge per run; buttons on the auxiliary canvas.
- V6: Long-press (~550ms) or desktop hover on an ability button shows its tooltip popup.
- V7: Title screen: any click on the main canvas starts a new run; game over screen click returns to title.
- V8: High score persists in localStorage key ftol:mysticcardpaw:highScore; run score resets each deal.
- V9: About ~36 KB after Play; pointer click/tap on dual canvases only.
- V10: Adapted from js13k-2025 by ZYXPlay (MIT, JS13K 2025); ships LICENSE + CREDITS.

## Implemented features

- Dual 256x240 canvases (main + aux) with responsive CSS scaling and pointer coordinate remapping.
- Five-card hand dealt from a 52-card deck; playing a card draws a replacement when deck has cards.
- Standard poker hand evaluation with animated score feedback and particle fireworks on high hands (score >= 500).
- Four one-use cat abilities with animated paw/scratch VFX on the main canvas.
- Wagging cat sprite, orbiting title-card animation, plasma background (hidden when prefers-reduced-motion).
- Procedural ZzFX audio plus generated loop music (starts after first body click for autoplay policy).

## Anti-claims

- Does NOT use a server backend or CDN at runtime.
- Does NOT use keyboard movement (pointer click/tap only).
- Does NOT include pointer-lock or gamepad controls.
- Is NOT a branded clone of a commercial poker franchise (original js13k cat-themed puzzle).
- Does NOT ship a service worker in this js13k site build.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire137 scaffold: CMS + JSP + pictogram + SKILL written');
