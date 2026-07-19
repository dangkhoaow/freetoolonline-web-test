#!/usr/bin/env node
import { execFileSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
const execFileAsync = promisify(execFile);
const ROOT = '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const REPO = process.env.STAGING_REPO || '/tmp/fto-fire151-stg';
const HOLDER = 'game-discovery-fire151';
const VERIFY = 'https://dangkhoaow.github.io/freetoolonline-web-test/games/rune-keeper.html';
const WAIT = path.join(ROOT, '.agent/skills/seo-runner-route/scripts/wait-for-deploy.mjs');
const { acquireLease, releaseLease } = await import(path.join(ROOT, '.agent/skills/_lib/deploy-lease.mjs'));
function git(...args) { return execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8' }); }
const lr = acquireLease({ repoRoot: ROOT, holder: HOLDER });
if (!lr.acquired) { console.log(JSON.stringify({ ok: false, reason: 'deploy_lease_held', heldBy: lr.heldBy, age_minutes: lr.age_minutes })); process.exit(4); }
try {
  git('fetch', 'origin', 'main');
  try { git('merge', '--no-edit', 'origin/main'); }
  catch (e) { console.error('merge failed', e.message||e); try { git('merge', '--abort'); } catch {} process.exit(3); }
  execFileSync('git', ['-C', REPO, 'push', 'origin', 'HEAD:main'], { stdio: 'inherit' });
  const sha = git('rev-parse', '--short', 'HEAD').trim();
  console.log(JSON.stringify({ ok: true, pushed: true, pushedSha: sha }));
  const args = [WAIT, '--repo=staging', `--sha=${sha}`, `--url=${VERIFY}`, '--json'];
  try {
    const { stdout } = await execFileAsync('node', args, { timeout: (45*60+60)*1000, maxBuffer: 8*1024*1024 });
    const build = JSON.parse(String(stdout).trim().split('\n').pop());
    console.log(JSON.stringify({ ok: true, pushedSha: sha, build }, null, 2));
    process.exit(build?.ok === false ? 1 : 0);
  } catch (e) {
    try { const build = JSON.parse(String(e.stdout||'').trim().split('\n').pop()); console.log(JSON.stringify({ ok:false, pushedSha:sha, build},null,2)); process.exit(build?.ok===false?1:0); }
    catch { console.error('wait failed', e.message||e); process.exit(1); }
  }
} finally { releaseLease({ repoRoot: ROOT, holder: HOLDER }); }
