#!/usr/bin/env node
/** fire142 push: restore-before-push desk-cat-coder on staging + prod mirror */
import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { acquireLock, releaseLock, lockStatus, refreshLock } from '../../.agent/skills/_lib/cleanup-backlog-lock.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STG = join(__dirname, '..');
const FRONTEND = join(STG, '..');
const PROD_MAIN = join(FRONTEND, 'freetoolonline-web');
const PROD_WT = '/tmp/fto-gamedrain-fresh';
const SESSION = 'game-discovery-fire142';

function sh(cwd, args, opts = {}) {
  return spawnSync(args[0], args.slice(1), {
    cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    timeout: opts.timeout ?? 180000,
    env: { ...process.env, ...(opts.env || {}) },
  });
}
function sleep(ms) {
  spawnSync('/bin/sleep', [String(Math.max(1, Math.ceil(ms / 1000)))], { stdio: 'ignore', timeout: ms + 5000 });
}
function log(...a) { console.log(new Date().toISOString(), ...a); }

function hasGame(repo, ref = 'HEAD') {
  return sh(repo, ['git', 'cat-file', '-e', `${ref}:source/web/src/main/webapp/static/games/desk-cat-coder/index.html`]).status === 0;
}

function walkRel(root, base, pred) {
  const out = [];
  function w(dir) {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) w(full);
      else if (pred(full)) out.push(relative(root, full));
    }
  }
  w(base);
  return out;
}

function collectStagingPaths() {
  const paths = [
    'scripts/site-data.mjs', 'scripts/seo-clusters.mjs',
    'source/static/src/main/webapp/resources/view/l-menu.html',
    'source/web/src/main/webapp/static/script/related-tools.js',
    'source/web/src/main/webapp/static/games/desk-cat-coder',
    'source/web/src/main/webapp/WEB-INF/jsp/games/desk-cat-coder.jsp',
    'pipeline-logs/fire142-scaffold-desk-cat-coder.mjs',
    'pipeline-logs/fire142-patch-registries.mjs',
    'pipeline-logs/fire142-prove-desk-cat-coder.mjs',
    'pipeline-logs/fire142-mirror-prod.mjs',
    'pipeline-logs/fire142-ship-push.mjs',
    'pipeline-logs/fire142-prove-engine.json',
  ];
  const cms = walkRel(STG, join(STG, 'source/static/src/main/webapp/resources/view/CMS'), (f) => /deskcatcoder/i.test(f));
  const guides = walkRel(STG, join(STG, 'source/web/src/main/webapp/WEB-INF/jsp/guide'), (f) => /desk-cat-coder/i.test(f));
  const pics = walkRel(STG, join(STG, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'), (f) => /deskcatcoder__/i.test(f));
  return [...paths, ...cms, ...guides, ...pics].filter((p) => existsSync(join(STG, p)));
}

function ensureCommitted() {
  for (const f of ['scripts/site-data.mjs', 'scripts/seo-clusters.mjs',
    'source/static/src/main/webapp/resources/view/l-menu.html',
    'source/web/src/main/webapp/static/script/related-tools.js']) {
    sh(STG, ['git', 'update-index', '--no-assume-unchanged', '--', f]);
    sh(STG, ['git', 'update-index', '--no-skip-worktree', '--', f]);
  }
  if (hasGame(STG)) {
    // still stage any pending path changes
    const all = collectStagingPaths();
    sh(STG, ['git', 'add', '-f', '--', ...all]);
    const cached = sh(STG, ['git', 'diff', '--cached', '--name-only']).stdout || '';
    if (cached.trim()) {
      const r = sh(STG, ['git', 'commit', '-m', 'game-discovery fire142: Desk Cat Coder (/games/desk-cat-coder.html) + 18 locale guides.']);
      log('commit', (r.stdout || r.stderr || '').slice(-300));
    } else log('staging already committed with desk-cat-coder');
    return;
  }
  const all = collectStagingPaths();
  log('add count', all.length);
  let r = sh(STG, ['git', 'add', '-f', '--', ...all]);
  if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
  r = sh(STG, ['git', 'commit', '-m', 'game-discovery fire142: Desk Cat Coder (/games/desk-cat-coder.html) + 18 locale guides.']);
  log('commit', (r.stdout || r.stderr || '').slice(-400));
  if (r.status !== 0 && !(r.stdout || '').includes('nothing to commit')) process.exit(1);
}

// lock
let acquired = false;
for (let i = 1; i <= 60; i++) {
  const st = lockStatus(FRONTEND);
  if (st.held && st.lock?.session !== SESSION) {
    log(`cleanup lock held by ${st.lock?.session} age=${st.age_minutes} attempt=${i}`);
    sleep(25000); continue;
  }
  const lr = acquireLock({ repoRoot: FRONTEND, session: SESSION, ttlMinutes: 120 });
  if (lr.acquired) { acquired = true; log('acquired cleanup lock'); break; }
  sleep(20000);
}
if (!acquired) process.exit(4);

try {
  ensureCommitted();
  const leanEnv = { SEO_LEAN_MIRROR: '1', PA_LEAN_CUSTOM_PROMPT: '1' };

  let stgOk = false;
  for (let i = 1; i <= 120; i++) {
    refreshLock({ repoRoot: FRONTEND, session: SESSION });
    if (!hasGame(STG)) ensureCommitted();
    log('staging push attempt', i);
    const r = sh(FRONTEND, [
      'node', 'dashboard/laneGit.mjs',
      '--repo-dir', STG, '--branch', 'main',
      '--holder', 'game-manual-fire142', '--session', SESSION,
      '--wait-build', '--repo-key', 'staging',
      '--verify-url', 'https://dangkhoaow.github.io/freetoolonline-web-test/games/desk-cat-coder.html',
    ], { timeout: 3600000, env: leanEnv });
    const out = (r.stdout || '') + (r.stderr || '');
    log(out.slice(-500));
    if (out.includes('"ok":true')) {
      sh(STG, ['git', 'fetch', 'origin', 'main']);
      if (hasGame(STG, 'origin/main')) {
        writeFileSync('/tmp/fire142-stg-ok.json', out);
        stgOk = true; log('STAGING_PUSH_OK'); break;
      }
    }
    sleep(out.includes('deploy_lease_held') ? 35000 : 40000);
  }
  if (!stgOk) process.exit(1);

  let prodDir = PROD_MAIN;
  if (existsSync(PROD_WT)) {
    sh(FRONTEND, ['git', '-C', PROD_MAIN, 'checkout', '--detach', 'HEAD']);
    sh(PROD_WT, ['git', 'fetch', 'origin', 'seo-boost']);
    sh(PROD_WT, ['git', 'checkout', '-B', 'seo-boost', 'origin/seo-boost']);
    prodDir = PROD_WT;
  } else {
    sh(PROD_MAIN, ['git', 'fetch', 'origin', 'seo-boost']);
    sh(PROD_MAIN, ['git', 'checkout', '-B', 'seo-boost', 'origin/seo-boost']);
  }

  let r = sh(STG, ['node', 'pipeline-logs/fire142-mirror-prod.mjs'], { env: { PROD_REPO: prodDir } });
  log('mirror', ((r.stdout || '') + (r.stderr || '')).slice(-400));
  if (r.status !== 0) process.exit(1);

  const prodAdds = [
    'scripts/site-data.mjs', 'scripts/seo-clusters.mjs',
    'source/static/src/main/webapp/resources/view/l-menu.html',
    'source/web/src/main/webapp/static/script/related-tools.js',
    'source/web/src/main/webapp/static/games/desk-cat-coder',
    'source/web/src/main/webapp/WEB-INF/jsp/games/desk-cat-coder.jsp',
  ];
  const pCms = walkRel(prodDir, join(prodDir, 'source/static/src/main/webapp/resources/view/CMS'), (f) => /deskcatcoder/i.test(f));
  const pGuides = walkRel(prodDir, join(prodDir, 'source/web/src/main/webapp/WEB-INF/jsp/guide'), (f) => /desk-cat-coder/i.test(f));
  const pPics = walkRel(prodDir, join(prodDir, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram'), (f) => /deskcatcoder__/i.test(f));
  const pAll = [...prodAdds, ...pCms, ...pGuides, ...pPics].filter((p) => existsSync(join(prodDir, p)));
  sh(prodDir, ['git', 'add', '--', ...pAll]);
  const names = sh(prodDir, ['git', 'diff', '--cached', '--name-only']).stdout || '';
  if (names.includes('permanent-rules')) process.exit(1);
  if (names.trim()) {
    r = sh(prodDir, ['git', 'commit', '-m', 'Mirror Desk Cat Coder to prod (game-discovery fire142).']);
    log('prod commit', (r.stdout || r.stderr || '').slice(-300));
  }

  let prodOk = false;
  for (let i = 1; i <= 120; i++) {
    refreshLock({ repoRoot: FRONTEND, session: SESSION });
    if (!hasGame(prodDir)) {
      sh(prodDir, ['git', 'fetch', 'origin', 'seo-boost']);
      sh(prodDir, ['git', 'reset', '--hard', 'origin/seo-boost']);
      sh(STG, ['node', 'pipeline-logs/fire142-mirror-prod.mjs'], { env: { PROD_REPO: prodDir } });
      sh(prodDir, ['git', 'add', '--', ...pAll]);
      sh(prodDir, ['git', 'commit', '-m', 'Mirror Desk Cat Coder to prod (game-discovery fire142).']);
    }
    log('prod push attempt', i);
    r = sh(FRONTEND, [
      'node', 'dashboard/laneGit.mjs',
      '--repo-dir', prodDir, '--branch', 'seo-boost',
      '--holder', 'game-manual-fire142', '--session', `${SESSION}-prod`,
      '--wait-build', '--repo-key', 'prod',
      '--verify-url', 'https://freetoolonline.com/games/desk-cat-coder.html',
    ], { timeout: 3600000, env: leanEnv });
    const out = (r.stdout || '') + (r.stderr || '');
    log(out.slice(-500));
    if (out.includes('"ok":true') || out.includes('"pushed":true')) {
      sh(prodDir, ['git', 'fetch', 'origin', 'seo-boost']);
      if (hasGame(prodDir, 'origin/seo-boost')) {
        writeFileSync('/tmp/fire142-prod-ok.json', out);
        prodOk = true; log('PROD_PUSH_OK'); break;
      }
    }
    if (out.includes('deploy_lease_held')) { sleep(35000); continue; }
    if (out.includes('merge_conflict') || out.includes('phase6') || out.includes('permanent-rules')) {
      sh(prodDir, ['git', 'fetch', 'origin', 'seo-boost']);
      sh(prodDir, ['git', 'reset', '--hard', 'origin/seo-boost']);
      sh(STG, ['node', 'pipeline-logs/fire142-mirror-prod.mjs'], { env: { PROD_REPO: prodDir } });
      sh(prodDir, ['git', 'add', '--', ...pAll]);
      sh(prodDir, ['git', 'commit', '-m', 'Mirror Desk Cat Coder to prod (game-discovery fire142).']);
      sleep(20000); continue;
    }
    sleep(40000);
  }
  if (!prodOk) process.exit(1);
  writeFileSync('/tmp/fire142-ship-complete.json', JSON.stringify({ ok: true, at: new Date().toISOString() }));
} finally {
  releaseLock({ repoRoot: FRONTEND, session: SESSION });
  log('released cleanup lock');
}
log('FIRE142_SHIP_COMPLETE');
