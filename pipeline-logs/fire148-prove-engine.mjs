import { chromium } from 'playwright';

const INDEX = process.env.PROVE_URL || 'http://localhost:8950/index.html';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });

  await page.goto(INDEX, { waitUntil: 'load' });
  await page.waitForSelector('#startButton', { timeout: 10000 });
  await page.click('#startButton');
  await page.waitForTimeout(800);

  const canvas = page.locator('#gameCanvas');
  const shot1 = await canvas.screenshot();
  console.log('post-start screenshot bytes:', shot1.length);

  // Summon a unit (key 1 = Robot Infantry) and let the sim run a bit.
  await page.keyboard.press('1');
  await page.waitForTimeout(3000);
  const shot2 = await canvas.screenshot();
  console.log('post-summon screenshot bytes:', shot2.length);
  const changed = Buffer.compare(shot1, shot2) !== 0;
  console.log('frame-changed-after-summon+3s:', changed);

  // Read the live HUD stats to confirm the simulation is genuinely ticking
  // (energy regenerates, threat/status text updates) - a stronger signal
  // than pixel diffing alone for a mostly-dark sci-fi UI.
  const hud = await page.evaluate(() => ({
    energy: document.getElementById('energyText')?.textContent,
    scrap: document.getElementById('scrapText')?.textContent,
    base: document.getElementById('baseText')?.textContent,
    hive: document.getElementById('hiveText')?.textContent,
    status: document.getElementById('statusText')?.textContent,
  }));
  console.log('HUD after start:', JSON.stringify(hud));

  if (errors.length) {
    console.log('PAGE ERRORS:', JSON.stringify(errors, null, 2));
  }

  await browser.close();

  const hudLooksLive = hud.base && hud.base !== '0' && hud.hive && hud.hive !== '0';
  const result = { ok: changed && hudLooksLive && errors.length === 0, changed, hud, errors };
  console.log('RESULT', JSON.stringify(result));
  if (!result.ok) process.exit(1);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
