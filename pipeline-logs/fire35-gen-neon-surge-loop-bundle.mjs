#!/usr/bin/env node
/** Fire35: neon-surge-loop route bundle + multilingual guides + site-data patches. */
import fs from 'node:fs';
import path from 'node:path';
import { patchCloudFront301 } from '../../.agent/skills/seo-tool-page-builder/scripts/lib/patch-cloudfront-301.mjs';

const FRONTEND = '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const ROOT = path.join(FRONTEND, 'freetoolonline-web-test');
const CMS = path.join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const SLUG = 'neon-surge-loop';
const CMS_SLUG = 'neonsurgeloop';
const GAME = `/games/${SLUG}.html`;
const HORDE = '/games/procedural-horde-game.html';
const NIGHT = '/games/night-swarm-survivor.html';
const CHILI = '/games/chili-blast-shooter.html';
const DATE = '2026-07-10';
const PAYLOAD = '~40 KB';

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  return p;
}

const gameTitle = 'Neon Surge Loop - Free Online Roguelite Wave Shooter';
const gameDesc = `Neon Surge Loop - a free browser roguelite shooter: steer with the mouse, auto-fire neon projectiles, collect XP gems, and pick level-up upgrades. About ${PAYLOAD}, no install, session-only runs.`;
const gameKw = 'neon surge loop game,browser roguelite shooter,free wave survival online,canvas arcade shooter no install,synthwave survivor game,upgrade pick shooter';

write(path.join(CMS, `BODYTITLE${CMS_SLUG}.txt`), gameTitle + '\n');
write(path.join(CMS, `BODYDESC${CMS_SLUG}.txt`), gameDesc + '\n');
write(path.join(CMS, `BODYKW${CMS_SLUG}.txt`), gameKw + '\n');

write(path.join(CMS, `BODYHTML${CMS_SLUG}.html`), `<div class="w3-container">
    <p>Survive neon enemy waves in a synthwave arena: move with the mouse, auto-fire cyan bolts, level up, and choose upgrade cards. No install, no account.</p>
</div>

<div id="nslWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="nslStage" style="position:relative; width:100%; min-height:520px; background:#111; border-radius:6px; overflow:hidden;">
            <div id="nslLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6edf3; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; letter-spacing:1px; color:#9a2aff;">NEON SURGE LOOP</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#9db0c5;">Roguelite wave shooter on canvas: mouse-move steering, auto-fire, XP gems, and level-up upgrade picks. Press Play to load about ${PAYLOAD}.</p>
                <button id="nslPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="nslStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px; min-height:20px;">Press Play to start the shooter.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="nslFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: click START GAME, move the mouse to steer, Space triggers Nova after you unlock it.</span>
    </div>
    <style>#nslStage:fullscreen { border-radius: 0; } #nslStage iframe { display:block; width:100%; height:620px; border:0; }</style>
</div>`);

write(path.join(CMS, `BODYJS${CMS_SLUG}.html`), `<script>
    // Neon Surge Loop launcher. Adapted from thegamerbay/neon-dopamine (MIT, 2026 Artem Ryazanov)
    web.localUpload = false;
    var NSL_GAME_URL = 'neon-surge-loop/index.html';
    function nslStatus(text) {
        var el = document.getElementById('nslStatus');
        if (el) el.textContent = text;
    }
    function nslInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'nslFrame';
        frame.src = NSL_GAME_URL;
        frame.title = 'Neon Surge Loop';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            nslStatus('Game loaded. Click START GAME inside the frame.');
            try { frame.contentWindow.focus(); } catch (e) { }
        });
        var launch = document.getElementById('nslLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('nslStage');
        var playBtn = document.getElementById('nslPlayBtn');
        if (!stage || !playBtn) return;
        var fsBtn = document.getElementById('nslFullscreenBtn');
        playBtn.addEventListener('click', function () {
            nslStatus('Loading the shooter (about ${PAYLOAD})...');
            nslInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('nslFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) { } }
        });
    }
</script>`);

write(path.join(CMS, `BODYWELCOME${CMS_SLUG}.html`), `<h1 class="text-uppercase"><b>Neon Surge Loop</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-10T13:10:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Press Play and a synthwave roguelite shooter loads in the tab. Move the mouse to steer your purple ship, auto-fire hits magenta foes, collect lime XP gems, and pick upgrade cards when you level.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
    <tr><th>Step</th><th>Action</th></tr>
    <tr><td>Launch</td><td>Play on this page, then START GAME inside the iframe</td></tr>
    <tr><td>Steer</td><td>Move the mouse; the ship follows the cursor</td></tr>
    <tr><td>Survive</td><td>Dodge enemies, collect XP, choose level-up upgrades</td></tr>
    <tr><td>Nova</td><td>After unlocking Nova via upgrade, press Space for a screen-wide burst</td></tr>
</table>
<p>Session-only runs with zero localStorage and zero server calls. Procedural Web Audio SFX inline. Adapted from Artem Ryazanov's open-source Neon Dopamine (MIT); LICENSE ships next to the game files.</p>`);

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
    slug: 'how-to-play-neon-surge-loop',
    cmsBase: 'howtoplayneonsurgeloop',
    copy: {
      en: { title: 'How to Play Neon Surge Loop - Step by Step', desc: 'Step-by-step Neon Surge Loop guide: launch iframe, START GAME, mouse steering, XP upgrades, Nova burst.', h1: 'How to Play Neon Surge Loop - Step by Step', lead: `The <a href="${GAME}">Neon Surge Loop</a> page loads a ${PAYLOAD} canvas roguelite shooter in an iframe. Mouse-move steering and auto-fire - no install required.`, answer: 'Press Play on the page, click START GAME inside the iframe, move the mouse to steer, survive waves, collect XP gems, and pick upgrade cards on level-up. Press Space for Nova only after you unlock that upgrade.', s1: 'Step 1 - launch', s1p: 'Click Play on the game page to load the iframe. Click START GAME on the neon title screen to begin the run.', s2: 'Step 2 - steer and shoot', s2p: 'Move the mouse anywhere on the canvas; your ship follows the cursor. Projectiles auto-fire on a cooldown without clicking.', s3: 'Step 3 - level up', s3p: 'Touch lime or gold XP gems to fill the bar. When you level, three upgrade cards appear - click one to apply fire-rate, damage, multi-shot, pierce, or Nova unlocks.', table: [['Control', 'Input', 'Notes'], ['Steer', 'Mouse move', 'Ship follows cursor'], ['Fire', 'Automatic', 'No click-to-shoot'], ['Nova', 'Spacebar', 'Only after Nova upgrade'], ['Saves', 'None', 'Session-only'], ['Download', PAYLOAD, 'HTML + JS + CSS']], links: `See <a href="{{p}}neon-surge-loop-when.html">when to play</a> and <a href="{{p}}neon-surge-loop-vs-alternatives.html">vs other survivors</a>. Also <a href="${HORDE}">Procedural Horde Game</a>.` },
      pt: { title: 'Como Jogar Neon Surge Loop - Passo a Passo', desc: 'Guia Neon Surge Loop: iframe, START GAME, mouse, upgrades XP, Nova.', h1: 'Como Jogar Neon Surge Loop - Passo a Passo', lead: `A pagina <a href="${GAME}">Neon Surge Loop</a> carrega shooter roguelite ${PAYLOAD} no iframe.`, answer: 'Pressione Play, START GAME no iframe, mova o mouse para dirigir, colete XP e escolha upgrades. Space para Nova apos desbloquear.', s1: 'Passo 1', s1p: 'Clique Play e depois START GAME.', s2: 'Passo 2', s2p: 'Mouse move o navio; tiros automaticos.', s3: 'Passo 3', s3p: 'Level up abre tres cartas de upgrade.', table: [['Controle', 'Entrada', 'Notas'], ['Dirigir', 'Mouse', 'Segue cursor'], ['Tiro', 'Auto', 'Sem clique'], ['Nova', 'Space', 'Apos upgrade'], ['Save', 'Nenhum', 'Sessao'], ['Tamanho', PAYLOAD, 'Canvas JS']], links: `<a href="{{p}}neon-surge-loop-when.html">Quando jogar</a>.` },
      es: { title: 'Como Jugar Neon Surge Loop - Paso a Paso', desc: 'Guia Neon Surge Loop: iframe, START GAME, raton, mejoras XP, Nova.', h1: 'Como Jugar Neon Surge Loop - Paso a Paso', lead: `La pagina <a href="${GAME}">Neon Surge Loop</a> carga un shooter roguelite (${PAYLOAD}) en el iframe.`, answer: 'Pulsa Play, START GAME en el iframe, mueve el raton, recoge XP y elige mejoras. Space para Nova tras desbloquearla.', s1: 'Paso 1', s1p: 'Pulsa Play y luego START GAME.', s2: 'Paso 2', s2p: 'El raton dirige la nave; disparo automatico.', s3: 'Paso 3', s3p: 'Al subir nivel aparecen tres cartas.', table: [['Control', 'Entrada', 'Notas'], ['Mover', 'Raton', 'Sigue cursor'], ['Disparo', 'Auto', 'Sin clic'], ['Nova', 'Space', 'Tras mejora'], ['Guardado', 'Ninguno', 'Sesion'], ['Tamano', PAYLOAD, 'Canvas JS']], links: `<a href="{{p}}neon-surge-loop-when.html">Cuando jugar</a>.` },
      vi: { title: 'Cach choi Neon Surge Loop - Huong dan tung buoc', desc: 'Huong dan Neon Surge Loop: iframe, START GAME, chuot, nang cap XP, Nova.', h1: 'Cach choi Neon Surge Loop - Huong dan tung buoc', lead: `<a href="${GAME}">Neon Surge Loop</a> tai game ban sung roguelite ${PAYLOAD} trong iframe.`, answer: 'Bam Play, START GAME trong iframe, di chuyen chuot, nhat XP, chon nang cap. Space cho Nova sau khi mo khoa.', s1: 'Buoc 1', s1p: 'Bam Play roi START GAME.', s2: 'Buoc 2', s2p: 'Chuot dieu khien tau; ban tu dong.', s3: 'Buoc 3', s3p: 'Len cap hien ba the nang cap.', table: [['Dieu khien', 'Nhap', 'Ghi chu'], ['Di chuyen', 'Chuot', 'Theo con tro'], ['Ban', 'Tu dong', 'Khong can click'], ['Nova', 'Space', 'Sau upgrade'], ['Luu', 'Khong', 'Phien'], ['Dung luong', PAYLOAD, 'Canvas JS']], links: `<a href="{{p}}neon-surge-loop-when.html">Khi nao choi</a>.` },
      id: { title: 'Cara Bermain Neon Surge Loop - Langkah demi Langkah', desc: 'Panduan Neon Surge Loop: iframe, START GAME, mouse, upgrade XP, Nova.', h1: 'Cara Bermain Neon Surge Loop - Langkah demi Langkah', lead: `Halaman <a href="${GAME}">Neon Surge Loop</a> memuat shooter roguelite ${PAYLOAD} di iframe.`, answer: 'Tekan Play, START GAME di iframe, gerakkan mouse, kumpulkan XP, pilih upgrade. Space untuk Nova setelah terbuka.', s1: 'Langkah 1', s1p: 'Klik Play lalu START GAME.', s2: 'Langkah 2', s2p: 'Mouse mengarahkan kapal; tembak otomatis.', s3: 'Langkah 3', s3p: 'Level up menampilkan tiga kartu upgrade.', table: [['Kontrol', 'Input', 'Catatan'], ['Gerak', 'Mouse', 'Ikuti kursor'], ['Tembak', 'Otomatis', 'Tanpa klik'], ['Nova', 'Space', 'Setelah upgrade'], ['Simpan', 'Tidak ada', 'Sesi'], ['Ukuran', PAYLOAD, 'Canvas JS']], links: `<a href="{{p}}neon-surge-loop-when.html">Kapan bermain</a>.` },
      de: { title: 'Neon Surge Loop spielen - Schritt fuer Schritt', desc: 'Anleitung Neon Surge Loop: iframe, START GAME, Maus, XP-Upgrades, Nova.', h1: 'Neon Surge Loop spielen - Schritt fuer Schritt', lead: `Die Seite <a href="${GAME}">Neon Surge Loop</a> laedt einen ${PAYLOAD} Roguelite-Shooter im iframe.`, answer: 'Play druecken, START GAME im iframe, Maus zum Steuern, XP sammeln, Upgrades waehlen. Space fuer Nova nach Freischaltung.', s1: 'Schritt 1', s1p: 'Play klicken, dann START GAME.', s2: 'Schritt 2', s2p: 'Maus steuert das Schiff; Auto-Feuer.', s3: 'Schritt 3', s3p: 'Level-Up zeigt drei Upgrade-Karten.', table: [['Steuerung', 'Eingabe', 'Hinweis'], ['Lenken', 'Maus', 'Folgt Cursor'], ['Feuer', 'Automatisch', 'Kein Klick'], ['Nova', 'Space', 'Nach Upgrade'], ['Speicher', 'Keiner', 'Sitzung'], ['Groesse', PAYLOAD, 'Canvas JS']], links: `<a href="{{p}}neon-surge-loop-when.html">Wann spielen</a>.` },
    },
  },
  {
    slug: 'neon-surge-loop-when',
    cmsBase: 'neonsurgeloopwhen',
    copy: {
      en: { title: 'When to Play Neon Surge Loop in the Browser', desc: `When a ${PAYLOAD} roguelite shooter beats installing a survivor app.`, h1: 'When to Play Neon Surge Loop in the Browser', lead: `Choose <a href="${GAME}">Neon Surge Loop</a> when you want a synthwave survivor loop with upgrade picks and no download.`, answer: 'Best for a 5-15 minute reflex run with visible XP progression and neon particle feedback. Skip if you want 3D graphics, tower defense, or persistent high-score saves.', s1: 'Good fit', s1p: 'You want mouse-steer auto-fire, elite gold enemies, level-up cards, and procedural audio in one lightweight tab.', s2: 'Skip when', s2p: 'You need WASD twin-stick controls or cloud saves - try <a href="${NIGHT}">Night Swarm Survivor</a> for horde persistence patterns instead.', table: [['Scenario', 'Neon Surge Loop', 'Notes'], ['Session', '5-15 min', 'Wave survival'], ['Payload', PAYLOAD, 'Canvas only'], ['Input', 'Mouse steer', 'Auto-fire'], ['Saves', 'None', 'Session-only']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Step-by-step</a>.` },
      pt: { title: 'Quando Jogar Neon Surge Loop no Navegador', desc: `Quando shooter roguelite ${PAYLOAD} vale mais que app instalado.`, h1: 'Quando Jogar Neon Surge Loop no Navegador', lead: `Escolha <a href="${GAME}">Neon Surge Loop</a> para loop synthwave sem download.`, answer: 'Ideal para sessoes de 5-15 minutos com cartas de upgrade.', s1: 'Bom para', s1p: 'Mouse + auto-fire + particulas neon leves.', s2: 'Evite se', s2p: 'Precisa de saves persistentes ou 3D.', table: [['Cenario', 'Valor', 'Notas'], ['Sessao', '5-15 min', 'Ondas'], ['Tamanho', PAYLOAD, 'Canvas'], ['Entrada', 'Mouse', 'Auto'], ['Save', 'Nenhum', 'Sessao']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Passo a passo</a>.` },
      es: { title: 'Cuando Jugar Neon Surge Loop en el Navegador', desc: `Cuando shooter roguelite ${PAYLOAD} conviene mas que app instalada.`, h1: 'Cuando Jugar Neon Surge Loop en el Navegador', lead: `Elige <a href="${GAME}">Neon Surge Loop</a> para un loop synthwave sin descarga.`, answer: 'Mejor para partidas de 5-15 minutos con cartas de mejora.', s1: 'Buen caso', s1p: 'Raton + auto-disparo + particulas neon.', s2: 'Evita si', s2p: 'Necesitas guardados persistentes o 3D.', table: [['Escenario', 'Valor', 'Notas'], ['Sesion', '5-15 min', 'Olas'], ['Tamano', PAYLOAD, 'Canvas'], ['Entrada', 'Raton', 'Auto'], ['Guardado', 'Ninguno', 'Sesion']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Paso a paso</a>.` },
      vi: { title: 'Khi nao choi Neon Surge Loop tren trinh duyet', desc: `Khi game ban sung roguelite ${PAYLOAD} phu hop hon app cai dat.`, h1: 'Khi nao choi Neon Surge Loop tren trinh duyet', lead: `Chon <a href="${GAME}">Neon Surge Loop</a> cho vong synthwave khong can tai.`, answer: 'Tot cho phien 5-15 phut voi the nang cap.', s1: 'Phu hop', s1p: 'Chuot + ban tu dong + hieu ung neon.', s2: 'Khong phu hop', s2p: 'Can luu diem hoac do hoa 3D.', table: [['Tinh huong', 'Gia tri', 'Ghi chu'], ['Phien', '5-15 phut', 'Song'], ['Dung luong', PAYLOAD, 'Canvas'], ['Vao', 'Chuot', 'Tu dong'], ['Luu', 'Khong', 'Phien']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Huong dan</a>.` },
      id: { title: 'Kapan Memainkan Neon Surge Loop di Browser', desc: `Kapan shooter roguelite ${PAYLOAD} lebih pas daripada app terpasang.`, h1: 'Kapan Memainkan Neon Surge Loop di Browser', lead: `Pilih <a href="${GAME}">Neon Surge Loop</a> untuk loop synthwave tanpa unduhan.`, answer: 'Cocok untuk sesi 5-15 menit dengan kartu upgrade.', s1: 'Cocok untuk', s1p: 'Mouse + tembak otomatis + partikel neon.', s2: 'Lewati jika', s2p: 'Butuh simpan skor atau 3D.', table: [['Skenario', 'Nilai', 'Catatan'], ['Sesi', '5-15 menit', 'Gelombang'], ['Ukuran', PAYLOAD, 'Canvas'], ['Input', 'Mouse', 'Otomatis'], ['Simpan', 'Tidak ada', 'Sesi']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Langkah demi langkah</a>.` },
      de: { title: 'Wann Neon Surge Loop im Browser spielen', desc: `Wann ein ${PAYLOAD} Roguelite-Shooter besser passt als eine installierte App.`, h1: 'Wann Neon Surge Loop im Browser spielen', lead: `Waehlen Sie <a href="${GAME}">Neon Surge Loop</a> fuer einen Synthwave-Survivor-Loop ohne Download.`, answer: 'Gut fuer 5-15 Minuten mit Upgrade-Karten.', s1: 'Passt wenn', s1p: 'Maus-Steuerung, Auto-Feuer, Neon-Partikel.', s2: 'Nicht wenn', s2p: 'Persistente Saves oder 3D noetig.', table: [['Szenario', 'Wert', 'Hinweis'], ['Sitzung', '5-15 Min', 'Wellen'], ['Groesse', PAYLOAD, 'Canvas'], ['Eingabe', 'Maus', 'Auto'], ['Speicher', 'Keiner', 'Sitzung']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Anleitung</a>.` },
    },
  },
  {
    slug: 'neon-surge-loop-vs-alternatives',
    cmsBase: 'neonsurgeloopvsalternatives',
    copy: {
      en: { title: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor, and Chili Blast Shooter', desc: `Compare ${PAYLOAD} Neon Surge Loop with other browser survivor shooters.`, h1: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor, and Chili Blast Shooter', lead: `This table contrasts <a href="${GAME}">Neon Surge Loop</a> with other survivor-style browser games on this site.`, answer: 'Neon Surge Loop is the lightest synthwave mouse-steer roguelite here. Procedural Horde Game is a longer horde canvas action title. Night Swarm Survivor uses keyboard movement with localStorage saves. Chili Blast Shooter is a compact chili-themed survivor with WASD.', s1: 'Versus Procedural Horde Game', s1p: 'Procedural Horde Game emphasizes horde waves and boss timers. Neon Surge Loop is tighter and mouse-driven with neon UI chrome.', s2: 'Versus Night Swarm Survivor', s2p: 'Night Swarm Survivor renames a Vampire-Survivors-style keyboard horde with save slots. Neon Surge Loop has no saves and uses mouse steering only.', table: [['Option', 'Payload', 'Session', 'Controls', 'Best for'], [`<a href="${GAME}">Neon Surge Loop</a>`, PAYLOAD, '5-15 min', 'Mouse steer + auto-fire', 'Synthwave roguelite'], [`<a href="${HORDE}">Procedural Horde Game</a>`, 'Canvas action', '10-25 min', 'WASD/arrows', 'Horde loops'], [`<a href="${NIGHT}">Night Swarm Survivor</a>`, '~327 KB modules', '10-20 min', 'Keyboard move', 'Saved horde runs'], [`<a href="${CHILI}">Chili Blast Shooter</a>`, '~26 KB', '1-5 min', 'WASD + auto-fire', 'Quick survivor']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">How to play</a>.` },
      pt: { title: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor e Chili Blast Shooter', desc: `Compare Neon Surge Loop (${PAYLOAD}) com outros survivors no navegador.`, h1: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor e Chili Blast Shooter', lead: `Tabela comparando <a href="${GAME}">Neon Surge Loop</a> com outras opcoes.`, answer: 'Neon Surge Loop e o roguelite synthwave mais leve com mouse.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game e mais longo; Neon Surge e mouse-driven.', s2: 'Vs Night Swarm Survivor', s2p: 'Night Swarm tem teclado e saves; Neon Surge nao.', table: [['Opcao', 'Tamanho', 'Sessao', 'Controles', 'Melhor para'], [`<a href="${GAME}">Neon Surge Loop</a>`, PAYLOAD, '5-15 min', 'Mouse', 'Roguelite neon'], [`<a href="${HORDE}">Procedural Horde Game</a>`, 'acao', '10-25 min', 'WASD', 'Horde'], [`<a href="${NIGHT}">Night Swarm Survivor</a>`, '~327 KB', '10-20 min', 'Teclado', 'Saves'], [`<a href="${CHILI}">Chili Blast Shooter</a>`, '~26 KB', '1-5 min', 'WASD', 'Rapido']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Como jogar</a>.` },
      es: { title: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor y Chili Blast Shooter', desc: `Compara Neon Surge Loop (${PAYLOAD}) con otros survivors en el navegador.`, h1: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor y Chili Blast Shooter', lead: `Tabla que contrasta <a href="${GAME}">Neon Surge Loop</a> con otras opciones.`, answer: 'Neon Surge Loop es el roguelite synthwave mas ligero con raton.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game es mas largo; Neon Surge usa raton.', s2: 'Vs Night Swarm Survivor', s2p: 'Night Swarm tiene teclado y guardados; Neon Surge no.', table: [['Opcion', 'Tamano', 'Sesion', 'Controles', 'Mejor para'], [`<a href="${GAME}">Neon Surge Loop</a>`, PAYLOAD, '5-15 min', 'Raton', 'Roguelite neon'], [`<a href="${HORDE}">Procedural Horde Game</a>`, 'accion', '10-25 min', 'WASD', 'Horde'], [`<a href="${NIGHT}">Night Swarm Survivor</a>`, '~327 KB', '10-20 min', 'Teclado', 'Guardados'], [`<a href="${CHILI}">Chili Blast Shooter</a>`, '~26 KB', '1-5 min', 'WASD', 'Rapido']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Como jugar</a>.` },
      vi: { title: 'Neon Surge Loop so voi Procedural Horde Game, Night Swarm Survivor va Chili Blast Shooter', desc: `So sanh Neon Surge Loop (${PAYLOAD}) voi game survivor khac.`, h1: 'Neon Surge Loop so voi Procedural Horde Game, Night Swarm Survivor va Chili Blast Shooter', lead: `Bang so sanh <a href="${GAME}">Neon Surge Loop</a> voi lua chon khac.`, answer: 'Neon Surge Loop la roguelite synthwave nhe nhat voi chuot.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game dai hon; Neon Surge dieu khien bang chuot.', s2: 'Vs Night Swarm Survivor', s2p: 'Night Swarm co ban phim va luu; Neon Surge khong.', table: [['Lua chon', 'Dung luong', 'Phien', 'Dieu khien', 'Tot cho'], [`<a href="${GAME}">Neon Surge Loop</a>`, PAYLOAD, '5-15 phut', 'Chuot', 'Roguelite neon'], [`<a href="${HORDE}">Procedural Horde Game</a>`, 'hanh dong', '10-25 phut', 'WASD', 'Horde'], [`<a href="${NIGHT}">Night Swarm Survivor</a>`, '~327 KB', '10-20 phut', 'Ban phim', 'Co luu'], [`<a href="${CHILI}">Chili Blast Shooter</a>`, '~26 KB', '1-5 phut', 'WASD', 'Nhanh']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Huong dan</a>.` },
      id: { title: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor, dan Chili Blast Shooter', desc: `Bandingkan Neon Surge Loop (${PAYLOAD}) dengan survivor browser lain.`, h1: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor, dan Chili Blast Shooter', lead: `Tabel membandingkan <a href="${GAME}">Neon Surge Loop</a> dengan opsi lain.`, answer: 'Neon Surge Loop adalah roguelite synthwave paling ringan dengan mouse.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game lebih panjang; Neon Surge pakai mouse.', s2: 'Vs Night Swarm Survivor', s2p: 'Night Swarm punya keyboard dan simpan; Neon Surge tidak.', table: [['Opsi', 'Ukuran', 'Sesi', 'Kontrol', 'Terbaik untuk'], [`<a href="${GAME}">Neon Surge Loop</a>`, PAYLOAD, '5-15 menit', 'Mouse', 'Roguelite neon'], [`<a href="${HORDE}">Procedural Horde Game</a>`, 'aksi', '10-25 menit', 'WASD', 'Horde'], [`<a href="${NIGHT}">Night Swarm Survivor</a>`, '~327 KB', '10-20 menit', 'Keyboard', 'Simpan'], [`<a href="${CHILI}">Chili Blast Shooter</a>`, '~26 KB', '1-5 menit', 'WASD', 'Cepat']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Cara bermain</a>.` },
      de: { title: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor und Chili Blast Shooter', desc: `Vergleiche Neon Surge Loop (${PAYLOAD}) mit anderen Browser-Survivors.`, h1: 'Neon Surge Loop vs Procedural Horde Game, Night Swarm Survivor und Chili Blast Shooter', lead: `Tabelle zum Vergleich von <a href="${GAME}">Neon Surge Loop</a> mit anderen Optionen.`, answer: 'Neon Surge Loop ist der leichteste Synthwave-Roguelite mit Maus.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game ist laenger; Neon Surge ist mausgesteuert.', s2: 'Vs Night Swarm Survivor', s2p: 'Night Swarm hat Tastatur und Saves; Neon Surge nicht.', table: [['Option', 'Groesse', 'Sitzung', 'Steuerung', 'Am besten fuer'], [`<a href="${GAME}">Neon Surge Loop</a>`, PAYLOAD, '5-15 Min', 'Maus', 'Neon-Roguelite'], [`<a href="${HORDE}">Procedural Horde Game</a>`, 'Action', '10-25 Min', 'WASD', 'Horde'], [`<a href="${NIGHT}">Night Swarm Survivor</a>`, '~327 KB', '10-20 Min', 'Tastatur', 'Saves'], [`<a href="${CHILI}">Chili Blast Shooter</a>`, '~26 KB', '1-5 Min', 'WASD', 'Kurz']], links: `<a href="{{p}}how-to-play-neon-surge-loop.html">Anleitung</a>.` },
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
    "  '/guides/de/neural-particle-life-vs-alternatives.html',\n]);",
    `  '/guides/de/neural-particle-life-vs-alternatives.html',\n  // game-discovery-loop-runbook fire35 (2026-07-10): neon-surge-loop\n${guideRoutes.join('\n')}\n]);`
  );
  siteData = siteData.replace(
    "  '/neural-particle-life.html': '/games/neural-particle-life.html',",
    `  '/neural-particle-life.html': '/games/neural-particle-life.html',\n  '/neon-surge-loop.html': '/games/${SLUG}.html',`
  );
  siteData = siteData.replace(
    "  '/games/neural-particle-life.html': 'games/neural-particle-life.jsp',",
    `  '/games/neural-particle-life.html': 'games/neural-particle-life.jsp',\n  '/games/${SLUG}.html': 'games/${SLUG}.jsp',`
  );
  siteData = siteData.replace(
    "  '/guides/de/neural-particle-life-vs-alternatives.html': 'guide/de/neural-particle-life-vs-alternatives.jsp',",
    `  '/guides/de/neural-particle-life-vs-alternatives.html': 'guide/de/neural-particle-life-vs-alternatives.jsp',\n  // game-discovery-loop-runbook fire35 (2026-07-10): neon-surge-loop guides\n${jspRoutes.join('\n')}`
  );
  fs.writeFileSync(siteDataPath, siteData);
}

const clustersPath = path.join(ROOT, 'scripts/seo-clusters.mjs');
let clusters = fs.readFileSync(clustersPath, 'utf8');
if (!clusters.includes(SLUG)) {
  clusters = clusters.replace("'/games/neural-particle-life.html']", `'/games/neural-particle-life.html', '/games/${SLUG}.html']`);
  fs.writeFileSync(clustersPath, clusters);
}

const relatedPath = path.join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
let related = fs.readFileSync(relatedPath, 'utf8');
if (!related.includes('Neon Surge Loop')) {
  related = related.replace(
    '{ title: "Neural Particle Life", url: "https://freetoolonline.com/games/neural-particle-life.html", include: !1, tags: "games" },',
    `{ title: "Neural Particle Life", url: "https://freetoolonline.com/games/neural-particle-life.html", include: !1, tags: "games" },\n    { title: "Neon Surge Loop", url: "https://freetoolonline.com/games/${SLUG}.html", include: !1, tags: "games" },`
  );
  fs.writeFileSync(relatedPath, related);
}

const menuPath = path.join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
let menu = fs.readFileSync(menuPath, 'utf8');
if (!menu.includes('Neon Surge Loop')) {
  menu = menu.replace(
    "<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/neural-particle-life.html'>Neural Particle Life</a>",
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/neural-particle-life.html'>Neural Particle Life</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/${SLUG}.html'>Neon Surge Loop</a>`
  );
  fs.writeFileSync(menuPath, menu);
}

const skillDir = path.join(FRONTEND, '.agent/skills/tool-neonsurgeloop');
fs.mkdirSync(skillDir, { recursive: true });
write(path.join(skillDir, 'SKILL.md'), `---
name: tool-neonsurgeloop
description: |
  Ground-truth implementation reference for the /games/${SLUG}.html
  page. Hand-authored 2026-07-10 (game-discovery-loop-runbook fire 35) from the
  adapted neon-dopamine engine at static/games/${SLUG}/.
---

# tool-neonsurgeloop - ground-truth reference for /games/${SLUG}.html

## Identity

- **Route**: /games/${SLUG}.html
- **Slug**: \`${SLUG}\` (CMS fragment slug: \`${CMS_SLUG}\`)
- **Cluster**: games
- **Aliases**: \`/neon-surge-loop.html\` (ALIAS_ROUTES + CloudFront REDIRECTS)

## Reader task (one sentence)

Survive neon enemy waves in a free browser roguelite shooter with mouse steering, auto-fire, XP level-up cards, and optional Nova burst.

## Processing model

**client-side-only** - index.html + style.css + src/main.js under \`static/games/${SLUG}/\` in a same-origin iframe. Total payload ${PAYLOAD}. Canvas 2D only. Procedural Web Audio API oscillators. No network calls after load.

## License analysis

- Upstream: thegamerbay/neon-dopamine (MIT, Copyright 2026 Artem Ryazanov). Verified via LICENSE file.
- Page title **Neon Surge Loop**; upstream credited in CREDITS.txt.

## Reader-benefit framing menu

- A1: Mouse-move steering; ship follows cursor on canvas.
- A2: Auto-fire projectiles on a fire-rate cooldown (no click-to-shoot).
- A3: Magenta regular enemies and gold elite enemies with higher HP and XP.
- A4: Lime XP gems pull toward the player; level bar fills for upgrade picks.
- A5: Level-up overlay shows three upgrade cards (damage, fire rate, multi-shot, pierce, movement, Nova unlock, etc.).
- A6: Spacebar triggers Nova screen-wide burst only after Nova upgrade is chosen.
- A7: HP bar with critical-health vignette below 30 percent.
- A8: Game over screen shows final level; MAIN MENU resets the run.
- A9: Zero localStorage and zero server calls (session-only).
- A10: About ${PAYLOAD} payload (HTML + CSS + JS).

## Anti-claims

- No WASD or keyboard movement (mouse steer only; Space is Nova only).
- No persistent high-score or cloud saves.
- No 3D or WebGL (canvas 2D only).
- Not a Vampire Survivors clone branding (original Neon Surge implementation).
- assets/ screenshots in upstream repo are README-only and not shipped.

## claim_catalogue_status

verified
`);

await patchCloudFront301({
  frontendRoot: FRONTEND,
  aliasUrl: '/neon-surge-loop.html',
  canonicalUrl: GAME,
  runDate: '20260710-neon-surge-loop',
});

console.log('fire35 bundle generated for', SLUG);
