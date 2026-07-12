#!/usr/bin/env node
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const SRC = '/tmp/src-ibouncy';
const WORK = '/tmp/src-ibouncy-adapt';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/precision-bounce-loop');

rmSync(WORK, { recursive: true, force: true });
cpSync(SRC, WORK, { recursive: true });

function patch(path, pairs) {
  let text = readFileSync(join(WORK, path), 'utf8');
  for (const [from, to] of pairs) text = text.replace(from, to);
  writeFileSync(join(WORK, path), text, 'utf8');
}

patch('src/elements/E_MainMenu.js', [
  ['.$append("按")\n            .$append("空格键", 3, void 0, void 0, "bold")\n            .$append("开始游戏");',
    '.$append("Press ")\n            .$append("Space", 3, void 0, void 0, "bold")\n            .$append(" to start");'],
  ['.$append("通过")\n            .$append("方向键", 3, void 0, void 0, "bold")\n            .$append("或")\n            .$append("W/A/S/D", 3, void 0, void 0, "bold")\n            .$append("来控制平板的移动");',
    '.$append("Use ")\n            .$append("arrow keys", 3, void 0, void 0, "bold")\n            .$append(" or ")\n            .$append("W/A/S/D", 3, void 0, void 0, "bold")\n            .$append(" to move the tablet");'],
  ['new URL("/public/svg/brand.svg", import.meta.url).href;',
    'new URL("../../svg/brand.svg", import.meta.url).href;'],
]);

patch('src/elements/E_OptionsMenu.js', [
  ['text: "游戏已暂停",', 'text: "Game Paused",'],
  ['.$append("按")\n            .$append("空格键", 3, void 0, void 0, "bold")\n            .$append("继续游戏");',
    '.$append("Press ")\n            .$append("Space", 3, void 0, void 0, "bold")\n            .$append(" to continue");'],
  ['.$append("按")\n            .$append("回车键", 3, void 0, void 0, "bold")\n            .$append("结束游戏并返回开始菜单");',
    '.$append("Press ")\n            .$append("Enter", 3, void 0, void 0, "bold")\n            .$append(" to quit to main menu");'],
]);

patch('src/elements/E_Settlement.js', [
  ['.$append("按")\n            .$append("空格键", 3, void 0, void 0, "bold")\n            .$append("重新开始");',
    '.$append("Press ")\n            .$append("Space", 3, void 0, void 0, "bold")\n            .$append(" to restart");'],
  ['.$append("按")\n            .$append("回车键", 3, void 0, void 0, "bold")\n            .$append("返回开始菜单");',
    '.$append("Press ")\n            .$append("Enter", 3, void 0, void 0, "bold")\n            .$append(" to return to main menu");'],
  ['new URL("/fonts/HYBeiBingYang-W.woff2", import.meta.url).href;',
    'new URL("../../fonts/HYBeiBingYang-W.woff2", import.meta.url).href;'],
  ['new URL("/img/GL.jpg", import.meta.url).href;', 'new URL("../../img/GL.jpg", import.meta.url).href;'],
  ['new URL("/img/DL.jpg", import.meta.url).href;', 'new URL("../../img/DL.jpg", import.meta.url).href;'],
]);

let vite = readFileSync(join(WORK, 'vite.config.js'), 'utf8');
if (!vite.includes("base:")) {
  vite = vite.replace('export default defineConfig({', "export default defineConfig({\n    base: './',");
  writeFileSync(join(WORK, 'vite.config.js'), vite, 'utf8');
}

execSync('npm install --legacy-peer-deps', { cwd: WORK, stdio: 'inherit' });
execSync('npm run build', { cwd: WORK, stdio: 'inherit' });

rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
for (const item of ['index.html', 'assets', 'fonts', 'img', 'svg']) {
  cpSync(join(WORK, 'dist', item), join(DEST, item), { recursive: true });
}

let html = readFileSync(join(DEST, 'index.html'), 'utf8');
html = html.replace('<title>iBouncy - H</title>', '<title>Precision Bounce Loop</title>');
html = html.replace(
  '<meta charset="UTF-8">',
  '<meta charset="UTF-8">\n    <meta name="robots" content="noindex">',
);
writeFileSync(join(DEST, 'index.html'), html, 'utf8');
cpSync(join(WORK, 'LICENSE'), join(DEST, 'LICENSE'));
writeFileSync(
  join(DEST, 'CREDITS.txt'),
  'Precision Bounce Loop adapted from Horean0574/iBouncy (MIT, Copyright 2026 Horean0574).\nLeafer-Game canvas timing arcade: keep a ball bouncing on a moving tablet with combo scoring.\n',
);

console.log('Adapted precision-bounce-loop to', DEST);
