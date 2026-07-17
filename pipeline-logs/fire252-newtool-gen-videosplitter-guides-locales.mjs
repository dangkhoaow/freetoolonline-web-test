// new-tool-discovery-loop-runbook — guide_locale_fanout drain for video-splitter
// (fire252 ship-pending resume). Authors pt/es/vi/id/de locale variants of the 3
// EN companion guide angles (video-splitter-when, -step-by-step, -vs-alternatives)
// that shipped EN-only in a prior killed fire. Content translated faithfully from
// the CORRECTED EN BODYHTMLguidesvideosplitter{when,stepbystep,vsalternatives}.html
// sources (this fire also fixed a stale generic-splitter leftover claim -
// "or as a single archive" / a non-existent "merger" tool - before translating),
// which themselves paraphrase ONLY .agent/skills/tool-videosplitter/SKILL.md
// ## Reader-benefit framing menu / ## Implemented features / ## NOT implemented.
// Same generator shape as fire114-newtool-gen-deletepdfpages-guides-locales.mjs.
// VI/ID diacritic-free, DE ue/oe/ae/ss, ASCII hyphen only (R9), no SEO-query echo.
import fs from 'node:fs';
import path from 'node:path';

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

function html({ h1, intro, sections, backLabel }) {
  let out = `<h1 class="text-uppercase"><b>${h1}</b></h1>\n`;
  out += `<time itemprop="dateUpdated" datetime="${REVIEWED}T00:00:00"><b>Last reviewed: ${REVIEWED}</b></time>\n`;
  out += `<hr/>\n<p>${intro}</p>\n`;
  for (const s of sections) {
    if (s.h2) out += `<br/><h2><b>${s.h2}</b></h2>\n`;
    if (s.table) {
      out += `<table class="w3-table w3-bordered w3-small">\n<tr>${s.table.header.map(h => `<th>${h}</th>`).join('')}</tr>\n`;
      for (const row of s.table.rows) out += `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>\n`;
      out += `</table>\n`;
    }
    for (const p of s.paragraphs || []) out += `<p>${p}</p>\n`;
  }
  out += `<p><a href="/video-tools.html">&larr; ${backLabel}</a></p>\n`;
  return out;
}

const TOOL_LINK_EN = `<a href="/video-tools/video-splitter.html">`;

const LOCALES = {
  pt: {
    step: {
      title: 'Divisor de Video Passo a Passo',
      desc: 'Divisor de Video Passo a Passo - os passos exatos para executar o Divisor de Video desde abrir até baixar o resultado.',
      h1: 'Divisor de Video Passo a Passo',
      intro: `${TOOL_LINK_EN}Divisor de Video</a> funciona em três passos: abra a ferramenta, forneça sua entrada e depois baixe o resultado. Esta página explica o que cada passo espera.`,
      sections: [
        { h2: 'Passo 1 - abra a ferramenta', paragraphs: [`Acesse ${TOOL_LINK_EN}Divisor de Video</a>. Nada precisa ser instalado e você não precisa entrar em uma conta antes de começar.`] },
        { h2: 'Passo 2 - forneça sua entrada', paragraphs: ['Envie seu arquivo de vídeo e digite o ponto de divisão no campo "Split at" - tanto segundos simples ("90") quanto mm:ss ("1:30") funcionam. Esse único ponto é onde o corte acontece.'] },
        { h2: 'Passo 3 - obtenha o resultado', paragraphs: ['A ferramenta produz dois clipes separados: tudo antes do ponto de divisão e tudo depois. Cada um aparece como seu próprio link de download - não há etapa de zip ou arquivo compactado, e o arquivo original não é retido depois que o processamento termina.'] },
      ],
      backLabel: 'Voltar para ferramentas de vídeo',
    },
    when: {
      title: 'Divisor de Video Quando Usar',
      desc: 'Divisor de Video Quando Usar - quando abrir o Divisor de Video faz sentido e o que esperar quando faz.',
      h1: 'Divisor de Video Quando Usar',
      intro: `${TOOL_LINK_EN}Divisor de Video</a> vale a pena abrir quando você precisa de uma execução rápida e única sem instalar nada. Esta página explica quando isso faz sentido e quando não.`,
      sections: [
        { h2: 'Quando faz sentido', paragraphs: ['Use esta ferramenta quando você tiver um clipe e precisar cortá-lo em duas partes em um único ponto - removendo a introdução do início de uma gravação, separando um destaque do restante de uma gravação mais longa, ou dividindo um vídeo pela metade para que cada metade caiba em um limite de tamanho ou duração. A qualidade original é preservada porque o corte é uma cópia sem perdas, não uma nova codificação.'] },
        { h2: 'O que esperar', paragraphs: ['Você recebe exatamente dois arquivos - tudo antes do ponto de divisão e tudo depois - cada um como seu próprio download. A ferramenta não corta em mais de um ponto em uma única execução, e não agrupa os dois clipes em um zip; se precisar de três ou mais partes, execute a ferramenta novamente em um dos clipes resultantes. O arquivo enviado não é retido depois que os dois clipes estão prontos.'] },
      ],
      backLabel: 'Voltar para ferramentas de vídeo',
    },
    vs: {
      title: 'Divisor de Video Vs Alternativas',
      desc: 'Divisor de Video Vs Alternativas - como o Divisor de Video se compara a um aplicativo de desktop ou a um serviço online baseado em upload.',
      h1: 'Divisor de Video Vs Alternativas',
      intro: `${TOOL_LINK_EN}Divisor de Video</a> é uma de três formas comuns de fazer isso: uma ferramenta no navegador como esta, um aplicativo de desktop ou um serviço online baseado em upload. Cada uma tem vantagens diferentes quanto a para onde vai seu arquivo e o que você precisa instalar.`,
      sections: [
        { h2: 'Como o Divisor de Video se compara', table: { header: ['Aspecto', 'Divisor de Video (esta ferramenta)', 'Aplicativo de desktop', 'Serviço online baseado em upload'], rows: [
          ['Para onde vai seu arquivo', 'Permanece neste dispositivo - roda no navegador', 'Permanece neste dispositivo', 'Enviado a um servidor'],
          ['Instalação necessária', 'Não', 'Sim', 'Não'],
          ['Funciona sem conta', 'Sim', 'Sim', 'Varia por serviço'],
        ] }, paragraphs: ['Cada um dos dois clipes resultantes é baixado separadamente - eles nunca são agrupados em um zip ou arquivo compactado - e o arquivo enviado não é retido depois que o processamento termina.'] },
      ],
      backLabel: 'Voltar para ferramentas de vídeo',
    },
  },
  es: {
    step: {
      title: 'Divisor de Video Paso a Paso',
      desc: 'Divisor de Video Paso a Paso - los pasos exactos para ejecutar Divisor de Video desde abrir hasta descargar el resultado.',
      h1: 'Divisor de Video Paso a Paso',
      intro: `${TOOL_LINK_EN}Divisor de Video</a> funciona en tres pasos: abre la herramienta, proporciona tu entrada y luego descarga el resultado. Esta página explica qué espera cada paso.`,
      sections: [
        { h2: 'Paso 1 - abre la herramienta', paragraphs: [`Abre ${TOOL_LINK_EN}Divisor de Video</a>. No necesitas instalar nada ni iniciar sesión antes de empezar.`] },
        { h2: 'Paso 2 - proporciona tu entrada', paragraphs: ['Sube tu archivo de video y escribe el punto de división en el campo "Split at" - funcionan tanto segundos simples ("90") como mm:ss ("1:30"). Ese único punto es donde ocurre el corte.'] },
        { h2: 'Paso 3 - obtén el resultado', paragraphs: ['La herramienta produce dos clips separados: todo antes del punto de división y todo después. Cada uno aparece como su propio enlace de descarga - no hay paso de zip ni archivo comprimido, y el archivo original no se conserva una vez que termina el procesamiento.'] },
      ],
      backLabel: 'Volver a herramientas de video',
    },
    when: {
      title: 'Divisor de Video Cuando Usarlo',
      desc: 'Divisor de Video Cuando Usarlo - cuando abrir Divisor de Video tiene sentido y qué esperar cuando lo hace.',
      h1: 'Divisor de Video Cuando Usarlo',
      intro: `${TOOL_LINK_EN}Divisor de Video</a> vale la pena abrirlo cuando necesitas una ejecución rápida y puntual sin instalar nada. Esta página explica cuándo eso tiene sentido y cuándo no.`,
      sections: [
        { h2: 'Cuando tiene sentido', paragraphs: ['Usa esta herramienta cuando tienes un clip y necesitas cortarlo en dos partes en un solo punto - quitando la introducción al inicio de una grabación, separando un momento destacado del resto de una toma más larga, o dividiendo un video por la mitad para que cada mitad se ajuste a un límite de tamaño o duración. Mantiene la calidad original porque el corte es una copia sin pérdidas, no una nueva codificación.'] },
        { h2: 'Qué esperar', paragraphs: ['Obtienes exactamente dos archivos - todo antes del punto de división y todo después - cada uno como su propia descarga. No corta en más de un punto en una sola ejecución, y no agrupa los dos clips en un zip; si necesitas tres o más partes, ejecuta la herramienta de nuevo en uno de los clips resultantes. El archivo subido no se conserva una vez que los dos clips están listos.'] },
      ],
      backLabel: 'Volver a herramientas de video',
    },
    vs: {
      title: 'Divisor de Video Vs Alternativas',
      desc: 'Divisor de Video Vs Alternativas - cómo se compara Divisor de Video con una aplicación de escritorio o un servicio en línea basado en subida de archivos.',
      h1: 'Divisor de Video Vs Alternativas',
      intro: `${TOOL_LINK_EN}Divisor de Video</a> es una de tres formas comunes de hacer esto: una herramienta en el navegador como esta, una aplicación de escritorio o un servicio en línea basado en subida de archivos. Cada una tiene ventajas distintas en cuanto a dónde va tu archivo y qué necesitas instalar.`,
      sections: [
        { h2: 'Cómo se compara Divisor de Video', table: { header: ['Aspecto', 'Divisor de Video (esta herramienta)', 'Aplicación de escritorio', 'Servicio en línea basado en subida'], rows: [
          ['Dónde va tu archivo', 'Permanece en este dispositivo - se ejecuta en el navegador', 'Permanece en este dispositivo', 'Se sube a un servidor'],
          ['Instalación necesaria', 'No', 'Sí', 'No'],
          ['Funciona sin cuenta', 'Sí', 'Sí', 'Varía según el servicio'],
        ] }, paragraphs: ['Cada uno de los dos clips resultantes se descarga por separado - nunca se agrupan en un zip o archivo comprimido - y el archivo subido no se conserva una vez que termina el procesamiento.'] },
      ],
      backLabel: 'Volver a herramientas de video',
    },
  },
  vi: {
    step: {
      title: 'Chia Video Tung Buoc',
      desc: 'Chia Video Tung Buoc - cac buoc chinh xac de chay Chia Video tu khi mo den khi tai ket qua.',
      h1: 'Chia Video Tung Buoc',
      intro: `${TOOL_LINK_EN}Chia Video</a> chay theo ba buoc: mo cong cu, cung cap dau vao, roi tai ket qua. Trang nay giai thich moi buoc can gi.`,
      sections: [
        { h2: 'Buoc 1 - mo cong cu', paragraphs: [`Mo ${TOOL_LINK_EN}Chia Video</a>. Khong can cai dat hay dang nhap truoc khi bat dau.`] },
        { h2: 'Buoc 2 - cung cap dau vao', paragraphs: ['Tai file video len, roi nhap diem chia vao o "Split at" - ca giay don gian ("90") va dang mm:ss ("1:30") deu dung duoc. Diem do la noi cat xay ra.'] },
        { h2: 'Buoc 3 - nhan ket qua', paragraphs: ['Cong cu tao ra hai doan video rieng: toan bo phan truoc diem chia va toan bo phan sau. Moi doan hien thi thanh mot lien ket tai rieng - khong co buoc dong goi zip, va file goc khong duoc giu lai sau khi xu ly xong.'] },
      ],
      backLabel: 'Ve lai cong cu video',
    },
    when: {
      title: 'Chia Video Khi Nao Nen Dung',
      desc: 'Chia Video Khi Nao Nen Dung - khi nao mo Chia Video phu hop, va ban se nhan duoc gi khi dung no.',
      h1: 'Chia Video Khi Nao Nen Dung',
      intro: `${TOOL_LINK_EN}Chia Video</a> dang de mo khi ban can chay nhanh, mot lan, khong can cai dat gi. Trang nay noi ro khi nao phu hop va khi nao khong.`,
      sections: [
        { h2: 'Khi nao phu hop', paragraphs: ['Dung cong cu nay khi ban co mot doan video va can cat thanh hai phan tai mot diem duy nhat - cat phan gioi thieu o dau doan ghi hinh, tach mot doan noi bat ra khoi phan con lai cua ban ghi dai hon, hoac chia doi video de moi nua vua voi gioi han kich thuoc hoac thoi luong. Chat luong goc duoc giu nguyen vi day la sao chep khong mat du lieu, khong phai ma hoa lai.'] },
        { h2: 'Ban se nhan duoc gi', paragraphs: ['Ban nhan duoc chinh xac hai file - toan bo phan truoc diem chia va toan bo phan sau - moi file la mot ban tai rieng. Cong cu khong cat tai nhieu hon mot diem trong mot lan chay, va khong dong goi hai doan video vao mot file zip; neu can ba phan hoac nhieu hon, hay chay lai cong cu tren mot trong hai doan da co. File tai len khong duoc giu lai sau khi hai doan video da san sang.'] },
      ],
      backLabel: 'Ve lai cong cu video',
    },
    vs: {
      title: 'Chia Video So Sanh Voi Cac Lua Chon Khac',
      desc: 'Chia Video So Sanh Voi Cac Lua Chon Khac - Chia Video khac gi voi ung dung desktop hoac dich vu online can tai file len.',
      h1: 'Chia Video So Sanh Voi Cac Lua Chon Khac',
      intro: `${TOOL_LINK_EN}Chia Video</a> la mot trong ba cach pho bien de lam viec nay: mot cong cu chay trong trinh duyet nhu the nay, mot ung dung desktop, hoac mot dich vu online can tai file len. Moi cach danh doi khac nhau ve noi file cua ban di den va nhung gi ban can cai dat.`,
      sections: [
        { h2: 'Chia Video so sanh nhu the nao', table: { header: ['Khia canh', 'Chia Video (cong cu nay)', 'Ung dung desktop', 'Dich vu online can tai len'], rows: [
          ['Noi file cua ban di den', 'Van o tren thiet bi nay - chay trong trinh duyet', 'Van o tren thiet bi nay', 'Duoc tai len server'],
          ['Can cai dat', 'Khong', 'Co', 'Khong'],
          ['Hoat dong khong can tai khoan', 'Co', 'Co', 'Tuy dich vu'],
        ] }, paragraphs: ['Moi doan trong hai doan video ket qua duoc tai xuong rieng - chung khong bao gio duoc dong goi vao file zip - va file tai len khong duoc giu lai sau khi xu ly xong.'] },
      ],
      backLabel: 'Ve lai cong cu video',
    },
  },
  id: {
    step: {
      title: 'Pembagi Video Langkah demi Langkah',
      desc: 'Pembagi Video Langkah demi Langkah - langkah pasti untuk menjalankan Pembagi Video dari membuka hingga mengunduh hasilnya.',
      h1: 'Pembagi Video Langkah demi Langkah',
      intro: `${TOOL_LINK_EN}Pembagi Video</a> berjalan dalam tiga langkah: buka alat, berikan input Anda, lalu unduh hasilnya. Halaman ini menjelaskan apa yang diharapkan di setiap langkah.`,
      sections: [
        { h2: 'Langkah 1 - buka alat', paragraphs: [`Buka ${TOOL_LINK_EN}Pembagi Video</a>. Tidak perlu memasang apa pun atau masuk akun sebelum memulai.`] },
        { h2: 'Langkah 2 - berikan input Anda', paragraphs: ['Unggah file video Anda, lalu ketik titik pembagian di kolom "Split at" - baik detik biasa ("90") maupun format mm:ss ("1:30") berfungsi. Titik itulah tempat potongan terjadi.'] },
        { h2: 'Langkah 3 - dapatkan hasilnya', paragraphs: ['Alat ini menghasilkan dua klip terpisah: semua sebelum titik pembagian, dan semua sesudahnya. Masing-masing muncul sebagai tautan unduhan sendiri - tidak ada langkah zip atau arsip, dan file asli tidak disimpan setelah proses selesai.'] },
      ],
      backLabel: 'Kembali ke alat video',
    },
    when: {
      title: 'Pembagi Video Kapan Digunakan',
      desc: 'Pembagi Video Kapan Digunakan - kapan membuka Pembagi Video cocok dan apa yang diharapkan.',
      h1: 'Pembagi Video Kapan Digunakan',
      intro: `${TOOL_LINK_EN}Pembagi Video</a> layak dibuka saat kamu perlu proses cepat sekali jalan tanpa memasang apa pun. Halaman ini membahas kapan itu cocok dan kapan tidak.`,
      sections: [
        { h2: 'Kapan cocok', paragraphs: ['Gunakan alat ini saat kamu punya satu klip dan perlu memotongnya menjadi dua bagian pada satu titik - memotong bagian intro dari awal rekaman, memisahkan momen sorotan dari sisa rekaman yang lebih panjang, atau membagi video menjadi dua agar tiap bagian sesuai batas ukuran atau durasi. Kualitas asli tetap terjaga karena potongan ini adalah salinan tanpa kompresi ulang, bukan pengkodean ulang.'] },
        { h2: 'Apa yang diharapkan', paragraphs: ['Kamu mendapat tepat dua file - semua sebelum titik pembagian dan semua sesudahnya - masing-masing sebagai unduhan sendiri. Alat ini tidak memotong di lebih dari satu titik dalam sekali jalan, dan tidak menggabungkan dua klip ke dalam satu zip; jika perlu tiga bagian atau lebih, jalankan alat ini lagi pada salah satu klip hasil. File yang diunggah tidak disimpan setelah dua klip siap.'] },
      ],
      backLabel: 'Kembali ke alat video',
    },
    vs: {
      title: 'Pembagi Video Vs Alternatif',
      desc: 'Pembagi Video Vs Alternatif - bagaimana Pembagi Video dibandingkan dengan aplikasi desktop atau layanan online berbasis unggah.',
      h1: 'Pembagi Video Vs Alternatif',
      intro: `${TOOL_LINK_EN}Pembagi Video</a> adalah satu dari tiga cara umum melakukan ini: alat berbasis browser seperti ini, aplikasi desktop, atau layanan online berbasis unggah. Masing-masing punya kelebihan berbeda soal ke mana file Anda pergi dan apa yang perlu dipasang.`,
      sections: [
        { h2: 'Bagaimana Pembagi Video dibandingkan', table: { header: ['Aspek', 'Pembagi Video (alat ini)', 'Aplikasi desktop', 'Layanan online berbasis unggah'], rows: [
          ['Ke mana file Anda pergi', 'Tetap di perangkat ini - berjalan di browser', 'Tetap di perangkat ini', 'Diunggah ke server'],
          ['Perlu instalasi', 'Tidak', 'Ya', 'Tidak'],
          ['Berfungsi tanpa akun', 'Ya', 'Ya', 'Bergantung pada layanan'],
        ] }, paragraphs: ['Masing-masing dari dua klip hasil diunduh secara terpisah - tidak pernah digabungkan ke dalam zip atau arsip - dan file yang diunggah tidak disimpan setelah proses selesai.'] },
      ],
      backLabel: 'Kembali ke alat video',
    },
  },
  de: {
    step: {
      title: 'Video-Teiler Schritt fuer Schritt',
      desc: 'Video-Teiler Schritt fuer Schritt - die genauen Schritte, um Video-Teiler vom Oeffnen bis zum Herunterladen des Ergebnisses auszufuehren.',
      h1: 'Video-Teiler Schritt fuer Schritt',
      intro: `${TOOL_LINK_EN}Video-Teiler</a> laeuft in drei Schritten ab: das Werkzeug oeffnen, die Eingabe bereitstellen, dann das Ergebnis herunterladen. Diese Seite erklaert, was jeder Schritt erwartet.`,
      sections: [
        { h2: 'Schritt 1 - Werkzeug oeffnen', paragraphs: [`Oeffne ${TOOL_LINK_EN}Video-Teiler</a>. Vor dem Start muss nichts installiert oder angemeldet werden.`] },
        { h2: 'Schritt 2 - Eingabe bereitstellen', paragraphs: ['Lade deine Videodatei hoch und gib den Trennpunkt in das Feld "Split at" ein - sowohl einfache Sekunden ("90") als auch mm:ss ("1:30") funktionieren. Dieser eine Punkt ist die Stelle, an der geschnitten wird.'] },
        { h2: 'Schritt 3 - Ergebnis erhalten', paragraphs: ['Das Werkzeug erzeugt zwei getrennte Clips: alles vor dem Trennpunkt und alles danach. Jeder erscheint als eigener Download-Link - es gibt keinen Zip- oder Archivschritt, und die Originaldatei wird nach Abschluss der Verarbeitung nicht aufbewahrt.'] },
      ],
      backLabel: 'Zurueck zu Video-Werkzeugen',
    },
    when: {
      title: 'Video-Teiler Wann Nutzen',
      desc: 'Video-Teiler Wann Nutzen - wann das Oeffnen von Video-Teiler passt und was dabei zu erwarten ist.',
      h1: 'Video-Teiler Wann Nutzen',
      intro: `${TOOL_LINK_EN}Video-Teiler</a> lohnt sich, wenn du einen schnellen, einmaligen Durchlauf ohne Installation brauchst. Diese Seite zeigt, wann das passt und wann nicht.`,
      sections: [
        { h2: 'Wann es passt', paragraphs: ['Nutze dieses Werkzeug, wenn du einen Clip hast und ihn an einer einzigen Stelle in zwei Teile schneiden musst - das Intro vom Anfang einer Aufnahme abschneiden, einen Hoehepunkt vom Rest einer laengeren Aufnahme trennen, oder ein Video halbieren, damit jede Haelfte in ein Groessen- oder Laengenlimit passt. Die Originalqualitaet bleibt erhalten, weil der Schnitt eine verlustfreie Kopie ist, keine Neukodierung.'] },
        { h2: 'Was zu erwarten ist', paragraphs: ['Du bekommst genau zwei Dateien zurueck - alles vor dem Trennpunkt und alles danach - jede als eigener Download. Das Werkzeug schneidet in einem Durchlauf nur an einer Stelle, und es packt die beiden Clips nicht in ein Zip; wenn du drei oder mehr Teile brauchst, fuehre das Werkzeug erneut auf einem der entstandenen Clips aus. Die hochgeladene Datei wird nicht aufbewahrt, sobald die beiden Clips fertig sind.'] },
      ],
      backLabel: 'Zurueck zu Video-Werkzeugen',
    },
    vs: {
      title: 'Video-Teiler Vs Alternativen',
      desc: 'Video-Teiler Vs Alternativen - wie Video-Teiler im Vergleich zu einer Desktop-Anwendung oder einem Upload-basierten Online-Dienst abschneidet.',
      h1: 'Video-Teiler Vs Alternativen',
      intro: `${TOOL_LINK_EN}Video-Teiler</a> ist eine von drei gaengigen Methoden dafuer: ein browserbasiertes Werkzeug wie dieses, eine Desktop-Anwendung oder ein Upload-basierter Online-Dienst. Jede Variante hat andere Kompromisse dabei, wohin deine Datei geht und was du installieren musst.`,
      sections: [
        { h2: 'Wie Video-Teiler abschneidet', table: { header: ['Aspekt', 'Video-Teiler (dieses Werkzeug)', 'Desktop-Anwendung', 'Upload-basierter Online-Dienst'], rows: [
          ['Wohin deine Datei geht', 'Bleibt auf diesem Geraet - laeuft im Browser', 'Bleibt auf diesem Geraet', 'Wird auf einen Server hochgeladen'],
          ['Installation erforderlich', 'Nein', 'Ja', 'Nein'],
          ['Funktioniert ohne Konto', 'Ja', 'Ja', 'Je nach Dienst unterschiedlich'],
        ] }, paragraphs: ['Jeder der beiden entstandenen Clips wird separat heruntergeladen - sie werden nie in ein Zip oder Archiv gepackt - und die hochgeladene Datei wird nach Abschluss der Verarbeitung nicht aufbewahrt.'] },
      ],
      backLabel: 'Zurueck zu Video-Werkzeugen',
    },
  },
};

const ANGLE_SLUG = { step: 'stepbystep', when: 'when', vs: 'vsalternatives' };
const ANGLE_ROUTE = { step: 'step-by-step', when: 'when', vs: 'vs-alternatives' };

let written = 0;
for (const [lang, angles] of Object.entries(LOCALES)) {
  for (const [angleKey, content] of Object.entries(angles)) {
    const slug = `guides${lang}videosplitter${ANGLE_SLUG[angleKey]}`;
    fs.writeFileSync(path.join(CMS, `BODYTITLE${slug}.txt`), content.title + '\n');
    fs.writeFileSync(path.join(CMS, `BODYDESC${slug}.txt`), content.desc + '\n');
    fs.writeFileSync(path.join(CMS, `BODYHTML${slug}.html`), html(content));
    written += 3;

    const jspDir = path.join(JSP, lang);
    fs.mkdirSync(jspDir, { recursive: true });
    fs.writeFileSync(path.join(jspDir, `video-splitter-${ANGLE_ROUTE[angleKey]}.jsp`), JSP_TEMPLATE);
    written += 1;
  }
}
console.log(`Wrote ${written} files (15 guide pages x [BODYTITLE, BODYDESC, BODYHTML, JSP]).`);
