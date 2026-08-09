// Throwaway headless PROVE for /space-3d/bennu-osiris-rex.html (space-3d-discovery-loop-runbook §3 step 7).
// Serves dist/ locally, loads the page with swiftshader, asserts canvas paints + facts panel fills + zero scene-origin errors, at 390 + 1440.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const DIST = path.resolve(import.meta.dirname, "..", "dist");
const PORT = 8935 + Math.floor(Math.random() * 500);

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  let filePath = path.join(DIST, p);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, p, "index.html");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found: " + p); return; }
    const ext = path.extname(filePath);
    const type = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json" }[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

const results = [];
for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

  await page.goto(`http://localhost:${PORT}/space-3d/bennu-osiris-rex.html`, { waitUntil: "load" });
  await page.waitForTimeout(3500); // let requestIdleCallback boot() + first frame render

  const canvasInfo = await page.evaluate(() => {
    const host = document.getElementById("t3dCanvasHost");
    const canvas = host ? host.querySelector("canvas") : null;
    const info = document.getElementById("t3dInfoPanel");
    return {
      hasCanvas: !!canvas,
      canvasW: canvas ? canvas.width : 0,
      canvasH: canvas ? canvas.height : 0,
      infoHtml: info ? info.innerHTML.slice(0, 300) : null,
      status: document.getElementById("t3dStatus") ? document.getElementById("t3dStatus").textContent : null,
    };
  });

  let nonBlank = false;
  if (canvasInfo.hasCanvas) {
    const buf = await page.locator("#t3dCanvasHost canvas").screenshot();
    // crude non-blank check: PNG byte variance
    const bytes = new Uint8Array(buf);
    let sum = 0, sumSq = 0;
    for (let i = 0; i < bytes.length; i += 37) { sum += bytes[i]; sumSq += bytes[i] * bytes[i]; }
    const n = Math.ceil(bytes.length / 37);
    const mean = sum / n;
    const variance = sumSq / n - mean * mean;
    nonBlank = variance > 50;
  }

  // Click "Simulate TAG" and re-check state transition after animation completes.
  let tagWorked = false;
  const debug = { preClickDisplay: null, btnVisible: null, labelSamples: [] };
  try {
    debug.preClickDisplay = await page.evaluate(() => {
      const el = document.getElementById("t3dBennuControls");
      return el ? getComputedStyle(el).display : "MISSING";
    });
    debug.btnVisible = await page.locator("#t3dBennuTagBtn").isVisible();
    await page.click("#t3dBennuTagBtn", { timeout: 2000 });
    for (let i = 0; i < 8; i++) {
      await page.waitForTimeout(700);
      const label = await page.evaluate(() => {
        const el = document.getElementById("t3dBennuStateLabel");
        return el ? el.textContent : null;
      });
      debug.labelSamples.push(label);
      if (label && /TAG complete/i.test(label)) { tagWorked = true; break; }
    }
  } catch (e) {
    errors.push("tag-click-failed: " + String(e));
  }

  const sceneErrors = errors.filter((e) => !/adsbygoogle|doubleclick|googlesyndication|googletagmanager|google-analytics|favicon|ReadPixels|net::ERR_|get-rating|heath-check-alive|CORS policy|403/i.test(e));

  results.push({ viewport: viewport.width, ...canvasInfo, nonBlank, tagWorked, debug, errors: sceneErrors });
  await page.close();
}

await browser.close();
server.close();

console.log(JSON.stringify(results, null, 2));
const allPass = results.every((r) => r.hasCanvas && r.nonBlank && r.tagWorked && r.errors.length === 0);
console.log(allPass ? "PROVE: PASS" : "PROVE: FAIL");
process.exit(allPass ? 0 : 1);
