/**
 * fire161 - ship /games/iso-city-sandbox.html from victorqribeiro/isocity (MIT)
 * + Kenney isometric landscape textures (CC0).
 * Run from worktree root: node pipeline-logs/fire161-ship-isocity.mjs
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WT = path.resolve(__dirname, "..");
// worktree is freetoolonline-web-test/.worktrees/game-fire161-stg -> wrapper is ../../..
const WRAPPER = path.resolve(WT, "../../.."); // freetoolonline-frontend
const SRC = "/tmp/isocity-scan";
const ROUTE = "iso-city-sandbox";
const CMS = "isocitysandbox";
const TITLE = "Iso City Sandbox";
const PLAY = "icsPlayBtn";
const PREFIX = "ics";
const TODAY = "2026-07-20";
const PAYLOAD = "~480 KB";

const cmsDir = path.join(WT, "source/static/src/main/webapp/resources/view/CMS");
const gamesDir = path.join(WT, "source/web/src/main/webapp/static/games", ROUTE);
const jspGames = path.join(WT, "source/web/src/main/webapp/WEB-INF/jsp/games");
const jspGuide = path.join(WT, "source/web/src/main/webapp/WEB-INF/jsp/guide");
const pictDir = path.join(WT, "source/web/src/main/webapp/static/img/illustrations/mini-pictogram");
const skillDir = path.join(WRAPPER, ".agent/skills/tool-isocitysandbox");

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log("wrote", path.relative(WT, p), content.length);
}

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    if (ent.name === ".git" || ent.name === "screenshot.png" || ent.name === "README.md") continue;
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

function patchFile(file, find, insertAfter = true) {
  let src = fs.readFileSync(file, "utf8");
  if (src.includes(find.insert || find.needle)) {
    console.log("skip already present", path.basename(file), (find.insert || find.needle).slice(0, 60));
    return;
  }
  const idx = src.indexOf(find.needle);
  if (idx < 0) throw new Error(`needle not found in ${file}: ${find.needle.slice(0, 80)}`);
  const at = insertAfter ? idx + find.needle.length : idx;
  src = src.slice(0, at) + find.insert + src.slice(at);
  fs.writeFileSync(file, src);
  console.log("patched", path.relative(WT, file));
}

// ---- 1. Vendor engine ----
fs.rmSync(gamesDir, { recursive: true, force: true });
copyRecursive(SRC, gamesDir);

let indexHtml = fs.readFileSync(path.join(gamesDir, "index.html"), "utf8");
indexHtml = indexHtml
  .replace(/<meta property="og:[^>]*>\n?/g, "")
  .replace(/<link rel="apple-touch-icon"[^>]*>\n?/, "")
  .replace(/<title>IsoCity<\/title>/, `<title>${TITLE}</title>\n\t<meta name="robots" content="noindex">`)
  .replace(/<meta name="Description" content="Isometric City Builder">/, `<meta name="Description" content="Isometric city tile sandbox - place landscape tiles freely.">`);
write(path.join(gamesDir, "index.html"), indexHtml);

write(
  path.join(gamesDir, "CREDITS"),
  `${TITLE}
Upstream: https://github.com/victorqribeiro/isocity
Author: Victor Ribeiro
License: MIT (see LICENSE)
Textures: Kenney.nl "Isometric Landscape" (CC0) via OpenGameArt
  https://opengameart.org/content/isometric-landscape
Adapted for FreeToolOnline iframe embed ${TODAY}:
- stripped og/social meta; added robots noindex; retitled page
- excluded screenshot.png from ship payload
- URL hash still encodes the 7x7 tile map (shareable within the iframe)
`
);

// ---- 2. Game JSP ----
const jspBody = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
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
write(path.join(jspGames, `${ROUTE}.jsp`), jspBody);

// ---- 3. Game CMS ----
write(path.join(cmsDir, `BODYTITLE${CMS}.txt`), `${TITLE} - Free Isometric Tile City`);
write(
  path.join(cmsDir, `BODYDESC${CMS}.txt`),
  `Paint a tiny isometric city in your browser. Pick landscape tiles, click the 7x7 grid, share the map via the URL hash. About ${PAYLOAD}. No account.`
);
write(
  path.join(cmsDir, `BODYKW${CMS}.txt`),
  `iso city sandbox, isometric city builder free, tile city canvas, kenney landscape, browser city paint`
);

write(
  path.join(cmsDir, `BODYHTML${CMS}.html`),
  `<div class="w3-container">
    <p>${TITLE} is a free browser isometric tile sandbox. Pick a landscape tile from the palette, then click or drag on the 7x7 diamond grid to place roads, water, and buildings. There is no budget and no win condition - just build. About ${PAYLOAD} after Play, no install, no account.</p>
    <p>Want free-form 3D voxels instead? Try <a href="/games/voxel-world-builder.html">Voxel World Builder</a>. Want a city timeline toy? Try <a href="/games/city-time-machine.html">City Time Machine</a>.</p>
</div>

<div id="${PREFIX}Wrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="${PREFIX}Stage" style="position:relative; width:100%; aspect-ratio:16/10; max-width:960px; margin:0 auto; min-height:520px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="${PREFIX}Launch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px; background:#1a1a1a;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#9FD;">ISO CITY SANDBOX</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#a8a8a8;">Choose a tile from the side palette, then click the isometric grid to place it. Right-click clears a cell. The URL hash stores your 7x7 map so you can share a layout. Adapted from Victor Ribeiro's IsoCity (MIT) with Kenney CC0 textures. About ${PAYLOAD}.</p>
                <button id="${PLAY}" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Mouse or touch. Best on a wide screen so the tile palette stays visible.</p>
            </div>
        </div>
    </div>
    <div id="${PREFIX}Status" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
    <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="${PREFIX}FullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Map state lives in the iframe URL hash - no localStorage.</span>
    </div>
    <style>
        #${PREFIX}Stage:fullscreen { border-radius: 0; max-width: none; }
        #${PREFIX}Stage iframe { display:block; width:100%; height:100%; border:0; background:#fff; }
    </style>
</div>
`
);

write(
  path.join(cmsDir, `BODYJS${CMS}.html`),
  `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var ICS_GAME_URL = 'iso-city-sandbox/index.html';
    function icsStatus(text) {
        var el = document.getElementById('${PREFIX}Status');
        if (el) el.textContent = text;
    }
    function icsInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = '${PREFIX}Frame';
        frame.src = ICS_GAME_URL;
        frame.title = '${TITLE} game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            icsStatus('Game loaded. Pick a tile on the left, then click the grid to place it.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('${PREFIX}Launch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('${PREFIX}Stage');
        var playBtn = document.getElementById('${PLAY}');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('${PREFIX}FullscreenBtn');
        playBtn.addEventListener('click', function () {
            icsStatus('Loading the game (about 480 KB, one time - then cached)...');
            icsInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('${PREFIX}Frame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>
`
);

write(
  path.join(cmsDir, `BODYWELCOME${CMS}.html`),
  `<p>Welcome to ${TITLE} - a free browser isometric tile sandbox with no account or install. Pick landscape tiles from the Kenney palette and paint a 7x7 diamond city. There is no budget meter and no simulation - the map is the point. About ${PAYLOAD} after Play. The iframe URL hash encodes your layout so you can bookmark or share a build. Privacy note: nothing is written to localStorage; clearing the hash or refreshing resets to grass. For more free browser games, open the <a href="/games.html">games hub</a>. Related building toys on this site include <a href="/games/voxel-world-builder.html">Voxel World Builder</a> and <a href="/games/city-time-machine.html">City Time Machine</a>.</p>
`
);

write(
  path.join(cmsDir, `FAQ${CMS}.html`),
  `<style>
    details.faq-item { margin: 8px 0; border-bottom: 1px solid #e0e0e0; padding: 6px 0; }
    details.faq-item > summary { list-style: none; cursor: pointer; padding: 8px 0 8px 28px; position: relative; font-weight: 600; }
    details.faq-item > summary::-webkit-details-marker { display: none; }
    details.faq-item > summary::before { content: '>'; position: absolute; left: 8px; top: 8px; transition: transform 0.15s ease; color: #555; font-size: 0.9em; }
    details.faq-item[open] > summary::before { transform: rotate(90deg); }
    details.faq-item > p, details.faq-item > div { padding: 0 8px 8px 28px; margin: 0; }
</style>
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Iso City Sandbox?</summary><p>A free browser isometric city tile sandbox. You pick landscape tiles and place them on a 7x7 grid. There is no budget, score, or simulation loop.</p></details>
<details class="faq-item"><summary>How do I place tiles?</summary><p>Click a tile in the side palette, then click (or drag) on the diamond grid. Right-click clears a cell back to empty grass. Touch works on the same click handlers.</p></details>
<details class="faq-item"><summary>Does it save my city?</summary><p>Yes, in the iframe URL hash as a compact Base64 map - not in localStorage. Copy the iframe address or use browser history within the frame to restore a layout.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${PAYLOAD} of HTML, JavaScript, CSS, and one Kenney landscape spritesheet after you press Play.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from IsoCity by Victor Ribeiro under the MIT license. Landscape textures are Kenney.nl Isometric Landscape under CC0. This site build adds noindex and ships LICENSE plus CREDITS next to the engine.</p></details>
<details class="faq-item"><summary>Is it good on a phone?</summary><p>It runs, but the palette plus grid is designed for a wider screen. Use landscape orientation or Fullscreen when the palette feels cramped.</p></details>
</div>
`
);

// ---- 4. Guides (3 angles x EN + 5 locales) ----
const locales = ["", "pt", "es", "vi", "id", "de"];
const angles = [
  {
    kebab: "how-to-play-iso-city-sandbox",
    cms: "howtoplayisocitysandbox",
    h1: {
      "": "How to Play Iso City Sandbox - Step by Step",
      pt: "Como jogar Iso City Sandbox - passo a passo",
      es: "Como jugar Iso City Sandbox - paso a paso",
      vi: "Cach choi Iso City Sandbox - tung buoc",
      id: "Cara main Iso City Sandbox - langkah demi langkah",
      de: "Iso City Sandbox spielen - Schritt fuer Schritt",
    },
    lead: {
      "": `Press Play, pick a tile from the palette, then click the 7x7 isometric grid to place it.`,
      pt: `Pressione Play, escolha um tile na paleta e clique na grade isometrica 7x7 para colocar.`,
      es: `Pulsa Play, elige un tile en la paleta y haz clic en la cuadrícula isometrica 7x7 para colocarlo.`,
      vi: `Nhan Play, chon o gach tren bang mau, roi bam luoi isometric 7x7 de dat.`,
      id: `Tekan Play, pilih tile di palet, lalu klik grid isometric 7x7 untuk menaruhnya.`,
      de: `Play druecken, Kachel in der Palette waehlen, dann auf das isometrische 7x7-Gitter klicken.`,
    },
    bodyEn: (lead) => `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Iso City Sandbox - Step by Step</b></h1>
<p>The <a href="/games/iso-city-sandbox.html">${TITLE}</a> page loads a ${PAYLOAD} isometric tile sandbox in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${TODAY}">Last reviewed: ${TODAY}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>${lead}</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${PAYLOAD}). A tile palette and two stacked canvases appear.</p>
<h2><b>Step 2 - pick a tile</b></h2><p>Click a tile thumbnail on the side palette. The selected tile shows a dashed border.</p>
<h2><b>Step 3 - paint the grid</b></h2><p>Click or drag on the diamond map to place the tile. Right-click clears a cell. The URL hash updates with your 7x7 Base64 state.</p>
<h2><b>Step 4 - share or reset</b></h2><p>Copy the iframe URL (including the hash) to share a layout. Clear the hash or refresh to start from empty grass.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${PAYLOAD}</td><td>HTML + JS + CSS + spritesheet</td></tr><tr><td>Input</td><td>click / drag / right-click</td><td>touch ok</td></tr><tr><td>Saves</td><td>URL hash</td><td>no localStorage</td></tr><tr><td>Core loop</td><td>pick tile -> place</td><td>no simulation</td></tr></table>
<p>See <a href="/guides/iso-city-sandbox-when.html">when to play</a>, <a href="/guides/iso-city-sandbox-vs-alternatives.html">comparisons</a>, and <a href="/games/voxel-world-builder.html">Voxel World Builder</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
    bodyLoc: (lang, h1, lead) => `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${h1}</b></h1>
<p><a href="/games/iso-city-sandbox.html">${TITLE}</a> - ${PAYLOAD} iframe isometric sandbox.</p>
<p><time itemprop="dateReviewed" datetime="${TODAY}">Last reviewed: ${TODAY}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>${lead}</b></p></div>
<h2><b>1 - Play</b></h2><p>Play -> iframe (${PAYLOAD}).</p>
<h2><b>2 - Pick tile</b></h2><p>Palette click selects the brush.</p>
<h2><b>3 - Place</b></h2><p>Grid click/drag places; right-click clears.</p>
<h2><b>4 - Share / reset</b></h2><p>URL hash holds the map; refresh clears.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${PAYLOAD}</td><td>HTML+JS+CSS+sheet</td></tr><tr><td>Input</td><td>click/drag</td><td>touch ok</td></tr><tr><td>Saves</td><td>URL hash</td><td>no localStorage</td></tr></table>
<p><a href="/guides/${lang}/iso-city-sandbox-when.html">when</a> · <a href="/guides/${lang}/iso-city-sandbox-vs-alternatives.html">vs</a> · <a href="/games.html">games</a></p>
</div>`,
  },
  {
    kebab: "iso-city-sandbox-when",
    cms: "isocitysandboxwhen",
    h1: {
      "": "When to Play Iso City Sandbox",
      pt: "Quando jogar Iso City Sandbox",
      es: "Cuando jugar Iso City Sandbox",
      vi: "Khi nao choi Iso City Sandbox",
      id: "Kapan main Iso City Sandbox",
      de: "Wann Iso City Sandbox spielen",
    },
    bodyEn: () => `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Iso City Sandbox</b></h1>
<p><a href="/games/iso-city-sandbox.html">${TITLE}</a> fits a short creative session - about ${PAYLOAD} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${TODAY}">Last reviewed: ${TODAY}</time></p>
<h2><b>When you want a calm build with no goals</b></h2><p>There is no budget, timer, or win screen. Good when you just want to place roads and water.</p>
<h2><b>When you want a shareable tiny map</b></h2><p>The URL hash stores the 7x7 layout, so you can bookmark a favorite city without an account.</p>
<h2><b>When to pick another game</b></h2><p>Want free-form 3D voxels? Use <a href="/games/voxel-world-builder.html">Voxel World Builder</a>. Want a city timeline explorer? Use <a href="/games/city-time-machine.html">City Time Machine</a>.</p>
<p>See <a href="/guides/how-to-play-iso-city-sandbox.html">how to play</a> and <a href="/guides/iso-city-sandbox-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
    bodyLoc: (lang, h1) => `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${h1}</b></h1>
<p><a href="/games/iso-city-sandbox.html">${TITLE}</a> - ${PAYLOAD}, no install.</p>
<p><time itemprop="dateReviewed" datetime="${TODAY}">Last reviewed: ${TODAY}</time></p>
<h2><b>Calm build</b></h2><p>No budget / win - place tiles only.</p>
<h2><b>Shareable map</b></h2><p>URL hash stores the 7x7 layout.</p>
<h2><b>Other picks</b></h2><p><a href="/games/voxel-world-builder.html">Voxel World Builder</a> · <a href="/games/city-time-machine.html">City Time Machine</a>.</p>
<p><a href="/guides/${lang}/how-to-play-iso-city-sandbox.html">how to play</a> · <a href="/guides/${lang}/iso-city-sandbox-vs-alternatives.html">vs</a></p>
<p><a href="/games.html">games</a></p>
</div>`,
  },
  {
    kebab: "iso-city-sandbox-vs-alternatives",
    cms: "isocitysandboxvsalternatives",
    h1: {
      "": "Iso City Sandbox vs Alternatives",
      pt: "Iso City Sandbox vs alternativas",
      es: "Iso City Sandbox vs alternativas",
      vi: "Iso City Sandbox vs lua chon khac",
      id: "Iso City Sandbox vs alternatif",
      de: "Iso City Sandbox vs Alternativen",
    },
    bodyEn: () => `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Iso City Sandbox vs Alternatives</b></h1>
<p><a href="/games/iso-city-sandbox.html">${TITLE}</a> is a 2D isometric tile paint sandbox. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${TODAY}">Last reviewed: ${TODAY}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>${TITLE}</td><td>${PAYLOAD}</td><td>Click / drag tiles</td><td>URL hash (no localStorage)</td></tr>
<tr><td><a href="/games/voxel-world-builder.html">Voxel World Builder</a></td><td>~multi-MB WebGL</td><td>Mouse look + place/break</td><td>local (engine-specific)</td></tr>
<tr><td><a href="/games/city-time-machine.html">City Time Machine</a></td><td>heavier city demo</td><td>Timeline scrub / explore</td><td>session / demo state</td></tr>
</table>
<p>Pick ${TITLE} for a tiny 2D isometric paint loop with a shareable hash. Pick Voxel World Builder for 3D voxels. Pick City Time Machine for a city timeline explorer.</p>
<p>See <a href="/guides/how-to-play-iso-city-sandbox.html">how to play</a> and <a href="/guides/iso-city-sandbox-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
    bodyLoc: (lang, h1) => `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${h1}</b></h1>
<p><a href="/games/iso-city-sandbox.html">${TITLE}</a> vs other free browser games.</p>
<p><time itemprop="dateReviewed" datetime="${TODAY}">Last reviewed: ${TODAY}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download</th><th>Input</th><th>Save</th></tr>
<tr><td>${TITLE}</td><td>${PAYLOAD}</td><td>click/drag</td><td>URL hash</td></tr>
<tr><td><a href="/games/voxel-world-builder.html">Voxel World Builder</a></td><td>~multi-MB</td><td>3D place</td><td>engine</td></tr>
<tr><td><a href="/games/city-time-machine.html">City Time Machine</a></td><td>heavier</td><td>timeline</td><td>session</td></tr>
</table>
<p><a href="/guides/${lang}/how-to-play-iso-city-sandbox.html">how to play</a> · <a href="/guides/${lang}/iso-city-sandbox-when.html">when</a></p>
<p><a href="/games.html">games</a></p>
</div>`,
  },
];

const titleMeta = {
  howtoplayisocitysandbox: {
    "": { t: "How to Play Iso City Sandbox - Free Guide", d: "Step-by-step: press Play, pick a Kenney landscape tile, place it on the 7x7 isometric grid, share via URL hash." },
    pt: { t: "Como jogar Iso City Sandbox - guia", d: "Passo a passo: Play, escolher tile, colocar na grade 7x7, partilhar via hash da URL." },
    es: { t: "Como jugar Iso City Sandbox - guia", d: "Paso a paso: Play, elige tile, coloca en la rejilla 7x7, comparte con el hash de la URL." },
    vi: { t: "Cach choi Iso City Sandbox - huong dan", d: "Tung buoc: Play, chon o gach, dat len luoi 7x7, chia se qua hash URL." },
    id: { t: "Cara main Iso City Sandbox - panduan", d: "Langkah: Play, pilih tile, taruh di grid 7x7, bagikan lewat hash URL." },
    de: { t: "Iso City Sandbox spielen - Anleitung", d: "Schritt: Play, Kachel waehlen, auf 7x7-Gitter setzen, per URL-Hash teilen." },
  },
  isocitysandboxwhen: {
    "": { t: "When to Play Iso City Sandbox - Use Cases", d: "Best for calm tile painting with no budget goals, plus shareable 7x7 maps via the URL hash." },
    pt: { t: "Quando jogar Iso City Sandbox - casos", d: "Ideal para pintar tiles sem metas, com mapa 7x7 partilhavel via hash." },
    es: { t: "Cuando jugar Iso City Sandbox - casos", d: "Ideal para pintar tiles sin metas, con mapa 7x7 compartible por hash." },
    vi: { t: "Khi nao choi Iso City Sandbox - truong hop", d: "Phu hop ve o gach khong muc tieu, ban do 7x7 chia se qua hash." },
    id: { t: "Kapan main Iso City Sandbox - kasus", d: "Cocok untuk melukis tile tanpa goal, peta 7x7 bisa dibagikan via hash." },
    de: { t: "Wann Iso City Sandbox spielen - Faelle", d: "Gut fuer ruhiges Kachelmalen ohne Ziele, 7x7-Karte per URL-Hash teilbar." },
  },
  isocitysandboxvsalternatives: {
    "": { t: "Iso City Sandbox vs Alternatives - Compare", d: "Numeric compare: Iso City Sandbox vs Voxel World Builder vs City Time Machine on size, input, saves." },
    pt: { t: "Iso City Sandbox vs alternativas - comparacao", d: "Comparacao: Iso City Sandbox vs Voxel World Builder vs City Time Machine." },
    es: { t: "Iso City Sandbox vs alternativas - comparacion", d: "Comparacion: Iso City Sandbox vs Voxel World Builder vs City Time Machine." },
    vi: { t: "Iso City Sandbox vs lua chon - so sanh", d: "So sanh: Iso City Sandbox vs Voxel World Builder vs City Time Machine." },
    id: { t: "Iso City Sandbox vs alternatif - banding", d: "Bandingkan: Iso City Sandbox vs Voxel World Builder vs City Time Machine." },
    de: { t: "Iso City Sandbox vs Alternativen - Vergleich", d: "Vergleich: Iso City Sandbox vs Voxel World Builder vs City Time Machine." },
  },
};

const kwBase = {
  howtoplayisocitysandbox: "how to play iso city sandbox, isometric tile guide, place city tiles",
  isocitysandboxwhen: "when to play iso city sandbox, isometric city use cases",
  isocitysandboxvsalternatives: "iso city sandbox vs voxel builder, city sandbox compare",
};

for (const angle of angles) {
  for (const loc of locales) {
    const langKey = loc || "";
    const cmsSlug = loc ? `guides${loc}${angle.cms}` : `guides${angle.cms}`;
    const meta = titleMeta[angle.cms][langKey] || titleMeta[angle.cms][""];
    write(path.join(cmsDir, `BODYTITLE${cmsSlug}.txt`), meta.t);
    write(path.join(cmsDir, `BODYDESC${cmsSlug}.txt`), meta.d);
    write(path.join(cmsDir, `BODYKW${cmsSlug}.txt`), kwBase[angle.cms]);
    let html;
    if (!loc) {
      if (angle.kebab.startsWith("how-to")) html = angle.bodyEn(angle.lead[""]);
      else html = angle.bodyEn();
    } else {
      const h1 = angle.h1[loc];
      if (angle.kebab.startsWith("how-to")) html = angle.bodyLoc(loc, h1, angle.lead[loc]);
      else html = angle.bodyLoc(loc, h1);
    }
    write(path.join(cmsDir, `BODYHTML${cmsSlug}.html`), html);

    const jspRel = loc ? path.join(loc, `${angle.kebab}.jsp`) : `${angle.kebab}.jsp`;
    write(path.join(jspGuide, jspRel), jspBody);
  }
}

// ---- 5. Registries ----
const siteData = path.join(WT, "scripts/site-data.mjs");
const seoClusters = path.join(WT, "scripts/seo-clusters.mjs");
const related = path.join(WT, "source/web/src/main/webapp/static/script/related-tools.js");
const lmenu = path.join(WT, "source/static/src/main/webapp/resources/view/l-menu.html");

patchFile(siteData, {
  needle: "  '/games/rock-paper-neural.html': 'games/rock-paper-neural.jsp',",
  insert: `\n  '/games/${ROUTE}.html': 'games/${ROUTE}.jsp',`,
});
patchFile(siteData, {
  needle: "  '/rock-paper-neural.html': '/games/rock-paper-neural.html',",
  insert: `\n  '/${ROUTE}.html': '/games/${ROUTE}.html',`,
});

const guideRoutes = [];
const guideJsps = [];
for (const angle of angles) {
  for (const loc of locales) {
    const route = loc ? `/guides/${loc}/${angle.kebab}.html` : `/guides/${angle.kebab}.html`;
    const jsp = loc ? `guide/${loc}/${angle.kebab}.jsp` : `guide/${angle.kebab}.jsp`;
    guideRoutes.push(`  '${route}',`);
    guideJsps.push(`  '${route}': '${jsp}',`);
  }
}
const guideBlock = `\n  // game-discovery-loop-runbook fire161 (${TODAY}): ${CMS} companion guides\n${guideRoutes.join("\n")}`;
const jspBlock = `\n  // game-discovery-loop-runbook fire161 (${TODAY}): ${CMS} companion guides\n${guideJsps.join("\n")}`;

patchFile(siteData, {
  needle: "  '/guides/de/rock-paper-neural-vs-alternatives.html',",
  insert: guideBlock,
});
// GUIDE_ROUTES also needs entries - find last RPN guide in GUIDE_ROUTES
{
  let src = fs.readFileSync(siteData, "utf8");
  const marker = "  '/guides/de/rock-paper-neural-vs-alternatives.html',";
  // There may be two occurrences (INFO + GUIDE). Insert after BOTH by replaceAll carefully.
  let count = 0;
  src = src.replaceAll(marker, (m) => {
    count += 1;
    // first is INFO_ROUTES (already patched once above for INFO - wait, we already inserted after first)
    return m;
  });
  // Re-read after previous patch - INFO already has fire161 block after de RPN.
  // Find GUIDE_ROUTES section and append there.
  const guideStart = src.indexOf("export const GUIDE_ROUTES");
  const needleInGuide = "  '/guides/de/rock-paper-neural-vs-alternatives.html',";
  const idx = src.indexOf(needleInGuide, guideStart);
  if (idx < 0) throw new Error("GUIDE_ROUTES RPN needle missing");
  if (!src.includes(`'/guides/${angles[0].kebab}.html'`)) {
    src = src.slice(0, idx + needleInGuide.length) + guideBlock + src.slice(idx + needleInGuide.length);
    fs.writeFileSync(siteData, src);
    console.log("patched GUIDE_ROUTES");
  }
}
{
  let src = fs.readFileSync(siteData, "utf8");
  const jspStart = src.indexOf("export const JSP_BY_ROUTE");
  const needle = "  '/guides/de/rock-paper-neural-vs-alternatives.html': 'guide/de/rock-paper-neural-vs-alternatives.jsp',";
  const idx = src.indexOf(needle, jspStart);
  if (idx < 0) throw new Error("JSP_BY_ROUTE guide needle missing");
  if (!src.includes(`'/guides/${angles[0].kebab}.html':`)) {
    src = src.slice(0, idx + needle.length) + jspBlock + src.slice(idx + needle.length);
    fs.writeFileSync(siteData, src);
    console.log("patched JSP_BY_ROUTE guides");
  }
}

{
  let src = fs.readFileSync(seoClusters, "utf8");
  const needle = "'/games/rock-paper-neural.html']";
  if (!src.includes(`'/games/${ROUTE}.html'`)) {
    if (!src.includes(needle)) throw new Error("seo-clusters needle missing");
    src = src.replace(needle, `'/games/rock-paper-neural.html', '/games/${ROUTE}.html']`);
    fs.writeFileSync(seoClusters, src);
    console.log("patched seo-clusters");
  }
}

patchFile(related, {
  needle: `    { title: "Rock Paper Neural", url: "https://freetoolonline.com/games/rock-paper-neural.html", include: !1, tags: "games" },`,
  insert: `\n    { title: "${TITLE}", url: "https://freetoolonline.com/games/${ROUTE}.html", include: !1, tags: "games" },`,
});
patchFile(lmenu, {
  needle: `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/rock-paper-neural.html'>Rock Paper Neural (RPS vs AI)</a>`,
  insert: `\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/${ROUTE}.html'>${TITLE} (Isometric Tiles)</a>`,
});

// ---- 6. Pictogram ----
const svgBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-${CMS}-title svg-minipictogram-${CMS}-desc">
  <title id="svg-minipictogram-${CMS}-title">${TITLE}</title>
  <desc id="svg-minipictogram-${CMS}-desc">Isometric diamond city tiles with a small building block</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <path d="M32 14 L48 22 L32 30 L16 22 Z" fill="#7DAFA3"/>
  <path d="M16 22 L32 30 L32 44 L16 36 Z" fill="#5B73AE"/>
  <path d="M32 30 L48 22 L48 36 L32 44 Z" fill="#FFFFFF"/>
  <rect x="28" y="24" width="8" height="10" fill="#FF4D00"/>
  <text x="32" y="57" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="7" font-weight="700" letter-spacing="0.5" fill="#FFFFFF">ISO</text>
</svg>
`;
const hash8 = crypto.createHash("sha256").update(svgBody).digest("hex").slice(0, 8);
const pictName = `${CMS}__${hash8}.svg`;
write(path.join(pictDir, pictName), svgBody);
console.log("pictogram", pictName);

// ---- 7. SKILL.md ----
write(
  path.join(skillDir, "SKILL.md"),
  `# Iso City Sandbox (tool-isocitysandbox)

## Reader task
Paint a tiny isometric city in the browser: pick landscape tiles from a palette and place them on a 7x7 diamond grid with no budget or win condition.

## Implemented features
- 7x7 isometric tile map (two canvases: bg + fg hover)
- Side palette of Kenney landscape tiles (roads, water, buildings, terrain)
- Click / drag to place; right-click clears a cell
- URL hash Base64 encoding of the full map (shareable / history)
- Touch handlers on the same click path
- Session-only aside from the hash (no localStorage)
- Payload about ${PAYLOAD} (HTML + JS + CSS + one spritesheet); MIT code + CC0 textures

## Anti-claims
- Does not run a city simulation (no budget, happiness, traffic AI)
- Does not use a CDN or server at runtime
- Does not write localStorage; map state is the iframe URL hash only
- Not a port of SimCity or any commercial city-builder IP
- Not optimized as a phone-first UI (palette + grid prefer a wide viewport)

## Reader-benefit framing menu
- Calm tile painting with zero goals
- Bookmark or share a layout via the URL hash
- Compare with Voxel World Builder (3D voxels) and City Time Machine (timeline city)

## Controls (source-verified from js/main.js)
- Palette click selects brush tile [row, col] into tool
- mousedown / touchend / pointerup on fg canvas places the selected tile
- right-click (which === 3) clears cell to [0,0]
- mousemove while placing continues paint; hover draws translucent diamond
- popstate reloads map from hash

## Saves / payload
- No localStorage keys
- history.pushState updates \`#<base64>\` of 49 tile indices
- Upstream screenshot.png excluded from ship; og meta stripped; robots noindex added

## License analysis
- Code: MIT, Copyright (c) 2019 Victor Ribeiro (LICENSE verified verbatim)
- Textures: Kenney.nl Isometric Landscape on OpenGameArt - CC0 (credit optional)
`
);

// ---- 8. CloudFront 301 ----
const cfPath = path.join(WRAPPER, "seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js");
{
  let src = fs.readFileSync(cfPath, "utf8");
  const needle = `  "/rock-paper-neural.html": "/games/rock-paper-neural.html",`;
  const insert = `\n  "/${ROUTE}.html": "/games/${ROUTE}.html",`;
  if (!src.includes(`"/${ROUTE}.html"`)) {
    if (!src.includes(needle)) throw new Error("CF needle missing");
    src = src.replace(needle, needle + insert);
    fs.writeFileSync(cfPath, src);
    console.log("patched CloudFront 301");
  }
}

// ---- 9. Enroll header pictogram (staging worktree) ----
{
  const enroll = path.join(WT, "scripts/header-pictogram-enrolled.json");
  const j = JSON.parse(fs.readFileSync(enroll, "utf8"));
  const arr = Array.isArray(j) ? j : j.slugs || j.enrolled || Object.values(j).find(Array.isArray);
  // file shape: { enrolled: [...] } or { slugs: [...] }?
  const keys = Object.keys(j);
  console.log("enroll keys", keys.slice(0, 5), "isArray", Array.isArray(j));
  let list;
  if (Array.isArray(j)) list = j;
  else if (Array.isArray(j.slugs)) list = j.slugs;
  else if (Array.isArray(j.enrolled)) list = j.enrolled;
  else {
    // find first array prop
    for (const k of keys) if (Array.isArray(j[k])) { list = j[k]; break; }
  }
  if (!list) throw new Error("cannot find enrolled array");
  if (!list.includes(CMS)) {
    list.push(CMS);
    list.sort();
    fs.writeFileSync(enroll, JSON.stringify(j, null, 2) + "\n");
    console.log("enrolled", CMS);
  }
}

console.log("FIRE161 ship authoring DONE");
console.log("NEXT: validate-svg, render-share-cards, export, prove, gates, push");
