#!/usr/bin/env node
/** Fire46: andromeda-star-shooter route bundle + multilingual guides + site-data patches. */
import fs from 'node:fs';
import path from 'node:path';
import { patchCloudFront301 } from '../../.agent/skills/seo-tool-page-builder/scripts/lib/patch-cloudfront-301.mjs';

const FRONTEND = '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const ROOT = path.join(FRONTEND, 'freetoolonline-web-test');
const CMS = path.join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAMES = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = path.join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const SLUG = 'andromeda-star-shooter';
const CMS_SLUG = 'andromedastarshooter';
const GAME = `/games/${SLUG}.html`;
const RETRO = '/games/retro-arcade-shooter.html';
const ARROW = '/games/arrow-dodge-arena.html';
const CHILI = '/games/chili-blast-shooter.html';
const DATE = '2026-07-10';
const PAYLOAD = '~45 KB';

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

write(path.join(CMS, `BODYTITLE${CMS_SLUG}.txt`), 'Andromeda Star Shooter - Free Online Pixel Canvas Shooter Game\n');
write(path.join(CMS, `BODYDESC${CMS_SLUG}.txt`), `Andromeda Star Shooter - a free browser fixed-shooter: move left/right, fire pulses, clear descending ships, and climb levels. About ${PAYLOAD}, no install.\n`);
write(path.join(CMS, `BODYKW${CMS_SLUG}.txt`), 'canvas shooter game,browser space shooter,pixel arcade shooter,free invaders style game,keyboard shooter online,procedural audio game\n');

write(path.join(CMS, `BODYHTML${CMS_SLUG}.html`), `<div class="w3-container">
    <p>Move left and right, fire pulses at descending ships, and survive escalating levels. Keyboard or on-screen buttons, no install.</p>
</div>
<div id="amsWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="amsStage" style="position:relative; width:100%; min-height:520px; background:#111; border-radius:6px; overflow:hidden;">
            <div id="amsLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6edf3; padding:16px;">
                <div style="font:700 22px system-ui,sans-serif; color:#7ec8ff;">ANDROMEDA STAR SHOOTER</div>
                <p style="font-size:14px; max-width:560px; margin:10px 0 14px 0; color:#9db0c5;">Pixel canvas fixed-shooter. Press Play to load about ${PAYLOAD}.</p>
                <button id="amsPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
            </div>
        </div>
        <div id="amsStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px;">Press Play to start.</div>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="amsFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Inside the frame: click Play/Pause, then arrow keys or buttons to move.</span>
    </div>
    <style>#amsStage:fullscreen { border-radius:0; } #amsStage iframe { display:block; width:100%; height:560px; border:0; }</style>
</div>`);

write(path.join(CMS, `BODYJS${CMS_SLUG}.html`), `<script>
    web.localUpload = false;
    var AMS_GAME_URL = 'andromeda-star-shooter/index.html';
    function amsStatus(t){ var el=document.getElementById('amsStatus'); if(el) el.textContent=t; }
    function amsInjectFrame(stage){
        var frame=document.createElement('iframe');
        frame.id='amsFrame'; frame.src=AMS_GAME_URL; frame.title='Andromeda Star Shooter';
        frame.setAttribute('allow','fullscreen'); frame.setAttribute('allowfullscreen','');
        frame.addEventListener('load',function(){ amsStatus('Loaded. Click Play/Pause inside the frame to start.'); });
        var launch=document.getElementById('amsLaunch');
        if(launch&&launch.parentNode===stage) stage.removeChild(launch);
        stage.appendChild(frame);
    }
    function doAfterPageRendered(){
        var stage=document.getElementById('amsStage'), playBtn=document.getElementById('amsPlayBtn');
        if(!stage||!playBtn) return;
        var fsBtn=document.getElementById('amsFullscreenBtn');
        playBtn.addEventListener('click',function(){
            amsStatus('Loading about ${PAYLOAD}...'); amsInjectFrame(stage);
            if(fsBtn) fsBtn.disabled=false;
        });
        if(fsBtn) fsBtn.addEventListener('click',function(){
            if(stage.requestFullscreen) stage.requestFullscreen();
            else if(stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
        });
    }
</script>`);

write(path.join(CMS, `BODYWELCOME${CMS_SLUG}.html`), `<h1 class="text-uppercase"><b>Andromeda Star Shooter</b></h1>
<time itemprop="dateUpdated" datetime="2026-07-10T15:15:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Press Play and a pixel canvas shooter loads in the tab. Move with arrow keys or on-screen buttons, fire with Enter or Space, and clear descending enemy ships before they reach the bottom.</p>
<table class="w3-table w3-bordered w3-small" style="max-width:520px;">
<tr><th>Step</th><th>Action</th></tr>
<tr><td>Launch</td><td>Play on this page, then Play/Pause in the iframe</td></tr>
<tr><td>Move</td><td>Left/Right arrow keys or on-screen arrows</td></tr>
<tr><td>Fire</td><td>Enter or Space (pulse weapon)</td></tr>
<tr><td>Pause</td><td>Play/Pause button or P key</td></tr>
</table>
<p>Adapted from Susam Pal's open-source Andromeda Invaders (MIT). Procedural Web Audio only; no score persistence in this build.</p>`);

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
  { slug: 'how-to-play-andromeda-star-shooter', cmsBase: 'howtoplayandromedastarshooter', copy: {
    en: { title: 'How to Play Andromeda Star Shooter - Step by Step', desc: 'Andromeda Star Shooter guide: Play, pause, move, fire pulses.', h1: 'How to Play Andromeda Star Shooter - Step by Step', lead: `<a href="${GAME}">Andromeda Star Shooter</a> loads a ${PAYLOAD} canvas shooter in an iframe.`, answer: 'Press Play, click Play/Pause in the iframe, move with arrows, fire with Enter or Space.', s1: 'Launch', s1p: 'Click Play on this page, then Play/Pause inside the iframe.', s2: 'Controls', s2p: 'Left/Right arrows move; Enter or Space fires a pulse; P pauses.', table: [['Control', 'Input'], ['Move', 'Arrow keys or buttons'], ['Fire', 'Enter / Space'], ['Pause', 'P or Play/Pause button']], links: `<a href="{{p}}andromeda-star-shooter-when.html">When to play</a>.` },
    pt: { title: 'Como Jogar Andromeda Star Shooter', desc: 'Guia Andromeda Star Shooter.', h1: 'Como Jogar Andromeda Star Shooter', lead: `<a href="${GAME}">Andromeda Star Shooter</a> no iframe.`, answer: 'Play, Play/Pause, setas para mover, Enter ou Espaco para atirar.', s1: 'Inicio', s1p: 'Clique Play e depois Play/Pause.', s2: 'Controles', s2p: 'Setas movem; Enter/Espaco dispara.', table: [['Controle', 'Entrada'], ['Mover', 'Setas'], ['Atirar', 'Enter/Espaco'], ['Pausa', 'P']], links: `<a href="{{p}}andromeda-star-shooter-when.html">Quando jogar</a>.` },
    es: { title: 'Como Jugar Andromeda Star Shooter', desc: 'Guia Andromeda Star Shooter.', h1: 'Como Jugar Andromeda Star Shooter', lead: `<a href="${GAME}">Andromeda Star Shooter</a> en el iframe.`, answer: 'Play, Play/Pause, flechas para mover, Enter o Espacio para disparar.', s1: 'Inicio', s1p: 'Pulsa Play y luego Play/Pause.', s2: 'Controles', s2p: 'Flechas mueven; Enter/Espacio dispara.', table: [['Control', 'Entrada'], ['Mover', 'Flechas'], ['Disparar', 'Enter/Espacio'], ['Pausa', 'P']], links: `<a href="{{p}}andromeda-star-shooter-when.html">Cuando jugar</a>.` },
    vi: { title: 'Cach choi Andromeda Star Shooter', desc: 'Huong dan Andromeda Star Shooter.', h1: 'Cach choi Andromeda Star Shooter', lead: `<a href="${GAME}">Andromeda Star Shooter</a> trong iframe.`, answer: 'Play, Play/Pause, mui ten di chuyen, Enter hoac Space ban.', s1: 'Bat dau', s1p: 'Bam Play roi Play/Pause.', s2: 'Dieu khien', s2p: 'Mui ten di chuyen; Enter/Space ban.', table: [['Dieu khien', 'Nhap'], ['Di chuyen', 'Mui ten'], ['Ban', 'Enter/Space'], ['Pause', 'P']], links: `<a href="{{p}}andromeda-star-shooter-when.html">Khi nao choi</a>.` },
    id: { title: 'Cara Bermain Andromeda Star Shooter', desc: 'Panduan Andromeda Star Shooter.', h1: 'Cara Bermain Andromeda Star Shooter', lead: `<a href="${GAME}">Andromeda Star Shooter</a> di iframe.`, answer: 'Play, Play/Pause, panah untuk bergerak, Enter atau Spasi untuk menembak.', s1: 'Mulai', s1p: 'Klik Play lalu Play/Pause.', s2: 'Kontrol', s2p: 'Panah bergerak; Enter/Spasi menembak.', table: [['Kontrol', 'Input'], ['Gerak', 'Panah'], ['Tembak', 'Enter/Spasi'], ['Jeda', 'P']], links: `<a href="{{p}}andromeda-star-shooter-when.html">Kapan bermain</a>.` },
    de: { title: 'Andromeda Star Shooter spielen', desc: 'Anleitung Andromeda Star Shooter.', h1: 'Andromeda Star Shooter spielen', lead: `<a href="${GAME}">Andromeda Star Shooter</a> im iframe.`, answer: 'Play, Play/Pause, Pfeile bewegen, Enter oder Leertaste schiesst.', s1: 'Start', s1p: 'Play klicken, dann Play/Pause im iframe.', s2: 'Steuerung', s2p: 'Pfeile bewegen; Enter/Leertaste feuert.', table: [['Steuerung', 'Eingabe'], ['Bewegen', 'Pfeile'], ['Feuer', 'Enter/Leertaste'], ['Pause', 'P']], links: `<a href="{{p}}andromeda-star-shooter-when.html">Wann spielen</a>.` },
  }},
  { slug: 'andromeda-star-shooter-when', cmsBase: 'andromedastarshooterwhen', copy: {
    en: { title: 'When to Play Andromeda Star Shooter', desc: 'When a classic canvas shooter fits.', h1: 'When to Play Andromeda Star Shooter', lead: `Choose <a href="${GAME}">Andromeda Star Shooter</a> for a keyboard fixed-shooter session.`, answer: 'Best when you want a short retro shooter with levels and procedural audio.', s1: 'Good fit', s1p: 'You like left-right shooters with pulse weapons and escalating levels.', s2: 'Skip when', s2p: 'You want twin-stick survivors - try <a href="${CHILI}">Chili Blast Shooter</a>.', table: [['Scenario', 'Fit'], ['Session', '3-15 min'], ['Input', 'Keyboard']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">How to play</a>.` },
    pt: { title: 'Quando Jogar Andromeda Star Shooter', desc: 'Quando jogar shooter canvas.', h1: 'Quando Jogar Andromeda Star Shooter', lead: `<a href="${GAME}">Andromeda Star Shooter</a> para shooter classico.`, answer: 'Ideal para sessoes retro curtas.', s1: 'Bom para', s1p: 'Shooter fixo com niveis.', s2: 'Evite se', s2p: 'Quer survivor WASD.', table: [['Cenario', 'Valor'], ['Sessao', '3-15 min'], ['Entrada', 'Teclado']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Como jogar</a>.` },
    es: { title: 'Cuando Jugar Andromeda Star Shooter', desc: 'Cuando jugar shooter canvas.', h1: 'Cuando Jugar Andromeda Star Shooter', lead: `<a href="${GAME}">Andromeda Star Shooter</a> para shooter clasico.`, answer: 'Mejor para sesiones retro cortas.', s1: 'Buen caso', s1p: 'Shooter fijo con niveles.', s2: 'Evita si', s2p: 'Quieres survivor WASD.', table: [['Escenario', 'Valor'], ['Sesion', '3-15 min'], ['Entrada', 'Teclado']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Como jugar</a>.` },
    vi: { title: 'Khi nao choi Andromeda Star Shooter', desc: 'Khi nao choi shooter canvas.', h1: 'Khi nao choi Andromeda Star Shooter', lead: `<a href="${GAME}">Andromeda Star Shooter</a> cho shooter co dien.`, answer: 'Tot cho phien retro ngan.', s1: 'Phu hop', s1p: 'Shooter co level.', s2: 'Khong phu hop', s2p: 'Can survivor WASD.', table: [['Tinh huong', 'Gia tri'], ['Phien', '3-15 phut'], ['Vao', 'Ban phim']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Huong dan</a>.` },
    id: { title: 'Kapan Memainkan Andromeda Star Shooter', desc: 'Kapan main shooter canvas.', h1: 'Kapan Memainkan Andromeda Star Shooter', lead: `<a href="${GAME}">Andromeda Star Shooter</a> untuk shooter klasik.`, answer: 'Cocok untuk sesi retro singkat.', s1: 'Cocok', s1p: 'Shooter tetap dengan level.', s2: 'Lewati jika', s2p: 'Butuh survivor WASD.', table: [['Skenario', 'Nilai'], ['Sesi', '3-15 mnt'], ['Input', 'Keyboard']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Cara bermain</a>.` },
    de: { title: 'Wann Andromeda Star Shooter spielen', desc: 'Wann Canvas-Shooter passt.', h1: 'Wann Andromeda Star Shooter spielen', lead: `<a href="${GAME}">Andromeda Star Shooter</a> fuer klassischen Shooter.`, answer: 'Gut fuer kurze Retro-Sessions.', s1: 'Passt wenn', s1p: 'Fixer Shooter mit Leveln.', s2: 'Nicht wenn', s2p: 'WASD-Survivor noetig.', table: [['Szenario', 'Wert'], ['Sitzung', '3-15 Min'], ['Eingabe', 'Tastatur']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Anleitung</a>.` },
  }},
  { slug: 'andromeda-star-shooter-vs-alternatives', cmsBase: 'andromedastarshootervsalternatives', copy: {
    en: { title: 'Andromeda Star Shooter vs Retro Arcade Shooter and Arrow Dodge Arena', desc: 'Compare canvas shooters on this site.', h1: 'Andromeda Star Shooter vs Retro Arcade Shooter and Arrow Dodge Arena', lead: `Compare <a href="${GAME}">Andromeda Star Shooter</a> with other browser shooters here.`, answer: 'Andromeda Star Shooter is a fixed bottom-shooter with levels. Retro Arcade Shooter is a WebGL tunnel shooter. Arrow Dodge Arena is a 30-second dodge reflex game.', s1: 'Vs Retro Arcade', s1p: 'Retro Arcade Shooter uses WebGL tunnel flight; Andromeda is 2D canvas fixed-shooter.', s2: 'Vs Arrow Dodge', s2p: 'Arrow Dodge Arena is timed dodge only; Andromeda has shooting and levels.', table: [['Game', 'Style', 'Controls'], [`<a href="${GAME}">Andromeda Star Shooter</a>`, 'Fixed shooter', 'Arrows + fire'], [`<a href="${RETRO}">Retro Arcade Shooter</a>`, 'WebGL tunnel', 'Keyboard flight'], [`<a href="${ARROW}">Arrow Dodge Arena</a>`, 'Dodge reflex', 'Arrow keys']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">How to play</a>.` },
    pt: { title: 'Andromeda Star Shooter vs Retro Arcade e Arrow Dodge', desc: 'Compare shooters.', h1: 'Andromeda Star Shooter vs Retro Arcade e Arrow Dodge', lead: `Compare <a href="${GAME}">Andromeda Star Shooter</a>.`, answer: 'Andromeda e shooter fixo 2D; Retro Arcade e WebGL; Arrow Dodge e dodge 30s.', s1: 'Vs Retro', s1p: 'Retro Arcade usa WebGL.', s2: 'Vs Arrow', s2p: 'Arrow Dodge e dodge sem tiro.', table: [['Jogo', 'Estilo', 'Controles'], [`<a href="${GAME}">Andromeda</a>`, 'Shooter fixo', 'Setas'], [`<a href="${RETRO}">Retro Arcade</a>`, 'WebGL', 'Teclado'], [`<a href="${ARROW}">Arrow Dodge</a>`, 'Dodge', 'Setas']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Como jogar</a>.` },
    es: { title: 'Andromeda Star Shooter vs Retro Arcade y Arrow Dodge', desc: 'Compara shooters.', h1: 'Andromeda Star Shooter vs Retro Arcade y Arrow Dodge', lead: `Compara <a href="${GAME}">Andromeda Star Shooter</a>.`, answer: 'Andromeda es shooter fijo 2D; Retro Arcade es WebGL; Arrow Dodge es dodge 30s.', s1: 'Vs Retro', s1p: 'Retro Arcade usa WebGL.', s2: 'Vs Arrow', s2p: 'Arrow Dodge es dodge sin disparos.', table: [['Juego', 'Estilo', 'Controles'], [`<a href="${GAME}">Andromeda</a>`, 'Shooter fijo', 'Flechas'], [`<a href="${RETRO}">Retro Arcade</a>`, 'WebGL', 'Teclado'], [`<a href="${ARROW}">Arrow Dodge</a>`, 'Dodge', 'Flechas']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Como jugar</a>.` },
    vi: { title: 'Andromeda Star Shooter so voi Retro Arcade va Arrow Dodge', desc: 'So sanh shooter.', h1: 'Andromeda Star Shooter so voi Retro Arcade va Arrow Dodge', lead: `So sanh <a href="${GAME}">Andromeda Star Shooter</a>.`, answer: 'Andromeda la shooter 2D co dinh; Retro Arcade la WebGL; Arrow Dodge la dodge 30s.', s1: 'Vs Retro', s1p: 'Retro Arcade dung WebGL.', s2: 'Vs Arrow', s2p: 'Arrow Dodge chi ne tranh.', table: [['Game', 'Kieu', 'Dieu khien'], [`<a href="${GAME}">Andromeda</a>`, 'Shooter co dinh', 'Mui ten'], [`<a href="${RETRO}">Retro Arcade</a>`, 'WebGL', 'Ban phim'], [`<a href="${ARROW}">Arrow Dodge</a>`, 'Dodge', 'Mui ten']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Huong dan</a>.` },
    id: { title: 'Andromeda Star Shooter vs Retro Arcade dan Arrow Dodge', desc: 'Bandingkan shooter.', h1: 'Andromeda Star Shooter vs Retro Arcade dan Arrow Dodge', lead: `Bandingkan <a href="${GAME}">Andromeda Star Shooter</a>.`, answer: 'Andromeda shooter 2D tetap; Retro Arcade WebGL; Arrow Dodge dodge 30d.', s1: 'Vs Retro', s1p: 'Retro Arcade pakai WebGL.', s2: 'Vs Arrow', s2p: 'Arrow Dodge hanya menghindar.', table: [['Game', 'Gaya', 'Kontrol'], [`<a href="${GAME}">Andromeda</a>`, 'Shooter tetap', 'Panah'], [`<a href="${RETRO}">Retro Arcade</a>`, 'WebGL', 'Keyboard'], [`<a href="${ARROW}">Arrow Dodge</a>`, 'Dodge', 'Panah']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Cara bermain</a>.` },
    de: { title: 'Andromeda Star Shooter vs Retro Arcade und Arrow Dodge', desc: 'Vergleiche Shooter.', h1: 'Andromeda Star Shooter vs Retro Arcade und Arrow Dodge', lead: `Vergleiche <a href="${GAME}">Andromeda Star Shooter</a>.`, answer: 'Andromeda ist 2D-Fix-Shooter; Retro Arcade WebGL; Arrow Dodge 30s Dodge.', s1: 'Vs Retro', s1p: 'Retro Arcade nutzt WebGL.', s2: 'Vs Arrow', s2p: 'Arrow Dodge nur Ausweichen.', table: [['Spiel', 'Stil', 'Steuerung'], [`<a href="${GAME}">Andromeda</a>`, 'Fix-Shooter', 'Pfeile'], [`<a href="${RETRO}">Retro Arcade</a>`, 'WebGL', 'Tastatur'], [`<a href="${ARROW}">Arrow Dodge</a>`, 'Dodge', 'Pfeile']], links: `<a href="{{p}}how-to-play-andromeda-star-shooter.html">Anleitung</a>.` },
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
    "  '/guides/de/arrow-dodge-arena-vs-alternatives.html',\n]);",
    `  '/guides/de/arrow-dodge-arena-vs-alternatives.html',\n  // fire46 andromeda-star-shooter\n${guideRoutes.join('\n')}\n]);`
  );
  siteData = siteData.replace(
    "  '/arrow-dodge-arena.html': '/games/arrow-dodge-arena.html',",
    `  '/arrow-dodge-arena.html': '/games/arrow-dodge-arena.html',\n  '/andromeda-star-shooter.html': '/games/${SLUG}.html',`
  );
  siteData = siteData.replace(
    "  '/games/arrow-dodge-arena.html': 'games/arrow-dodge-arena.jsp',",
    `  '/games/arrow-dodge-arena.html': 'games/arrow-dodge-arena.jsp',\n  '/games/${SLUG}.html': 'games/${SLUG}.jsp',`
  );
  siteData = siteData.replace(
    "  '/guides/de/arrow-dodge-arena-vs-alternatives.html': 'guide/de/arrow-dodge-arena-vs-alternatives.jsp',",
    `  '/guides/de/arrow-dodge-arena-vs-alternatives.html': 'guide/de/arrow-dodge-arena-vs-alternatives.jsp',\n  // fire46 andromeda-star-shooter guides\n${jspRoutes.join('\n')}`
  );
  fs.writeFileSync(siteDataPath, siteData);
}

let clusters = fs.readFileSync(path.join(ROOT, 'scripts/seo-clusters.mjs'), 'utf8');
if (!clusters.includes(SLUG)) {
  clusters = clusters.replace("'/games/arrow-dodge-arena.html']", `'/games/arrow-dodge-arena.html', '/games/${SLUG}.html']`);
  fs.writeFileSync(path.join(ROOT, 'scripts/seo-clusters.mjs'), clusters);
}

let related = fs.readFileSync(path.join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'), 'utf8');
if (!related.includes('Andromeda Star Shooter')) {
  related = related.replace(
    '{ title: "Arrow Dodge Arena", url: "https://freetoolonline.com/games/arrow-dodge-arena.html", include: !1, tags: "games" },',
    `{ title: "Arrow Dodge Arena", url: "https://freetoolonline.com/games/arrow-dodge-arena.html", include: !1, tags: "games" },\n    { title: "Andromeda Star Shooter", url: "https://freetoolonline.com/games/${SLUG}.html", include: !1, tags: "games" },`
  );
  fs.writeFileSync(path.join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'), related);
}

let menu = fs.readFileSync(path.join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'), 'utf8');
if (!menu.includes('Andromeda Star Shooter')) {
  menu = menu.replace(
    "<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/arrow-dodge-arena.html'>Arrow Dodge Arena</a>",
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/arrow-dodge-arena.html'>Arrow Dodge Arena</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/${SLUG}.html'>Andromeda Star Shooter</a>`
  );
  fs.writeFileSync(path.join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'), menu);
}

const skillDir = path.join(FRONTEND, '.agent/skills/tool-andromedastarshooter');
fs.mkdirSync(skillDir, { recursive: true });
write(path.join(skillDir, 'SKILL.md'), `---
name: tool-andromedastarshooter
description: Ground-truth for /games/${SLUG}.html (fire46, susam/invaders MIT).
---

# tool-andromedastarshooter

## Identity
- Route: /games/${SLUG}.html
- Slug: \`${SLUG}\` (CMS: \`${CMS_SLUG}\`)
- Aliases: /andromeda-star-shooter.html

## Reader task
Play a free browser fixed-shooter: move along the bottom, fire pulses at descending ships, and survive level progression.

## Processing model
client-side-only - index.html single-file in static/games/${SLUG}/ iframe. ${PAYLOAD}. Canvas 2D + Web Audio procedural SFX.

## Reader-benefit framing menu
- A1: Left/Right arrow keys or on-screen arrow buttons move the player along the bottom.
- A2: Enter or Space fires a pulse projectile upward.
- A3: P key or Play/Pause button starts, pauses, or resumes a run.
- A4: Enemy ships descend in patterns; clearing them advances levels.
- A5: Player health and score display on the canvas HUD.
- A6: Procedural Web Audio generates music and SFX (no audio files).
- A7: Mute button toggles audio output.
- A8: Zero CDN and zero network calls after load; no localStorage high score in upstream build.

## Anti-claims
- No mouse-aim twin-stick controls.
- No multiplayer or cloud saves.
- Not a commercial Space Invaders ROM or asset rip (original pixel implementation).

## claim_catalogue_status
verified
`);

await patchCloudFront301({ frontendRoot: FRONTEND, aliasUrl: '/andromeda-star-shooter.html', canonicalUrl: GAME, runDate: '20260710-andromeda-star-shooter' });
console.log('fire46 bundle generated for', SLUG);
