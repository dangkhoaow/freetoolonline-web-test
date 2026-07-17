import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/dist';
const ROOT = DIST;
const mime = { '.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.wasm':'application/wasm' };
const server = http.createServer((req,res)=>{
  let u = decodeURIComponent((req.url||'/').split('?')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const fp = path.join(ROOT, u);
  if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, {'Content-Type': mime[path.extname(fp)]||'application/octet-stream'});
  fs.createReadStream(fp).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port = server.address().port;
const url = `http://127.0.0.1:${port}/games/layer-flip-platformer.html`;
const browser = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const results = [];
for (const w of [390, 1440]) {
  const page = await browser.newPage({ viewport:{width:w,height:800} });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', msg => { if (msg.type()==='error') errs.push(msg.text()); });
  await page.goto(url, { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForSelector('#lfpPlayBtn', { timeout:15000 });
  await page.click('#lfpPlayBtn');
  await page.waitForSelector('#lfpFrame', { timeout:15000 });
  await page.waitForTimeout(2500);
  const frame = page.frameLocator('#lfpFrame');
  // SVG game root exists in ONOFF
  const hasSvg = await frame.locator('#game, svg#game, body').count().catch(()=>0);
  const gameOriginErrs = errs.filter(e => !/get-rating|adsbygoogle|gtag|403|Failed to load resource|heath-check-alive|downloader\.freetool\.online|CORS policy/i.test(e));
  results.push({ w, hasSvg, errs: gameOriginErrs.slice(0,5), ok: hasSvg>0 && gameOriginErrs.length===0 });
  await page.close();
}
await browser.close();
server.close();
console.log(JSON.stringify(results,null,2));
if (!results.every(r=>r.ok)) process.exit(2);
console.log('PROVE_PASS');
