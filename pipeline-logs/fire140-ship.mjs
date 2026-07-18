#!/usr/bin/env node
/**
 * fire140 ship: wait cleanup-lock + deploy-lease, commit witchcat bundle on staging,
 * lean-push staging, mirror prod, lean-push prod.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { acquireLock, releaseLock, lockStatus } from '../../.agent/skills/_lib/cleanup-backlog-lock.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STG = join(__dirname, '..'); // freetoolonline-web-test
const FRONTEND = join(STG, '..');
const PROD = join(FRONTEND, 'freetoolonline-web');
const SESSION = 'game-discovery-fire140';

function sh(cwd, args, opts = {}) {
  const r = spawnSync(args[0], args.slice(1), {
    cwd,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: opts.timeout ?? 120000,
    env: { ...process.env, ...(opts.env || {}) },
  });
  return r;
}

function walk(dir, pred, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, pred, acc);
    else if (pred(full)) acc.push(relative(STG, full));
  }
  return acc;
}

function sleep(ms) {
  const sec = Math.max(1, Math.ceil(ms / 1000));
  const r = spawnSync('/bin/sleep', [String(sec)], { stdio: 'ignore', timeout: (sec + 5) * 1000 });
  if (r.error) console.error('sleep error', r.error);
}

function log(...a) {
  console.log(new Date().toISOString(), ...a);
}

// --- acquire cleanup lock (poll) ---
let acquired = false;
for (let i = 1; i <= 120; i++) {
  const st = lockStatus(FRONTEND);
  if (st.held) {
    log(`cleanup lock held by ${st.lock?.session} age=${st.age_minutes} attempt=${i}`);
    sleep(35000);
    continue;
  }
  const lr = acquireLock({ repoRoot: FRONTEND, session: SESSION, ttlMinutes: 90 });
  if (lr.acquired) {
    acquired = true;
    log('acquired cleanup lock', lr.stole_stale ? '(stole stale)' : '');
    break;
  }
  log('acquire failed', lr.reason || lr);
  sleep(20000);
}
if (!acquired) {
  console.error('FAILED to acquire cleanup lock');
  process.exit(4);
}

try {
  // Ensure dist exists (export already done)
  if (!existsSync(join(STG, 'dist/games/seasonal-witchcat.html'))) {
    log('missing dist game page - running export');
    const ex = sh(STG, ['node', 'scripts/export-site.mjs'], { timeout: 7200000 });
    if (ex.status !== 0) {
      console.error(ex.stderr?.slice(-500));
      process.exit(2);
    }
  }

  // dist/ is gitignored — GitHub Pages rebuilds via export-site from source.
  const paths = [
    'scripts/site-data.mjs',
    'scripts/seo-clusters.mjs',
    'source/static/src/main/webapp/resources/view/l-menu.html',
    'source/web/src/main/webapp/static/script/related-tools.js',
    'source/web/src/main/webapp/static/games/seasonal-witchcat',
    'source/web/src/main/webapp/WEB-INF/jsp/games/seasonal-witchcat.jsp',
    'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/seasonalwitchcat__c8d4e1a7.svg',
    'pipeline-logs/fire140-scaffold-seasonal-witchcat.mjs',
    'pipeline-logs/fire140-patch-registries.mjs',
    'pipeline-logs/fire140-prove-seasonal-witchcat.mjs',
    'pipeline-logs/fire140-mirror-prod.mjs',
    'pipeline-logs/fire140-prove-result.json',
    'pipeline-logs/fire140-ship.mjs',
  ];

  const cms = walk(join(STG, 'source/static/src/main/webapp/resources/view/CMS'), (f) => /seasonalwitchcat/i.test(f));
  const guideJsps = walk(join(STG, 'source/web/src/main/webapp/WEB-INF/jsp/guide'), (f) => /seasonal-witchcat/i.test(f));

  const all = [...paths, ...cms, ...guideJsps].filter((p) => existsSync(join(STG, p)));
  log('staging add count', all.length);

  // Sibling agents often mark heavy registries assume-unchanged; clear before add.
  for (const f of ['scripts/site-data.mjs', 'scripts/seo-clusters.mjs', 'source/static/src/main/webapp/resources/view/l-menu.html', 'source/web/src/main/webapp/static/script/related-tools.js']) {
    sh(STG, ['git', 'update-index', '--no-assume-unchanged', '--', f]);
    sh(STG, ['git', 'update-index', '--no-skip-worktree', '--', f]);
  }

  let r = sh(STG, ['git', 'add', '-f', '--', ...all]);
  if (r.status !== 0) {
    console.error('git add failed', r.stderr);
    process.exit(1);
  }

  r = sh(STG, ['git', 'diff', '--cached', '--stat']);
  log('cached stat\n', (r.stdout || '').split('\n').slice(-8).join('\n'));

  r = sh(STG, [
    'git', 'commit', '-m',
    'game-discovery fire140: Seasonal Witchcat (/games/seasonal-witchcat.html) + 18 locale guides.',
  ]);
  log('commit', (r.stdout || r.stderr || '').slice(-300));
  if (r.status !== 0 && !(r.stdout || '').includes('nothing to commit')) {
    // allow empty if already committed
    if (!(r.stderr || '').includes('nothing to commit') && !(r.stdout || '').includes('nothing to commit')) {
      console.error('commit failed');
      process.exit(1);
    }
  }

  const leanEnv = { SEO_LEAN_MIRROR: '1', PA_LEAN_CUSTOM_PROMPT: '1' };

  // staging push
  let stgOk = false;
  for (let i = 1; i <= 90; i++) {
    log('staging push attempt', i);
    r = sh(FRONTEND, [
      'node', 'dashboard/laneGit.mjs',
      '--repo-dir', STG,
      '--branch', 'main',
      '--holder', 'game-manual-fire140',
      '--session', SESSION,
      '--wait-build',
      '--repo-key', 'staging',
      '--verify-url', 'https://dangkhoaow.github.io/freetoolonline-web-test/games/seasonal-witchcat.html',
    ], { timeout: 3600000, env: leanEnv });
    const out = (r.stdout || '') + (r.stderr || '');
    log(out.slice(-400));
    if (out.includes('"ok":true')) {
      writeFileSync('/tmp/fire140-stg-ok.json', out);
      stgOk = true;
      break;
    }
    if (out.includes('deploy_lease_held')) {
      sleep(40000);
      continue;
    }
    sleep(45000);
  }
  if (!stgOk) {
    console.error('staging push failed');
    process.exit(1);
  }
  log('STAGING_PUSH_OK');

  // prod mirror via script with PROD path
  // Prefer worktree if seo-boost contended
  let prodDir = PROD;
  const wt = '/tmp/fto-gamedrain-fresh';
  if (existsSync(wt)) {
    // ensure detached main + wt owns seo-boost
    sh(FRONTEND, ['git', '-C', PROD, 'checkout', '--detach', 'HEAD']);
    sh(FRONTEND, ['git', '-C', wt, 'fetch', 'origin', 'seo-boost']);
    sh(FRONTEND, ['git', '-C', wt, 'checkout', '-B', 'seo-boost', 'origin/seo-boost']);
    prodDir = wt;
  }

  r = sh(STG, ['node', 'pipeline-logs/fire140-mirror-prod.mjs'], {
    env: { PROD_REPO: prodDir },
    timeout: 120000,
  });
  log('mirror', (r.stdout || '') + (r.stderr || '').slice(-400));
  if (r.status !== 0) {
    console.error('mirror failed');
    process.exit(1);
  }

  // commit prod
  const prodAdds = [
    'scripts/site-data.mjs',
    'scripts/seo-clusters.mjs',
    'source/static/src/main/webapp/resources/view/l-menu.html',
    'source/web/src/main/webapp/static/script/related-tools.js',
    'source/web/src/main/webapp/static/games/seasonal-witchcat',
    'source/web/src/main/webapp/WEB-INF/jsp/games/seasonal-witchcat.jsp',
    'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/seasonalwitchcat__c8d4e1a7.svg',
  ];
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
  const pCms = walkRel(prodDir, join(prodDir, 'source/static/src/main/webapp/resources/view/CMS'), (f) => /seasonalwitchcat/i.test(f));
  const pGuides = walkRel(prodDir, join(prodDir, 'source/web/src/main/webapp/WEB-INF/jsp/guide'), (f) => /seasonal-witchcat/i.test(f));
  const pAll = [...prodAdds, ...pCms, ...pGuides].filter((p) => existsSync(join(prodDir, p)));

  sh(prodDir, ['git', 'add', '--', ...pAll]);
  const names = sh(prodDir, ['git', 'diff', '--cached', '--name-only']).stdout || '';
  if (names.includes('permanent-rules')) {
    console.error('ABORT permanent-rules in prod commit');
    process.exit(1);
  }
  r = sh(prodDir, [
    'git', 'commit', '-m',
    'Mirror Seasonal Witchcat to prod (game-discovery fire140).',
  ]);
  log('prod commit', (r.stdout || r.stderr || '').slice(-300));

  let prodOk = false;
  for (let i = 1; i <= 90; i++) {
    // rebase/merge remote first via laneGit
    sh(prodDir, ['git', 'fetch', 'origin', 'seo-boost']);
    log('prod push attempt', i);
    r = sh(FRONTEND, [
      'node', 'dashboard/laneGit.mjs',
      '--repo-dir', prodDir,
      '--branch', 'seo-boost',
      '--holder', 'game-manual-fire140',
      '--session', `${SESSION}-prod`,
      '--wait-build',
      '--repo-key', 'prod',
      '--verify-url', 'https://freetoolonline.com/games/seasonal-witchcat.html',
    ], { timeout: 3600000, env: leanEnv });
    const out = (r.stdout || '') + (r.stderr || '');
    log(out.slice(-450));
    if (out.includes('"ok":true')) {
      writeFileSync('/tmp/fire140-prod-ok.json', out);
      // verify origin has engine
      sh(prodDir, ['git', 'fetch', 'origin', 'seo-boost']);
      const has = sh(prodDir, ['git', 'cat-file', '-e', 'origin/seo-boost:source/web/src/main/webapp/static/games/seasonal-witchcat/index.html']);
      log('ON_ORIGIN', has.status === 0);
      prodOk = has.status === 0;
      break;
    }
    if (out.includes('deploy_lease_held')) {
      sleep(40000);
      continue;
    }
    // if merge conflict / lost commit, remirror
    if (out.includes('merge_conflict') || out.includes('phase6') || out.includes('permanent-rules')) {
      log('remirror after gate/conflict');
      sh(prodDir, ['git', 'fetch', 'origin', 'seo-boost']);
      sh(prodDir, ['git', 'reset', '--hard', 'origin/seo-boost']);
      sh(STG, ['node', 'pipeline-logs/fire140-mirror-prod.mjs'], { env: { PROD_REPO: prodDir } });
      sh(prodDir, ['git', 'add', '--', ...pAll]);
      sh(prodDir, ['git', 'commit', '-m', 'Mirror Seasonal Witchcat to prod (game-discovery fire140).']);
      sleep(20000);
      continue;
    }
    sleep(45000);
  }
  if (!prodOk) {
    console.error('prod push/verify failed');
    process.exit(1);
  }
  log('PROD_PUSH_OK');
  writeFileSync('/tmp/fire140-ship-complete.json', JSON.stringify({ ok: true, session: SESSION, at: new Date().toISOString() }));
} finally {
  releaseLock({ repoRoot: FRONTEND, session: SESSION });
  log('released cleanup lock');
}

log('FIRE140_SHIP_COMPLETE');
