#!/usr/bin/env node
/** Fire29: serpentine-3d route bundle + multilingual guides + site-data patches. */
import fs from 'node:fs';
import path from 'node:path';
import { patchCloudFront301 } from '../../.agent/skills/seo-tool-page-builder/scripts/lib/patch-cloudfront-301.mjs';

const FRONTEND = '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const ROOT = path.join(FRONTEND, 'freetoolonline-web-test');
const CMS = path.join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const SLUG = 'serpentine-3d';
const CMS_SLUG = 'serpentine3d';
const GAME = `/games/${SLUG}.html`;
const SNAKE = '/games/snake-classic.html';
const CNM = '/games/cyber-neon-maze.html';
const DATE = '2026-07-10';
const PAYLOAD = '~650 KB';

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

write(path.join(CMS, `BODYTITLE${CMS_SLUG}.txt`), 'Serpentine 3D - Free Online WebGL Snake Game in 3D\n');
write(path.join(CMS, `BODYDESC${CMS_SLUG}.txt`), `Serpentine 3D - a free browser WebGL 3D snake game: three difficulties, mobile joystick or keyboard, particle effects, and per-difficulty high scores saved locally. About ${PAYLOAD}, no install.\n`);
write(path.join(CMS, `BODYKW${CMS_SLUG}.txt`), 'serpentine 3d snake game,browser 3d snake online,webgl snake game free,3d snake no download,mobile joystick snake game,three.js snake browser\n');

write(path.join(CMS, `BODYHTML${CMS_SLUG}.html`), `<div class="w3-container">
    <p>A fast-paced 3D WebGL snake game in the browser tab: neon grid arena, three difficulty presets, touch joystick or keyboard steering, particle trails, and local high-score history. No install, no account.</p>
</div>
<div id="s3dWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="s3dStage" style="position:relative; width:100%; aspect-ratio:16/10; min-height:480px; background:#050510; border-radius:6px; overflow:hidden;">
            <div id="s3dLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6edf3; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; letter-spacing:1px; color:#00ffe7;">SERPENTINE 3D</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#9db0c5;">Grow your neon serpent on a 3D grid, dodge walls, and chase high scores across Easy, Medium, and Hard. Joystick on phones, arrows/WASD on desktop. About ${PAYLOAD} loads when you press Play.</p>
                <button id="s3dPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="s3dStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px; min-height:20px;">Press Play to start the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="s3dFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Pick a difficulty inside the game, then press START.</span>
    </div>
    <style>#s3dStage:fullscreen { border-radius: 0; } #s3dStage iframe { display:block; width:100%; height:100%; border:0; }</style>
</div>`);

write(path.join(CMS, `BODYJS${CMS_SLUG}.html`), `<script>
    web.localUpload = false;
    var S3D_GAME_URL = 'serpentine-3d/index.html';
    function s3dStatus(text) { var el = document.getElementById('s3dStatus'); if (el) el.textContent = text; }
    function s3dInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 's3dFrame'; frame.src = S3D_GAME_URL; frame.title = 'Serpentine 3D';
        frame.setAttribute('allow', 'fullscreen'); frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            s3dStatus('Game loaded. Choose a difficulty and press PLAY, then START.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('s3dLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('s3dStage');
        var playBtn = document.getElementById('s3dPlayBtn');
        if (!stage || !playBtn) return;
        var fsBtn = document.getElementById('s3dFullscreenBtn');
        playBtn.addEventListener('click', function () {
            s3dStatus('Loading the game (about ${PAYLOAD})...');
            s3dInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('s3dFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
</script>`);

write(path.join(CMS, `BODYWELCOME${CMS_SLUG}.html`), `<h1 class="text-uppercase"><b>Serpentine 3D</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-10T09:30:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Press Play and a full 3D snake session loads in the tab. Pick Easy, Medium, or Hard, then steer your serpent across a neon grid while length and speed ramp up.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
    <tr><th>Step</th><th>Action</th></tr>
    <tr><td>Launch</td><td>Play on this page, then choose a difficulty card</td></tr>
    <tr><td>Start</td><td>Press PLAY on the difficulty screen, then START on the briefing</td></tr>
    <tr><td>Steer</td><td>Arrow keys or WASD on desktop; on-screen joystick on phones</td></tr>
    <tr><td>Score</td><td>High scores and last five runs save per difficulty under ftol:serpentine3d:* keys</td></tr>
</table>
<p>Adapted from S-SUJAN-S's open-source Serpentine (MIT); three.js r128 is vendored locally. Differentiated from the site's 2D Snake Classic page. Credits ship next to the game files.</p>`);

write(path.join(JSP_GAMES, `${SLUG}.jsp`), `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page customStyle='\${pageStyle}' browserTitle='\${pageBodyTitle}' keyword='\${pageBodyKeyword}' description='\${pageBodyDesc}'>
\t<freetoolonline:loading/>
\t\${pageBodyHTML}
\t<freetoolonline:welcome welcomeTest='\${pageBodyWelcome}'/>
\t<freetoolonline:share-btns></freetoolonline:share-btns>
\t\${pageBodyJS}
</freetoolonline:page>
`);

const faqStyle = `<style>details.faq-item{margin:8px 0;border-bottom:1px solid #e0e0e0;padding:6px 0}details.faq-item>summary{list-style:none;cursor:pointer;padding:8px 0 8px 28px;position:relative;font-weight:600}details.faq-item>summary::-webkit-details-marker{display:none}details.faq-item>summary::before{content:'>';position:absolute;left:8px;top:8px;color:#555}details.faq-item>p{padding:0 8px 8px 28px;margin:0}</style>`;
function wrapGuide(t) {
  const rows = (t.table || []).map((r, i) => `<tr>${r.map((c) => (i ? `<td>${c}</td>` : `<th>${c}</th>`)).join('')}</tr>`).join('');
  return `${faqStyle}<div class="w3-container w3-margin-top"><h1 class="text-uppercase"><b>${t.h1}</b></h1><p>${t.lead}</p><p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>${t.answer}</b></p></div>${t.s1 ? `<h2><b>${t.s1}</b></h2><p>${t.s1p}</p>` : ''}${t.s2 ? `<h2><b>${t.s2}</b></h2><p>${t.s2p}</p>` : ''}${rows ? `<table class="w3-table w3-bordered w3-small">${rows}</table>` : ''}<p>${t.links}</p><p><a href="/games.html">&larr; Back to games</a></p></div>`;
}

const guides = [
  { slug: 'how-to-play-serpentine-3d', cmsBase: 'howtoplayserpentine3d', copy: {
    en: { title: 'How to Play Serpentine 3D - Step by Step', desc: 'Step-by-step Serpentine 3D guide: launch iframe, pick difficulty, steer on a 3D grid, use joystick or keyboard, read local high scores.', h1: 'How to Play Serpentine 3D - Step by Step', lead: `The <a href="${GAME}">Serpentine 3D</a> page loads a ${PAYLOAD} WebGL 3D snake game in an iframe. Three difficulty presets, particle effects, and per-difficulty local high scores.`, answer: 'Press Play on the page, choose Easy/Medium/Hard, press PLAY then START. Steer with arrow keys or WASD on desktop, or the on-screen joystick on phones. Pause with P; open settings for quality and particle sliders.', s1: 'Step 1 - launch and difficulty', s1p: 'Click Play on the game page. Inside the iframe, pick one of the three difficulty cards (each changes speed, wall mode, and scoring). Press PLAY to open the briefing screen.', s2: 'Step 2 - controls and HUD', s2p: 'Press START to enter the arena. The HUD shows score, high score, length, speed, and wall mode. Toggle joystick vs mouse mode with the control button on touch devices.', table: [['Setting', 'Value', 'Notes'], ['Download', PAYLOAD, 'index.html + shared three.js'], ['Difficulties', '3', 'Easy / Medium / Hard'], ['Saves', 'localStorage', 'ftol:serpentine3d:* keys'], ['Server calls', '0', 'No fetch/XHR']], links: `See <a href="{{p}}serpentine-3d-when.html">when to play</a> and <a href="{{p}}serpentine-3d-vs-alternatives.html">vs other snake games</a>.` },
    pt: { title: 'Como Jogar Serpentine 3D - Passo a Passo', desc: 'Guia Serpentine 3D: iframe, dificuldade, controle 3D, joystick ou teclado, recordes locais.', h1: 'Como Jogar Serpentine 3D - Passo a Passo', lead: `A pagina <a href="${GAME}">Serpentine 3D</a> carrega uma cobra 3D WebGL (${PAYLOAD}) no iframe.`, answer: 'Pressione Play, escolha a dificuldade, PLAY e START. Use setas/WASD ou joystick.', s1: 'Passo 1 - lancar', s1p: 'Clique Play e escolha um cartao de dificuldade.', s2: 'Passo 2 - controles', s2p: 'START entra na arena; HUD mostra pontuacao e recorde.', table: [['Item', 'Valor', 'Notas'], ['Tamanho', PAYLOAD, 'three.js local'], ['Dificuldades', '3', 'Easy/Medium/Hard'], ['Save', 'localStorage', 'ftol:serpentine3d:*'], ['Servidor', '0', 'Sem rede']], links: `<a href="{{p}}serpentine-3d-when.html">Quando jogar</a>.` },
    es: { title: 'Como Jugar Serpentine 3D - Paso a Paso', desc: 'Guia Serpentine 3D: iframe, dificultad, control 3D, joystick o teclado, records locales.', h1: 'Como Jugar Serpentine 3D - Paso a Paso', lead: `La pagina <a href="${GAME}">Serpentine 3D</a> carga una serpiente 3D WebGL (${PAYLOAD}) en el iframe.`, answer: 'Pulsa Play, elige dificultad, PLAY y START. Usa flechas/WASD o joystick.', s1: 'Paso 1 - lanzar', s1p: 'Pulsa Play y elige una tarjeta de dificultad.', s2: 'Paso 2 - controles', s2p: 'START entra en la arena; el HUD muestra puntuacion y record.', table: [['Ajuste', 'Valor', 'Notas'], ['Tamano', PAYLOAD, 'three.js local'], ['Dificultades', '3', 'Easy/Medium/Hard'], ['Guardado', 'localStorage', 'ftol:serpentine3d:*'], ['Servidor', '0', 'Sin red']], links: `<a href="{{p}}serpentine-3d-when.html">Cuando jugar</a>.` },
    vi: { title: 'Cach choi Serpentine 3D - Huong dan tung buoc', desc: 'Huong dan Serpentine 3D: iframe, do kho, dieu khien 3D, joystick hoac ban phim.', h1: 'Cach choi Serpentine 3D - Huong dan tung buoc', lead: `<a href="${GAME}">Serpentine 3D</a> tai game ran 3D WebGL (${PAYLOAD}) trong iframe.`, answer: 'Bam Play, chon do kho, PLAY roi START. Dung phim mui/WASD hoac joystick.', s1: 'Buoc 1 - khoi dong', s1p: 'Bam Play va chon mot the do kho.', s2: 'Buoc 2 - dieu khien', s2p: 'START vao san; HUD hien diem va ky luc.', table: [['Muc', 'Gia tri', 'Ghi chu'], ['Dung luong', PAYLOAD, 'three.js local'], ['Do kho', '3', 'Easy/Medium/Hard'], ['Luu', 'localStorage', 'ftol:serpentine3d:*'], ['Server', '0', 'Khong mang']], links: `<a href="{{p}}serpentine-3d-when.html">Khi nao choi</a>.` },
    id: { title: 'Cara Bermain Serpentine 3D - Langkah demi Langkah', desc: 'Panduan Serpentine 3D: iframe, kesulitan, kontrol 3D, joystick atau keyboard.', h1: 'Cara Bermain Serpentine 3D - Langkah demi Langkah', lead: `Halaman <a href="${GAME}">Serpentine 3D</a> memuat ular 3D WebGL (${PAYLOAD}) di iframe.`, answer: 'Tekan Play, pilih kesulitan, PLAY lalu START. Gunakan panah/WASD atau joystick.', s1: 'Langkah 1 - luncurkan', s1p: 'Klik Play dan pilih kartu kesulitan.', s2: 'Langkah 2 - kontrol', s2p: 'START masuk arena; HUD menampilkan skor dan rekor.', table: [['Setelan', 'Nilai', 'Catatan'], ['Ukuran', PAYLOAD, 'three.js lokal'], ['Kesulitan', '3', 'Easy/Medium/Hard'], ['Simpan', 'localStorage', 'ftol:serpentine3d:*'], ['Server', '0', 'Tanpa jaringan']], links: `<a href="{{p}}serpentine-3d-when.html">Kapan bermain</a>.` },
    de: { title: 'Serpentine 3D spielen - Schritt fuer Schritt', desc: 'Anleitung Serpentine 3D: iframe, Schwierigkeit, 3D-Steuerung, Joystick oder Tastatur.', h1: 'Serpentine 3D spielen - Schritt fuer Schritt', lead: `Die Seite <a href="${GAME}">Serpentine 3D</a> laedt ein 3D-WebGL-Snake-Spiel (${PAYLOAD}) im iframe.`, answer: 'Play druecken, Schwierigkeit waehlen, PLAY dann START. Pfeile/WASD oder Joystick.', s1: 'Schritt 1 - Start', s1p: 'Play klicken und eine Schwierigkeitskarte waehlen.', s2: 'Schritt 2 - Steuerung', s2p: 'START startet die Arena; HUD zeigt Punkte und Rekord.', table: [['Einstellung', 'Wert', 'Hinweis'], ['Groesse', PAYLOAD, 'three.js lokal'], ['Stufen', '3', 'Easy/Medium/Hard'], ['Speicher', 'localStorage', 'ftol:serpentine3d:*'], ['Server', '0', 'Kein Netz']], links: `<a href="{{p}}serpentine-3d-when.html">Wann spielen</a>.` },
  }},
  { slug: 'serpentine-3d-when', cmsBase: 'serpentine3dwhen', copy: {
    en: { title: 'When to Play Serpentine 3D in the Browser', desc: `When a ${PAYLOAD} WebGL 3D snake game beats installing an app: quick arcade runs, joystick or keyboard, local high scores.`, h1: 'When to Play Serpentine 3D in the Browser', lead: `Choose <a href="${GAME}">Serpentine 3D</a> when you want a neon 3D twist on classic snake without a store download.`, answer: 'Best for 3-15 minute arcade runs, trying three difficulty presets, or phone joystick play. Skip if you want a minimal 2D snake only - try Snake Classic instead.', s1: 'Good fit', s1p: 'You want WebGL depth, particle trails, per-difficulty history, and quality sliders in one tab.', s2: 'Skip when', s2p: 'You need the smallest possible 2D snake or a first-person maze - see Snake Classic or Cyber Neon Maze.', table: [['Scenario', 'Serpentine 3D', 'Notes'], ['Session', '3-15 min', 'Per difficulty run'], ['Payload', PAYLOAD, 'Shared three.js'], ['Input', 'Keys or joystick', 'Toggle on touch'], ['Saves', 'High scores', 'ftol:serpentine3d:*']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Step-by-step</a>.` },
    pt: { title: 'Quando Jogar Serpentine 3D no Navegador', desc: `Quando uma cobra 3D WebGL de ${PAYLOAD} vale mais que instalar app.`, h1: 'Quando Jogar Serpentine 3D no Navegador', lead: `Escolha <a href="${GAME}">Serpentine 3D</a> para um twist neon 3D na cobra classica.`, answer: 'Ideal para runs de 3-15 minutos com tres dificuldades.', s1: 'Bom para', s1p: 'Profundidade WebGL e historico local.', s2: 'Evite se', s2p: 'Quiser apenas cobra 2D minima.', table: [['Cenario', 'Valor', 'Notas'], ['Sessao', '3-15 min', 'Por dificuldade'], ['Tamanho', PAYLOAD, 'three.js'], ['Entrada', 'Teclas/joystick', 'Alternavel'], ['Save', 'Recordes', 'ftol:serpentine3d:*']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Passo a passo</a>.` },
    es: { title: 'Cuando Jugar Serpentine 3D en el Navegador', desc: `Cuando una serpiente 3D WebGL de ${PAYLOAD} conviene mas que instalar una app.`, h1: 'Cuando Jugar Serpentine 3D en el Navegador', lead: `Elige <a href="${GAME}">Serpentine 3D</a> para un giro neon 3D del snake clasico.`, answer: 'Mejor para runs de 3-15 minutos con tres dificultades.', s1: 'Buen caso', s1p: 'WebGL con historial local.', s2: 'Evita si', s2p: 'Solo quieres snake 2D minimo.', table: [['Escenario', 'Valor', 'Notas'], ['Sesion', '3-15 min', 'Por dificultad'], ['Tamano', PAYLOAD, 'three.js'], ['Entrada', 'Teclas/joystick', 'Alternable'], ['Guardado', 'Records', 'ftol:serpentine3d:*']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Paso a paso</a>.` },
    vi: { title: 'Khi nao choi Serpentine 3D tren trinh duyet', desc: `Khi game ran 3D WebGL ${PAYLOAD} phu hop hon cai app.`, h1: 'Khi nao choi Serpentine 3D tren trinh duyet', lead: `Chon <a href="${GAME}">Serpentine 3D</a> cho phien ban ran 3D neon.`, answer: 'Tot cho run 3-15 phut voi ba do kho.', s1: 'Phu hop', s1p: 'WebGL voi lich su local.', s2: 'Khong phu hop', s2p: 'Chi can ran 2D toi gian.', table: [['Tinh huong', 'Gia tri', 'Ghi chu'], ['Phien', '3-15 phut', 'Theo do kho'], ['Dung luong', PAYLOAD, 'three.js'], ['Vao', 'Phim/joystick', 'Chuyen doi'], ['Luu', 'Diem cao', 'ftol:serpentine3d:*']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Huong dan</a>.` },
    id: { title: 'Kapan Memainkan Serpentine 3D di Browser', desc: `Kapan ular 3D WebGL ${PAYLOAD} lebih pas daripada instal app.`, h1: 'Kapan Memainkan Serpentine 3D di Browser', lead: `Pilih <a href="${GAME}">Serpentine 3D</a> untuk twist neon 3D pada snake klasik.`, answer: 'Cocok untuk run 3-15 menit dengan tiga kesulitan.', s1: 'Cocok untuk', s1p: 'WebGL dengan riwayat lokal.', s2: 'Lewati jika', s2p: 'Hanya butuh snake 2D minimal.', table: [['Skenario', 'Nilai', 'Catatan'], ['Sesi', '3-15 menit', 'Per kesulitan'], ['Ukuran', PAYLOAD, 'three.js'], ['Input', 'Keyboard/joystick', 'Beralih'], ['Simpan', 'Skor tinggi', 'ftol:serpentine3d:*']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Langkah demi langkah</a>.` },
    de: { title: 'Wann Serpentine 3D im Browser spielen', desc: `Wann ein ${PAYLOAD} WebGL-3D-Snake besser passt als eine App.`, h1: 'Wann Serpentine 3D im Browser spielen', lead: `Waehlen Sie <a href="${GAME}">Serpentine 3D</a> fuer eine neon 3D-Variante von Snake.`, answer: 'Gut fuer 3-15-Minuten-Runs mit drei Schwierigkeiten.', s1: 'Passt wenn', s1p: 'WebGL mit lokaler Historie.', s2: 'Nicht wenn', s2p: 'Nur minimales 2D-Snake noetig.', table: [['Szenario', 'Wert', 'Hinweis'], ['Sitzung', '3-15 Min', 'Pro Stufe'], ['Groesse', PAYLOAD, 'three.js'], ['Eingabe', 'Tasten/Joystick', 'Umschaltbar'], ['Speicher', 'Highscores', 'ftol:serpentine3d:*']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Anleitung</a>.` },
  }},
  { slug: 'serpentine-3d-vs-alternatives', cmsBase: 'serpentine3dvsalternatives', copy: {
    en: { title: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze, and Installed Snake Apps', desc: `Compare ${PAYLOAD} Serpentine 3D with Snake Classic and Cyber Neon Maze on this site.`, h1: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze, and Installed Snake Apps', lead: `This table contrasts <a href="${GAME}">Serpentine 3D</a> with other browser games when you want snake or neon action.`, answer: 'Serpentine 3D is the WebGL 3D snake option here. Snake Classic is lightweight 2D grid snake. Cyber Neon Maze is first-person maze escape - different genre.', s1: 'Versus Snake Classic', s1p: 'Snake Classic is a small 2D canvas/grid snake. Serpentine 3D adds depth, particles, three difficulties, and joystick mode - better for spectacle, heavier payload.', s2: 'Versus Cyber Neon Maze', s2p: 'Cyber Neon Maze is FPS maze exploration with pointer lock. Serpentine 3D is top-down/third-person arcade snake on a grid.', table: [['Game', 'Payload', 'Session', 'Perspective', 'Best for'], [`<a href="${GAME}">Serpentine 3D</a>`, PAYLOAD, '3-15 min', '3D WebGL snake', 'Neon arcade snake'], [`<a href="${SNAKE}">Snake Classic</a>`, 'Small 2D', '2-10 min', 'Top-down grid', 'Minimal classic snake'], [`<a href="${CNM}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 min', 'First-person 3D', 'Maze escape'], ['Installed snake app', '50-200+ MB', 'Hours', 'Varies', 'Ads + cloud saves']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">How to play</a>.` },
    pt: { title: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze e Apps', desc: `Compare Serpentine 3D (${PAYLOAD}) com outros jogos de cobra no navegador.`, h1: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze e Apps', lead: `Tabela comparando <a href="${GAME}">Serpentine 3D</a> com outras opcoes.`, answer: 'Serpentine 3D e a opcao snake 3D WebGL aqui.', s1: 'Vs Snake Classic', s1p: 'Snake Classic e 2D leve; Serpentine 3D e neon 3D.', s2: 'Vs Cyber Neon Maze', s2p: 'Cyber Neon Maze e labirinto FPS.', table: [['Jogo', 'Tamanho', 'Sessao', 'Visao', 'Melhor para'], [`<a href="${GAME}">Serpentine 3D</a>`, PAYLOAD, '3-15 min', '3D snake', 'Arcade neon'], [`<a href="${SNAKE}">Snake Classic</a>`, 'pequeno 2D', '2-10 min', 'Grid', 'Classico'], [`<a href="${CNM}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 min', 'FPS 3D', 'Labirinto'], ['App instalado', '50-200+ MB', 'Horas', 'Varia', 'Nuvem']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Como jogar</a>.` },
    es: { title: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze y Apps', desc: `Compara Serpentine 3D (${PAYLOAD}) con otros juegos de serpiente.`, h1: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze y Apps', lead: `Tabla que contrasta <a href="${GAME}">Serpentine 3D</a> con otras opciones.`, answer: 'Serpentine 3D es la opcion snake 3D WebGL aqui.', s1: 'Vs Snake Classic', s1p: 'Snake Classic es 2D ligero.', s2: 'Vs Cyber Neon Maze', s2p: 'Cyber Neon Maze es laberinto FPS.', table: [['Juego', 'Tamano', 'Sesion', 'Vista', 'Mejor para'], [`<a href="${GAME}">Serpentine 3D</a>`, PAYLOAD, '3-15 min', '3D snake', 'Arcade neon'], [`<a href="${SNAKE}">Snake Classic</a>`, 'pequeno 2D', '2-10 min', 'Grid', 'Clasico'], [`<a href="${CNM}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 min', 'FPS 3D', 'Laberinto'], ['App instalada', '50-200+ MB', 'Horas', 'Varia', 'Nube']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Como jugar</a>.` },
    vi: { title: 'Serpentine 3D so voi Snake Classic, Cyber Neon Maze va app', desc: `So sanh Serpentine 3D (${PAYLOAD}) voi game ran khac.`, h1: 'Serpentine 3D so voi Snake Classic, Cyber Neon Maze va app', lead: `Bang so sanh <a href="${GAME}">Serpentine 3D</a> voi lua chon khac.`, answer: 'Serpentine 3D la tuy chon ran 3D WebGL tren site.', s1: 'Vs Snake Classic', s1p: 'Snake Classic la 2D nhe.', s2: 'Vs Cyber Neon Maze', s2p: 'Cyber Neon Maze la me cung FPS.', table: [['Game', 'Dung luong', 'Phien', 'Goc nhin', 'Tot cho'], [`<a href="${GAME}">Serpentine 3D</a>`, PAYLOAD, '3-15 phut', '3D snake', 'Arcade neon'], [`<a href="${SNAKE}">Snake Classic</a>`, '2D nho', '2-10 phut', 'Grid', 'Co dien'], [`<a href="${CNM}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 phut', 'FPS 3D', 'Me cung'], ['App da cai', '50-200+ MB', 'Gio', 'Khac', 'Cloud']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Huong dan</a>.` },
    id: { title: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze, dan App', desc: `Bandingkan Serpentine 3D (${PAYLOAD}) dengan game ular lain.`, h1: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze, dan App', lead: `Tabel membandingkan <a href="${GAME}">Serpentine 3D</a> dengan opsi lain.`, answer: 'Serpentine 3D adalah opsi ular 3D WebGL di sini.', s1: 'Vs Snake Classic', s1p: 'Snake Classic adalah 2D ringan.', s2: 'Vs Cyber Neon Maze', s2p: 'Cyber Neon Maze adalah labirin FPS.', table: [['Game', 'Ukuran', 'Sesi', 'Sudut', 'Terbaik untuk'], [`<a href="${GAME}">Serpentine 3D</a>`, PAYLOAD, '3-15 menit', '3D snake', 'Arcade neon'], [`<a href="${SNAKE}">Snake Classic</a>`, '2D kecil', '2-10 menit', 'Grid', 'Klasik'], [`<a href="${CNM}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 menit', 'FPS 3D', 'Labirin'], ['App terinstal', '50-200+ MB', 'Jam', 'Bervariasi', 'Cloud']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Cara bermain</a>.` },
    de: { title: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze und Apps', desc: `Vergleiche Serpentine 3D (${PAYLOAD}) mit anderen Snake-Spielen.`, h1: 'Serpentine 3D vs Snake Classic, Cyber Neon Maze und Apps', lead: `Tabelle zum Vergleich von <a href="${GAME}">Serpentine 3D</a> mit anderen Optionen.`, answer: 'Serpentine 3D ist die WebGL-3D-Snake-Option hier.', s1: 'Vs Snake Classic', s1p: 'Snake Classic ist leichtes 2D.', s2: 'Vs Cyber Neon Maze', s2p: 'Cyber Neon Maze ist FPS-Labyrinth.', table: [['Spiel', 'Groesse', 'Sitzung', 'Sicht', 'Am besten fuer'], [`<a href="${GAME}">Serpentine 3D</a>`, PAYLOAD, '3-15 Min', '3D Snake', 'Neon-Arcade'], [`<a href="${SNAKE}">Snake Classic</a>`, 'klein 2D', '2-10 Min', 'Grid', 'Klassisch'], [`<a href="${CNM}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 Min', 'FPS 3D', 'Labyrinth'], ['Installierte App', '50-200+ MB', 'Stunden', 'Variiert', 'Cloud']], links: `<a href="{{p}}how-to-play-serpentine-3d.html">Anleitung</a>.` },
  }},
];

const jspTpl = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page browserTitle='\${pageBodyTitle}' description='\${pageBodyDesc}'>
\t<freetoolonline:loading/>
\t\${pageBodyHTML}
</freetoolonline:page>
`;
const locales = ['en', 'pt', 'es', 'vi', 'id', 'de'];
const guideRoutes = [];
const jspRoutes = [];
for (const g of guides) {
  for (const lang of locales) {
    const prefix = lang === 'en' ? '/guides/' : `/guides/${lang}/`;
    const route = `${prefix}${g.slug}.html`;
    const cmsSlug = lang === 'en' ? `guides${g.cmsBase}` : `guides${lang}${g.cmsBase}`;
    const jspRel = lang === 'en' ? `guide/${g.slug}.jsp` : `guide/${lang}/${g.slug}.jsp`;
    const jspDisk = lang === 'en' ? `${g.slug}.jsp` : `${lang}/${g.slug}.jsp`;
    const c = g.copy[lang];
    write(path.join(CMS, `BODYTITLE${cmsSlug}.txt`), c.title + '\n');
    write(path.join(CMS, `BODYDESC${cmsSlug}.txt`), c.desc + '\n');
    write(path.join(CMS, `BODYHTML${cmsSlug}.html`), wrapGuide({ ...c, links: c.links.replaceAll('{{p}}', prefix) }));
    write(path.join(JSP_GUIDE, jspDisk), jspTpl);
    guideRoutes.push(`  '${route}',`);
    jspRoutes.push(`  '${route}': '${jspRel}',`);
  }
}

const siteDataPath = path.join(ROOT, 'scripts/site-data.mjs');
let siteData = fs.readFileSync(siteDataPath, 'utf8');
if (!siteData.includes(SLUG)) {
  siteData = siteData.replace(
    "  '/guides/de/cyber-neon-maze-vs-alternatives.html',\n\n]);",
    `  '/guides/de/cyber-neon-maze-vs-alternatives.html',\n  // game-discovery-loop-runbook fire29 (2026-07-10): serpentine-3d\n${guideRoutes.join('\n')}\n]);`
  );
  siteData = siteData.replace(
    "  '/cyber-neon-maze.html': '/games/cyber-neon-maze.html',",
    `  '/cyber-neon-maze.html': '/games/cyber-neon-maze.html',\n  '/serpentine-3d.html': '/games/${SLUG}.html',`
  );
  siteData = siteData.replace(
    "  '/games/cyber-neon-maze.html': 'games/cyber-neon-maze.jsp',",
    `  '/games/cyber-neon-maze.html': 'games/cyber-neon-maze.jsp',\n  '/games/${SLUG}.html': 'games/${SLUG}.jsp',`
  );
  siteData = siteData.replace(
    "  '/guides/de/cyber-neon-maze-vs-alternatives.html': 'guide/de/cyber-neon-maze-vs-alternatives.jsp',",
    `  '/guides/de/cyber-neon-maze-vs-alternatives.html': 'guide/de/cyber-neon-maze-vs-alternatives.jsp',\n  // game-discovery-loop-runbook fire29 (2026-07-10): serpentine-3d guides\n${jspRoutes.join('\n')}`
  );
  fs.writeFileSync(siteDataPath, siteData);
}

const clustersPath = path.join(ROOT, 'scripts/seo-clusters.mjs');
let clusters = fs.readFileSync(clustersPath, 'utf8');
if (!clusters.includes(SLUG)) {
  clusters = clusters.replace("'/games/cyber-neon-maze.html']", `'/games/cyber-neon-maze.html', '/games/${SLUG}.html']`);
  fs.writeFileSync(clustersPath, clusters);
}

const relatedPath = path.join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
let related = fs.readFileSync(relatedPath, 'utf8');
if (!related.includes('Serpentine 3D')) {
  related = related.replace(
    '{ title: "Cyber Neon Maze", url: "https://freetoolonline.com/games/cyber-neon-maze.html", include: !1, tags: "games" },',
    `{ title: "Cyber Neon Maze", url: "https://freetoolonline.com/games/cyber-neon-maze.html", include: !1, tags: "games" },\n    { title: "Serpentine 3D", url: "https://freetoolonline.com/games/${SLUG}.html", include: !1, tags: "games" },`
  );
  fs.writeFileSync(relatedPath, related);
}

const menuPath = path.join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
let menu = fs.readFileSync(menuPath, 'utf8');
if (!menu.includes('Serpentine 3D')) {
  menu = menu.replace(
    "<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/cyber-neon-maze.html'>Cyber Neon Maze</a>",
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/cyber-neon-maze.html'>Cyber Neon Maze</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/${SLUG}.html'>Serpentine 3D</a>`
  );
  fs.writeFileSync(menuPath, menu);
}

const skillDir = path.join(FRONTEND, '.agent/skills/tool-serpentine3d');
fs.mkdirSync(skillDir, { recursive: true });
write(path.join(skillDir, 'SKILL.md'), `---
name: tool-serpentine3d
description: |
  Ground-truth implementation reference for the /games/${SLUG}.html
  page. Hand-authored 2026-07-10 (game-discovery-loop-runbook fire 29).
---

# tool-serpentine3d - ground-truth reference for /games/${SLUG}.html

## Identity

- **Route**: /games/${SLUG}.html
- **Slug**: \`${SLUG}\` (CMS fragment slug: \`${CMS_SLUG}\`)
- **Cluster**: games
- **Aliases**: \`/serpentine-3d.html\` (ALIAS_ROUTES + CloudFront REDIRECTS)

## Reader task (one sentence)

Play a free fast-paced 3D WebGL snake game in the browser tab - grow your neon serpent across three difficulties with joystick or keyboard controls and local high scores.

## Processing model

**client-side-only** - single index.html + shared vendored three.js r128 in a same-origin iframe. Total payload ${PAYLOAD}. Procedural Web Audio. No network calls after load.

## License analysis

- Upstream: S-SUJAN-S/serpentine-game (MIT, Copyright 2025 S-SUJAN-S).
- Runtime: index.html, LICENSE, CREDITS.txt. Google Fonts removed; three.js vendored locally.

## Reader-benefit framing menu

- A1: Three difficulty presets (Easy, Medium, Hard) with different speed and wall rules.
- A2: WebGL 3D neon grid arena with particle trails.
- A3: Keyboard (arrows/WASD) and on-screen joystick modes.
- A4: Per-difficulty high scores and five-run history saved locally.
- A5: Quality and particle sliders in the settings panel.
- A6: Pause with P; game-over screen with session stats.
- A7: Differentiated from 2D Snake Classic on this site.
- A8: localStorage under ftol:serpentine3d:* keys only.
- A9: About ${PAYLOAD} payload with shared three.min.js vendor.
- A10: Touch control toggle for phones.

## Anti-claims

- Not first-person maze escape (see Cyber Neon Maze).
- Not 2D grid snake (see Snake Classic).
- No online leaderboard or accounts.
- No cloud saves.

## claim_catalogue_status

verified
`);

await patchCloudFront301({ frontendRoot: FRONTEND, aliasUrl: '/serpentine-3d.html', canonicalUrl: GAME, runDate: '20260710-serpentine-3d' });
console.log('fire29 bundle generated for', SLUG);
