#!/usr/bin/env node
import { cpSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = '/tmp/stg-game-scan';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/nova-star-barrage');
const LS = 'ftol:novastarbarrage:';

const SKIP = new Set([
  '.git', '.github', '.omo', '.sisyphus', 'tools', 'server.js', 'sw.js',
  'manifest.json', '_headers', 'README.md',
]);

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    if (SKIP.has(name)) continue;
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) copyTree(s, d);
    else cpSync(s, d);
  }
}

function patchFile(path, fn) {
  const text = readFileSync(path, 'utf8');
  writeFileSync(path, fn(text), 'utf8');
}

function nsKeys(text) {
  let out = text;
  out = out.replace(/'stg_/g, `'${LS}stg_`);
  out = out.replace(/"stg_/g, `"${LS}stg_`);
  out = out.replace(/'DailyRun_/g, `'${LS}DailyRun_`);
  out = out.replace(/'__stg_test__'/g, `'__ftol_novastarbarrage_test__'`);
  return out;
}

mkdirSync(DEST, { recursive: true });
copyTree(SRC, DEST);

writeFileSync(join(DEST, 'LICENSE'), readFileSync(join(SRC, 'LICENSE'), 'utf8'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Nova Star Barrage adapted from WXFffff666/stg-game (MIT, Copyright 2026).\nOriginal HTML5 Canvas bullet-hell shmup with factions, talents, and weapon fusion.\n',
);

patchFile(join(DEST, 'index.html'), (html) => {
  let out = html;
  out = out.replace('<html lang="zh-CN">', '<html lang="en">');
  out = out.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n<meta name="robots" content="noindex">');
  out = out.replace(/<link rel="manifest" href="\.\/manifest\.json">\n/, '');
  out = out.replace(/<title>星域战机 - STG<\/title>/, '<title>Nova Star Barrage</title>');
  out = out.replace(/<h1>星域战机<\/h1>/, '<h1>Nova Star Barrage</h1>');
  out = out.replace(/<div class="subtitle">STAR DOMAIN STG<\/div>/, '<div class="subtitle">NOVA STAR BARRAGE</div>');
  out = out.replace(/id="btn-start">开始游戏/, 'id="btn-start">Start Game');
  out = out.replace(/id="btn-daily"[^>]*>📅 每日挑战/, 'id="btn-daily" style="flex:1;max-width:180px;font-size:12px;padding:10px 8px;">Daily Challenge');
  out = out.replace(/id="btn-endless"[^>]*>🔁 无尽模式/, 'id="btn-endless" style="flex:1;max-width:180px;font-size:12px;padding:10px 8px;">Endless Mode');
  out = out.replace(/id="btn-challenge"[^>]*>⚡ 挑战模式/, 'id="btn-challenge" style="margin-top:4px;">Challenge Mode');
  out = out.replace(/id="btn-codex">📖 图鉴/, 'id="btn-codex">Codex');
  out = out.replace(/id="btn-meta-shop">🛒 商店/, 'id="btn-meta-shop">Shop');
  out = out.replace(/id="btn-settings">⚙️ 设置/, 'id="btn-settings">Settings');
  out = out.replace(/id="btn-leaderboard">排行榜/, 'id="btn-leaderboard">Leaderboard');
  out = out.replace(/id="btn-howto">操作说明/, 'id="btn-howto">How to Play');
  out = out.replace(/id="btn-talent-confirm">确认出战/, 'id="btn-talent-confirm">Confirm Loadout');
  out = out.replace(/var messages = \['加载核心引擎\.\.\.', '初始化战斗系统\.\.\.', '加载武器模块\.\.\.', '准备就绪!'\];/,
    "var messages = ['Loading core engine...', 'Initializing combat...', 'Loading weapons...', 'Ready!'];");
  out = out.replace(/text\.textContent = '准备就绪!';/, "text.textContent = 'Ready!';");
  out = out.replace(
    /if \('serviceWorker' in navigator\) \{[\s\S]*?\}\n\}\);\n<\/script>/,
    '// service worker disabled for iframe embed\n})();\n</script>',
  );
  return nsKeys(out);
});

function walkJs(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkJs(p);
    else if (name.endsWith('.js')) patchFile(p, nsKeys);
  }
}
walkJs(join(DEST, 'js'));

console.log('Adapted nova-star-barrage to', DEST);
