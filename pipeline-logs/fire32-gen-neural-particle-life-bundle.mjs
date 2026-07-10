#!/usr/bin/env node
/** Fire32: neural-particle-life route bundle + multilingual guides + site-data patches. */
import fs from 'node:fs';
import path from 'node:path';
import { patchCloudFront301 } from '../../.agent/skills/seo-tool-page-builder/scripts/lib/patch-cloudfront-301.mjs';

const FRONTEND = '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const ROOT = path.join(FRONTEND, 'freetoolonline-web-test');
const CMS = path.join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const SLUG = 'neural-particle-life';
const CMS_SLUG = 'neuralparticlelife';
const GAME = `/games/${SLUG}.html`;
const PROC = '/games/procedural-horde-game.html';
const PIXEL = '/games/pixel-pipeline-reflex.html';
const DATE = '2026-07-10';
const PAYLOAD = '~19 KB';

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  return p;
}

const gameTitle = 'Neural Particle Life - Free Online Artificial Life Simulation';
const gameDesc = `Neural Particle Life - a free browser artificial life sandbox: 2000 neural-network agents evolve on a toroidal grid with Start, Stop, and step controls. About ${PAYLOAD}, no install, optional genome export.`;
const gameKw = 'neural particle life game,browser artificial life sim,neural network evolution online,free alife sandbox no install,particle evolution browser,genetic algorithm visualization';

write(path.join(CMS, `BODYTITLE${CMS_SLUG}.txt`), gameTitle + '\n');
write(path.join(CMS, `BODYDESC${CMS_SLUG}.txt`), gameDesc + '\n');
write(path.join(CMS, `BODYKW${CMS_SLUG}.txt`), gameKw + '\n');

write(path.join(CMS, `BODYHTML${CMS_SLUG}.html`), `<div class="w3-container">
    <p>Watch thousands of tiny organisms sense their neighborhood through a feedforward neural net, move on a wraparound grid, reproduce when they survive long enough, and evolve through crossover and mutation. No install, no account.</p>
</div>

<div id="nplWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="nplStage" style="position:relative; width:100%; min-height:520px; background:#111; border-radius:6px; overflow:hidden;">
            <div id="nplLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6edf3; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; letter-spacing:1px; color:#7fd2ff;">NEURAL PARTICLE LIFE</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#9db0c5;">Artificial life on a 200x200 toroidal field: each dot uses a 121-input neural network to choose movement, breeds on long survival, and mutates across generations. Press Play to load about ${PAYLOAD}.</p>
                <button id="nplPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="nplStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px; min-height:20px;">Press Play to start the simulation.</div>
        <noscript>This simulation runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="nplFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: Start runs the sim, Stop pauses, One advances a single tick.</span>
    </div>
    <style>#nplStage:fullscreen { border-radius: 0; } #nplStage iframe { display:block; width:100%; height:620px; border:0; }</style>
</div>`);

write(path.join(CMS, `BODYJS${CMS_SLUG}.html`), `<script>
    // Neural Particle Life launcher. Adapted from xcontcom/neuroparticles (MIT, 2025 Serhii Herasymov)
    web.localUpload = false;
    var NPL_GAME_URL = 'neural-particle-life/index.html';
    function nplStatus(text) {
        var el = document.getElementById('nplStatus');
        if (el) el.textContent = text;
    }
    function nplInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'nplFrame';
        frame.src = NPL_GAME_URL;
        frame.title = 'Neural Particle Life';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            nplStatus('Simulation loaded. Click Start inside the frame.');
            try { frame.contentWindow.focus(); } catch (e) { }
        });
        var launch = document.getElementById('nplLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('nplStage');
        var playBtn = document.getElementById('nplPlayBtn');
        if (!stage || !playBtn) return;
        var fsBtn = document.getElementById('nplFullscreenBtn');
        playBtn.addEventListener('click', function () {
            nplStatus('Loading the simulation (about ${PAYLOAD})...');
            nplInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('nplFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) { } }
        });
    }
</script>`);

write(path.join(CMS, `BODYWELCOME${CMS_SLUG}.html`), `<h1 class="text-uppercase"><b>Neural Particle Life</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-10T10:50:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Press Play and a canvas artificial-life sandbox loads in the tab. Two thousand agents each read an 11x11 neighborhood, pick one of nine moves through a small neural net, and pass genomes to offspring when they live long enough.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
    <tr><th>Step</th><th>Action</th></tr>
    <tr><td>Launch</td><td>Play on this page, then Start inside the iframe</td></tr>
    <tr><td>Run</td><td>Start runs continuous ticks; Stop pauses; One steps once</td></tr>
    <tr><td>Tune</td><td>Adjust mutation percent and generation count, then Recreate</td></tr>
    <tr><td>Export</td><td>Save Genome Pool downloads JSON; Load Genome Pool imports a pool</td></tr>
</table>
<p>No localStorage or server calls during play. Optional genome download is a local file only. Adapted from Serhii Herasymov's open-source Neuroparticles (MIT); LICENSE ships next to the game files.</p>`);

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
    slug: 'how-to-play-neural-particle-life',
    cmsBase: 'howtoplayneuralparticlelife',
    copy: {
      en: { title: 'How to Play Neural Particle Life - Step by Step', desc: 'Step-by-step Neural Particle Life guide: launch iframe, Start/Stop/One controls, mutation sliders, genome pool export.', h1: 'How to Play Neural Particle Life - Step by Step', lead: `The <a href="${GAME}">Neural Particle Life</a> page loads a ${PAYLOAD} canvas artificial-life sim in an iframe. Two thousand neural-network agents on a toroidal grid - no install required.`, answer: 'Press Play on the page, click Start inside the iframe to run ticks, use Stop to pause and One for a single step. Tune mutation percent and generation count, then Recreate to respawn the population. Save Genome Pool exports JSON locally.', s1: 'Step 1 - launch', s1p: 'Click Play on the game page to load the iframe. The simulation boots immediately with a static field preview; press Start to begin evolution ticks.', s2: 'Step 2 - controls', s2p: 'Start runs the animation loop. Stop freezes the field. One advances exactly one simulation step - useful for studying a single generation boundary.', s3: 'Step 3 - evolution knobs', s3p: 'Mutations % and Gens fields feed the genetic algorithm. Recreate rebuilds the population with your settings. Console log rows under the canvas show generation stats.', table: [['Setting', 'Value', 'Notes'], ['Download', PAYLOAD, 'HTML + JS + CSS'], ['Agents', '2000', '11x11 perception window'], ['Saves', 'Optional JSON export', 'Local file only'], ['Server calls', '0', 'No fetch/XHR']], links: `See <a href="{{p}}neural-particle-life-when.html">when to play</a> and <a href="{{p}}neural-particle-life-vs-alternatives.html">vs other sims</a>. Also <a href="${PROC}">Procedural Horde Game</a>.` },
      pt: { title: 'Como Jogar Neural Particle Life - Passo a Passo', desc: 'Guia Neural Particle Life: iframe, Start/Stop/One, mutacao, exportar genoma.', h1: 'Como Jogar Neural Particle Life - Passo a Passo', lead: `A pagina <a href="${GAME}">Neural Particle Life</a> carrega simulacao ${PAYLOAD} no iframe.`, answer: 'Pressione Play, Start dentro do iframe, Stop pausa, One avanca um passo. Ajuste mutacao e Gens, depois Recreate.', s1: 'Passo 1', s1p: 'Clique Play para carregar o iframe.', s2: 'Passo 2', s2p: 'Start executa ticks; Stop pausa; One um passo.', s3: 'Passo 3', s3p: 'Recreate reconstrói a populacao com novas configuracoes.', table: [['Item', 'Valor', 'Notas'], ['Tamanho', PAYLOAD, 'Canvas JS'], ['Agentes', '2000', 'Rede neural'], ['Save', 'JSON opcional', 'Arquivo local'], ['Servidor', '0', 'Sem rede']], links: `<a href="{{p}}neural-particle-life-when.html">Quando jogar</a>.` },
      es: { title: 'Como Jugar Neural Particle Life - Paso a Paso', desc: 'Guia Neural Particle Life: iframe, Start/Stop/One, mutacion, exportar genoma.', h1: 'Como Jugar Neural Particle Life - Paso a Paso', lead: `La pagina <a href="${GAME}">Neural Particle Life</a> carga la simulacion (${PAYLOAD}) en el iframe.`, answer: 'Pulsa Play, Start dentro del iframe, Stop pausa, One un paso. Ajusta mutacion y Gens, luego Recreate.', s1: 'Paso 1', s1p: 'Pulsa Play para cargar el iframe.', s2: 'Paso 2', s2p: 'Start ejecuta ticks; Stop pausa.', s3: 'Paso 3', s3p: 'Recreate reconstruye la poblacion.', table: [['Ajuste', 'Valor', 'Notas'], ['Tamano', PAYLOAD, 'Canvas JS'], ['Agentes', '2000', 'Red neuronal'], ['Guardado', 'JSON opcional', 'Archivo local'], ['Servidor', '0', 'Sin red']], links: `<a href="{{p}}neural-particle-life-when.html">Cuando jugar</a>.` },
      vi: { title: 'Cach choi Neural Particle Life - Huong dan tung buoc', desc: 'Huong dan Neural Particle Life: iframe, Start/Stop/One, dot bien, xuat gen.', h1: 'Cach choi Neural Particle Life - Huong dan tung buoc', lead: `<a href="${GAME}">Neural Particle Life</a> tai mo phong ${PAYLOAD} trong iframe.`, answer: 'Bam Play, Start trong iframe, Stop tam dung, One mot buoc. Chinh mutation va Gens, roi Recreate.', s1: 'Buoc 1', s1p: 'Bam Play de tai iframe.', s2: 'Buoc 2', s2p: 'Start chay tick; Stop dung.', s3: 'Buoc 3', s3p: 'Recreate tao lai dan so.', table: [['Muc', 'Gia tri', 'Ghi chu'], ['Dung luong', PAYLOAD, 'Canvas JS'], ['Tac nhan', '2000', 'Mang no-ron'], ['Luu', 'JSON tuy chon', 'File local'], ['Server', '0', 'Khong mang']], links: `<a href="{{p}}neural-particle-life-when.html">Khi nao choi</a>.` },
      id: { title: 'Cara Bermain Neural Particle Life - Langkah demi Langkah', desc: 'Panduan Neural Particle Life: iframe, Start/Stop/One, mutasi, ekspor genom.', h1: 'Cara Bermain Neural Particle Life - Langkah demi Langkah', lead: `Halaman <a href="${GAME}">Neural Particle Life</a> memuat simulasi ${PAYLOAD} di iframe.`, answer: 'Tekan Play, Start di iframe, Stop jeda, One satu langkah. Atur mutasi dan Gens, lalu Recreate.', s1: 'Langkah 1', s1p: 'Klik Play untuk memuat iframe.', s2: 'Langkah 2', s2p: 'Start menjalankan tick; Stop menjeda.', s3: 'Langkah 3', s3p: 'Recreate membangun ulang populasi.', table: [['Setelan', 'Nilai', 'Catatan'], ['Ukuran', PAYLOAD, 'Canvas JS'], ['Agen', '2000', 'Jaringan saraf'], ['Simpan', 'JSON opsional', 'File lokal'], ['Server', '0', 'Tanpa jaringan']], links: `<a href="{{p}}neural-particle-life-when.html">Kapan bermain</a>.` },
      de: { title: 'Neural Particle Life spielen - Schritt fuer Schritt', desc: 'Anleitung Neural Particle Life: iframe, Start/Stop/One, Mutation, Genom-Export.', h1: 'Neural Particle Life spielen - Schritt fuer Schritt', lead: `Die Seite <a href="${GAME}">Neural Particle Life</a> laedt eine ${PAYLOAD} KI-Lebenssimulation im iframe.`, answer: 'Play druecken, Start im iframe, Stop pausiert, One ein Schritt. Mutation und Gens einstellen, dann Recreate.', s1: 'Schritt 1', s1p: 'Play klicken, iframe laden.', s2: 'Schritt 2', s2p: 'Start startet Ticks; Stop pausiert.', s3: 'Schritt 3', s3p: 'Recreate baut die Population neu.', table: [['Einstellung', 'Wert', 'Hinweis'], ['Groesse', PAYLOAD, 'Canvas JS'], ['Agenten', '2000', 'Neuronales Netz'], ['Speicher', 'Optional JSON', 'Lokal'], ['Server', '0', 'Kein Netz']], links: `<a href="{{p}}neural-particle-life-when.html">Wann spielen</a>.` },
    },
  },
  {
    slug: 'neural-particle-life-when',
    cmsBase: 'neuralparticlelifewhen',
    copy: {
      en: { title: 'When to Play Neural Particle Life in the Browser', desc: `When a ${PAYLOAD} artificial-life sandbox beats installing a desktop sim.`, h1: 'When to Play Neural Particle Life in the Browser', lead: `Choose <a href="${GAME}">Neural Particle Life</a> when you want to watch emergent flocking and spacing behavior evolve without installing NetLogo or a desktop ALife lab.`, answer: 'Best for a calm 10-30 minute observation session, teaching neural-net + genetic-algorithm basics, or exporting a genome pool for experiments. Skip if you need 3D graphics, action combat, or persistent cloud saves.', s1: 'Good fit', s1p: 'You want a lightweight canvas sim with Start/Stop/One stepping, visible generation logs, and optional JSON genome export - all in one tab.', s2: 'Skip when', s2p: 'You want a horde shooter or reflex arcade run - try <a href="${PROC}">Procedural Horde Game</a> or <a href="${PIXEL}">Pixel Pipeline Reflex</a> instead.', table: [['Scenario', 'Neural Particle Life', 'Notes'], ['Session', '10-30 min observe', 'Continuous or stepped'], ['Payload', PAYLOAD, 'Canvas only'], ['Input', 'Buttons + sliders', 'No pointer lock'], ['Saves', 'Optional JSON', 'Local download']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Step-by-step</a>.` },
      pt: { title: 'Quando Jogar Neural Particle Life no Navegador', desc: `Quando simulacao ${PAYLOAD} vale mais que app desktop.`, h1: 'Quando Jogar Neural Particle Life no Navegador', lead: `Escolha <a href="${GAME}">Neural Particle Life</a> para observar evolucao emergente sem instalar software.`, answer: 'Ideal para sessoes calmas de 10-30 minutos ou ensino de algoritmos geneticos.', s1: 'Bom para', s1p: 'Simulacao canvas leve com controles de passo.', s2: 'Evite se', s2p: 'Precisa de shooter ou reflexo arcade.', table: [['Cenario', 'Valor', 'Notas'], ['Sessao', '10-30 min', 'Observar'], ['Tamanho', PAYLOAD, 'Canvas'], ['Entrada', 'Botoes', 'Sem lock'], ['Save', 'JSON opcional', 'Local']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Passo a passo</a>.` },
      es: { title: 'Cuando Jugar Neural Particle Life en el Navegador', desc: `Cuando simulacion ${PAYLOAD} conviene mas que app de escritorio.`, h1: 'Cuando Jugar Neural Particle Life en el Navegador', lead: `Elige <a href="${GAME}">Neural Particle Life</a> para ver comportamiento emergente sin instalar software.`, answer: 'Mejor para sesiones de observacion de 10-30 minutos.', s1: 'Buen caso', s1p: 'Simulacion canvas ligera con paso a paso.', s2: 'Evita si', s2p: 'Necesitas shooter o arcade de reflejos.', table: [['Escenario', 'Valor', 'Notas'], ['Sesion', '10-30 min', 'Observar'], ['Tamano', PAYLOAD, 'Canvas'], ['Entrada', 'Botones', 'Sin lock'], ['Guardado', 'JSON opcional', 'Local']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Paso a paso</a>.` },
      vi: { title: 'Khi nao choi Neural Particle Life tren trinh duyet', desc: `Khi mo phong ${PAYLOAD} phu hop hon app desktop.`, h1: 'Khi nao choi Neural Particle Life tren trinh duyet', lead: `Chon <a href="${GAME}">Neural Particle Life</a> de quan sat hanh vi emergent khong can cai dat.`, answer: 'Tot cho phien quan sat 10-30 phut hoac day thuat toan di truyen.', s1: 'Phu hop', s1p: 'Sim canvas nhe voi nut buoc.', s2: 'Khong phu hop', s2p: 'Can game ban hoac phan xa.', table: [['Tinh huong', 'Gia tri', 'Ghi chu'], ['Phien', '10-30 phut', 'Quan sat'], ['Dung luong', PAYLOAD, 'Canvas'], ['Vao', 'Nut', 'Khong lock'], ['Luu', 'JSON tuy chon', 'Local']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Huong dan</a>.` },
      id: { title: 'Kapan Memainkan Neural Particle Life di Browser', desc: `Kapan simulasi ${PAYLOAD} lebih pas daripada app desktop.`, h1: 'Kapan Memainkan Neural Particle Life di Browser', lead: `Pilih <a href="${GAME}">Neural Particle Life</a> untuk mengamati evolusi emergen tanpa instalasi.`, answer: 'Cocok untuk sesi observasi 10-30 menit.', s1: 'Cocok untuk', s1p: 'Sim canvas ringan dengan kontrol langkah.', s2: 'Lewati jika', s2p: 'Butuh shooter atau reflex arcade.', table: [['Skenario', 'Nilai', 'Catatan'], ['Sesi', '10-30 menit', 'Observasi'], ['Ukuran', PAYLOAD, 'Canvas'], ['Input', 'Tombol', 'Tanpa lock'], ['Simpan', 'JSON opsional', 'Lokal']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Langkah demi langkah</a>.` },
      de: { title: 'Wann Neural Particle Life im Browser spielen', desc: `Wann eine ${PAYLOAD} ALife-Simulation besser passt als Desktop-Software.`, h1: 'Wann Neural Particle Life im Browser spielen', lead: `Waehlen Sie <a href="${GAME}">Neural Particle Life</a> fuer emergentes Verhalten ohne Installation.`, answer: 'Gut fuer 10-30 Minuten Beobachtung oder GA-Unterricht.', s1: 'Passt wenn', s1p: 'Leichte Canvas-Sim mit Schrittsteuerung.', s2: 'Nicht wenn', s2p: 'Shooter oder Reflex-Arcade gewuenscht.', table: [['Szenario', 'Wert', 'Hinweis'], ['Sitzung', '10-30 Min', 'Beobachten'], ['Groesse', PAYLOAD, 'Canvas'], ['Eingabe', 'Knoepfe', 'Kein Lock'], ['Speicher', 'Optional JSON', 'Lokal']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Anleitung</a>.` },
    },
  },
  {
    slug: 'neural-particle-life-vs-alternatives',
    cmsBase: 'neuralparticlelifevsalternatives',
    copy: {
      en: { title: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex, and Desktop ALife', desc: `Compare ${PAYLOAD} Neural Particle Life with other browser games and desktop artificial-life tools.`, h1: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex, and Desktop ALife', lead: `This table contrasts <a href="${GAME}">Neural Particle Life</a> with other options when you want evolution visuals or browser games without installing anything.`, answer: 'Neural Particle Life is the only neural-network evolution sandbox on this site. Procedural Horde Game is a combat horde survivor. Pixel Pipeline Reflex is a scanline reflex arcade. Desktop ALife tools offer deeper modeling but need installs.', s1: 'Versus Procedural Horde Game', s1p: 'Procedural Horde Game is an action horde survivor with waves and upgrades. Neural Particle Life is observational - you watch agents evolve, not fight enemies.', s2: 'Versus Pixel Pipeline Reflex', s2p: 'Pixel Pipeline Reflex is a short reflex puzzle about routing packets before a scan beam. Neural Particle Life is open-ended and slower - better for studying emergence.', table: [['Option', 'Payload', 'Session', 'Genre', 'Best for'], [`<a href="${GAME}">Neural Particle Life</a>`, PAYLOAD, '10-30 min', 'ALife sim', 'Neural evolution watch'], [`<a href="${PROC}">Procedural Horde Game</a>`, 'Canvas action', '10-25 min', 'Horde survivor', 'Combat loops'], [`<a href="${PIXEL}">Pixel Pipeline Reflex</a>`, '~48 KB', '3-10 min', 'Reflex arcade', 'Packet routing'], ['Desktop ALife (NetLogo etc.)', '50+ MB install', 'Hours', 'Modeling lab', 'Research depth']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">How to play</a>.` },
      pt: { title: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex e ALife desktop', desc: `Compare Neural Particle Life (${PAYLOAD}) com outros jogos no navegador.`, h1: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex e ALife desktop', lead: `Tabela comparando <a href="${GAME}">Neural Particle Life</a> com outras opcoes.`, answer: 'Neural Particle Life e o unico sandbox de evolucao neural aqui.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game e combate; Neural Particle Life e observacional.', s2: 'Vs Pixel Pipeline Reflex', s2p: 'Pixel Pipeline e reflexo rapido; Neural Particle Life e aberto e lento.', table: [['Opcao', 'Tamanho', 'Sessao', 'Genero', 'Melhor para'], [`<a href="${GAME}">Neural Particle Life</a>`, PAYLOAD, '10-30 min', 'ALife', 'Evolucao'], [`<a href="${PROC}">Procedural Horde Game</a>`, 'acao', '10-25 min', 'Horde', 'Combate'], [`<a href="${PIXEL}">Pixel Pipeline Reflex</a>`, '~48 KB', '3-10 min', 'Reflexo', 'Roteamento'], ['ALife desktop', '50+ MB', 'Horas', 'Modelagem', 'Pesquisa']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Como jogar</a>.` },
      es: { title: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex y ALife de escritorio', desc: `Compara Neural Particle Life (${PAYLOAD}) con otros juegos en el navegador.`, h1: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex y ALife de escritorio', lead: `Tabla que contrasta <a href="${GAME}">Neural Particle Life</a> con otras opciones.`, answer: 'Neural Particle Life es el unico sandbox de evolucion neural aqui.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game es combate; Neural Particle Life es observacional.', s2: 'Vs Pixel Pipeline Reflex', s2p: 'Pixel Pipeline es reflejo rapido; Neural Particle Life es abierto.', table: [['Opcion', 'Tamano', 'Sesion', 'Genero', 'Mejor para'], [`<a href="${GAME}">Neural Particle Life</a>`, PAYLOAD, '10-30 min', 'ALife', 'Evolucion'], [`<a href="${PROC}">Procedural Horde Game</a>`, 'accion', '10-25 min', 'Horde', 'Combate'], [`<a href="${PIXEL}">Pixel Pipeline Reflex</a>`, '~48 KB', '3-10 min', 'Reflejo', 'Enrutamiento'], ['ALife escritorio', '50+ MB', 'Horas', 'Modelado', 'Investigacion']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Como jugar</a>.` },
      vi: { title: 'Neural Particle Life so voi Procedural Horde Game, Pixel Pipeline Reflex va ALife desktop', desc: `So sanh Neural Particle Life (${PAYLOAD}) voi game khac.`, h1: 'Neural Particle Life so voi Procedural Horde Game, Pixel Pipeline Reflex va ALife desktop', lead: `Bang so sanh <a href="${GAME}">Neural Particle Life</a> voi lua chon khac.`, answer: 'Neural Particle Life la sandbox tien hoa no-ron duy nhat tren site.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game la chien dau; Neural Particle Life la quan sat.', s2: 'Vs Pixel Pipeline Reflex', s2p: 'Pixel Pipeline la phan xa nhanh; Neural Particle Life mo va cham.', table: [['Lua chon', 'Dung luong', 'Phien', 'The loai', 'Tot cho'], [`<a href="${GAME}">Neural Particle Life</a>`, PAYLOAD, '10-30 phut', 'ALife', 'Tien hoa'], [`<a href="${PROC}">Procedural Horde Game</a>`, 'hanh dong', '10-25 phut', 'Horde', 'Chien dau'], [`<a href="${PIXEL}">Pixel Pipeline Reflex</a>`, '~48 KB', '3-10 phut', 'Phan xa', 'Routing'], ['ALife desktop', '50+ MB', 'Gio', 'Mo hinh', 'Nghien cuu']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Huong dan</a>.` },
      id: { title: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex, dan ALife desktop', desc: `Bandingkan Neural Particle Life (${PAYLOAD}) dengan game browser lain.`, h1: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex, dan ALife desktop', lead: `Tabel membandingkan <a href="${GAME}">Neural Particle Life</a> dengan opsi lain.`, answer: 'Neural Particle Life adalah satu-satunya sandbox evolusi neural di sini.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game adalah pertempuran; Neural Particle Life observasional.', s2: 'Vs Pixel Pipeline Reflex', s2p: 'Pixel Pipeline adalah refleks cepat; Neural Particle Life terbuka.', table: [['Opsi', 'Ukuran', 'Sesi', 'Genre', 'Terbaik untuk'], [`<a href="${GAME}">Neural Particle Life</a>`, PAYLOAD, '10-30 menit', 'ALife', 'Evolusi'], [`<a href="${PROC}">Procedural Horde Game</a>`, 'aksi', '10-25 menit', 'Horde', 'Tempur'], [`<a href="${PIXEL}">Pixel Pipeline Reflex</a>`, '~48 KB', '3-10 menit', 'Refleks', 'Routing'], ['ALife desktop', '50+ MB', 'Jam', 'Modeling', 'Riset']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Cara bermain</a>.` },
      de: { title: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex und Desktop-ALife', desc: `Vergleiche Neural Particle Life (${PAYLOAD}) mit anderen Browser-Spielen.`, h1: 'Neural Particle Life vs Procedural Horde Game, Pixel Pipeline Reflex und Desktop-ALife', lead: `Tabelle zum Vergleich von <a href="${GAME}">Neural Particle Life</a> mit anderen Optionen.`, answer: 'Neural Particle Life ist die einzige neuronale Evolutions-Sandbox hier.', s1: 'Vs Procedural Horde Game', s1p: 'Horde Game ist Kampf; Neural Particle Life ist Beobachtung.', s2: 'Vs Pixel Pipeline Reflex', s2p: 'Pixel Pipeline ist schneller Reflex; Neural Particle Life ist offen.', table: [['Option', 'Groesse', 'Sitzung', 'Genre', 'Am besten fuer'], [`<a href="${GAME}">Neural Particle Life</a>`, PAYLOAD, '10-30 Min', 'ALife', 'Evolution'], [`<a href="${PROC}">Procedural Horde Game</a>`, 'Action', '10-25 Min', 'Horde', 'Kampf'], [`<a href="${PIXEL}">Pixel Pipeline Reflex</a>`, '~48 KB', '3-10 Min', 'Reflex', 'Routing'], ['Desktop-ALife', '50+ MB', 'Stunden', 'Modell', 'Forschung']], links: `<a href="{{p}}how-to-play-neural-particle-life.html">Anleitung</a>.` },
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
    "  '/guides/de/cyber-neon-maze-vs-alternatives.html',\n]);",
    `  '/guides/de/cyber-neon-maze-vs-alternatives.html',\n  // game-discovery-loop-runbook fire32 (2026-07-10): neural-particle-life\n${guideRoutes.join('\n')}\n]);`
  );
  siteData = siteData.replace(
    "  '/serpentine-3d.html': '/games/serpentine-3d.html',",
    `  '/serpentine-3d.html': '/games/serpentine-3d.html',\n  '/neural-particle-life.html': '/games/${SLUG}.html',`
  );
  siteData = siteData.replace(
    "  '/games/serpentine-3d.html': 'games/serpentine-3d.jsp',",
    `  '/games/serpentine-3d.html': 'games/serpentine-3d.jsp',\n  '/games/${SLUG}.html': 'games/${SLUG}.jsp',`
  );
  siteData = siteData.replace(
    "  '/guides/de/serpentine-3d-vs-alternatives.html': 'guide/de/serpentine-3d-vs-alternatives.jsp',",
    `  '/guides/de/serpentine-3d-vs-alternatives.html': 'guide/de/serpentine-3d-vs-alternatives.jsp',\n  // game-discovery-loop-runbook fire32 (2026-07-10): neural-particle-life guides\n${jspRoutes.join('\n')}`
  );
  fs.writeFileSync(siteDataPath, siteData);
}

const clustersPath = path.join(ROOT, 'scripts/seo-clusters.mjs');
let clusters = fs.readFileSync(clustersPath, 'utf8');
if (!clusters.includes(SLUG)) {
  clusters = clusters.replace("'/games/serpentine-3d.html']", `'/games/serpentine-3d.html', '/games/${SLUG}.html']`);
  fs.writeFileSync(clustersPath, clusters);
}

const relatedPath = path.join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js');
let related = fs.readFileSync(relatedPath, 'utf8');
if (!related.includes('Neural Particle Life')) {
  related = related.replace(
    '{ title: "Serpentine 3D", url: "https://freetoolonline.com/games/serpentine-3d.html", include: !1, tags: "games" },',
    `{ title: "Serpentine 3D", url: "https://freetoolonline.com/games/serpentine-3d.html", include: !1, tags: "games" },\n    { title: "Neural Particle Life", url: "https://freetoolonline.com/games/${SLUG}.html", include: !1, tags: "games" },`
  );
  fs.writeFileSync(relatedPath, related);
}

const menuPath = path.join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html');
let menu = fs.readFileSync(menuPath, 'utf8');
if (!menu.includes('Neural Particle Life')) {
  menu = menu.replace(
    "<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/serpentine-3d.html'>Serpentine 3D</a>",
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/serpentine-3d.html'>Serpentine 3D</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/${SLUG}.html'>Neural Particle Life</a>`
  );
  fs.writeFileSync(menuPath, menu);
}

const skillDir = path.join(FRONTEND, '.agent/skills/tool-neuralparticlelife');
fs.mkdirSync(skillDir, { recursive: true });
write(path.join(skillDir, 'SKILL.md'), `---
name: tool-neuralparticlelife
description: |
  Ground-truth implementation reference for the /games/${SLUG}.html
  page. Hand-authored 2026-07-10 (game-discovery-loop-runbook fire 32) from the
  adapted neuroparticles engine at static/games/${SLUG}/.
---

# tool-neuralparticlelife - ground-truth reference for /games/${SLUG}.html

## Identity

- **Route**: /games/${SLUG}.html
- **Slug**: \`${SLUG}\` (CMS fragment slug: \`${CMS_SLUG}\`)
- **Cluster**: games
- **Aliases**: \`/neural-particle-life.html\` (ALIAS_ROUTES + CloudFront REDIRECTS)

## Reader task (one sentence)

Watch a free browser artificial-life sandbox where two thousand neural-network agents evolve on a toroidal grid with Start, Stop, and step controls.

## Processing model

**client-side-only** - index.html + 11x11.js + style.css under \`static/games/${SLUG}/\` in a same-origin iframe. Total payload ${PAYLOAD}. Canvas 2D only. No network calls after load.

## License analysis

- Upstream: xcontcom/neuroparticles (MIT, Copyright 2025 Serhii Herasymov). Verified via LICENSE file.
- Shipped mode: 11x11 single-channel simulation only (rgb.js mode excluded).
- Page title **Neural Particle Life**; upstream credited in CREDITS.txt.

## Reader-benefit framing menu

- A1: 2000 agents on a 200x200 toroidal wraparound grid.
- A2: Each agent uses a feedforward neural net (121 inputs, 25 hidden, 9 move outputs).
- A3: Genetic algorithm: fitness = survival time, crossover + mutation across generations.
- A4: Start runs continuous ticks; Stop pauses; One steps a single tick.
- A5: Mutation % and Gens sliders with Recreate to respawn population.
- A6: Generation stats in console-log rows under the canvas.
- A7: Save Genome Pool exports sampled JSON locally; Load Genome Pool imports JSON.
- A8: Zero localStorage and zero server calls during play.
- A9: About ${PAYLOAD} payload (HTML + JS + CSS).
- A10: 11x11 local perception window per agent.

## Anti-claims

- No 3D graphics or WebGL (canvas 2D only).
- No combat horde gameplay (see Procedural Horde Game).
- No reflex arcade routing (see Pixel Pipeline Reflex).
- RGB three-population predator-prey mode not shipped (11x11 mode only).
- Not a commercial franchise clone (original Neuroparticles implementation).

## claim_catalogue_status

verified
`);

await patchCloudFront301({
  frontendRoot: FRONTEND,
  aliasUrl: '/neural-particle-life.html',
  canonicalUrl: GAME,
  runDate: '20260710-neural-particle-life',
});

console.log('fire32 bundle generated for', SLUG);
