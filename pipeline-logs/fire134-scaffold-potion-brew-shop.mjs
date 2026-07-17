#!/usr/bin/env node
/** fire134: scaffold potion-brew-shop CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SKILL = join(ROOT, '..', '.agent/skills/tool-potionbrewshop');
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
  return p;
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

cmsTxt('potionbrewshop', 'BODYTITLE', 'Potion Brew Shop - Free Online Point-and-Click Puzzle Game');
cmsTxt('potionbrewshop', 'BODYDESC', 'Potion Brew Shop - free browser potion puzzle: click ingredients into the cauldron, brew orders for customers, unlock new bottles, and avoid too many mistakes. Mouse controls, ~32 KB, no install.');
cmsTxt('potionbrewshop', 'BODYKW', 'potion brew shop game, browser potion puzzle, click cauldron game, js13k potion shop, black cat potions online, free point click puzzle');

cmsHtml('potionbrewshop', 'BODYHTML', `<div class="w3-container">
    <p>Potion Brew Shop is a point-and-click potion puzzle in the browser: read each customer order, click shelf ingredients into the cauldron, then serve the bottle before the timer runs out. Clear 30 orders to win the campaign; ten wrong brews close the shop. About ~32 KB after Play, no install, no account.</p>
    <p>Prefer pipe valves instead? Try <a href="/games/wash-the-cat.html">Wash The Cat</a>.</p>
</div>

<div id="pbsWrapper" class="w3-container" style="background:#1a1020; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="pbsStage" style="position:relative; width:100%; aspect-ratio:16/9; min-height:480px; background:#26192c; border-radius:6px; overflow:hidden;">
            <div id="pbsLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#c9a227;">POTION BREW SHOP</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Fulfill potion orders, unlock new ingredients, and keep mistakes under ten. From Black Cat Potions by Sebastian Dorn (MIT, JS13K 2025). About ~32 KB downloads once when you press Play.</p>
                <button id="pbsPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Click or tap ingredients, the cauldron, and the bottle button on the canvas. Press Esc inside the game to pause. Best on desktop or tablet with a pointer.</p>
            </div>
        </div>
        <div id="pbsStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="pbsFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">No save data - each shop run starts fresh in your browser.</span>
    </div>
    <style>
        #pbsStage:fullscreen { border-radius: 0; }
        #pbsStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('potionbrewshop', 'BODYWELCOME', `<p>Welcome to Potion Brew Shop - a free browser potion puzzle you can play without an account or install. Press Play to load the ~32 KB canvas engine in a same-origin iframe, then click shelf bottles to add ingredients to the cauldron and serve the correct brew before the order timer expires. New ingredient types unlock as you progress through three shop stages. Win by completing 30 correct orders; lose if customers complain ten times. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>. Prefer pipe routing? Try <a href="/games/wash-the-cat.html">Wash The Cat</a>.</p>`);

cmsHtml('potionbrewshop', 'BODYJS', `<script>
    web.localUpload = false;
    var PBS_GAME_URL = 'potion-brew-shop/index.html';
    function pbsStatus(text) {
        var el = document.getElementById('pbsStatus');
        if (el) el.textContent = text;
    }
    function pbsInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'pbsFrame';
        frame.src = PBS_GAME_URL;
        frame.title = 'Potion Brew Shop game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            pbsStatus('Game loaded. Click Open Shop on the canvas, then click ingredients and the bottle button to brew orders.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('pbsLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('pbsStage');
        var playBtn = document.getElementById('pbsPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('pbsFullscreenBtn');
        playBtn.addEventListener('click', function () {
            pbsStatus('Loading the game (about 32 KB, one time - then cached)...');
            pbsInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('pbsFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('potionbrewshop', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Potion Brew Shop?</summary><p>A point-and-click potion shop puzzle. Customers show an order card; you click shelf ingredients into the cauldron, then click the bottle button to serve. Clear 30 orders to win; ten wrong brews end the run.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Mouse click or tap on the canvas only. Click ingredient bottles on the shelves to add them to the cauldron. Click the round bottle button to serve. Press Esc to pause. A restart button clears the cauldron mid-order.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>No. The engine does not use localStorage or accounts. Each shop session starts from the intro screen.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ~32 KB of HTML and JavaScript after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>The engine uses canvas clicks and scales to your screen. It plays on phones and tablets, though reading order text and clicking small bottles is easiest with a mouse or stylus.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Black Cat Potions by Sebastian Dorn (sebadorn/js13k-2025-black-cat) under the MIT license. This site build adds noindex on the iframe and ships LICENSE next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/potion-brew-shop.jsp', JSP_WRAPPER);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Potion Brew Shop - Step by Step</b></h1>
<p>The <a href="/games/potion-brew-shop.html">Potion Brew Shop</a> page loads a ~32 KB potion puzzle in an iframe. Brew orders, unlock ingredients, and avoid ten mistakes. Press Play on this page to start.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Click shelf ingredients into the cauldron, then click the bottle button to serve the order before the timer runs out.</b></p></div>
<h2><b>Step 1 - press Play on this page</b></h2><p>Press Play to inject the iframe (~32 KB). The intro screen loads inside the canvas. Upstream is sebadorn/js13k-2025-black-cat (MIT, JS13K 2025).</p>
<h2><b>Step 2 - open the shop</b></h2><p>Click the yellow Open Shop button on the intro overlay. The first stage starts with warm and cold ingredient bottles on the shelves.</p>
<h2><b>Step 3 - read the order card</b></h2><p>Each customer shows a speech bubble describing the potion they want. Some orders accept alternative recipes when noted in the engine (for example plain water instead of a cooling brew).</p>
<h2><b>Step 4 - brew in the cauldron</b></h2><p>Click ingredient bottles to toss them into the cauldron. The fluid color mixes as you add items. Click the round bottle button when you think the brew matches the order.</p>
<h2><b>Step 5 - watch the score bars</b></h2><p>Done tracks successful orders toward 30. Wrong counts mistakes toward 10. Fail ten wrong orders and the shop closes. Some orders have a countdown timer on the card.</p>
<h2><b>Step 6 - unlock new ingredients</b></h2><p>After enough correct orders, a new stage adds Life and later Emotion bottles with harder multi-ingredient recipes. Press Esc anytime to pause.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>~32 KB</td><td>index.html + i.js</td></tr><tr><td>Input</td><td>click / tap</td><td>canvas pointer only</td></tr><tr><td>Saves</td><td>none</td><td>fresh run each session</td></tr><tr><td>Win / lose</td><td>30 done / 10 wrong</td><td>campaign goal</td></tr></table>
<p>See <a href="/guides/potion-brew-shop-when.html">when to play</a>, <a href="/guides/potion-brew-shop-vs-alternatives.html">comparisons</a>, and <a href="/games/wash-the-cat.html">Wash The Cat</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Potion Brew Shop</b></h1>
<p><a href="/games/potion-brew-shop.html">Potion Brew Shop</a> fits short breaks where you want a cozy click puzzle with timed orders - about ~32 KB after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>Order-matching coffee breaks</b></h2><p>Each customer is one quick recipe decision. Read the card, click two or three bottles, serve before the timer expires.</p>
<h2><b>When you like unlock progression</b></h2><p>Three shop stages add Life herbs and Emotion crystals with longer ingredient lists. The Done bar shows progress toward 30 correct brews.</p>
<h2><b>When to pick another game</b></h2><p>Want pipe valves instead of potions? Use <a href="/games/wash-the-cat.html">Wash The Cat</a>. Want rotate-to-connect tiles? Use <a href="/games/pipe-rotate-puzzle.html">Pipe Rotate Puzzle</a>.</p>
<p>See <a href="/guides/how-to-play-potion-brew-shop.html">how to play</a> and <a href="/guides/potion-brew-shop-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Potion Brew Shop vs Alternatives</b></h1>
<p><a href="/games/potion-brew-shop.html">Potion Brew Shop</a> is a timed ingredient-matching shop puzzle with a cauldron and order cards. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Potion Brew Shop</td><td>~32 KB</td><td>Click ingredients on canvas</td><td>none</td></tr>
<tr><td><a href="/games/wash-the-cat.html">Wash The Cat</a></td><td>~50 KB</td><td>Click valves on canvas</td><td>ftol:washthecat:lj</td></tr>
<tr><td><a href="/games/pipe-rotate-puzzle.html">Pipe Rotate Puzzle</a></td><td>~32 KB</td><td>Tap / click rotate tiles</td><td>ftol:piperotatepuzzle:level</td></tr>
</table>
<p>Pick Potion Brew Shop for recipe matching and staged ingredient unlocks. Pick Wash The Cat for water routing and a walking cat goal. Pick Pipe Rotate Puzzle for static pipe rotation.</p>
<p>See <a href="/guides/how-to-play-potion-brew-shop.html">how to play</a> and <a href="/guides/potion-brew-shop-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-potion-brew-shop', slug: 'guideshowtoplaypotionbrewshop', enTitle: 'How to Play Potion Brew Shop - Step by Step', enDesc: 'How to play Potion Brew Shop: click ingredients, brew cauldron orders, unlock stages, ~32 KB browser potion puzzle.', html: howToEn },
  { route: 'potion-brew-shop-when', slug: 'guidespotionbrewshopwhen', enTitle: 'When to Play Potion Brew Shop', enDesc: 'When Potion Brew Shop fits: timed order matching, staged ingredients, click controls, ~32 KB.', html: whenEn },
  { route: 'potion-brew-shop-vs-alternatives', slug: 'guidespotionbrewshopvsalternatives', enTitle: 'Potion Brew Shop vs Alternatives', enDesc: 'Compare Potion Brew Shop with Wash The Cat and Pipe Rotate Puzzle - download size, input, saves.', html: vsEn },
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
    } else if (g.route === 'how-to-play-potion-brew-shop') {
      cmsSlug = `guides${loc.prefix}howtoplaypotionbrewshop`;
    } else if (g.route === 'potion-brew-shop-when') {
      cmsSlug = `guides${loc.prefix}potionbrewshopwhen`;
    } else {
      cmsSlug = `guides${loc.prefix}potionbrewshopvsalternatives`;
    }

    const howTitles = {
      pt: [`Como jogar Potion Brew Shop`, `Como jogar Potion Brew Shop: ingredientes, caldeirao, pedidos, ~32 KB.`],
      es: [`Como jugar Potion Brew Shop`, `Como jugar Potion Brew Shop: ingredientes, caldero, pedidos, ~32 KB.`],
      vi: [`Cach choi Potion Brew Shop`, `Huong dan Potion Brew Shop: nguyen lieu, noi, don hang, ~32 KB.`],
      id: [`Cara main Potion Brew Shop`, `Panduan Potion Brew Shop: bahan, kuali, pesanan, ~32 KB.`],
      de: [`Potion Brew Shop spielen`, `Potion Brew Shop spielen: Zutaten, Kessel, Bestellungen, ~32 KB.`],
    };
    const whenTitles = {
      pt: [`Quando jogar Potion Brew Shop`, `Quando Potion Brew Shop encaixa: puzzle de pocoes, ~32 KB.`],
      es: [`Cuando jugar Potion Brew Shop`, `Cuando jugar Potion Brew Shop: rompecabezas de pociones, ~32 KB.`],
      vi: [`Khi nao choi Potion Brew Shop`, `Khi nao choi Potion Brew Shop: giai do pha che, ~32 KB.`],
      id: [`Kapan main Potion Brew Shop`, `Kapan main Potion Brew Shop: teka-teki ramuan, ~32 KB.`],
      de: [`Wann Potion Brew Shop spielen`, `Wann Potion Brew Shop spielen: kurze Bestell-Raetsel, ~32 KB.`],
    };
    const vsTitles = {
      pt: [`Potion Brew Shop vs alternativas`, `Compare Potion Brew Shop com Wash The Cat e Pipe Rotate Puzzle.`],
      es: [`Potion Brew Shop vs alternativas`, `Compara Potion Brew Shop con Wash The Cat y Pipe Rotate Puzzle.`],
      vi: [`Potion Brew Shop vs lua chon khac`, `So sanh Potion Brew Shop voi Wash The Cat va Pipe Rotate Puzzle.`],
      id: [`Potion Brew Shop vs alternatif`, `Bandingkan Potion Brew Shop dengan Wash The Cat dan Pipe Rotate Puzzle.`],
      de: [`Potion Brew Shop vs Alternativen`, `Potion Brew Shop vs Wash The Cat und Pipe Rotate Puzzle vergleichen.`],
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
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser potion puzzle on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/potion-brew-shop.html">Potion Brew Shop</a> laedt ein ~32 KB Trank-Raetsel im iframe. Klicken Sie Zutaten in den Kessel. 30 richtige Bestellungen gewinnen; 10 Fehler schliessen den Laden.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Steuerung: Klick auf Flaschen und Kessel im Canvas. Esc pausiert. Engine MIT (sebadorn/js13k-2025-black-cat, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/potion-brew-shop.html">Potion Brew Shop</a> loads a ~32 KB potion puzzle in an iframe. Click shelf ingredients into the cauldron and serve orders. Win at 30 correct brews; lose at 10 mistakes.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Three shop stages unlock Life and Emotion ingredients. Esc pauses. Engine MIT (sebadorn/js13k-2025-black-cat, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

w('source/web/src/main/webapp/static/img/illustrations/mini-pictogram/potionbrewshop__c7e2a4f9.svg', `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-pbs-title svg-minipictogram-pbs-desc">
  <title id="svg-minipictogram-pbs-title">Potion Brew Shop</title>
  <desc id="svg-minipictogram-pbs-desc">Point and click potion brew shop puzzle game</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#26192c" aria-hidden="true"/>
  <ellipse cx="32" cy="42" rx="18" ry="10" fill="#444" stroke="#888" stroke-width="2"/>
  <path d="M24 42 Q32 22 40 42" fill="#6a1b9a" opacity="0.85"/>
  <rect x="28" y="18" width="8" height="12" rx="2" fill="#c9a227"/>
  <circle cx="32" cy="32" r="6" fill="#a81646" opacity="0.9"/>
  <text x="32" y="58" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="6" font-weight="700" letter-spacing="0.3" fill="#FFFFFF">PBS</text>
</svg>`);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-potionbrewshop
description: |
  Ground-truth for /games/potion-brew-shop.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire134) from sebadorn/js13k-2025-black-cat at
  static/games/potion-brew-shop/.
---

# tool-potionbrewshop - /games/potion-brew-shop.html

## Identity

- **Route**: /games/potion-brew-shop.html
- **Slug**: \`potion-brew-shop\` (CMS: \`potionbrewshop\`)
- **Cluster**: games
- **Aliases**: /potion-brew-shop.html

## Reader task

Run a potion shop: read customer order cards, click shelf ingredients into the cauldron, serve the bottle before timers expire, unlock new ingredients across three stages, and finish 30 correct orders without hitting 10 mistakes.

## Processing model

**client-side-only** - JS13K canvas game (~32 KB: index.html + i.js), same-origin iframe. No CDN, no analytics, no external fonts at runtime. Engine HTML is noindex; canonical URL is /games/potion-brew-shop.html. Internal canvas resolution scales to viewport (js13k.Renderer).

## License analysis

- Upstream: sebadorn/js13k-2025-black-cat, **MIT, Copyright (c) 2025 Sebastian Dorn** (LICENSE vendored).
- Original js13k 2025 Black Cat Potions entry; not a commercial clone.
- Embedded audio: kitten meow (AlexMurphy53, freesound.org) + ZzFX synth in build.
- No localStorage or session persistence in engine source.
- Adaptations: noindex meta, English iframe title Potion Brew Shop.
- Clean ELIGIBLE; no operator adjudication.

## Reader-benefit framing menu

- V1: Click shelf bottles to add warm, cold, life, and emotion ingredients to the cauldron.
- V2: Click the round bottle button to serve the brew and score the current order.
- V3: Done bar tracks successful orders toward 30; Wrong bar tracks mistakes toward 10.
- V4: Three shop stages unlock new ingredient types and harder multi-item recipes.
- V5: Some orders accept alternative potions when defined in js13k.Potion (e.g. Water for CoolingPotion).
- V6: Esc pauses; on-screen restart clears cauldron contents mid-order.
- V7: About ~32 KB after Play; pointer click/tap on canvas only.
- V8: Adapted from Black Cat Potions by Sebastian Dorn (MIT, JS13K 2025); ships LICENSE + CREDITS.

## Implemented features

- Canvas 2D shop scene with animated black cat background and cauldron fluid mixing.
- Point-and-click ingredient bottles on shelves (Fire Berries, Ice Crystals, Life herbs, Emotion crystals).
- Order cards with speech bubbles, per-order timers, and scoring (+1 correct, 0 alternative, -1 wrong).
- Campaign win at ordersCorrectGoal 30; game over at ordersWrongLimit 10 failed orders.
- Procedural ZzFX audio plus embedded kitten meow sample (no runtime CDN fetch).
- Intro overlay with Open Shop button; pause overlay on Esc.

## Anti-claims

- Does NOT use a server backend or CDN at runtime.
- Does NOT use keyboard movement (pointer click/tap only; Esc is pause only).
- Does NOT persist progress in localStorage or accounts.
- Is NOT a branded clone of a commercial potion or cooking franchise.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire134 scaffold: CMS + JSP + pictogram + SKILL written');
