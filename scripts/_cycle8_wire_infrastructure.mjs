// One-shot infrastructure wiring for cycle 8: extends JSP_BY_ROUTE +
// GUIDE_ROUTES in scripts/site-data.mjs, the seo-clusters.mjs guides
// routes[], related-tools.js urlMaps[], and the static sitemap.xml.
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(REPO, 'scripts/_cycle8_manifest.json'), 'utf8'));

// 1) JSP_BY_ROUTE — append after the Cycle B block before /compose-pdf.html
{
  const file = path.join(REPO, 'scripts/site-data.mjs');
  let src = fs.readFileSync(file, 'utf8');
  const marker = "  '/guides/what-an-lcd-test-does-and-when-to-run-one.html': 'guide/what-an-lcd-test-does-and-when-to-run-one.jsp',";
  if (!src.includes(marker)) throw new Error('site-data.mjs JSP_BY_ROUTE marker not found');
  let added = 0;
  let block = "\n  // Phase 16 cycle 8 N-series guides (25 new).\n";
  for (const g of manifest.guides) {
    const route = `/guides/${g.slug}.html`;
    const jsp = `guide/${g.slug}.jsp`;
    if (src.includes(`'${route}': '${jsp}'`)) continue;
    block += `  '${route}': '${jsp}',\n`;
    added++;
  }
  src = src.replace(marker, marker + block);
  fs.writeFileSync(file, src);
  console.log(`site-data.mjs JSP_BY_ROUTE: +${added} routes`);
}

// 2) GUIDE_ROUTES set
{
  const file = path.join(REPO, 'scripts/site-data.mjs');
  let src = fs.readFileSync(file, 'utf8');
  const re = /export const GUIDE_ROUTES = new Set\(\[\n([\s\S]*?)\n\]\);/;
  const m = src.match(re);
  if (!m) throw new Error('site-data.mjs GUIDE_ROUTES not found');
  let body = m[1];
  let added = 0;
  for (const g of manifest.guides) {
    const route = `/guides/${g.slug}.html`;
    if (body.includes(`'${route}'`)) continue;
    body = body.replace(/(\n)$/, '') + `\n  '${route}',`;
    added++;
  }
  src = src.replace(re, `export const GUIDE_ROUTES = new Set([\n${body}\n]);`);
  fs.writeFileSync(file, src);
  console.log(`site-data.mjs GUIDE_ROUTES: +${added} entries`);
}

// 3) seo-clusters.mjs guides cluster routes[]
{
  const file = path.join(REPO, 'scripts/seo-clusters.mjs');
  let src = fs.readFileSync(file, 'utf8');
  // find the guides cluster's routes[] array
  const re = /(cluster:\s*['"]guides['"][\s\S]*?routes:\s*\[)([\s\S]*?)(\])/;
  const m = src.match(re);
  if (!m) throw new Error('seo-clusters.mjs guides cluster not found');
  let body = m[2];
  let added = 0;
  for (const g of manifest.guides) {
    const route = `/guides/${g.slug}.html`;
    if (body.includes(`'${route}'`)) continue;
    // ensure trailing comma
    body = body.replace(/[,\s]*$/, '');
    body += `,\n      '${route}'`;
    added++;
  }
  src = src.replace(re, m[1] + body + '\n    ' + m[3]);
  fs.writeFileSync(file, src);
  console.log(`seo-clusters.mjs guides routes[]: +${added} entries`);
}

// 4) related-tools.js urlMaps — insert before the closing ];
{
  const file = path.join(REPO, 'source/web/src/main/webapp/static/script/related-tools.js');
  let src = fs.readFileSync(file, 'utf8');
  // append entries inside the existing urlMaps array (find the last guide entry then insert after)
  // strategy: find a known anchor entry and append our entries right after it
  const anchor = '{ title: "What an LCD Test Does (and When to Run One)", url: "https://freetoolonline.com/guides/what-an-lcd-test-does-and-when-to-run-one.html", include: !1, tags: "guide,device-test,lcd" }';
  if (!src.includes(anchor)) throw new Error('related-tools.js anchor entry not found');
  let block = '';
  let added = 0;
  for (const g of manifest.guides) {
    const url = `https://freetoolonline.com/guides/${g.slug}.html`;
    if (src.includes(url)) continue;
    block += `,\n    { title: ${JSON.stringify(g.title)}, url: ${JSON.stringify(url)}, include: !1, tags: ${JSON.stringify(g.tags)} }`;
    added++;
  }
  src = src.replace(anchor, anchor + block);
  fs.writeFileSync(file, src);
  console.log(`related-tools.js urlMaps: +${added} entries`);
}

// 5) static sitemap.xml — append <url> entries before </urlset>
{
  const file = path.join(REPO, 'source/web/src/main/webapp/static/sitemap.xml');
  let src = fs.readFileSync(file, 'utf8');
  const closer = '</urlset>';
  if (!src.includes(closer)) throw new Error('sitemap.xml closer not found');
  const today = new Date().toISOString();
  let block = '';
  let added = 0;
  for (const g of manifest.guides) {
    const url = `https://freetoolonline.com/guides/${g.slug}.html`;
    if (src.includes(`<loc>${url}</loc>`)) continue;
    block += `  <url><loc>${url}</loc><lastmod>${today}</lastmod></url>\n`;
    added++;
  }
  src = src.replace(closer, block + closer);
  fs.writeFileSync(file, src);
  console.log(`sitemap.xml: +${added} <url> entries`);
}

console.log('Done.');
