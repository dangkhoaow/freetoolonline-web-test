// new-tool-discovery-loop-runbook — guide_locale_fanout drain for rotate-pdf.
// Authors pt/es/vi/id/de locale variants of the 3 EN companion guide angles
// (rotate-pdf-when, rotate-pdf-step-by-step, rotate-pdf-vs-alternatives) that
// shipped EN-only in commit 79398aec. Content paraphrased from
// .agent/skills/tool-rotatepdf/SKILL.md ## Reader-benefit framing menu only.
// VI/ID diacritic-free, DE ue/oe/ae/ss, ASCII hyphen only (R9), no SEO-query echo.
import fs from 'node:fs';
import path from 'node:path';

const CMS = 'source/static/src/main/webapp/resources/view/CMS';
const JSP = 'source/web/src/main/webapp/WEB-INF/jsp/guide';
const REVIEWED = '2026-07-12';

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
  out += `<p><a href="/pdf-tools.html">&larr; ${backLabel}</a></p>\n`;
  return out;
}

const TOOL_LINK_EN = `<a href="/pdf-tools/rotate-pdf.html">`;

const LOCALES = {
  pt: {
    toolName: 'Girar PDF',
    step: {
      title: 'Girar PDF Passo a Passo',
      desc: 'Girar PDF Passo a Passo - os passos exatos para executar o Girar PDF desde abrir até baixar o resultado.',
      h1: 'Girar PDF Passo a Passo',
      intro: `${TOOL_LINK_EN}Girar PDF</a> funciona em três passos: abra a ferramenta, forneça sua entrada e depois baixe o resultado. Esta página explica o que cada passo espera.`,
      sections: [
        { h2: 'Passo 1 - abra a ferramenta', paragraphs: [`Abra o ${TOOL_LINK_EN}Girar PDF</a>. Nada precisa ser instalado ou conectado antes de começar.`] },
        { h2: 'Passo 2 - forneça sua entrada', paragraphs: ['O ângulo é aplicado de forma uniforme a todo o documento; não é possível girar páginas individuais para ângulos diferentes.'] },
        { h2: 'Passo 3 - obtenha o resultado', paragraphs: ['O arquivo é processado nesta aba do navegador e nunca é enviado a um servidor.', 'Para dividir, unir ou comprimir o PDF, veja a seção de ferramentas relacionadas.'] },
      ],
      backLabel: 'Voltar para ferramentas de PDF',
    },
    when: {
      title: 'Girar PDF Quando Usar',
      desc: 'Girar PDF Quando Usar - quando abrir o Girar PDF faz sentido e o que esperar quando faz.',
      h1: 'Girar PDF Quando Usar',
      intro: `${TOOL_LINK_EN}Girar PDF</a> vale a pena abrir quando você precisa de uma execução rápida e única sem instalar nada. Esta página mostra quando isso faz sentido e quando não.`,
      sections: [
        { h2: 'Quando faz sentido', paragraphs: ['O ângulo é aplicado de forma uniforme a todo o documento; não é possível girar páginas individuais para ângulos diferentes.'] },
        { h2: 'O que esperar', paragraphs: ['O arquivo é processado nesta aba do navegador e nunca é enviado a um servidor.', 'Para dividir, unir ou comprimir o PDF, veja a seção de ferramentas relacionadas.'] },
      ],
      backLabel: 'Voltar para ferramentas de PDF',
    },
    vs: {
      title: 'Girar PDF Vs Alternativas',
      desc: 'Girar PDF Vs Alternativas - como o Girar PDF se compara a um aplicativo de desktop ou a um serviço online baseado em upload.',
      h1: 'Girar PDF Vs Alternativas',
      intro: `${TOOL_LINK_EN}Girar PDF</a> é uma de três formas comuns de fazer isso: uma ferramenta no navegador como esta, um aplicativo de desktop ou um serviço online baseado em upload. Cada uma tem vantagens diferentes quanto a para onde vai seu arquivo e o que você precisa instalar.`,
      sections: [
        { h2: 'Como o Girar PDF se compara', table: { header: ['Aspecto', 'Girar PDF (esta ferramenta)', 'Aplicativo de desktop', 'Serviço online baseado em upload'], rows: [
          ['Para onde vai seu arquivo', 'Permanece neste dispositivo', 'Permanece neste dispositivo', 'Enviado a um servidor'],
          ['Instalação necessária', 'Não', 'Sim', 'Não'],
          ['Funciona sem conta', 'Sim', 'Sim', 'Varia por serviço'],
        ] }, paragraphs: ['O ângulo é aplicado de forma uniforme a todo o documento; não é possível girar páginas individuais para ângulos diferentes.', 'O arquivo é processado nesta aba do navegador e nunca é enviado a um servidor.'] },
      ],
      backLabel: 'Voltar para ferramentas de PDF',
    },
  },
  es: {
    step: {
      title: 'Girar PDF Paso a Paso',
      desc: 'Girar PDF Paso a Paso - los pasos exactos para ejecutar Girar PDF desde abrir hasta descargar el resultado.',
      h1: 'Girar PDF Paso a Paso',
      intro: `${TOOL_LINK_EN}Girar PDF</a> funciona en tres pasos: abre la herramienta, proporciona tu entrada y luego descarga el resultado. Esta página explica qué espera cada paso.`,
      sections: [
        { h2: 'Paso 1 - abre la herramienta', paragraphs: [`Abre ${TOOL_LINK_EN}Girar PDF</a>. No necesitas instalar ni iniciar sesión antes de empezar.`] },
        { h2: 'Paso 2 - proporciona tu entrada', paragraphs: ['El ángulo se aplica de forma uniforme a todo el documento; no permite girar páginas individuales a ángulos distintos.'] },
        { h2: 'Paso 3 - obtén el resultado', paragraphs: ['El archivo se procesa en esta pestaña del navegador y nunca se sube a un servidor.', 'Para dividir, unir o comprimir el PDF en su lugar, consulta la sección de herramientas relacionadas.'] },
      ],
      backLabel: 'Volver a herramientas de PDF',
    },
    when: {
      title: 'Girar PDF Cuando Usarlo',
      desc: 'Girar PDF Cuando Usarlo - cuando abrir Girar PDF tiene sentido y qué esperar cuando lo hace.',
      h1: 'Girar PDF Cuando Usarlo',
      intro: `${TOOL_LINK_EN}Girar PDF</a> vale la pena abrirlo cuando necesitas una ejecución rápida y puntual sin instalar nada. Esta página explica cuándo eso tiene sentido y cuándo no.`,
      sections: [
        { h2: 'Cuando tiene sentido', paragraphs: ['El ángulo se aplica de forma uniforme a todo el documento; no permite girar páginas individuales a ángulos distintos.'] },
        { h2: 'Qué esperar', paragraphs: ['El archivo se procesa en esta pestaña del navegador y nunca se sube a un servidor.', 'Para dividir, unir o comprimir el PDF en su lugar, consulta la sección de herramientas relacionadas.'] },
      ],
      backLabel: 'Volver a herramientas de PDF',
    },
    vs: {
      title: 'Girar PDF Vs Alternativas',
      desc: 'Girar PDF Vs Alternativas - cómo se compara Girar PDF con una aplicación de escritorio o un servicio en línea basado en subida de archivos.',
      h1: 'Girar PDF Vs Alternativas',
      intro: `${TOOL_LINK_EN}Girar PDF</a> es una de tres formas comunes de hacer esto: una herramienta en el navegador como esta, una aplicación de escritorio o un servicio en línea basado en subida de archivos. Cada una tiene ventajas distintas en cuanto a dónde va tu archivo y qué necesitas instalar.`,
      sections: [
        { h2: 'Cómo se compara Girar PDF', table: { header: ['Aspecto', 'Girar PDF (esta herramienta)', 'Aplicación de escritorio', 'Servicio en línea basado en subida'], rows: [
          ['Dónde va tu archivo', 'Permanece en este dispositivo', 'Permanece en este dispositivo', 'Se sube a un servidor'],
          ['Instalación necesaria', 'No', 'Sí', 'No'],
          ['Funciona sin cuenta', 'Sí', 'Sí', 'Varía según el servicio'],
        ] }, paragraphs: ['El ángulo se aplica de forma uniforme a todo el documento; no permite girar páginas individuales a ángulos distintos.', 'El archivo se procesa en esta pestaña del navegador y nunca se sube a un servidor.'] },
      ],
      backLabel: 'Volver a herramientas de PDF',
    },
  },
  vi: {
    step: {
      title: 'Xoay PDF Tung Buoc',
      desc: 'Xoay PDF Tung Buoc - cac buoc chinh xac de chay Xoay PDF tu khi mo den khi tai ket qua.',
      h1: 'Xoay PDF Tung Buoc',
      intro: `${TOOL_LINK_EN}Xoay PDF</a> chay theo ba buoc: mo cong cu, cung cap dau vao, roi tai ket qua. Trang nay giai thich moi buoc can gi.`,
      sections: [
        { h2: 'Buoc 1 - mo cong cu', paragraphs: [`Mo ${TOOL_LINK_EN}Xoay PDF</a>. Khong can cai dat hay dang nhap truoc khi bat dau.`] },
        { h2: 'Buoc 2 - cung cap dau vao', paragraphs: ['Goc xoay duoc ap dung deu cho toan bo tai lieu; khong ho tro xoay tung trang theo goc khac nhau.'] },
        { h2: 'Buoc 3 - nhan ket qua', paragraphs: ['File duoc xu ly ngay trong tab trinh duyet nay va khong bao gio duoc gui len server.', 'De tach, ghep, hoac nen PDF, xem phan cong cu lien quan.'] },
      ],
      backLabel: 'Ve lai cong cu PDF',
    },
    when: {
      title: 'Xoay PDF Khi Nao Nen Dung',
      desc: 'Xoay PDF Khi Nao Nen Dung - khi nao mo Xoay PDF phu hop, va ban se nhan duoc gi khi dung no.',
      h1: 'Xoay PDF Khi Nao Nen Dung',
      intro: `${TOOL_LINK_EN}Xoay PDF</a> dang de mo khi ban can chay nhanh, mot lan, khong can cai dat gi. Trang nay noi ro khi nao phu hop va khi nao khong.`,
      sections: [
        { h2: 'Khi nao phu hop', paragraphs: ['Goc xoay duoc ap dung deu cho toan bo tai lieu; khong ho tro xoay tung trang theo goc khac nhau.'] },
        { h2: 'Ban se nhan duoc gi', paragraphs: ['File duoc xu ly ngay trong tab trinh duyet nay va khong bao gio duoc gui len server.', 'De tach, ghep, hoac nen PDF, xem phan cong cu lien quan.'] },
      ],
      backLabel: 'Ve lai cong cu PDF',
    },
    vs: {
      title: 'Xoay PDF So Sanh Voi Cac Lua Chon Khac',
      desc: 'Xoay PDF So Sanh Voi Cac Lua Chon Khac - Xoay PDF khac gi voi ung dung desktop hoac dich vu online can tai file len.',
      h1: 'Xoay PDF So Sanh Voi Cac Lua Chon Khac',
      intro: `${TOOL_LINK_EN}Xoay PDF</a> la mot trong ba cach pho bien de lam viec nay: mot cong cu chay trong trinh duyet nhu the nay, mot ung dung desktop, hoac mot dich vu online can tai file len. Moi cach danh doi khac nhau ve noi file cua ban di den va nhung gi ban can cai dat.`,
      sections: [
        { h2: 'Xoay PDF so sanh nhu the nao', table: { header: ['Khia canh', 'Xoay PDF (cong cu nay)', 'Ung dung desktop', 'Dich vu online can tai len'], rows: [
          ['Noi file cua ban di den', 'Van o tren thiet bi nay', 'Van o tren thiet bi nay', 'Duoc tai len server'],
          ['Can cai dat', 'Khong', 'Co', 'Khong'],
          ['Hoat dong khong can tai khoan', 'Co', 'Co', 'Tuy dich vu'],
        ] }, paragraphs: ['Goc xoay duoc ap dung deu cho toan bo tai lieu; khong ho tro xoay tung trang theo goc khac nhau.', 'File duoc xu ly ngay trong tab trinh duyet nay va khong bao gio duoc gui len server.'] },
      ],
      backLabel: 'Ve lai cong cu PDF',
    },
  },
  id: {
    step: {
      title: 'Memutar PDF Langkah demi Langkah',
      desc: 'Memutar PDF Langkah demi Langkah - langkah pasti untuk menjalankan Memutar PDF dari membuka hingga mengunduh hasilnya.',
      h1: 'Memutar PDF Langkah demi Langkah',
      intro: `${TOOL_LINK_EN}Memutar PDF</a> berjalan dalam tiga langkah: buka alat, berikan input Anda, lalu unduh hasilnya. Halaman ini menjelaskan apa yang diharapkan di setiap langkah.`,
      sections: [
        { h2: 'Langkah 1 - buka alat', paragraphs: [`Buka ${TOOL_LINK_EN}Memutar PDF</a>. Tidak perlu memasang apa pun atau masuk akun sebelum memulai.`] },
        { h2: 'Langkah 2 - berikan input Anda', paragraphs: ['Sudut rotasi diterapkan secara merata ke seluruh dokumen; tidak mendukung memutar halaman tertentu ke sudut yang berbeda.'] },
        { h2: 'Langkah 3 - dapatkan hasilnya', paragraphs: ['File diproses langsung di tab browser ini dan tidak pernah diunggah ke server.', 'Untuk memisahkan, menggabungkan, atau mengompres PDF, lihat bagian alat terkait.'] },
      ],
      backLabel: 'Kembali ke alat PDF',
    },
    when: {
      title: 'Memutar PDF Kapan Digunakan',
      desc: 'Memutar PDF Kapan Digunakan - kapan membuka Memutar PDF cocok dan apa yang diharapkan.',
      h1: 'Memutar PDF Kapan Digunakan',
      intro: `${TOOL_LINK_EN}Memutar PDF</a> layak dibuka saat kamu perlu proses cepat sekali jalan tanpa memasang apa pun. Halaman ini membahas kapan itu cocok dan kapan tidak.`,
      sections: [
        { h2: 'Kapan cocok', paragraphs: ['Sudut rotasi diterapkan secara merata ke seluruh dokumen; tidak mendukung memutar halaman tertentu ke sudut yang berbeda.'] },
        { h2: 'Apa yang diharapkan', paragraphs: ['File diproses langsung di tab browser ini dan tidak pernah diunggah ke server.', 'Untuk memisahkan, menggabungkan, atau mengompres PDF, lihat bagian alat terkait.'] },
      ],
      backLabel: 'Kembali ke alat PDF',
    },
    vs: {
      title: 'Memutar PDF Vs Alternatif',
      desc: 'Memutar PDF Vs Alternatif - bagaimana Memutar PDF dibandingkan dengan aplikasi desktop atau layanan online berbasis unggah.',
      h1: 'Memutar PDF Vs Alternatif',
      intro: `${TOOL_LINK_EN}Memutar PDF</a> adalah satu dari tiga cara umum melakukan ini: alat berbasis browser seperti ini, aplikasi desktop, atau layanan online berbasis unggah. Masing-masing punya kelebihan berbeda soal ke mana file Anda pergi dan apa yang perlu dipasang.`,
      sections: [
        { h2: 'Bagaimana Memutar PDF dibandingkan', table: { header: ['Aspek', 'Memutar PDF (alat ini)', 'Aplikasi desktop', 'Layanan online berbasis unggah'], rows: [
          ['Ke mana file Anda pergi', 'Tetap di perangkat ini', 'Tetap di perangkat ini', 'Diunggah ke server'],
          ['Perlu instalasi', 'Tidak', 'Ya', 'Tidak'],
          ['Berfungsi tanpa akun', 'Ya', 'Ya', 'Bergantung pada layanan'],
        ] }, paragraphs: ['Sudut rotasi diterapkan secara merata ke seluruh dokumen; tidak mendukung memutar halaman tertentu ke sudut yang berbeda.', 'File diproses langsung di tab browser ini dan tidak pernah diunggah ke server.'] },
      ],
      backLabel: 'Kembali ke alat PDF',
    },
  },
  de: {
    step: {
      title: 'PDF Drehen Schritt fuer Schritt',
      desc: 'PDF Drehen Schritt fuer Schritt - die genauen Schritte, um PDF Drehen vom Oeffnen bis zum Herunterladen des Ergebnisses auszufuehren.',
      h1: 'PDF Drehen Schritt fuer Schritt',
      intro: `${TOOL_LINK_EN}PDF Drehen</a> laeuft in drei Schritten ab: das Werkzeug oeffnen, die Eingabe bereitstellen, dann das Ergebnis herunterladen. Diese Seite erklaert, was jeder Schritt erwartet.`,
      sections: [
        { h2: 'Schritt 1 - Werkzeug oeffnen', paragraphs: [`Oeffne ${TOOL_LINK_EN}PDF Drehen</a>. Vor dem Start muss nichts installiert oder angemeldet werden.`] },
        { h2: 'Schritt 2 - Eingabe bereitstellen', paragraphs: ['Der Winkel wird einheitlich auf das gesamte Dokument angewendet; einzelne Seiten koennen nicht auf unterschiedliche Winkel gedreht werden.'] },
        { h2: 'Schritt 3 - Ergebnis erhalten', paragraphs: ['Die Datei wird direkt in diesem Browser-Tab verarbeitet und nie an einen Server hochgeladen.', 'Um das PDF stattdessen zu teilen, zusammenzufuegen oder zu komprimieren, siehe den Abschnitt mit verwandten Werkzeugen.'] },
      ],
      backLabel: 'Zurueck zu PDF-Werkzeugen',
    },
    when: {
      title: 'PDF Drehen Wann Nutzen',
      desc: 'PDF Drehen Wann Nutzen - wann das Oeffnen von PDF Drehen passt und was dabei zu erwarten ist.',
      h1: 'PDF Drehen Wann Nutzen',
      intro: `${TOOL_LINK_EN}PDF Drehen</a> lohnt sich, wenn du einen schnellen, einmaligen Durchlauf ohne Installation brauchst. Diese Seite zeigt, wann das passt und wann nicht.`,
      sections: [
        { h2: 'Wann es passt', paragraphs: ['Der Winkel wird einheitlich auf das gesamte Dokument angewendet; einzelne Seiten koennen nicht auf unterschiedliche Winkel gedreht werden.'] },
        { h2: 'Was zu erwarten ist', paragraphs: ['Die Datei wird direkt in diesem Browser-Tab verarbeitet und nie an einen Server hochgeladen.', 'Um das PDF stattdessen zu teilen, zusammenzufuegen oder zu komprimieren, siehe den Abschnitt mit verwandten Werkzeugen.'] },
      ],
      backLabel: 'Zurueck zu PDF-Werkzeugen',
    },
    vs: {
      title: 'PDF Drehen Vs Alternativen',
      desc: 'PDF Drehen Vs Alternativen - wie PDF Drehen im Vergleich zu einer Desktop-Anwendung oder einem Upload-basierten Online-Dienst abschneidet.',
      h1: 'PDF Drehen Vs Alternativen',
      intro: `${TOOL_LINK_EN}PDF Drehen</a> ist eine von drei gaengigen Methoden dafuer: ein browserbasiertes Werkzeug wie dieses, eine Desktop-Anwendung oder ein Upload-basierter Online-Dienst. Jede Variante hat andere Kompromisse dabei, wohin deine Datei geht und was du installieren musst.`,
      sections: [
        { h2: 'Wie PDF Drehen abschneidet', table: { header: ['Aspekt', 'PDF Drehen (dieses Werkzeug)', 'Desktop-Anwendung', 'Upload-basierter Online-Dienst'], rows: [
          ['Wohin deine Datei geht', 'Bleibt auf diesem Geraet', 'Bleibt auf diesem Geraet', 'Wird auf einen Server hochgeladen'],
          ['Installation erforderlich', 'Nein', 'Ja', 'Nein'],
          ['Funktioniert ohne Konto', 'Ja', 'Ja', 'Je nach Dienst unterschiedlich'],
        ] }, paragraphs: ['Der Winkel wird einheitlich auf das gesamte Dokument angewendet; einzelne Seiten koennen nicht auf unterschiedliche Winkel gedreht werden.', 'Die Datei wird direkt in diesem Browser-Tab verarbeitet und nie an einen Server hochgeladen.'] },
      ],
      backLabel: 'Zurueck zu PDF-Werkzeugen',
    },
  },
};

const ANGLE_SLUG = { step: 'stepbystep', when: 'when', vs: 'vsalternatives' };
const ANGLE_ROUTE = { step: 'step-by-step', when: 'when', vs: 'vs-alternatives' };

let written = 0;
for (const [lang, angles] of Object.entries(LOCALES)) {
  for (const [angleKey, content] of Object.entries(angles)) {
    if (angleKey === 'toolName') continue;
    const slug = `guides${lang}rotatepdf${ANGLE_SLUG[angleKey]}`;
    fs.writeFileSync(path.join(CMS, `BODYTITLE${slug}.txt`), content.title + '\n');
    fs.writeFileSync(path.join(CMS, `BODYDESC${slug}.txt`), content.desc + '\n');
    fs.writeFileSync(path.join(CMS, `BODYHTML${slug}.html`), html(content));
    written += 3;

    const jspDir = path.join(JSP, lang);
    fs.mkdirSync(jspDir, { recursive: true });
    fs.writeFileSync(path.join(jspDir, `rotate-pdf-${ANGLE_ROUTE[angleKey]}.jsp`), JSP_TEMPLATE);
    written += 1;
  }
}
console.log(`Wrote ${written} files (15 guide pages x [BODYTITLE, BODYDESC, BODYHTML, JSP]).`);
