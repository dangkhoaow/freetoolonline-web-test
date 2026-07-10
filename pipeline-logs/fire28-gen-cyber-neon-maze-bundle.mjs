#!/usr/bin/env node
/** Fire28: cyber-neon-maze route bundle + multilingual guides + site-data patches. */
import fs from 'node:fs';
import path from 'node:path';
import { patchCloudFront301 } from '../../.agent/skills/seo-tool-page-builder/scripts/lib/patch-cloudfront-301.mjs';

const FRONTEND = '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const ROOT = path.join(FRONTEND, 'freetoolonline-web-test');
const CMS = path.join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const SLUG = 'cyber-neon-maze';
const CMS_SLUG = 'cyberneonmaze';
const GAME = `/games/${SLUG}.html`;
const MARBLE = '/games/marble-maze.html';
const NTR = '/games/neon-tower-rush.html';
const DATE = '2026-07-10';
const PAYLOAD = '~650 KB';

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  return p;
}

const gameTitle = 'Cyber Neon Maze - Free Online First-Person 3D Maze Escape';
const gameDesc = `Cyber Neon Maze - a free browser first-person 3D maze escape: procedural cyberpunk mazes, collectible orbs, laser traps, stamina sprint, and pointer-lock FPS controls. About ${PAYLOAD}, no install, session-only.`;
const gameKw = 'cyber neon maze game,browser 3d maze escape,first person maze online,free fps maze no install,neon maze browser game,collect orbs avoid lasers';

write(path.join(CMS, `BODYTITLE${CMS_SLUG}.txt`), gameTitle + '\n');
write(path.join(CMS, `BODYDESC${CMS_SLUG}.txt`), gameDesc + '\n');
write(path.join(CMS, `BODYKW${CMS_SLUG}.txt`), gameKw + '\n');

write(path.join(CMS, `BODYHTML${CMS_SLUG}.html`), `<div class="w3-container">
    <p>A first-person 3D cyberpunk maze escape in the browser tab: procedural walls, glowing orbs, rotating laser traps, health and stamina bars, and pointer-lock look controls. No install, no account, fully session-only.</p>
</div>

<div id="cnmWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="cnmStage" style="position:relative; width:100%; aspect-ratio:16/10; min-height:480px; background:#050510; border-radius:6px; overflow:hidden;">
            <div id="cnmLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6edf3; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; letter-spacing:1px; color:#ff0055;">CYBER NEON MAZE</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#9db0c5;">Escape procedural neon mazes, collect every orb, and dodge laser beams. WASD move, Shift sprint, Ctrl crouch, mouse look after pointer lock. About ${PAYLOAD} loads when you press Play.</p>
                <button id="cnmPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="cnmStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px; min-height:20px;">Press Play to start the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="cnmFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Click INITIATE RUN inside the game, then allow pointer lock for mouse look.</span>
    </div>
    <style>#cnmStage:fullscreen { border-radius: 0; } #cnmStage iframe { display:block; width:100%; height:100%; border:0; }</style>
</div>`);

write(path.join(CMS, `BODYJS${CMS_SLUG}.html`), `<script>
    // Cyber Neon Maze launcher. Adapted from bhanu2006-24/neon-maze (MIT, 2025)
    web.localUpload = false;
    var CNM_GAME_URL = 'cyber-neon-maze/index.html';
    function cnmStatus(text) {
        var el = document.getElementById('cnmStatus');
        if (el) el.textContent = text;
    }
    function cnmInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'cnmFrame';
        frame.src = CNM_GAME_URL;
        frame.title = 'Cyber Neon Maze';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            cnmStatus('Game loaded. Click INITIATE RUN inside the frame and allow pointer lock.');
            try { frame.contentWindow.focus(); } catch (e) { }
        });
        var launch = document.getElementById('cnmLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('cnmStage');
        var playBtn = document.getElementById('cnmPlayBtn');
        if (!stage || !playBtn) return;
        var fsBtn = document.getElementById('cnmFullscreenBtn');
        playBtn.addEventListener('click', function () {
            cnmStatus('Loading the game (about ${PAYLOAD})...');
            cnmInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('cnmFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) { } }
        });
    }
</script>`);

write(path.join(CMS, `BODYWELCOME${CMS_SLUG}.html`), `<h1 class="text-uppercase"><b>Cyber Neon Maze</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-10T08:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Press Play and a full first-person maze run loads in the tab. Each procedural layout hides orbs behind neon walls while laser emitters sweep corridors - sprint drains stamina, crouch slips under beams, and the compass strip tracks heading.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
    <tr><th>Step</th><th>Action</th></tr>
    <tr><td>Launch</td><td>Play on this page, then INITIATE RUN in the game overlay</td></tr>
    <tr><td>Look</td><td>Allow pointer lock; move mouse to turn</td></tr>
    <tr><td>Move</td><td>WASD walk, Shift sprint, Ctrl crouch, Space jump</td></tr>
    <tr><td>Goal</td><td>Collect all orbs and reach the exit before health hits zero</td></tr>
</table>
<p>No localStorage or server calls - every run is session-only. Adapted from Bhanu Pratap Saini's open-source Neon Maze (MIT); three.js r128 is vendored locally. Credits ship next to the game files.</p>`);

write(path.join(JSP_GAMES, `${SLUG}.jsp`), `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page
\tcustomStyle='\${pageStyle}'
\tbrowserTitle='\${pageBodyTitle}'
\tkeyword='\${pageBodyKeyword}'
\tdescription='\${pageBodyDesc}'>
\t<freetoolonline:loading/>
\t<!-- BODYHTML -->
\t\${pageBodyHTML}
\t<freetoolonline:welcome welcomeTest='\${pageBodyWelcome}'/>
\t<freetoolonline:share-btns></freetoolonline:share-btns>
\t<!-- BODYJS -->
\t\${pageBodyJS}
</freetoolonline:page>
`);

const faqStyle = `<style>details.faq-item{margin:8px 0;border-bottom:1px solid #e0e0e0;padding:6px 0}details.faq-item>summary{list-style:none;cursor:pointer;padding:8px 0 8px 28px;position:relative;font-weight:600}details.faq-item>summary::-webkit-details-marker{display:none}details.faq-item>summary::before{content:'>';position:absolute;left:8px;top:8px;color:#555}details.faq-item>p{padding:0 8px 8px 28px;margin:0}</style>`;

function wrapGuide(t) {
  const rows = (t.table || []).map((r, i) => `<tr>${r.map((c) => (i ? `<td>${c}</td>` : `<th>${c}</th>`)).join('')}</tr>`).join('');
  return `${faqStyle}<div class="w3-container w3-margin-top"><h1 class="text-uppercase"><b>${t.h1}</b></h1><p>${t.lead}</p><p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>${t.answer}</b></p></div>${t.s1 ? `<h2><b>${t.s1}</b></h2><p>${t.s1p}</p>` : ''}${t.s2 ? `<h2><b>${t.s2}</b></h2><p>${t.s2p}</p>` : ''}${t.s3 ? `<h2><b>${t.s3}</b></h2><p>${t.s3p}</p>` : ''}${rows ? `<table class="w3-table w3-bordered w3-small">${rows}</table>` : ''}<p>${t.links}</p><p><a href="/games.html">&larr; Back to games</a></p></div>`;
}

const guides = [
  {
    slug: 'how-to-play-cyber-neon-maze',
    cmsBase: 'howtoplaycyberneonmaze',
    copy: {
      en: { title: 'How to Play Cyber Neon Maze - Step by Step', desc: 'Step-by-step Cyber Neon Maze guide: launch iframe, pointer lock, WASD movement, sprint/crouch, collect orbs, dodge lasers, reach exit.', h1: 'How to Play Cyber Neon Maze - Step by Step', lead: `The <a href="${GAME}">Cyber Neon Maze</a> page loads a ${PAYLOAD} first-person WebGL maze in an iframe. Procedural neon corridors, orb pickups, and sweeping laser traps - all session-only with zero saves.`, answer: 'Press Play on the page, click INITIATE RUN inside the game, allow pointer lock, then use WASD to move, Shift to sprint, Ctrl to crouch, Space to jump, and mouse to look. Collect every orb and reach the exit before health reaches zero.', s1: 'Step 1 - launch', s1p: 'Click Play on the game page to load the iframe. Inside the overlay, read the control hints, then press INITIATE RUN. Your browser will ask for pointer lock - accept it to enable mouse-look.', s2: 'Step 2 - movement and stamina', s2p: 'WASD walks forward/back/strafe. Hold Shift to sprint while the green stamina bar has charge; release when empty. Ctrl crouches under low laser sweeps. Space jumps short gaps.', s3: 'Step 3 - objectives', s3p: 'The HUD shows orb count, timer, health, stamina, and a compass strip. Touch every glowing orb, then navigate to the exit portal. Lasers drain health on contact; death shows CRITICAL FAILURE with a reboot button.', table: [['Setting', 'Value', 'Notes'], ['Download', PAYLOAD, 'index.html + vendored three.js'], ['Perspective', 'First-person 3D', 'WebGL + pointer lock'], ['Saves', 'None', 'Session-only'], ['Server calls', '0', 'No fetch/XHR']], links: `See <a href="{{p}}cyber-neon-maze-when.html">when to play</a> and <a href="{{p}}cyber-neon-maze-vs-alternatives.html">vs other maze games</a>. Also <a href="${MARBLE}">Marble Maze</a>.` },
      pt: { title: 'Como Jogar Cyber Neon Maze - Passo a Passo', desc: 'Guia Cyber Neon Maze: iframe, pointer lock, WASD, sprint/agachar, coletar orbes, evitar lasers, saida.', h1: 'Como Jogar Cyber Neon Maze - Passo a Passo', lead: `A pagina <a href="${GAME}">Cyber Neon Maze</a> carrega um labirinto 3D em primeira pessoa (${PAYLOAD}) no iframe.`, answer: 'Pressione Play, INITIATE RUN, aceite pointer lock, use WASD, Shift sprint, Ctrl agachar, Space pular e mouse para olhar. Colete todos os orbes e alcance a saida.', s1: 'Passo 1 - lancar', s1p: 'Clique Play e depois INITIATE RUN. Aceite pointer lock.', s2: 'Passo 2 - movimento', s2p: 'WASD anda, Shift corre com stamina, Ctrl agacha, Space pula.', s3: 'Passo 3 - objetivos', s3p: 'HUD mostra orbes, tempo, vida e bussola. Colete orbes e va a saida; lasers reduzem vida.', table: [['Item', 'Valor', 'Notas'], ['Tamanho', PAYLOAD, 'three.js local'], ['Visao', '3D FPS', 'WebGL'], ['Save', 'Nenhum', 'Sessao'], ['Servidor', '0', 'Sem rede']], links: `<a href="{{p}}cyber-neon-maze-when.html">Quando jogar</a>.` },
      es: { title: 'Como Jugar Cyber Neon Maze - Paso a Paso', desc: 'Guia Cyber Neon Maze: iframe, pointer lock, WASD, sprint/agacharse, orbes, lasers, salida.', h1: 'Como Jugar Cyber Neon Maze - Paso a Paso', lead: `La pagina <a href="${GAME}">Cyber Neon Maze</a> carga un laberinto 3D en primera persona (${PAYLOAD}) en el iframe.`, answer: 'Pulsa Play, INITIATE RUN, acepta pointer lock, usa WASD, Shift sprint, Ctrl agacharse, Space saltar y raton para mirar.', s1: 'Paso 1 - lanzar', s1p: 'Pulsa Play y INITIATE RUN. Acepta pointer lock.', s2: 'Paso 2 - movimiento', s2p: 'WASD camina, Shift corre, Ctrl agacha, Space salta.', s3: 'Paso 3 - objetivos', s3p: 'Recoge orbes y llega a la salida antes de quedarte sin vida.', table: [['Ajuste', 'Valor', 'Notas'], ['Tamano', PAYLOAD, 'three.js local'], ['Vista', '3D FPS', 'WebGL'], ['Guardado', 'Ninguno', 'Sesion'], ['Servidor', '0', 'Sin red']], links: `<a href="{{p}}cyber-neon-maze-when.html">Cuando jugar</a>.` },
      vi: { title: 'Cach choi Cyber Neon Maze - Huong dan tung buoc', desc: 'Huong dan Cyber Neon Maze: iframe, pointer lock, WASD, sprint/crouch, thu orbs, tranh laser, den exit.', h1: 'Cach choi Cyber Neon Maze - Huong dan tung buoc', lead: `<a href="${GAME}">Cyber Neon Maze</a> tai me cung 3D goc nhin thu nhat (${PAYLOAD}) trong iframe.`, answer: 'Bam Play, INITIATE RUN, chap nhan pointer lock, dung WASD, Shift chay, Ctrl cui, Space nhay, chuot xoay.', s1: 'Buoc 1 - khoi dong', s1p: 'Bam Play roi INITIATE RUN. Chap nhan pointer lock.', s2: 'Buoc 2 - di chuyen', s2p: 'WASD di, Shift chay tieu stamina, Ctrl cui, Space nhay.', s3: 'Buoc 3 - muc tieu', s3p: 'Thu het orbs va den exit; laser lam mat mau.', table: [['Muc', 'Gia tri', 'Ghi chu'], ['Dung luong', PAYLOAD, 'three.js local'], ['Goc nhin', '3D FPS', 'WebGL'], ['Luu', 'Khong', 'Phien'], ['Server', '0', 'Khong mang']], links: `<a href="{{p}}cyber-neon-maze-when.html">Khi nao choi</a>.` },
      id: { title: 'Cara Bermain Cyber Neon Maze - Langkah demi Langkah', desc: 'Panduan Cyber Neon Maze: iframe, pointer lock, WASD, sprint/jongkok, kumpulkan orb, hindari laser.', h1: 'Cara Bermain Cyber Neon Maze - Langkah demi Langkah', lead: `Halaman <a href="${GAME}">Cyber Neon Maze</a> memuat labirin 3D orang pertama (${PAYLOAD}) di iframe.`, answer: 'Tekan Play, INITIATE RUN, izinkan pointer lock, gunakan WASD, Shift sprint, Ctrl jongkok, Space lompat.', s1: 'Langkah 1 - luncurkan', s1p: 'Klik Play lalu INITIATE RUN. Izinkan pointer lock.', s2: 'Langkah 2 - gerak', s2p: 'WASD berjalan, Shift sprint, Ctrl jongkok, Space lompat.', s3: 'Langkah 3 - tujuan', s3p: 'Kumpulkan semua orb dan capai pintu keluar.', table: [['Setelan', 'Nilai', 'Catatan'], ['Ukuran', PAYLOAD, 'three.js lokal'], ['Sudut', '3D FPS', 'WebGL'], ['Simpan', 'Tidak', 'Sesi'], ['Server', '0', 'Tanpa jaringan']], links: `<a href="{{p}}cyber-neon-maze-when.html">Kapan bermain</a>.` },
      de: { title: 'Cyber Neon Maze spielen - Schritt fuer Schritt', desc: 'Anleitung Cyber Neon Maze: iframe, Pointer Lock, WASD, Sprint/Ducken, Orbs, Laser, Ausgang.', h1: 'Cyber Neon Maze spielen - Schritt fuer Schritt', lead: `Die Seite <a href="${GAME}">Cyber Neon Maze</a> laedt ein 3D-Ego-Labyrinth (${PAYLOAD}) im iframe.`, answer: 'Play druecken, INITIATE RUN, Pointer Lock erlauben, WASD, Shift sprinten, Ctrl ducken, Space springen.', s1: 'Schritt 1 - Start', s1p: 'Play klicken, dann INITIATE RUN. Pointer Lock zulassen.', s2: 'Schritt 2 - Bewegung', s2p: 'WASD laufen, Shift sprinten, Ctrl ducken, Space springen.', s3: 'Schritt 3 - Ziel', s3p: 'Alle Orbs sammeln und den Ausgang erreichen.', table: [['Einstellung', 'Wert', 'Hinweis'], ['Groesse', PAYLOAD, 'three.js lokal'], ['Sicht', '3D FPS', 'WebGL'], ['Speicher', 'Keiner', 'Sitzung'], ['Server', '0', 'Kein Netz']], links: `<a href="{{p}}cyber-neon-maze-when.html">Wann spielen</a>.` },
    },
  },
  {
    slug: 'cyber-neon-maze-when',
    cmsBase: 'cyberneonmazewhen',
    copy: {
      en: { title: 'When to Play Cyber Neon Maze in the Browser', desc: `When a ${PAYLOAD} first-person neon maze beats installing an app: 5-20 minute escape runs, pointer-lock FPS controls, zero saves.`, h1: 'When to Play Cyber Neon Maze in the Browser', lead: `Choose <a href="${GAME}">Cyber Neon Maze</a> when you want a short immersive 3D maze escape without a store download - procedural layouts, orb hunting, and laser dodging in about ${PAYLOAD}.`, answer: 'Best for a focused 5-20 minute first-person escape run, practicing pointer-lock maze navigation, or trying cyberpunk neon aesthetics. Skip if you dislike pointer lock, need saves/leaderboards, or want top-down tilt physics like Marble Maze.', s1: 'Good fit', s1p: 'You want WebGL 3D corridors with sprint/stamina, crouch-under-laser mechanics, and a clear collect-all-orbs win condition in one browser tab.', s2: 'Skip when', s2p: 'You need persistent progress, multiplayer, or a physics marble tilt game - try <a href="${MARBLE}">Marble Maze</a> instead for keyboard-tilt runs.', table: [['Scenario', 'Cyber Neon Maze', 'Notes'], ['Session', '5-20 min', 'One procedural maze'], ['Payload', PAYLOAD, 'Vendored three.js'], ['Input', 'WASD + pointer lock', 'Mouse look required'], ['Saves', 'None', 'Session-only']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Step-by-step</a>.` },
      pt: { title: 'Quando Jogar Cyber Neon Maze no Navegador', desc: `Quando um labirinto neon 3D de ${PAYLOAD} vale mais que instalar app.`, h1: 'Quando Jogar Cyber Neon Maze no Navegador', lead: `Escolha <a href="${GAME}">Cyber Neon Maze</a> para uma fuga 3D curta sem download.`, answer: 'Ideal para runs de 5-20 minutos com pointer lock. Pule se precisar de saves ou labirinto de marmore.', s1: 'Bom para', s1p: 'Corredores WebGL com sprint e lasers.', s2: 'Evite se', s2p: 'Precisa de progresso persistente ou fisica de marmore.', table: [['Cenario', 'Valor', 'Notas'], ['Sessao', '5-20 min', 'Um labirinto'], ['Tamanho', PAYLOAD, 'three.js local'], ['Entrada', 'WASD+lock', 'Mouse look'], ['Save', 'Nenhum', 'Sessao']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Passo a passo</a>.` },
      es: { title: 'Cuando Jugar Cyber Neon Maze en el Navegador', desc: `Cuando un laberinto neon 3D de ${PAYLOAD} conviene mas que instalar una app.`, h1: 'Cuando Jugar Cyber Neon Maze en el Navegador', lead: `Elige <a href="${GAME}">Cyber Neon Maze</a> para una escapada 3D corta sin descarga.`, answer: 'Mejor para runs de 5-20 minutos con pointer lock. Evita si necesitas guardado o fisica de canica.', s1: 'Buen caso', s1p: 'Corredores WebGL con sprint y lasers.', s2: 'Evita si', s2p: 'Necesitas progreso persistente o laberinto de canica.', table: [['Escenario', 'Valor', 'Notas'], ['Sesion', '5-20 min', 'Un laberinto'], ['Tamano', PAYLOAD, 'three.js local'], ['Entrada', 'WASD+lock', 'Raton'], ['Guardado', 'Ninguno', 'Sesion']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Paso a paso</a>.` },
      vi: { title: 'Khi nao choi Cyber Neon Maze tren trinh duyet', desc: `Khi me cung neon 3D ${PAYLOAD} phu hop hon cai app.`, h1: 'Khi nao choi Cyber Neon Maze tren trinh duyet', lead: `Chon <a href="${GAME}">Cyber Neon Maze</a> cho phien thoat 3D ngan khong can tai.`, answer: 'Tot cho run 5-20 phut voi pointer lock. Bo qua neu can luu tien trinh.', s1: 'Phu hop', s1p: 'Hanh lang WebGL voi sprint va laser.', s2: 'Khong phu hop', s2p: 'Can luu tien trinh hoac me cung bi.', table: [['Tinh huong', 'Gia tri', 'Ghi chu'], ['Phien', '5-20 phut', 'Mot me cung'], ['Dung luong', PAYLOAD, 'three.js local'], ['Vao', 'WASD+lock', 'Chuot'], ['Luu', 'Khong', 'Phien']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Huong dan</a>.` },
      id: { title: 'Kapan Memainkan Cyber Neon Maze di Browser', desc: `Kapan labirin neon 3D ${PAYLOAD} lebih pas daripada instal app.`, h1: 'Kapan Memainkan Cyber Neon Maze di Browser', lead: `Pilih <a href="${GAME}">Cyber Neon Maze</a> untuk pelarian 3D singkat tanpa unduhan.`, answer: 'Cocok untuk run 5-20 menit dengan pointer lock. Lewati jika butuh simpan progres.', s1: 'Cocok untuk', s1p: 'Koridor WebGL dengan sprint dan laser.', s2: 'Lewati jika', s2p: 'Butuh progres persisten atau labirin kelereng.', table: [['Skenario', 'Nilai', 'Catatan'], ['Sesi', '5-20 menit', 'Satu labirin'], ['Ukuran', PAYLOAD, 'three.js lokal'], ['Input', 'WASD+lock', 'Mouse look'], ['Simpan', 'Tidak', 'Sesi']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Langkah demi langkah</a>.` },
      de: { title: 'Wann Cyber Neon Maze im Browser spielen', desc: `Wann ein ${PAYLOAD} Neon-3D-Labyrinth besser passt als eine App.`, h1: 'Wann Cyber Neon Maze im Browser spielen', lead: `Waehlen Sie <a href="${GAME}">Cyber Neon Maze</a> fuer eine kurze 3D-Flucht ohne Download.`, answer: 'Gut fuer 5-20-Minuten-Runs mit Pointer Lock. Ueberspringen bei Speicherbedarf.', s1: 'Passt wenn', s1p: 'WebGL-Korridore mit Sprint und Lasern.', s2: 'Nicht wenn', s2p: 'Dauerhafter Fortschritt oder Kugel-Labyrinth noetig.', table: [['Szenario', 'Wert', 'Hinweis'], ['Sitzung', '5-20 Min', 'Ein Labyrinth'], ['Groesse', PAYLOAD, 'three.js lokal'], ['Eingabe', 'WASD+Lock', 'Mausblick'], ['Speicher', 'Keiner', 'Sitzung']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Anleitung</a>.` },
    },
  },
  {
    slug: 'cyber-neon-maze-vs-alternatives',
    cmsBase: 'cyberneonmazevsalternatives',
    copy: {
      en: { title: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush, and Installed Maze Apps', desc: `Compare ${PAYLOAD} Cyber Neon Maze with Marble Maze and Neon Tower Rush on this site and installed maze apps.`, h1: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush, and Installed Maze Apps', lead: `This table contrasts <a href="${GAME}">Cyber Neon Maze</a> with other browser games when you want maze or neon action without installing anything.`, answer: 'Cyber Neon Maze is the only first-person 3D maze escape here. Marble Maze is top-down physics tilt. Neon Tower Rush is canvas tower defense - different genre entirely.', s1: 'Versus Marble Maze', s1p: 'Marble Maze is a small canvas tilt labyrinth (keyboard arrows). Cyber Neon Maze is FPS WebGL with pointer lock, orbs, and lasers - better for immersive escape, worse if you want quick tilt sessions without mouse capture.', s2: 'Versus Neon Tower Rush', s2p: 'Neon Tower Rush (~1.2 MB) is a 30-wave tower defense with drafting. Cyber Neon Maze (~650 KB) is a single-player maze runner - pick TD for strategy, pick maze for exploration.', table: [['Game', 'Payload', 'Session', 'Perspective', 'Best for'], [`<a href="${GAME}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 min', 'First-person 3D', 'Neon maze escape'], [`<a href="${MARBLE}">Marble Maze</a>`, 'Small canvas', '3-15 min', 'Top-down tilt', 'Physics labyrinth'], [`<a href="${NTR}">Neon Tower Rush</a>`, '~1.2 MB', '20-45 min', 'Top-down TD', 'Tower defense'], ['Installed maze app', '50-200+ MB', 'Hours', 'Varies', 'Cloud saves + IAP']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">How to play</a>.` },
      pt: { title: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush e Apps', desc: `Compare Cyber Neon Maze (${PAYLOAD}) com outros jogos de labirinto no navegador.`, h1: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush e Apps', lead: `Tabela comparando <a href="${GAME}">Cyber Neon Maze</a> com outras opcoes.`, answer: 'Cyber Neon Maze e o unico escape 3D em primeira pessoa aqui. Marble Maze e inclinacao. Neon Tower Rush e TD.', s1: 'Vs Marble Maze', s1p: 'Marble Maze e labirinto canvas inclinado. Cyber Neon Maze e FPS WebGL com orbes e lasers.', s2: 'Vs Neon Tower Rush', s2p: 'Tower Rush e defesa de torres; Cyber Neon Maze e corrida no labirinto.', table: [['Jogo', 'Tamanho', 'Sessao', 'Visao', 'Melhor para'], [`<a href="${GAME}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 min', '3D FPS', 'Escape neon'], [`<a href="${MARBLE}">Marble Maze</a>`, 'pequeno', '3-15 min', 'Top-down', 'Inclinacao'], [`<a href="${NTR}">Neon Tower Rush</a>`, '~1.2 MB', '20-45 min', 'TD', 'Estrategia'], ['App instalado', '50-200+ MB', 'Horas', 'Varia', 'Nuvem']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Como jogar</a>.` },
      es: { title: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush y Apps', desc: `Compara Cyber Neon Maze (${PAYLOAD}) con otros juegos de laberinto en el navegador.`, h1: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush y Apps', lead: `Tabla que contrasta <a href="${GAME}">Cyber Neon Maze</a> con otras opciones.`, answer: 'Cyber Neon Maze es el unico escape 3D en primera persona aqui.', s1: 'Vs Marble Maze', s1p: 'Marble Maze es inclinacion canvas. Cyber Neon Maze es FPS WebGL.', s2: 'Vs Neon Tower Rush', s2p: 'Tower Rush es defensa de torres; Cyber Neon Maze es laberinto.', table: [['Juego', 'Tamano', 'Sesion', 'Vista', 'Mejor para'], [`<a href="${GAME}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 min', '3D FPS', 'Escape neon'], [`<a href="${MARBLE}">Marble Maze</a>`, 'pequeno', '3-15 min', 'Top-down', 'Inclinacion'], [`<a href="${NTR}">Neon Tower Rush</a>`, '~1.2 MB', '20-45 min', 'TD', 'Estrategia'], ['App instalada', '50-200+ MB', 'Horas', 'Varia', 'Nube']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Como jugar</a>.` },
      vi: { title: 'Cyber Neon Maze so voi Marble Maze, Neon Tower Rush va app', desc: `So sanh Cyber Neon Maze (${PAYLOAD}) voi game me cung khac.`, h1: 'Cyber Neon Maze so voi Marble Maze, Neon Tower Rush va app', lead: `Bang so sanh <a href="${GAME}">Cyber Neon Maze</a> voi lua chon khac.`, answer: 'Cyber Neon Maze la game thoat me cung 3D goc nhin thu nhat duy nhat tren site.', s1: 'Vs Marble Maze', s1p: 'Marble Maze la nghieng canvas. Cyber Neon Maze la FPS WebGL.', s2: 'Vs Neon Tower Rush', s2p: 'Tower Rush la phong thu thap; Cyber Neon Maze la me cung.', table: [['Game', 'Dung luong', 'Phien', 'Goc nhin', 'Tot cho'], [`<a href="${GAME}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 phut', '3D FPS', 'Thoat neon'], [`<a href="${MARBLE}">Marble Maze</a>`, 'nho', '3-15 phut', 'Top-down', 'Nghieng'], [`<a href="${NTR}">Neon Tower Rush</a>`, '~1.2 MB', '20-45 phut', 'TD', 'Chien thuat'], ['App da cai', '50-200+ MB', 'Gio', 'Khac', 'Cloud']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Huong dan</a>.` },
      id: { title: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush, dan App', desc: `Bandingkan Cyber Neon Maze (${PAYLOAD}) dengan game labirin lain.`, h1: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush, dan App', lead: `Tabel membandingkan <a href="${GAME}">Cyber Neon Maze</a> dengan opsi lain.`, answer: 'Cyber Neon Maze adalah satu-satunya pelarian labirin 3D orang pertama di sini.', s1: 'Vs Marble Maze', s1p: 'Marble Maze adalah kemiringan canvas. Cyber Neon Maze adalah FPS WebGL.', s2: 'Vs Neon Tower Rush', s2p: 'Tower Rush adalah pertahanan menara; Cyber Neon Maze adalah labirin.', table: [['Game', 'Ukuran', 'Sesi', 'Sudut', 'Terbaik untuk'], [`<a href="${GAME}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 menit', '3D FPS', 'Pelarian neon'], [`<a href="${MARBLE}">Marble Maze</a>`, 'kecil', '3-15 menit', 'Top-down', 'Kemiringan'], [`<a href="${NTR}">Neon Tower Rush</a>`, '~1.2 MB', '20-45 menit', 'TD', 'Strategi'], ['App terinstal', '50-200+ MB', 'Jam', 'Bervariasi', 'Cloud']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Cara bermain</a>.` },
      de: { title: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush und Apps', desc: `Vergleiche Cyber Neon Maze (${PAYLOAD}) mit anderen Labyrinth-Spielen.`, h1: 'Cyber Neon Maze vs Marble Maze, Neon Tower Rush und Apps', lead: `Tabelle zum Vergleich von <a href="${GAME}">Cyber Neon Maze</a> mit anderen Optionen.`, answer: 'Cyber Neon Maze ist das einzige Ego-3D-Labyrinth-Fluchtspiel hier.', s1: 'Vs Marble Maze', s1p: 'Marble Maze ist Kipp-Canvas. Cyber Neon Maze ist WebGL-FPS.', s2: 'Vs Neon Tower Rush', s2p: 'Tower Rush ist Turmverteidigung; Cyber Neon Maze ist Labyrinth.', table: [['Spiel', 'Groesse', 'Sitzung', 'Sicht', 'Am besten fuer'], [`<a href="${GAME}">Cyber Neon Maze</a>`, PAYLOAD, '5-20 Min', '3D FPS', 'Neon-Flucht'], [`<a href="${MARBLE}">Marble Maze</a>`, 'klein', '3-15 Min', 'Top-down', 'Kippen'], [`<a href="${NTR}">Neon Tower Rush</a>`, '~1.2 MB', '20-45 Min', 'TD', 'Strategie'], ['Installierte App', '50-200+ MB', 'Stunden', 'Variiert', 'Cloud']], links: `<a href="{{p}}how-to-play-cyber-neon-maze.html">Anleitung</a>.` },
    },
  },
];

const jspTpl = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page browserTitle='\${pageBodyTitle}' description='\${pageBodyDesc}'>
\t<freetoolonline:loading/>
\t<!-- BODYHTML -->
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
    "  '/guides/de/neon-tower-rush-vs-alternatives.html',\n\n]);",
    `  '/guides/de/neon-tower-rush-vs-alternatives.html',\n  // game-discovery-loop-runbook fire28 (2026-07-10): cyber-neon-maze\n${guideRoutes.join('\n')}\n]);`
  );
  siteData = siteData.replace(
    "  '/neon-tower-rush.html': '/games/neon-tower-rush.html',",
    `  '/neon-tower-rush.html': '/games/neon-tower-rush.html',\n  '/cyber-neon-maze.html': '/games/${SLUG}.html',`
  );
  siteData = siteData.replace(
    "  '/games/neon-tower-rush.html': 'games/neon-tower-rush.jsp',",
    `  '/games/neon-tower-rush.html': 'games/neon-tower-rush.jsp',\n  '/games/${SLUG}.html': 'games/${SLUG}.jsp',`
  );
  siteData = siteData.replace(
    "  '/guides/de/neon-tower-rush-vs-alternatives.html': 'guide/de/neon-tower-rush-vs-alternatives.jsp',",
    `  '/guides/de/neon-tower-rush-vs-alternatives.html': 'guide/de/neon-tower-rush-vs-alternatives.jsp',\n  // game-discovery-loop-runbook fire28 (2026-07-10): cyber-neon-maze guides\n${jspRoutes.join('\n')}`
  );
  fs.writeFileSync(siteDataPath, siteData);
}

const clustersPath = path.join(ROOT, 'scripts/seo-clusters.mjs');
let clusters = fs.readFileSync(clustersPath, 'utf8');
if (!clusters.includes(SLUG)) {
  clusters = clusters.replace("'/games/neon-tower-rush.html']", `'/games/neon-tower-rush.html', '/games/${SLUG}.html']`);
  fs.writeFileSync(clustersPath, clusters);
}

const relatedPath = path.join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
let related = fs.readFileSync(relatedPath, 'utf8');
if (!related.includes('Cyber Neon Maze')) {
  related = related.replace(
    '{ title: "Neon Tower Rush", url: "https://freetoolonline.com/games/neon-tower-rush.html", include: !1, tags: "games" },',
    `{ title: "Neon Tower Rush", url: "https://freetoolonline.com/games/neon-tower-rush.html", include: !1, tags: "games" },\n    { title: "Cyber Neon Maze", url: "https://freetoolonline.com/games/${SLUG}.html", include: !1, tags: "games" },`
  );
  fs.writeFileSync(relatedPath, related);
}

const menuPath = path.join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
let menu = fs.readFileSync(menuPath, 'utf8');
if (!menu.includes('Cyber Neon Maze')) {
  menu = menu.replace(
    "<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/neon-tower-rush.html'>Neon Tower Rush</a>",
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/neon-tower-rush.html'>Neon Tower Rush</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/${SLUG}.html'>Cyber Neon Maze</a>`
  );
  fs.writeFileSync(menuPath, menu);
}

const skillDir = path.join(FRONTEND, '.agent/skills/tool-cyberneonmaze');
fs.mkdirSync(skillDir, { recursive: true });
write(path.join(skillDir, 'SKILL.md'), `---
name: tool-cyberneonmaze
description: |
  Ground-truth implementation reference for the /games/${SLUG}.html
  page. Hand-authored 2026-07-10 (game-discovery-loop-runbook fire 28) from the
  adapted neon-maze engine at static/games/${SLUG}/.
---

# tool-cyberneonmaze - ground-truth reference for /games/${SLUG}.html

## Identity

- **Route**: /games/${SLUG}.html
- **Slug**: \`${SLUG}\` (CMS fragment slug: \`${CMS_SLUG}\`)
- **Cluster**: games
- **Aliases**: \`/cyber-neon-maze.html\` (ALIAS_ROUTES + CloudFront REDIRECTS)

## Reader task (one sentence)

Play a free first-person 3D cyberpunk maze escape in the browser tab - collect orbs, dodge laser traps, sprint with stamina, and reach the exit without installing anything.

## Processing model

**client-side-only** - single index.html + vendored three.js r128 under \`static/games/${SLUG}/\` in a same-origin iframe. Total payload ${PAYLOAD}. Procedural Web Audio SFX. No network calls after load (three.js vendored locally).

## License analysis

- Upstream: bhanu2006-24/neon-maze (MIT, Copyright 2025 Bhanu Pratap Saini). Verified via LICENSE file.
- Runtime: index.html, LICENSE, CREDITS.txt. All MIT code; procedural textures generated in canvas.
- Page title **Cyber Neon Maze**; upstream credited in CREDITS.txt.

## Reader-benefit framing menu

- A1: Procedural neon maze generation each run.
- A2: First-person pointer-lock FPS controls (WASD + mouse look).
- A3: Collect all glowing orbs before reaching the exit.
- A4: Dodge sweeping laser traps; crouch under beams with Ctrl.
- A5: Sprint with Shift while stamina bar has charge.
- A6: Health and stamina HUD with compass heading strip.
- A7: Jump with Space for short gaps.
- A8: Session-only - zero localStorage and zero server calls.
- A9: About ${PAYLOAD} payload; three.js r128 vendored at ../../vendor/three/three.min.js.
- A10: WebGL Three.js renderer with fog and particle ambience.

## Anti-claims

- No saves, leaderboards, or accounts.
- Not top-down marble tilt (see Marble Maze).
- Not tower defense (see Neon Tower Rush).
- Requires pointer lock for mouse look (not touch-only friendly).
- Not a commercial franchise clone (original Neon Maze).

## claim_catalogue_status

verified
`);

await patchCloudFront301({
  frontendRoot: FRONTEND,
  aliasUrl: '/cyber-neon-maze.html',
  canonicalUrl: GAME,
  runDate: '20260710-cyber-neon-maze',
});

console.log('fire28 bundle generated for', SLUG);
