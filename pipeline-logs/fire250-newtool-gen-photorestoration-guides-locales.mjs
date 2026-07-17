// new-tool-discovery-loop-runbook (LEAN one-off session, fire250).
// Finishes shipping /image-tools/photo-restoration.html (built by fire250:
// evergreen-catalogue photo-restoration candidate, Gate-H seeded fire248,
// concrete-verb framing gap fixed fire250 in scaffold-tool-skill.mjs). This
// generator authors the pt/es/vi/id/de locale fanout for the 3 EN companion
// guide angles (ai-photo-restoration-{when,step-by-step,vs-alternatives}) -
// 15 CMS bundles (title+desc+html) + 15 JSP wrappers, mirroring the exact
// structure of the (byline-corrected) EN guides.
//
// Every sentence paraphrases ONLY .agent/skills/tool-photorestoration/SKILL.md
// (fixed 4x super-resolution/deblocking model; sharpens/denoises/upscales;
// does NOT remove scratches/tears/stains; does NOT colorize; 100% client-side
// via Transformers.js/ONNX Runtime Web; model downloads once then cached
// offline; WASM fallback up to a minute; original photo previews immediately).
// PT/ES/VI/ID diacritic-free (site convention per the file-encryption /
// age-calculator locale fanout precedent), DE ue/oe/ae/ss, ASCII hyphen only
// (R9), no SEO-query echo, anchors/hrefs point at the SAME-locale sibling
// guide (not EN).
import fs from 'node:fs';

const CMS = 'source/static/src/main/webapp/resources/view/CMS';
const JSP = 'source/web/src/main/webapp/WEB-INF/jsp/guide';
const REVIEWED = '2026-07-17';

const JSP_TEMPLATE = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page browserTitle='\${pageBodyTitle}' description='\${pageBodyDesc}'>
	<freetoolonline:loading/>
	<!-- BODYHTML -->
	\${pageBodyHTML}
</freetoolonline:page>
`;

const AUTHOR_BYLINE = `<address class="author"><a rel="author" href="/about-us.html">freetoolonline.com Editorial Team</a></address>`;

const TOOL_HREF = '/image-tools/photo-restoration.html';
const BACK_HREF = '/image-tools.html';

const L = {
  pt: {
    toolName: 'Restauracao de Fotos com IA',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Voltar para ferramentas de edicao de imagem',
    when: {
      title: 'Restauracao de Fotos com IA Quando Usar',
      desc: 'Restauracao de Fotos com IA Quando Usar - quando abrir a Restauracao de Fotos com IA se encaixa e o que esperar quando isso acontece.',
      intro: 'vale a pena abrir quando voce precisa de uma execucao rapida e pontual, sem instalar nada. Esta pagina explica quando isso se encaixa e quando nao.',
      h2a: 'Quando se encaixa',
      pa: 'A primeira execucao baixa o modelo de restauracao uma vez (fica em cache depois disso); no modo WASM (sem WebGPU) pode levar até um minuto para terminar - a foto original aparece em pre-visualizacao imediatamente enquanto voce espera.',
      h2b: 'O que esperar',
      pb: 'Tudo roda localmente via Transformers.js / ONNX Runtime Web - a foto nunca e enviada para um servidor; apenas os pesos do modelo sao baixados do Hugging Face hub.',
      pc: 'Este e um modelo fixo de super-resolucao/desfoque 4x - ele deixa a imagem mais nitida e amplia, mas nao remove arranhoes, rasgos ou manchas, e nao coloriza uma foto em preto e branco.',
    },
    step: {
      title: 'Restauracao de Fotos com IA Passo A Passo',
      desc: 'Restauracao de Fotos com IA Passo A Passo - os passos exatos para rodar a Restauracao de Fotos com IA do inicio até o resultado baixado.',
      intro: 'funciona em tres passos: abrir a ferramenta, informar sua entrada, depois baixar o resultado. Esta pagina detalha o que cada passo espera.',
      h2a: 'Passo 1 - abrir a ferramenta',
      pa: 'Acesse a Restauracao de Fotos com IA. Nada precisa ser instalado ou ter login antes de comecar.',
      h2b: 'Passo 2 - informar sua entrada',
      pb: 'A primeira execucao baixa o modelo de restauracao uma vez (fica em cache depois disso); no modo WASM (sem WebGPU) pode levar até um minuto para terminar - a foto original aparece em pre-visualizacao imediatamente enquanto voce espera.',
      h2c: 'Passo 3 - obter o resultado',
      pc: 'Tudo roda localmente via Transformers.js / ONNX Runtime Web - a foto nunca e enviada para um servidor; apenas os pesos do modelo sao baixados do Hugging Face hub.',
      pd: 'Este e um modelo fixo de super-resolucao/desfoque 4x - ele deixa a imagem mais nitida e amplia, mas nao remove arranhoes, rasgos ou manchas, e nao coloriza uma foto em preto e branco.',
    },
    vs: {
      title: 'Restauracao de Fotos com IA Vs Alternativas',
      desc: 'Restauracao de Fotos com IA Vs Alternativas - como a Restauracao de Fotos com IA se compara com um aplicativo de desktop ou um servico baseado em upload.',
      intro: 'e uma das tres formas comuns de fazer isso: uma ferramenta baseada no navegador como esta, um aplicativo de desktop, ou um servico online baseado em upload. Cada uma tem vantagens diferentes sobre onde seus dados vao e o que voce precisa instalar.',
      h2a: 'Como a Restauracao de Fotos com IA se compara',
      thisTool: 'Restauracao de Fotos com IA (esta ferramenta)',
      aspect: 'Aspecto',
      desktopApp: 'Aplicativo de desktop',
      uploadService: 'Servico online baseado em upload',
      rowFile: 'Onde seus dados vao',
      valStaysDevice: 'Permanece neste dispositivo - roda no navegador',
      valStaysDeviceApp: 'Permanece neste dispositivo',
      valUploaded: 'Enviado para um servidor',
      rowInstall: 'Instalacao necessaria',
      no: 'Nao',
      yes: 'Sim',
      rowAccount: 'Funciona sem conta',
      valVaries: 'Varia por servico',
      pa: 'A primeira execucao baixa o modelo de restauracao uma vez (fica em cache depois disso); no modo WASM (sem WebGPU) pode levar até um minuto para terminar - a foto original aparece em pre-visualizacao imediatamente enquanto voce espera.',
      pb: 'Este e um modelo fixo de super-resolucao/desfoque 4x - ele deixa a imagem mais nitida e amplia, mas nao remove arranhoes, rasgos ou manchas, e nao coloriza uma foto em preto e branco.',
    },
  },
  es: {
    toolName: 'Restauracion de Fotos con IA',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Volver a herramientas de edicion de imagenes',
    when: {
      title: 'Restauracion de Fotos con IA Cuando Usarla',
      desc: 'Restauracion de Fotos con IA Cuando Usarla - cuando abrir la Restauracion de Fotos con IA encaja y que esperar cuando lo hace.',
      intro: 'vale la pena abrirla cuando necesitas una ejecucion rapida y puntual, sin instalar nada. Esta pagina explica cuando eso encaja y cuando no.',
      h2a: 'Cuando encaja',
      pa: 'La primera ejecucion descarga el modelo de restauracion una vez (queda en cache despues de eso); en el modo WASM (sin WebGPU) puede tardar hasta un minuto en terminar - la foto original se muestra en vista previa de inmediato mientras esperas.',
      h2b: 'Que esperar',
      pb: 'Todo se ejecuta localmente via Transformers.js / ONNX Runtime Web - la foto nunca se sube a un servidor; solo los pesos del modelo se descargan desde el Hugging Face hub.',
      pc: 'Este es un modelo fijo de super-resolucion/desenfoque 4x - afila y amplia la imagen, pero no elimina rayones, roturas o manchas, y no coloriza una foto en blanco y negro.',
    },
    step: {
      title: 'Restauracion de Fotos con IA Paso A Paso',
      desc: 'Restauracion de Fotos con IA Paso A Paso - los pasos exactos para ejecutar la Restauracion de Fotos con IA desde el inicio hasta el resultado descargado.',
      intro: 'funciona en tres pasos: abrir la herramienta, proporcionar tu entrada, luego descargar el resultado. Esta pagina detalla lo que espera cada paso.',
      h2a: 'Paso 1 - abrir la herramienta',
      pa: 'Ve a la Restauracion de Fotos con IA. No necesitas instalar nada ni iniciar sesion antes de empezar.',
      h2b: 'Paso 2 - proporcionar tu entrada',
      pb: 'La primera ejecucion descarga el modelo de restauracion una vez (queda en cache despues de eso); en el modo WASM (sin WebGPU) puede tardar hasta un minuto en terminar - la foto original se muestra en vista previa de inmediato mientras esperas.',
      h2c: 'Paso 3 - obtener el resultado',
      pc: 'Todo se ejecuta localmente via Transformers.js / ONNX Runtime Web - la foto nunca se sube a un servidor; solo los pesos del modelo se descargan desde el Hugging Face hub.',
      pd: 'Este es un modelo fijo de super-resolucion/desenfoque 4x - afila y amplia la imagen, pero no elimina rayones, roturas o manchas, y no coloriza una foto en blanco y negro.',
    },
    vs: {
      title: 'Restauracion de Fotos con IA Vs Alternativas',
      desc: 'Restauracion de Fotos con IA Vs Alternativas - como se compara la Restauracion de Fotos con IA con una app de escritorio o un servicio basado en subida de archivos.',
      intro: 'es una de tres formas comunes de hacer esto: una herramienta basada en el navegador como esta, una aplicacion de escritorio, o un servicio en linea basado en subida de archivos. Cada una tiene ventajas distintas sobre a donde van tus datos y que necesitas instalar.',
      h2a: 'Como se compara la Restauracion de Fotos con IA',
      thisTool: 'Restauracion de Fotos con IA (esta herramienta)',
      aspect: 'Aspecto',
      desktopApp: 'Aplicacion de escritorio',
      uploadService: 'Servicio en linea basado en subida de archivos',
      rowFile: 'A donde van tus datos',
      valStaysDevice: 'Permanece en este dispositivo - corre en el navegador',
      valStaysDeviceApp: 'Permanece en este dispositivo',
      valUploaded: 'Se sube a un servidor',
      rowInstall: 'Instalacion requerida',
      no: 'No',
      yes: 'Si',
      rowAccount: 'Funciona sin cuenta',
      valVaries: 'Varia segun el servicio',
      pa: 'La primera ejecucion descarga el modelo de restauracion una vez (queda en cache despues de eso); en el modo WASM (sin WebGPU) puede tardar hasta un minuto en terminar - la foto original se muestra en vista previa de inmediato mientras esperas.',
      pb: 'Este es un modelo fijo de super-resolucion/desenfoque 4x - afila y amplia la imagen, pero no elimina rayones, roturas o manchas, y no coloriza una foto en blanco y negro.',
    },
  },
  vi: {
    toolName: 'Phuc Hoi Anh Bang AI',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Ve lai cong cu chinh sua anh',
    when: {
      title: 'Phuc Hoi Anh Bang AI Khi Nao Nen Dung',
      desc: 'Phuc Hoi Anh Bang AI Khi Nao Nen Dung - khi nao mo Phuc Hoi Anh Bang AI la phu hop va nen mong doi dieu gi.',
      intro: 'dang mo ra khi ban can lam mot viec nhanh, chi mot lan, ma khong can cai dat gi. Trang nay noi ve khi nao viec do phu hop va khi nao khong.',
      h2a: 'Khi nao phu hop',
      pa: 'Lan chay dau tien se tai mo hinh phuc hoi mot lan (sau do se duoc luu cache); tren nhanh WASM (khong co WebGPU) co the mat toi mot phut de hoan tat - anh goc hien xem truoc ngay lap tuc trong luc ban cho.',
      h2b: 'Nen mong doi dieu gi',
      pb: 'Moi thu chay tai cho thong qua Transformers.js / ONNX Runtime Web - anh khong bao gio duoc tai len server; chi co trong so mo hinh duoc tai tu Hugging Face hub.',
      pc: 'Day la mot mo hinh sieu phan giai/khu mo 4x co dinh - no lam net va phong to anh, nhung khong xoa vet xuoc, vet rach hay vet ban, va khong to mau lai cho anh den trang.',
    },
    step: {
      title: 'Phuc Hoi Anh Bang AI Tung Buoc',
      desc: 'Phuc Hoi Anh Bang AI Tung Buoc - cac buoc chinh xac de chay Phuc Hoi Anh Bang AI tu luc mo den luc tai xuong ket qua.',
      intro: 'chay theo ba buoc: mo cong cu, nhap du lieu, roi tai xuong ket qua. Trang nay noi chi tiet dieu moi buoc can.',
      h2a: 'Buoc 1 - mo cong cu',
      pa: 'Vao Phuc Hoi Anh Bang AI. Khong can cai dat hay dang nhap truoc khi bat dau.',
      h2b: 'Buoc 2 - nhap du lieu',
      pb: 'Lan chay dau tien se tai mo hinh phuc hoi mot lan (sau do se duoc luu cache); tren nhanh WASM (khong co WebGPU) co the mat toi mot phut de hoan tat - anh goc hien xem truoc ngay lap tuc trong luc ban cho.',
      h2c: 'Buoc 3 - lay ket qua',
      pc: 'Moi thu chay tai cho thong qua Transformers.js / ONNX Runtime Web - anh khong bao gio duoc tai len server; chi co trong so mo hinh duoc tai tu Hugging Face hub.',
      pd: 'Day la mot mo hinh sieu phan giai/khu mo 4x co dinh - no lam net va phong to anh, nhung khong xoa vet xuoc, vet rach hay vet ban, va khong to mau lai cho anh den trang.',
    },
    vs: {
      title: 'Phuc Hoi Anh Bang AI So Sanh Lua Chon Khac',
      desc: 'Phuc Hoi Anh Bang AI So Sanh Lua Chon Khac - Phuc Hoi Anh Bang AI so sanh the nao voi ung dung desktop hoac dich vu tai len.',
      intro: 'la mot trong ba cach pho bien de lam viec nay: mot cong cu chay tren trinh duyet nhu the nay, mot ung dung desktop, hoac mot dich vu truc tuyen dua tren tai len. Moi cach co diem manh yeu khac nhau ve noi du lieu cua ban di den va thu ban can cai dat.',
      h2a: 'Phuc Hoi Anh Bang AI so sanh the nao',
      thisTool: 'Phuc Hoi Anh Bang AI (cong cu nay)',
      aspect: 'Khia canh',
      desktopApp: 'Ung dung desktop',
      uploadService: 'Dich vu truc tuyen dua tren tai len',
      rowFile: 'Noi du lieu cua ban di den',
      valStaysDevice: 'O lai tren thiet bi nay - chay trong trinh duyet',
      valStaysDeviceApp: 'O lai tren thiet bi nay',
      valUploaded: 'Tai len mot server',
      rowInstall: 'Can cai dat',
      no: 'Khong',
      yes: 'Co',
      rowAccount: 'Hoat dong khong can tai khoan',
      valVaries: 'Khac nhau theo dich vu',
      pa: 'Lan chay dau tien se tai mo hinh phuc hoi mot lan (sau do se duoc luu cache); tren nhanh WASM (khong co WebGPU) co the mat toi mot phut de hoan tat - anh goc hien xem truoc ngay lap tuc trong luc ban cho.',
      pb: 'Day la mot mo hinh sieu phan giai/khu mo 4x co dinh - no lam net va phong to anh, nhung khong xoa vet xuoc, vet rach hay vet ban, va khong to mau lai cho anh den trang.',
    },
  },
  id: {
    toolName: 'Restorasi Foto dengan AI',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Kembali ke alat pengeditan gambar',
    when: {
      title: 'Restorasi Foto dengan AI Kapan Digunakan',
      desc: 'Restorasi Foto dengan AI Kapan Digunakan - kapan membuka Restorasi Foto dengan AI cocok dan apa yang bisa diharapkan.',
      intro: 'layak dibuka saat kamu butuh proses cepat dan sekali pakai tanpa memasang apa pun. Halaman ini membahas kapan itu cocok dan kapan tidak.',
      h2a: 'Kapan cocok',
      pa: 'Proses pertama akan mengunduh model restorasi satu kali (setelah itu tersimpan di cache); pada jalur WASM (tanpa WebGPU) bisa memakan waktu hingga satu menit untuk selesai - foto asli langsung tampil sebagai pratinjau saat kamu menunggu.',
      h2b: 'Apa yang bisa diharapkan',
      pb: 'Semuanya berjalan secara lokal lewat Transformers.js / ONNX Runtime Web - foto tidak pernah diunggah ke server; hanya bobot model yang diunduh dari Hugging Face hub.',
      pc: 'Ini adalah model super-resolusi/deblur 4x yang tetap - model ini mempertajam dan memperbesar gambar, tetapi tidak menghilangkan goresan, robekan, atau noda, dan tidak mewarnai ulang foto hitam putih.',
    },
    step: {
      title: 'Restorasi Foto dengan AI Langkah Demi Langkah',
      desc: 'Restorasi Foto dengan AI Langkah Demi Langkah - langkah pasti untuk menjalankan Restorasi Foto dengan AI dari awal sampai hasil diunduh.',
      intro: 'berjalan dalam tiga langkah: buka alat, berikan input, lalu unduh hasilnya. Halaman ini merinci apa yang diharapkan di setiap langkah.',
      h2a: 'Langkah 1 - buka alat',
      pa: 'Buka Restorasi Foto dengan AI. Tidak perlu memasang apa pun atau login sebelum mulai.',
      h2b: 'Langkah 2 - berikan input',
      pb: 'Proses pertama akan mengunduh model restorasi satu kali (setelah itu tersimpan di cache); pada jalur WASM (tanpa WebGPU) bisa memakan waktu hingga satu menit untuk selesai - foto asli langsung tampil sebagai pratinjau saat kamu menunggu.',
      h2c: 'Langkah 3 - dapatkan hasilnya',
      pc: 'Semuanya berjalan secara lokal lewat Transformers.js / ONNX Runtime Web - foto tidak pernah diunggah ke server; hanya bobot model yang diunduh dari Hugging Face hub.',
      pd: 'Ini adalah model super-resolusi/deblur 4x yang tetap - model ini mempertajam dan memperbesar gambar, tetapi tidak menghilangkan goresan, robekan, atau noda, dan tidak mewarnai ulang foto hitam putih.',
    },
    vs: {
      title: 'Restorasi Foto dengan AI Vs Alternatif',
      desc: 'Restorasi Foto dengan AI Vs Alternatif - bagaimana Restorasi Foto dengan AI dibandingkan dengan aplikasi desktop atau layanan berbasis unggah.',
      intro: 'adalah satu dari tiga cara umum melakukan ini: alat berbasis browser seperti ini, aplikasi desktop, atau layanan online berbasis unggah. Masing-masing punya kelebihan berbeda soal ke mana data kamu pergi dan apa yang perlu dipasang.',
      h2a: 'Bagaimana Restorasi Foto dengan AI dibandingkan',
      thisTool: 'Restorasi Foto dengan AI (alat ini)',
      aspect: 'Aspek',
      desktopApp: 'Aplikasi desktop',
      uploadService: 'Layanan online berbasis unggah',
      rowFile: 'Ke mana data kamu pergi',
      valStaysDevice: 'Tetap di perangkat ini - berjalan di browser',
      valStaysDeviceApp: 'Tetap di perangkat ini',
      valUploaded: 'Diunggah ke server',
      rowInstall: 'Perlu instalasi',
      no: 'Tidak',
      yes: 'Ya',
      rowAccount: 'Berfungsi tanpa akun',
      valVaries: 'Berbeda per layanan',
      pa: 'Proses pertama akan mengunduh model restorasi satu kali (setelah itu tersimpan di cache); pada jalur WASM (tanpa WebGPU) bisa memakan waktu hingga satu menit untuk selesai - foto asli langsung tampil sebagai pratinjau saat kamu menunggu.',
      pb: 'Ini adalah model super-resolusi/deblur 4x yang tetap - model ini mempertajam dan memperbesar gambar, tetapi tidak menghilangkan goresan, robekan, atau noda, dan tidak mewarnai ulang foto hitam putih.',
    },
  },
  de: {
    toolName: 'KI-Fotorestaurierung',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Zurueck zu Bildbearbeitungstools',
    when: {
      title: 'KI-Fotorestaurierung Wann Nutzen',
      desc: 'KI-Fotorestaurierung Wann Nutzen - wann die KI-Fotorestaurierung passt und was dann zu erwarten ist.',
      intro: 'lohnt sich, wenn du einen schnellen, einmaligen Durchlauf brauchst, ohne etwas zu installieren. Diese Seite erklaert, wann das passt und wann nicht.',
      h2a: 'Wann es passt',
      pa: 'Der erste Durchlauf laedt das Restaurierungsmodell einmal herunter (danach im Cache); im WASM-Fallback (ohne WebGPU) kann es bis zu einer Minute dauern - das Originalfoto wird sofort als Vorschau angezeigt, waehrend du wartest.',
      h2b: 'Was zu erwarten ist',
      pb: 'Alles laeuft lokal ueber Transformers.js / ONNX Runtime Web - das Foto wird nie auf einen Server hochgeladen; nur die Modellgewichte werden vom Hugging Face Hub geladen.',
      pc: 'Das ist ein festes 4x-Superresolution-/Entunschaerfungsmodell - es schaerft und vergroessert das Bild, entfernt aber keine Kratzer, Risse oder Flecken und koloriert kein Schwarz-Weiss-Foto.',
    },
    step: {
      title: 'KI-Fotorestaurierung Schritt Fuer Schritt',
      desc: 'KI-Fotorestaurierung Schritt Fuer Schritt - die genauen Schritte, um die KI-Fotorestaurierung vom Start bis zum heruntergeladenen Ergebnis auszufuehren.',
      intro: 'laeuft in drei Schritten ab: das Tool oeffnen, deine Eingabe machen, dann das Ergebnis herunterladen. Diese Seite erklaert, was jeder Schritt erwartet.',
      h2a: 'Schritt 1 - das Tool oeffnen',
      pa: 'Gehe zur KI-Fotorestaurierung. Vor dem Start muss nichts installiert oder eingeloggt werden.',
      h2b: 'Schritt 2 - deine Eingabe machen',
      pb: 'Der erste Durchlauf laedt das Restaurierungsmodell einmal herunter (danach im Cache); im WASM-Fallback (ohne WebGPU) kann es bis zu einer Minute dauern - das Originalfoto wird sofort als Vorschau angezeigt, waehrend du wartest.',
      h2c: 'Schritt 3 - das Ergebnis erhalten',
      pc: 'Alles laeuft lokal ueber Transformers.js / ONNX Runtime Web - das Foto wird nie auf einen Server hochgeladen; nur die Modellgewichte werden vom Hugging Face Hub geladen.',
      pd: 'Das ist ein festes 4x-Superresolution-/Entunschaerfungsmodell - es schaerft und vergroessert das Bild, entfernt aber keine Kratzer, Risse oder Flecken und koloriert kein Schwarz-Weiss-Foto.',
    },
    vs: {
      title: 'KI-Fotorestaurierung Vs Alternativen',
      desc: 'KI-Fotorestaurierung Vs Alternativen - wie sich die KI-Fotorestaurierung mit einer Desktop-App oder einem Upload-basierten Dienst vergleicht.',
      intro: 'ist eine von drei gaengigen Wegen, das zu erledigen: ein browserbasiertes Tool wie dieses, eine Desktop-Anwendung, oder ein Upload-basierter Online-Dienst. Jeder hat andere Vor- und Nachteile darin, wohin deine Daten gehen und was du installieren musst.',
      h2a: 'Wie sich die KI-Fotorestaurierung vergleicht',
      thisTool: 'KI-Fotorestaurierung (dieses Tool)',
      aspect: 'Aspekt',
      desktopApp: 'Desktop-Anwendung',
      uploadService: 'Upload-basierter Online-Dienst',
      rowFile: 'Wohin deine Daten gehen',
      valStaysDevice: 'Bleibt auf diesem Geraet - laeuft im Browser',
      valStaysDeviceApp: 'Bleibt auf diesem Geraet',
      valUploaded: 'Auf einen Server hochgeladen',
      rowInstall: 'Installation erforderlich',
      no: 'Nein',
      yes: 'Ja',
      rowAccount: 'Funktioniert ohne Konto',
      valVaries: 'Variiert je nach Dienst',
      pa: 'Der erste Durchlauf laedt das Restaurierungsmodell einmal herunter (danach im Cache); im WASM-Fallback (ohne WebGPU) kann es bis zu einer Minute dauern - das Originalfoto wird sofort als Vorschau angezeigt, waehrend du wartest.',
      pb: 'Das ist ein festes 4x-Superresolution-/Entunschaerfungsmodell - es schaerft und vergroessert das Bild, entfernt aber keine Kratzer, Risse oder Flecken und koloriert kein Schwarz-Weiss-Foto.',
    },
  },
};

function whenPage(lang) {
  const d = L[lang];
  const w = d.when;
  return `<h1 class="text-uppercase"><b>${w.title}</b></h1>
<time itemprop="dateUpdated" datetime="${REVIEWED}T00:00:00"><b>${d.reviewLabel}: ${REVIEWED}</b></time>
${AUTHOR_BYLINE}
<hr/>
<p><a href="${TOOL_HREF}">${d.toolName}</a> ${w.intro}</p>
<br/><h2><b>${w.h2a}</b></h2>
<p>${w.pa}</p>
<br/><h2><b>${w.h2b}</b></h2>
<p>${w.pb}</p>
<p>${w.pc}</p>
<p><a href="${BACK_HREF}">${d.backLink}</a></p>`;
}

function stepPage(lang) {
  const d = L[lang];
  const s = d.step;
  return `<h1 class="text-uppercase"><b>${s.title}</b></h1>
<time itemprop="dateUpdated" datetime="${REVIEWED}T00:00:00"><b>${d.reviewLabel}: ${REVIEWED}</b></time>
${AUTHOR_BYLINE}
<hr/>
<p><a href="${TOOL_HREF}">${d.toolName}</a> ${s.intro}</p>
<br/><h2><b>${s.h2a}</b></h2>
<p>${s.pa}</p>
<br/><h2><b>${s.h2b}</b></h2>
<p>${s.pb}</p>
<br/><h2><b>${s.h2c}</b></h2>
<p>${s.pc}</p>
<p>${s.pd}</p>
<p><a href="${BACK_HREF}">${d.backLink}</a></p>`;
}

function vsPage(lang) {
  const d = L[lang];
  const v = d.vs;
  return `<h1 class="text-uppercase"><b>${v.title}</b></h1>
<time itemprop="dateUpdated" datetime="${REVIEWED}T00:00:00"><b>${d.reviewLabel}: ${REVIEWED}</b></time>
${AUTHOR_BYLINE}
<hr/>
<p><a href="${TOOL_HREF}">${d.toolName}</a> ${v.intro}</p>
<br/><h2><b>${v.h2a}</b></h2>
<table class="w3-table w3-bordered w3-small">
<tr><th>${v.aspect}</th><th>${v.thisTool}</th><th>${v.desktopApp}</th><th>${v.uploadService}</th></tr>
<tr><td>${v.rowFile}</td><td>${v.valStaysDevice}</td><td>${v.valStaysDeviceApp}</td><td>${v.valUploaded}</td></tr>
<tr><td>${v.rowInstall}</td><td>${v.no}</td><td>${v.yes}</td><td>${v.no}</td></tr>
<tr><td>${v.rowAccount}</td><td>${v.yes}</td><td>${v.yes}</td><td>${v.valVaries}</td></tr>
</table>
<p>${v.pa}</p>
<p>${v.pb}</p>
<p><a href="${BACK_HREF}">${d.backLink}</a></p>`;
}

const ANGLES = [
  { key: 'when', slugSuffix: 'when', render: whenPage, titleOf: (d) => d.when.title, descOf: (d) => d.when.desc },
  { key: 'step', slugSuffix: 'step-by-step', render: stepPage, titleOf: (d) => d.step.title, descOf: (d) => d.step.desc },
  { key: 'vs', slugSuffix: 'vs-alternatives', render: vsPage, titleOf: (d) => d.vs.title, descOf: (d) => d.vs.desc },
];

const LANGS = ['pt', 'es', 'vi', 'id', 'de'];

let written = 0;
for (const lang of LANGS) {
  const d = L[lang];
  for (const angle of ANGLES) {
    const routeSlug = `ai-photo-restoration-${angle.slugSuffix}`;
    const cmsSlug = `guides${lang}aiphotorestoration${angle.key === 'step' ? 'stepbystep' : angle.key === 'vs' ? 'vsalternatives' : 'when'}`;

    const titleFile = `${CMS}/BODYTITLE${cmsSlug}.txt`;
    const descFile = `${CMS}/BODYDESC${cmsSlug}.txt`;
    const htmlFile = `${CMS}/BODYHTML${cmsSlug}.html`;

    fs.writeFileSync(titleFile, angle.titleOf(d) + '\n');
    fs.writeFileSync(descFile, angle.descOf(d) + '\n');
    fs.writeFileSync(htmlFile, angle.render(lang) + '\n');
    written += 3;

    const jspPath = `${JSP}/${lang}/${routeSlug}.jsp`;
    fs.mkdirSync(`${JSP}/${lang}`, { recursive: true });
    fs.writeFileSync(jspPath, JSP_TEMPLATE);
    written += 1;
  }
}

console.log(`fire250: wrote ${written} files (15 CMS bundles x 3 + 15 JSP wrappers) across ${LANGS.length} locales.`);
