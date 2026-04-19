// qa-visual-audit-20260419.mjs - forwards to qa-visual-audit-20260418.mjs (identical logic).
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const runner = path.join(path.dirname(fileURLToPath(import.meta.url)), 'qa-visual-audit-20260418.mjs');
const child = spawn(process.execPath, [runner, ...process.argv.slice(2)], { stdio: 'inherit' });
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
