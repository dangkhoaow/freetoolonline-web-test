#!/usr/bin/env node
/** Fire38: arrow-dodge-arena route bundle + multilingual guides + site-data patches. */
import fs from 'node:fs';
import path from 'node:path';
import { patchCloudFront301 } from '../../.agent/skills/seo-tool-page-builder/scripts/lib/patch-cloudfront-301.mjs';

const FRONTEND = '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const ROOT = path.join(FRONTEND, 'freetoolonline-web-test');
const CMS = path.join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const SLUG = 'arrow-dodge-arena';
const CMS_SLUG = 'arrowdodgearena';
const GAME = `/games/${SLUG}.html`;
const PIXEL = '/games/pixel-pipeline-reflex.html';
const CHILI = '/games/chili-blast-shooter.html';
const NEON = '/games/neon-surge-loop.html';
const DATE = '2026-07-10';
const PAYLOAD = '~11 KB';

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

write(path.join(CMS, `BODYTITLE${CMS_SLUG}.txt`), 'Arrow Dodge Arena - Free Online 30-Second Reflex Dodge Game\n');
write(path.join(CMS, `BODYDESC${CMS_SLUG}.txt`), `Arrow Dodge Arena - a free browser reflex game: dodge red arrows for 30 seconds, collect blue star power-ups, and chase a local high score. About ${PAYLOAD}, no install.\n`);
write(path.join(CMS, `BODYKW${CMS_SLUG}.txt`), 'arrow dodge game,browser reflex arcade,30 second dodge game,free canvas arcade no install,arrow key dodge online,high score browser game\n');

write(path.join(CMS, `BODYHTML${CMS_SLUG}.html`), `<div class="w3-container">
    <p>Dodge incoming red arrows for 30 seconds, grab blue stars for boosts, and beat your high score. Arrow keys only, no install.</p>
</div>
<div id="adaWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="adaStage" style="position:relative; width:100%; min-height:520px; background:#111; border-radius:6px; overflow:hidden;">
            <div id="adaLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6edf3; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; color:#ff6b6b;">ARROW DODGE ARENA</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#9db0c5;">30-second canvas reflex dodge. Press Play to load about ${PAYLOAD}.</p>
                <button id="adaPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="adaStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="adaFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: Start Game, then arrow keys to move.</span>
    </div>
    <style>#adaStage:fullscreen { border-radius:0; } #adaStage iframe { display:block; width:100%; height:560px; border:0; }</style>
</div>`);

write(path.join(CMS, `BODYJS${CMS_SLUG}.html`), `<script>
    web.localUpload = false;
    var ADA_GAME_URL = 'arrow-dodge-arena/index.html';
    function adaStatus(t){ var el=document.getElementById('adaStatus'); if(el) el.textContent=t; }
    function adaInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='adaFrame'; frame.src=ADA_GAME_URL; frame.title='Arrow Dodge Arena';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ adaStatus('Loaded. Click Start Game inside the frame.'); });
        var launch=document.getElementById('adaLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('adaStage'), playBtn=document.getElementById('adaPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('adaFullscreenBtn');
        playBtn.addEventListener('click',function(){
            adaStatus('Loading about ${PAYLOAD}...'); adaInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);

write(path.join(CMS, `BODYWELCOME${CMS_SLUG}.html`), `<h1 class="text-uppercase"><b>Arrow Dodge Arena</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-10T14:10:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Press Play and a 30-second reflex dodge loads in the tab. Move with arrow keys, avoid red arrows from all four sides, and collect blue stars for score and speed boosts.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page, then Start Game in the iframe</td></tr>
<tr><td>Move</td><td>Arrow keys (Up/Down/Left/Right)</td></tr>
<tr><td>Survive</td><td>30-second timer; dodge enemies, grab stars</td></tr>
<tr><td>Score</td><td>High score saved locally in your browser only</td></tr>
</table>
<p>Adapted from Hamdan Saddique's open-source Arrow Escape Game (MIT). High score key namespaced for this site.</p>`);

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
  return `${faqStyle}<div class="w3-container w3-margin-top"><h1 class="text-uppercase"><b>${t.h1}</b></h1><p>${t.lead}</p><p><time datetime="${DATE}">Last reviewed: ${DATE}</time></p><div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>${t.answer}</b></p></div>${t.s1 ? `<h2><b>${t.s1}</b></h2><p>${t.s1p}</p>` : ''}${t.s2 ? `<h2><b>${t.s2}</b></h2><p>${t.s2p}</p>` : ''}${rows ? `<table class="w3-table w3-bordered w3-small">${rows}</table>` : ''}<p>${t.links}</p><p><a href="/games.html">&larr; Back to games</a></p></div>`;
}

const guides = [
  { slug: 'how-to-play-arrow-dodge-arena', cmsBase: 'howtoplayarrowdodgearena', copy: {
    en: { title: 'How to Play Arrow Dodge Arena - Step by Step', desc: 'Arrow Dodge Arena guide: Play, Start Game, arrow keys, 30s timer.', h1: 'How to Play Arrow Dodge Arena - Step by Step', lead: `<a href="${GAME}">Arrow Dodge Arena</a> loads a ${PAYLOAD} dodge game in an iframe.`, answer: 'Press Play, click Start Game, use arrow keys to move, dodge red arrows for 30 seconds, collect blue stars.', s1: 'Launch', s1p: 'Click Play then Start Game inside the iframe.', s2: 'Controls', s2p: 'Arrow keys move the square player on the canvas.', table: [['Control', 'Input'], ['Move', 'Arrow keys'], ['Timer', '30 seconds'], ['Save', 'Local high score']], links: `<a href="{{p}}arrow-dodge-arena-when.html">When to play</a>.` },
    pt: { title: 'Como Jogar Arrow Dodge Arena', desc: 'Guia Arrow Dodge Arena.', h1: 'Como Jogar Arrow Dodge Arena', lead: `<a href="${GAME}">Arrow Dodge Arena</a> no iframe.`, answer: 'Play, Start Game, setas para mover, desvie por 30 segundos.', s1: 'Inicio', s1p: 'Clique Play e Start Game.', s2: 'Controles', s2p: 'Setas movem o jogador.', table: [['Controle', 'Entrada'], ['Mover', 'Setas'], ['Tempo', '30s'], ['Save', 'Local']], links: `<a href="{{p}}arrow-dodge-arena-when.html">Quando jogar</a>.` },
    es: { title: 'Como Jugar Arrow Dodge Arena', desc: 'Guia Arrow Dodge Arena.', h1: 'Como Jugar Arrow Dodge Arena', lead: `<a href="${GAME}">Arrow Dodge Arena</a> en el iframe.`, answer: 'Play, Start Game, flechas para mover, esquiva 30 segundos.', s1: 'Inicio', s1p: 'Pulsa Play y Start Game.', s2: 'Controles', s2p: 'Flechas mueven al jugador.', table: [['Control', 'Entrada'], ['Mover', 'Flechas'], ['Tiempo', '30s'], ['Guardado', 'Local']], links: `<a href="{{p}}arrow-dodge-arena-when.html">Cuando jugar</a>.` },
    vi: { title: 'Cach choi Arrow Dodge Arena', desc: 'Huong dan Arrow Dodge Arena.', h1: 'Cach choi Arrow Dodge Arena', lead: `<a href="${GAME}">Arrow Dodge Arena</a> trong iframe.`, answer: 'Play, Start Game, phim mui ten, ne 30 giay.', s1: 'Bat dau', s1p: 'Bam Play roi Start Game.', s2: 'Dieu khien', s2p: 'Phim mui ten di chuyen.', table: [['Dieu khien', 'Nhap'], ['Di chuyen', 'Mui ten'], ['Thoi gian', '30s'], ['Luu', 'Local']], links: `<a href="{{p}}arrow-dodge-arena-when.html">Khi nao choi</a>.` },
    id: { title: 'Cara Bermain Arrow Dodge Arena', desc: 'Panduan Arrow Dodge Arena.', h1: 'Cara Bermain Arrow Dodge Arena', lead: `<a href="${GAME}">Arrow Dodge Arena</a> di iframe.`, answer: 'Play, Start Game, tombol panah, hindari 30 detik.', s1: 'Mulai', s1p: 'Klik Play lalu Start Game.', s2: 'Kontrol', s2p: 'Panah menggerakkan pemain.', table: [['Kontrol', 'Input'], ['Gerak', 'Panah'], ['Waktu', '30d'], ['Simpan', 'Lokal']], links: `<a href="{{p}}arrow-dodge-arena-when.html">Kapan bermain</a>.` },
    de: { title: 'Arrow Dodge Arena spielen', desc: 'Anleitung Arrow Dodge Arena.', h1: 'Arrow Dodge Arena spielen', lead: `<a href="${GAME}">Arrow Dodge Arena</a> im iframe.`, answer: 'Play, Start Game, Pfeiltasten, 30 Sekunden ausweichen.', s1: 'Start', s1p: 'Play klicken, dann Start Game.', s2: 'Steuerung', s2p: 'Pfeiltasten bewegen den Spieler.', table: [['Steuerung', 'Eingabe'], ['Bewegen', 'Pfeile'], ['Zeit', '30s'], ['Speicher', 'Lokal']], links: `<a href="{{p}}arrow-dodge-arena-when.html">Wann spielen</a>.` },
  }},
  { slug: 'arrow-dodge-arena-when', cmsBase: 'arrowdodgearenawhen', copy: {
    en: { title: 'When to Play Arrow Dodge Arena', desc: 'When a quick dodge reflex game fits.', h1: 'When to Play Arrow Dodge Arena', lead: `Choose <a href="${GAME}">Arrow Dodge Arena</a> for a 30-second keyboard reflex burst.`, answer: 'Best for a short break or warming up before longer arcade games.', s1: 'Good fit', s1p: 'You want arrow-key dodge with a visible timer and local high score.', s2: 'Skip when', s2p: 'You need mouse-steer survivors - try <a href="${NEON}">Neon Surge Loop</a>.', table: [['Scenario', 'Fit'], ['Session', '30-60 sec'], ['Input', 'Arrow keys']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">How to play</a>.` },
    pt: { title: 'Quando Jogar Arrow Dodge Arena', desc: 'Quando jogar dodge rapido.', h1: 'Quando Jogar Arrow Dodge Arena', lead: `<a href="${GAME}">Arrow Dodge Arena</a> para reflexo rapido.`, answer: 'Ideal para pausas curtas.', s1: 'Bom para', s1p: 'Dodge com timer de 30s.', s2: 'Evite se', s2p: 'Precisa de mouse-steer.', table: [['Cenario', 'Valor'], ['Sessao', '30-60s'], ['Entrada', 'Setas']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Como jogar</a>.` },
    es: { title: 'Cuando Jugar Arrow Dodge Arena', desc: 'Cuando jugar dodge rapido.', h1: 'Cuando Jugar Arrow Dodge Arena', lead: `<a href="${GAME}">Arrow Dodge Arena</a> para reflejos rapidos.`, answer: 'Mejor para descansos cortos.', s1: 'Buen caso', s1p: 'Dodge con temporizador de 30s.', s2: 'Evita si', s2p: 'Necesitas raton.', table: [['Escenario', 'Valor'], ['Sesion', '30-60s'], ['Entrada', 'Flechas']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Como jugar</a>.` },
    vi: { title: 'Khi nao choi Arrow Dodge Arena', desc: 'Khi nao choi dodge nhanh.', h1: 'Khi nao choi Arrow Dodge Arena', lead: `<a href="${GAME}">Arrow Dodge Arena</a> cho phan xa nhanh.`, answer: 'Tot cho phien ngan.', s1: 'Phu hop', s1p: 'Dodge 30 giay.', s2: 'Khong phu hop', s2p: 'Can dieu khien chuot.', table: [['Tinh huong', 'Gia tri'], ['Phien', '30-60s'], ['Vao', 'Mui ten']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Huong dan</a>.` },
    id: { title: 'Kapan Memainkan Arrow Dodge Arena', desc: 'Kapan main dodge cepat.', h1: 'Kapan Memainkan Arrow Dodge Arena', lead: `<a href="${GAME}">Arrow Dodge Arena</a> untuk refleks cepat.`, answer: 'Cocok untuk istirahat singkat.', s1: 'Cocok', s1p: 'Dodge 30 detik.', s2: 'Lewati jika', s2p: 'Butuh mouse.', table: [['Skenario', 'Nilai'], ['Sesi', '30-60d'], ['Input', 'Panah']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Cara bermain</a>.` },
    de: { title: 'Wann Arrow Dodge Arena spielen', desc: 'Wann kurzes Dodge passt.', h1: 'Wann Arrow Dodge Arena spielen', lead: `<a href="${GAME}">Arrow Dodge Arena</a> fuer schnellen Reflex.`, answer: 'Gut fuer kurze Pausen.', s1: 'Passt wenn', s1p: '30-Sekunden-Dodge mit Highscore.', s2: 'Nicht wenn', s2p: 'Maus-Steuerung noetig.', table: [['Szenario', 'Wert'], ['Sitzung', '30-60s'], ['Eingabe', 'Pfeile']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Anleitung</a>.` },
  }},
  { slug: 'arrow-dodge-arena-vs-alternatives', cmsBase: 'arrowdodgearenavsalternatives', copy: {
    en: { title: 'Arrow Dodge Arena vs Pixel Pipeline Reflex and Chili Blast Shooter', desc: 'Compare arrow dodge with other reflex games.', h1: 'Arrow Dodge Arena vs Pixel Pipeline Reflex and Chili Blast Shooter', lead: `Compare <a href="${GAME}">Arrow Dodge Arena</a> with other quick browser reflex titles.`, answer: 'Arrow Dodge Arena is the shortest timed keyboard dodge here. Pixel Pipeline Reflex is scanline routing reflex. Chili Blast Shooter is a longer WASD survivor.', s1: 'Vs Pixel Pipeline', s1p: 'Pixel Pipeline is packet routing before a scan beam; Arrow Dodge is open-field enemy dodge.', s2: 'Vs Chili Blast', s2p: 'Chili Blast runs longer survivor waves with WASD; Arrow Dodge is a fixed 30-second sprint.', table: [['Game', 'Session', 'Controls'], [`<a href="${GAME}">Arrow Dodge Arena</a>`, '30s', 'Arrow keys'], [`<a href="${PIXEL}">Pixel Pipeline Reflex</a>`, '3-10 min', 'Click/tap route'], [`<a href="${CHILI}">Chili Blast Shooter</a>`, '1-5 min', 'WASD']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">How to play</a>.` },
    pt: { title: 'Arrow Dodge Arena vs Pixel Pipeline e Chili Blast', desc: 'Compare jogos de reflexo.', h1: 'Arrow Dodge Arena vs Pixel Pipeline e Chili Blast', lead: `Compare <a href="${GAME}">Arrow Dodge Arena</a>.`, answer: 'Arrow Dodge e o dodge mais curto com teclado.', s1: 'Vs Pixel', s1p: 'Pixel Pipeline e roteamento reflex.', s2: 'Vs Chili', s2p: 'Chili Blast e survivor WASD.', table: [['Jogo', 'Sessao', 'Controles'], [`<a href="${GAME}">Arrow Dodge Arena</a>`, '30s', 'Setas'], [`<a href="${PIXEL}">Pixel Pipeline</a>`, '3-10 min', 'Clique'], [`<a href="${CHILI}">Chili Blast</a>`, '1-5 min', 'WASD']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Como jogar</a>.` },
    es: { title: 'Arrow Dodge Arena vs Pixel Pipeline y Chili Blast', desc: 'Compara juegos de reflejo.', h1: 'Arrow Dodge Arena vs Pixel Pipeline y Chili Blast', lead: `Compara <a href="${GAME}">Arrow Dodge Arena</a>.`, answer: 'Arrow Dodge es el dodge mas corto con teclado.', s1: 'Vs Pixel', s1p: 'Pixel Pipeline es routing reflex.', s2: 'Vs Chili', s2p: 'Chili Blast es survivor WASD.', table: [['Juego', 'Sesion', 'Controles'], [`<a href="${GAME}">Arrow Dodge Arena</a>`, '30s', 'Flechas'], [`<a href="${PIXEL}">Pixel Pipeline</a>`, '3-10 min', 'Clic'], [`<a href="${CHILI}">Chili Blast</a>`, '1-5 min', 'WASD']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Como jugar</a>.` },
    vi: { title: 'Arrow Dodge Arena so voi Pixel Pipeline va Chili Blast', desc: 'So sanh game phan xa.', h1: 'Arrow Dodge Arena so voi Pixel Pipeline va Chili Blast', lead: `So sanh <a href="${GAME}">Arrow Dodge Arena</a>.`, answer: 'Arrow Dodge la dodge ngan nhat.', s1: 'Vs Pixel', s1p: 'Pixel Pipeline la routing.', s2: 'Vs Chili', s2p: 'Chili Blast la WASD survivor.', table: [['Game', 'Phien', 'Dieu khien'], [`<a href="${GAME}">Arrow Dodge Arena</a>`, '30s', 'Mui ten'], [`<a href="${PIXEL}">Pixel Pipeline</a>`, '3-10 phut', 'Click'], [`<a href="${CHILI}">Chili Blast</a>`, '1-5 phut', 'WASD']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Huong dan</a>.` },
    id: { title: 'Arrow Dodge Arena vs Pixel Pipeline dan Chili Blast', desc: 'Bandingkan game refleks.', h1: 'Arrow Dodge Arena vs Pixel Pipeline dan Chili Blast', lead: `Bandingkan <a href="${GAME}">Arrow Dodge Arena</a>.`, answer: 'Arrow Dodge adalah dodge terpendek.', s1: 'Vs Pixel', s1p: 'Pixel Pipeline routing reflex.', s2: 'Vs Chili', s2p: 'Chili Blast survivor WASD.', table: [['Game', 'Sesi', 'Kontrol'], [`<a href="${GAME}">Arrow Dodge Arena</a>`, '30d', 'Panah'], [`<a href="${PIXEL}">Pixel Pipeline</a>`, '3-10 mnt', 'Klik'], [`<a href="${CHILI}">Chili Blast</a>`, '1-5 mnt', 'WASD']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Cara bermain</a>.` },
    de: { title: 'Arrow Dodge Arena vs Pixel Pipeline und Chili Blast', desc: 'Vergleiche Reflex-Spiele.', h1: 'Arrow Dodge Arena vs Pixel Pipeline und Chili Blast', lead: `Vergleiche <a href="${GAME}">Arrow Dodge Arena</a>.`, answer: 'Arrow Dodge ist das kuerzeste Tastatur-Dodge.', s1: 'Vs Pixel', s1p: 'Pixel Pipeline ist Routing-Reflex.', s2: 'Vs Chili', s2p: 'Chili Blast ist WASD-Survivor.', table: [['Spiel', 'Sitzung', 'Steuerung'], [`<a href="${GAME}">Arrow Dodge Arena</a>`, '30s', 'Pfeile'], [`<a href="${PIXEL}">Pixel Pipeline</a>`, '3-10 Min', 'Klick'], [`<a href="${CHILI}">Chili Blast</a>`, '1-5 Min', 'WASD']], links: `<a href="{{p}}how-to-play-arrow-dodge-arena.html">Anleitung</a>.` },
  }},
];

const jspTpl = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page browserTitle='\${pageBodyTitle}' description='\${pageBodyDesc}'>
\t<freetoolonline:loading/>
\t\${pageBodyHTML}
</freetoolonline:page>
`;

const guideRoutes = [];
const jspRoutes = [];
for (const g of guides) {
  for (const lang of ['en', 'pt', 'es', 'vi', 'id', 'de']) {
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
    "  '/guides/de/neon-surge-loop-vs-alternatives.html',\n]);",
    `  '/guides/de/neon-surge-loop-vs-alternatives.html',\n  // fire38 arrow-dodge-arena\n${guideRoutes.join('\n')}\n]);`
  );
  siteData = siteData.replace(
    "  '/neon-surge-loop.html': '/games/neon-surge-loop.html',",
    `  '/neon-surge-loop.html': '/games/neon-surge-loop.html',\n  '/arrow-dodge-arena.html': '/games/${SLUG}.html',`
  );
  siteData = siteData.replace(
    "  '/games/neon-surge-loop.html': 'games/neon-surge-loop.jsp',",
    `  '/games/neon-surge-loop.html': 'games/neon-surge-loop.jsp',\n  '/games/${SLUG}.html': 'games/${SLUG}.jsp',`
  );
  siteData = siteData.replace(
    "  '/guides/de/neon-surge-loop-vs-alternatives.html': 'guide/de/neon-surge-loop-vs-alternatives.jsp',",
    `  '/guides/de/neon-surge-loop-vs-alternatives.html': 'guide/de/neon-surge-loop-vs-alternatives.jsp',\n  // fire38 arrow-dodge-arena guides\n${jspRoutes.join('\n')}`
  );
  fs.writeFileSync(siteDataPath, siteData);
}

let clusters = fs.readFileSync(path.join(ROOT, 'scripts/seo-clusters.mjs'), 'utf8');
if (!clusters.includes(SLUG)) {
  clusters = clusters.replace("'/games/neon-surge-loop.html']", `'/games/neon-surge-loop.html', '/games/${SLUG}.html']`);
  fs.writeFileSync(path.join(ROOT, 'scripts/seo-clusters.mjs'), clusters);
}

let related = fs.readFileSync(path.join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'), 'utf8');
if (!related.includes('Arrow Dodge Arena')) {
  related = related.replace(
    '{ title: "Neon Surge Loop", url: "https://freetoolonline.com/games/neon-surge-loop.html", include: !1, tags: "games" },',
    `{ title: "Neon Surge Loop", url: "https://freetoolonline.com/games/neon-surge-loop.html", include: !1, tags: "games" },\n    { title: "Arrow Dodge Arena", url: "https://freetoolonline.com/games/${SLUG}.html", include: !1, tags: "games" },`
  );
  fs.writeFileSync(path.join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'), related);
}

let menu = fs.readFileSync(path.join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'), 'utf8');
if (!menu.includes('Arrow Dodge Arena')) {
  menu = menu.replace(
    "<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/neon-surge-loop.html'>Neon Surge Loop</a>",
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/neon-surge-loop.html'>Neon Surge Loop</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/${SLUG}.html'>Arrow Dodge Arena</a>`
  );
  fs.writeFileSync(path.join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'), menu);
}

const skillDir = path.join(FRONTEND, '.agent/skills/tool-arrowdodgearena');
fs.mkdirSync(skillDir, { recursive: true });
write(path.join(skillDir, 'SKILL.md'), `---
name: tool-arrowdodgearena
description: Ground-truth for /games/${SLUG}.html (fire38, Hamdan-Saddique-ai/Arrow-Escape-Game MIT).
---

# tool-arrowdodgearena

## Identity
- Route: /games/${SLUG}.html
- Slug: \`${SLUG}\` (CMS: \`${CMS_SLUG}\`)
- Aliases: /arrow-dodge-arena.html

## Reader task
Dodge red arrows for 30 seconds in a free browser reflex game with arrow-key movement and local high score.

## Processing model
client-side-only - index.html + game.js + style.css in static/games/${SLUG}/ iframe. ${PAYLOAD}. Canvas 2D.

## Reader-benefit framing menu
- A1: Arrow keys move the player square on an 800x500 canvas.
- A2: Red arrow enemies spawn from four screen edges toward random directions.
- A3: 30-second countdown timer per run.
- A4: Blue star power-ups grant score and speed boosts when collected.
- A5: Collision with red arrows ends the run early.
- A6: Start Game button begins a run; score HUD updates live.
- A7: High score persisted in localStorage key ftol:arrowdodgearena:hs.
- A8: Zero CDN and zero network calls after load.

## Anti-claims
- No mouse or touch movement (arrow keys only).
- No multiplayer or cloud saves.
- Not a Pac-Man or commercial arcade clone.

## claim_catalogue_status
verified
`);

await patchCloudFront301({ frontendRoot: FRONTEND, aliasUrl: '/arrow-dodge-arena.html', canonicalUrl: GAME, runDate: '20260710-arrow-dodge-arena' });
console.log('fire38 bundle generated for', SLUG);
