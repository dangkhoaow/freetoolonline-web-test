#!/usr/bin/env node
/** fire145: scaffold darkline-paws CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // web-test
const SKILL = join(ROOT, '..', '.agent/skills/tool-darklinepaws');
const DATE = '2026-07-18';
const SIZE = '~36 KB';

const JSP = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
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
    details.faq-item > p, details.faq-item > div { padding: 0 8px 8px 28px; margin: 0; }
</style>`;

cmsTxt('darklinepaws', 'BODYTITLE', 'DarkLine Paws - Free Online 3-in-1 Cat Mini-Game Bundle');
cmsTxt('darklinepaws', 'BODYDESC', 'DarkLine Paws - free browser 3-in-1 cat game: a raycasted first-person maze, a Tic-Tac-Toe duel against an unbeatable cat AI, and a rooftop building-hop runner, about 36 KB, no install.');
cmsTxt('darklinepaws', 'BODYKW', 'darkline paws game, cat maze game browser, tic tac toe vs cat, cat rooftop jumper game, js13k black cat game');

cmsHtml('darklinepaws', 'BODYHTML', `<div class="w3-container">
    <p>DarkLine Paws bundles three free browser mini-games behind one menu: a raycasted first-person maze where a mystical cat searches for a witch's house, a Tic-Tac-Toe duel against an unbeatable minimax cat AI, and a rooftop building-hop runner. Pick a mode from the in-game dropdown after Play. About ${SIZE} total, no install, no account.</p>
    <p>Want a fixed-level auto-run platformer instead? Try <a href="/games/boing-cat-platformer.html">Boing Cat Platformer</a>.</p>
</div>

<div id="dlpWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="dlpStage" style="position:relative; width:100%; aspect-ratio:16/10; min-height:420px; background:#0f3460; border-radius:6px; overflow:hidden;">
            <div id="dlpLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#4ecdc4;">DARKLINE PAWS</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Three modes in one menu: a first-person maze, Tic-Tac-Toe vs an unbeatable cat, and a rooftop runner. From DarkLine-Paws by shaurya6903 (MIT, JS13K). About ${SIZE} downloads once when you press Play.</p>
                <button id="dlpPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Keyboard: WASD/arrows move in the maze, Shift runs, Space jumps in the runner, click cells in Tic-Tac-Toe. Best with a keyboard.</p>
            </div>
        </div>
        <div id="dlpStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="dlpFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no save data in this build.</span>
    </div>
    <style>
        #dlpStage:fullscreen { border-radius: 0; }
        #dlpStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('darklinepaws', 'BODYWELCOME', `<p>Welcome to DarkLine Paws - a free browser 3-in-1 cat game bundle you can play without an account or install. Press Play to load the ${SIZE} bundle in a same-origin iframe. The maze opens first: press BEGIN ADVENTURE, pick a maze layout, then press Start Game to move with WASD or the arrow keys, strafe with A/D, and run with Shift while searching for the witch's house. From the maze's own dropdown, switch to a Tic-Tac-Toe duel against an unbeatable minimax cat AI, or to a rooftop building-hop runner where Space (or a click) times each jump between buildings. Press Escape inside either side game to return to the maze menu. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('darklinepaws', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var DLP_GAME_URL = 'darkline-paws/index.html';
    function dlpStatus(text) {
        var el = document.getElementById('dlpStatus');
        if (el) el.textContent = text;
    }
    function dlpInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'dlpFrame';
        frame.src = DLP_GAME_URL;
        frame.title = 'DarkLine Paws game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            dlpStatus('Game loaded. Press BEGIN ADVENTURE, pick a maze, then Start Game.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('dlpLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('dlpStage');
        var playBtn = document.getElementById('dlpPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('dlpFullscreenBtn');
        playBtn.addEventListener('click', function () {
            dlpStatus('Loading the game (about 36 KB, one time - then cached)...');
            dlpInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('dlpFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('darklinepaws', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is DarkLine Paws?</summary><p>A free browser bundle of three cat mini-games behind one menu: a raycasted first-person maze, a Tic-Tac-Toe duel against an unbeatable cat AI, and a rooftop building-hop runner.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>In the maze: WASD or arrows move, A/D strafe, Q/E or left/right turn, Shift runs, Space is a cosmetic eye-blink. In Tic-Tac-Toe: click an empty cell. In the runner: Space or click jumps. Escape returns to the maze menu from either side game.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>In the maze, reach the glowing portal tile without your health reaching zero from spike tiles. In Tic-Tac-Toe, try to beat or draw the cat (it plays a perfect minimax strategy, so a draw is the best possible outcome). In the runner, hop across as many rooftops as possible to reach your master's house.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>This build is session-only. There is no save data. Closing the tab resets all three modes.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, JavaScript, and two small WebP images after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>The page loads on mobile, but the maze and runner need a keyboard for their default controls; Tic-Tac-Toe works fine with taps. Desktop or laptop is the recommended experience.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from DarkLine-Paws by shaurya6903 (js13kGames 2025, Black Cat theme) under the MIT license. This site build adds noindex on all three engine pages and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/darkline-paws.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play DarkLine Paws - Step by Step</b></h1>
<p>The <a href="/games/darkline-paws.html">DarkLine Paws</a> page loads a ${SIZE} bundle of three cat mini-games in an iframe, all reachable from one menu.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, then BEGIN ADVENTURE and Start Game to begin the maze; switch modes from its dropdown.</b></p></div>
<h2><b>Step 1 - press Play and BEGIN ADVENTURE</b></h2><p>Press Play to inject the iframe (${SIZE}). On the title screen press BEGIN ADVENTURE to open the menu.</p>
<h2><b>Step 2 - pick a mode and start</b></h2><p>Choose Deadly Maze, Maze, Cat Climber, or Tic-Tac-Toe from the dropdown, then press Start Game (maze modes) to begin.</p>
<h2><b>Step 3 - move through the maze</b></h2><p>WASD or arrows move, A/D strafe, Q/E or left/right turn, Shift runs. Red spike tiles cost health; green tiles heal; the glowing tile is the goal.</p>
<h2><b>Step 4 - try the side games</b></h2><p>The dropdown also opens a Tic-Tac-Toe duel against an unbeatable minimax cat, and a rooftop runner where Space or a click times each jump. Escape returns to the maze menu.</p>
<h2><b>Step 5 - replay any mode</b></h2><p>Each mode has its own restart: reach or fail the maze goal for a new run, press Play Again after Tic-Tac-Toe, or press R after the runner's game over.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>3 HTML files + 2 WebP icons</td></tr><tr><td>Input</td><td>keyboard + click</td><td>varies per mode</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Modes</td><td>3</td><td>maze, tic-tac-toe, runner</td></tr></table>
<p>See <a href="/guides/darkline-paws-when.html">when to play</a>, <a href="/guides/darkline-paws-vs-alternatives.html">comparisons</a>, and <a href="/games/boing-cat-platformer.html">Boing Cat Platformer</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play DarkLine Paws</b></h1>
<p><a href="/games/darkline-paws.html">DarkLine Paws</a> fits breaks where you want to pick between three different quick games from one menu - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want variety in one download</b></h2><p>A maze exploration session, a logic duel, and a timing runner all live behind the same Play button - switch without reloading the page.</p>
<h2><b>When you want an unbeatable opponent</b></h2><p>The Tic-Tac-Toe mode's cat AI plays a perfect minimax strategy - the best a sharp player can force is a draw, which suits a genuine challenge break.</p>
<h2><b>When to pick another game</b></h2><p>Want a single fixed-level platformer instead? Use <a href="/games/boing-cat-platformer.html">Boing Cat Platformer</a>. Want an endless high-score spike dodge? Use <a href="/games/pixel-spike-run.html">Pixel Spike Run</a>.</p>
<p>See <a href="/guides/how-to-play-darkline-paws.html">how to play</a> and <a href="/guides/darkline-paws-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>DarkLine Paws vs Alternatives</b></h1>
<p><a href="/games/darkline-paws.html">DarkLine Paws</a> is a 3-mode bundle (maze, board game, runner) behind one menu. Compare it with two other free browser cat games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>DarkLine Paws</td><td>${SIZE}</td><td>Keyboard + click (3 modes)</td><td>none (session)</td></tr>
<tr><td><a href="/games/boing-cat-platformer.html">Boing Cat Platformer</a></td><td>~130 KB</td><td>Space (auto-run + jump)</td><td>none (session)</td></tr>
<tr><td><a href="/games/mystic-card-paw.html">Mystic Card Paw</a></td><td>~36 KB</td><td>Click/tap poker actions</td><td>ftol:mysticcardpaw:highScore</td></tr>
</table>
<p>Pick DarkLine Paws for three different games in one download. Pick Boing Cat Platformer for a single fixed-level auto-run platformer. Pick Mystic Card Paw for a dual-canvas poker puzzle.</p>
<p>See <a href="/guides/how-to-play-darkline-paws.html">how to play</a> and <a href="/guides/darkline-paws-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-darkline-paws', slug: 'guideshowtoplaydarklinepaws', enTitle: 'How to Play DarkLine Paws - Step by Step', enDesc: 'How to play DarkLine Paws: maze controls, Tic-Tac-Toe vs a cat AI, rooftop runner, 3 modes, ~36 KB browser game bundle.', html: howToEn },
  { route: 'darkline-paws-when', slug: 'guidesdarklinepawswhen', enTitle: 'When to Play DarkLine Paws', enDesc: 'When DarkLine Paws fits: variety breaks, an unbeatable Tic-Tac-Toe cat AI, ~36 KB.', html: whenEn },
  { route: 'darkline-paws-vs-alternatives', slug: 'guidesdarklinepawsvsalternatives', enTitle: 'DarkLine Paws vs Alternatives', enDesc: 'Compare DarkLine Paws with Boing Cat Platformer and Mystic Card Paw - download size, input, saves.', html: vsEn },
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
    w(`source/web/src/main/webapp/WEB-INF/jsp/${jspPath}`, JSP);

    let cmsSlug;
    if (!loc.prefix) cmsSlug = g.slug;
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplaydarklinepaws`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}darklinepawswhen`;
    else cmsSlug = `guides${loc.prefix}darklinepawsvsalternatives`;

    const howTitles = {
      pt: ['Como jogar DarkLine Paws', 'Como jogar DarkLine Paws: controles do labirinto, Jogo da Velha vs gato, corrida, 3 modos, ~36 KB.'],
      es: ['Como jugar DarkLine Paws', 'Como jugar DarkLine Paws: controles del laberinto, Tres en Raya vs gato, carrera, 3 modos, ~36 KB.'],
      vi: ['Cach choi DarkLine Paws', 'Huong dan DarkLine Paws: dieu khien mien cung, Co Ca Ro voi meo, chay nha, 3 che do, ~36 KB.'],
      id: ['Cara main DarkLine Paws', 'Panduan DarkLine Paws: kontrol labirin, Tic-Tac-Toe vs kucing, lari atap, 3 mode, ~36 KB.'],
      de: ['DarkLine Paws spielen', 'DarkLine Paws spielen: Labyrinth-Steuerung, Tic-Tac-Toe vs Katze, Dachlauf, 3 Modi, ~36 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar DarkLine Paws', 'Quando DarkLine Paws encaixa: variedade em um download, ~36 KB.'],
      es: ['Cuando jugar DarkLine Paws', 'Cuando jugar DarkLine Paws: variedad en una descarga, ~36 KB.'],
      vi: ['Khi nao choi DarkLine Paws', 'Khi nao choi DarkLine Paws: da dang trong mot lan tai, ~36 KB.'],
      id: ['Kapan main DarkLine Paws', 'Kapan main DarkLine Paws: variasi dalam satu unduhan, ~36 KB.'],
      de: ['Wann DarkLine Paws spielen', 'Wann DarkLine Paws spielen: Vielfalt in einem Download, ~36 KB.'],
    };
    const vsTitles = {
      pt: ['DarkLine Paws vs alternativas', 'Compare DarkLine Paws com Boing Cat Platformer e Mystic Card Paw.'],
      es: ['DarkLine Paws vs alternativas', 'Compara DarkLine Paws con Boing Cat Platformer y Mystic Card Paw.'],
      vi: ['DarkLine Paws vs lua chon khac', 'So sanh DarkLine Paws voi Boing Cat Platformer va Mystic Card Paw.'],
      id: ['DarkLine Paws vs alternatif', 'Bandingkan DarkLine Paws dengan Boing Cat Platformer dan Mystic Card Paw.'],
      de: ['DarkLine Paws vs Alternativen', 'DarkLine Paws vs Boing Cat Platformer und Mystic Card Paw vergleichen.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser cat game bundle on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/darkline-paws.html">DarkLine Paws</a> laedt ein ${SIZE} Bundle aus drei Katzen-Minispielen im iframe: Labyrinth, Tic-Tac-Toe und Dachlauf.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Drei Modi, session-only (kein Speicherstand). Engine MIT (DarkLine-Paws, shaurya6903, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/darkline-paws.html">DarkLine Paws</a> loads a ${SIZE} bundle of three cat mini-games in an iframe: a maze, Tic-Tac-Toe, and a rooftop runner.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Three modes, session-only (no save data). Engine MIT (DarkLine-Paws, shaurya6903, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-dlp-title svg-minipictogram-dlp-desc">
  <title id="svg-minipictogram-dlp-title">DarkLine Paws</title>
  <desc id="svg-minipictogram-dlp-desc">Cat silhouette inside a maze corridor</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="12" y="12" width="40" height="6" fill="#7DAFA3"/>
  <rect x="12" y="46" width="40" height="6" fill="#7DAFA3"/>
  <rect x="12" y="12" width="6" height="40" fill="#7DAFA3"/>
  <rect x="46" y="12" width="6" height="40" fill="#7DAFA3"/>
  <circle cx="32" cy="32" r="9" fill="#FFFFFF"/>
  <path d="M25 25 L28 16 L32 24 Z" fill="#FFFFFF"/>
  <path d="M33 24 L37 16 L40 25 Z" fill="#FFFFFF"/>
  <circle cx="29" cy="32" r="1.5" fill="#1C1C1E"/>
  <circle cx="36" cy="32" r="1.5" fill="#1C1C1E"/>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picRel = `source/web/src/main/webapp/static/img/illustrations/mini-pictogram/darklinepaws__${hash8}.svg`;
w(picRel, pictogramBody);
console.log('pictogram', picRel);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-darklinepaws
description: |
  Ground-truth for /games/darkline-paws.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire145) from shaurya6903/DarkLine-Paws
  at static/games/darkline-paws/.
---

# tool-darklinepaws - /games/darkline-paws.html

## Identity

- **Route**: /games/darkline-paws.html
- **Slug**: \`darkline-paws\` (CMS: \`darklinepaws\`)
- **Cluster**: games
- **Aliases**: /darkline-paws.html

## Reader task

Pick one of three cat mini-games from a single in-engine menu: explore a raycasted first-person maze searching for a witch's house, duel an unbeatable minimax Tic-Tac-Toe cat AI, or time jumps across rooftops in an endless building-hop runner.

## Processing model

**client-side-only** - three inline single-file HTML pages (index.html maze + index2.html Tic-Tac-Toe + index3.html "Cat Jumper" runner, ~36 KB total including 2 WebP piece icons), same-origin iframe. No CDN, no analytics, no external fonts, no localStorage anywhere in any of the three modes. All three pages carry noindex; canonical URL is /games/darkline-paws.html. Navigation between modes is upstream's own \`window.location.href\` swap between the 3 sibling files - no custom launcher menu was built; the outer Play button loads index.html and the reader picks a mode from ITS OWN dropdown, exactly as upstream designed it.

## License analysis

- Upstream: shaurya6903 **DarkLine-Paws** (also mirrored at the js13kGames org as js13kGames/darkline-paws), js13kGames 2025 Black Cat theme, **MIT, Copyright (c) 2025 shaurya6903** (LICENSE vendored verbatim, verified via raw fetch).
- Original raycasted-maze + board-game + auto-runner bundle; raycasting is a public-domain rendering technique, not a copy of a specific commercial title. Not a franchise clone.
- Adaptations: added \`<meta name="robots" content="noindex">\` to all 3 HTML files. NO title rebrand needed - all three in-engine titles ("DarkLine Paws - Enhanced Edition", "Tic Tac Toe", "Cat Jumper - Rooftop Adventure") were already clean English. LICENSE + CREDITS shipped; the 2 WebP piece icons (cat1.ng.webp / cat2.webp, used only by the Tic-Tac-Toe mode) vendored byte-identical.
- Clean ELIGIBLE; no operator adjudication needed.

## Reader-benefit framing menu

- V1: One menu (in index.html) picks among 4 sub-experiences: Deadly Maze, Maze, Cat Climber (the runner), and Tic-Tac-Toe.
- V2: Maze mode uses WASD/arrows to move, A/D to strafe, Q/E or left/right arrows to turn, Shift to run; a raycasted renderer draws the corridors in real time.
- V3: Maze health/damage tiles (red = damage, green = heal) and a glowing goal tile that ends the run in victory.
- V4: Tic-Tac-Toe mode's cat AI plays a perfect minimax strategy (alpha-beta pruned) - it never loses; the best a human can force is a draw.
- V5: The runner ("Cat Jumper") auto-scrolls a cat across procedurally generated rooftops; Space or a click times each jump, and a fixed final building ends the run in victory.
- V6: Escape inside Tic-Tac-Toe or the runner returns to the maze's own menu (window.location.href swap between sibling files).
- V7: About ${SIZE} after Play; session-only across all three modes (no save data, no localStorage anywhere in the bundle).
- V8: Zero CDN, zero analytics, zero external fonts in any of the three HTML files - fully offline-capable once cached.
- V9: The 2 WebP piece icons used by Tic-Tac-Toe are the only binary assets in the whole bundle (~1 KB combined).
- V10: Adapted from DarkLine-Paws (MIT, shaurya6903, JS13K 2025 Black Cat theme); ships LICENSE + CREDITS.

## Implemented features

- Raycasted pseudo-3D maze renderer (classic Wolfenstein-style column casting) with 2 baked tile-grid layouts and procedurally-drawn wall textures (no image assets in this mode).
- Health/damage/heal tile system with a victory goal tile in the maze.
- Minimax-with-alpha-beta-pruning Tic-Tac-Toe AI (perfect play; unbeatable) rendered on a 3x3 DOM grid with WebP piece sprites.
- Procedurally generated endless rooftop sequence with gravity/jump physics and a fixed victory building in the runner mode.

## Anti-claims

- Does NOT use a server backend, CDN, or fetch at runtime, in any of the three modes.
- Does NOT persist scores or progress in any mode (no localStorage anywhere in the bundle).
- Is NOT the same game as Boing Cat Platformer: that game is a single fixed-level tile platformer with a duck-flag finish per level; DarkLine Paws's runner mode is an endless procedurally-generated building-hop with no discrete levels, and the bundle also includes an unrelated first-person maze and a board game that Boing Cat Platformer has no equivalent of.
- Is NOT the same game as Pixel Spike Run: that game is a flat-ground endless spike dodge with a variable-height hold-to-jump; DarkLine Paws's runner lands ON TOP of procedurally-generated buildings of varying height with a fixed-force jump, and is only one of three bundled modes, not the whole game.
- Is NOT a branded clone of a commercial franchise; raycasting is a decades-old public technique, not a copied product.
- Does NOT require touch controls for the maze or runner modes; keyboard is required for their default controls (Tic-Tac-Toe works with taps alone).

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire145 scaffold complete');
