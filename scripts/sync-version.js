#!/usr/bin/env node
/**
 * Single source of truth for Phantom.js version labels.
 *
 * Canonical package form (npm):  0.1.8-beta
 * Display form (banner / runtime / docs): 0.1.8-BETA
 *
 * Usage:
 *   node sync-version.js                 # sync current scripts/package.json everywhere
 *   node sync-version.js --set 0.1.8-beta
 *   node sync-version.js --bump          # patch+1, then sync
 *   node sync-version.js --check         # exit 1 if any label is out of sync
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SCRIPTS_PKG = path.join(__dirname, 'package.json');
const ROOT_PKG = path.join(ROOT, 'package.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

/** Normalize any incoming version to package form: 0.1.8-beta */
function toPackageVersion(raw) {
  const s = String(raw || '').trim().replace(/^v/i, '');
  const m = s.match(/^(\d+)\.(\d+)\.(\d+)(?:[-.]?(beta|alpha|rc)(\.\d+)?)?$/i);
  if (!m) {
    throw new Error(`Invalid version "${raw}". Expected like 0.1.8-beta`);
  }
  const base = `${m[1]}.${m[2]}.${m[3]}`;
  const pre = (m[4] || 'beta').toLowerCase();
  const preNum = m[5] || '';
  return `${base}-${pre}${preNum}`;
}

/** Display form used in banners / phantom.version / docs */
function toDisplayVersion(pkgVersion) {
  return pkgVersion.replace(/-(beta|alpha|rc)(\.\d+)?$/i, (_, p, n) => `-${p.toUpperCase()}${n || ''}`);
}

function parseBase(pkgVersion) {
  const [base, pre = 'beta'] = pkgVersion.split('-');
  const [major, minor, patch] = base.split('.').map(Number);
  return { major, minor, patch, pre: pre.toLowerCase() };
}

function bumpPackageVersion(pkgVersion) {
  const v = parseBase(pkgVersion);
  v.patch += 1;
  if (v.patch >= 10) {
    v.patch = 0;
    v.minor += 1;
  }
  if (v.minor >= 10) {
    v.minor = 0;
    v.major += 1;
  }
  return `${v.major}.${v.minor}.${v.patch}-${v.pre}`;
}

function replaceFile(filePath, replacer) {
  const before = fs.readFileSync(filePath, 'utf8');
  const after = replacer(before);
  if (after !== before) fs.writeFileSync(filePath, after, 'utf8');
  return after !== before;
}

function syncAll(pkgVersion) {
  const display = toDisplayVersion(pkgVersion);
  const changed = [];

  // package.json files
  for (const pkgPath of [SCRIPTS_PKG, ROOT_PKG]) {
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = readJson(pkgPath);
    if (pkg.version !== pkgVersion) {
      pkg.version = pkgVersion;
      writeJson(pkgPath, pkg);
      changed.push(path.relative(ROOT, pkgPath));
    }
  }

  // scripts/package-lock.json top-level version only
  const lockPath = path.join(__dirname, 'package-lock.json');
  if (fs.existsSync(lockPath)) {
    const lock = readJson(lockPath);
    let lockChanged = false;
    if (lock.version !== pkgVersion) {
      lock.version = pkgVersion;
      lockChanged = true;
    }
    if (lock.packages && lock.packages[''] && lock.packages[''].version !== pkgVersion) {
      lock.packages[''].version = pkgVersion;
      lockChanged = true;
    }
    if (lockChanged) {
      writeJson(lockPath, lock);
      changed.push('scripts/package-lock.json');
    }
  }

  // phantom.js — banner + runtime version
  const phantomPath = path.join(ROOT, 'phantom.js');
  if (replaceFile(phantomPath, (src) => {
    let out = src.replace(
      /^(\/\*! Phantom\.js v)[^\s|]+(\s*\|[^\n]*)/m,
      `$1${display}$2`
    );
    out = out.replace(
      /phantom\.version\s*=\s*["'][^"']+["']/,
      `phantom.version = "${display}"`
    );
    return out;
  })) changed.push('phantom.js');

  // README current version + usage example
  const readmePath = path.join(ROOT, 'README.md');
  if (fs.existsSync(readmePath) && replaceFile(readmePath, (src) => {
    let out = src.replace(/\*\*Version:\*\*\s*[^\n]+/, `**Version:** ${display}`);
    out = out.replace(
      /phantom\.version;\s*\/\/\s*["'][^"']+["']/,
      `phantom.version;  // "${display}"`
    );
    return out;
  })) changed.push('README.md');

  // Wiki home current version
  const wikiHome = path.join(ROOT, 'wiki', 'Home.md');
  if (fs.existsSync(wikiHome) && replaceFile(wikiHome, (src) =>
    src.replace(/\*\*Current Version:\*\*\s*[^\n]+/, `**Current Version:** ${display}`)
  )) changed.push('wiki/Home.md');

  // Test expectation — keep in sync automatically
  const testPath = path.join(ROOT, 'phantom.test.js');
  if (fs.existsSync(testPath) && replaceFile(testPath, (src) =>
    src.replace(
      /expect\(global\.phantom\.version\)\.toBe\(['"][^'"]+['"]\)/,
      `expect(global.phantom.version).toBe('${display}')`
    )
  )) changed.push('phantom.test.js');

  // Regenerate minified banner + body from current phantom.js
  try {
    execSync('node minify.js', { cwd: __dirname, stdio: 'inherit' });
    changed.push('phantom.min.js');
  } catch (e) {
    console.warn('⚠️  minify skipped:', e.message);
  }

  return { pkgVersion, display, changed };
}

function collectLabels() {
  const labels = {};
  labels['scripts/package.json'] = readJson(SCRIPTS_PKG).version;
  if (fs.existsSync(ROOT_PKG)) labels['package.json'] = readJson(ROOT_PKG).version;

  const phantom = fs.readFileSync(path.join(ROOT, 'phantom.js'), 'utf8');
  const banner = (phantom.match(/^\/\*! Phantom\.js v([^\s|]+)/m) || [])[1];
  const runtime = (phantom.match(/phantom\.version\s*=\s*["']([^"']+)["']/) || [])[1];
  labels['phantom.js banner'] = banner || null;
  labels['phantom.js runtime'] = runtime || null;

  if (fs.existsSync(path.join(ROOT, 'phantom.min.js'))) {
    const min = fs.readFileSync(path.join(ROOT, 'phantom.min.js'), 'utf8');
    labels['phantom.min.js banner'] = (min.match(/Phantom\.js v([^\s|/]+)/) || [])[1] || null;
    // Prefer literal assignment; fall back to executing the obfuscated bundle.
    let runtime =
      (min.match(/phantom\.version\s*=\s*["']([^"']+)["']/) ||
        min.match(/phantom\[\s*["']version["']\s*\]\s*=\s*["']([^"']+)["']/) ||
        [])[1] || null;
    if (!runtime) {
      try {
        const vm = require('vm');
        const sandbox = {};
        vm.createContext(sandbox);
        vm.runInContext(min, sandbox);
        runtime = sandbox.phantom && sandbox.phantom.version;
      } catch (_) {
        runtime = null;
      }
    }
    labels['phantom.min.js runtime'] = runtime || null;
  }

  if (fs.existsSync(path.join(ROOT, 'README.md'))) {
    const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
    labels['README Version'] = (readme.match(/\*\*Version:\*\*\s*([^\n]+)/) || [])[1]?.trim() || null;
  }

  if (fs.existsSync(path.join(ROOT, 'wiki', 'Home.md'))) {
    const home = fs.readFileSync(path.join(ROOT, 'wiki', 'Home.md'), 'utf8');
    labels['wiki/Home Current Version'] = (home.match(/\*\*Current Version:\*\*\s*([^\n]+)/) || [])[1]?.trim() || null;
  }

  if (fs.existsSync(path.join(ROOT, 'phantom.test.js'))) {
    const test = fs.readFileSync(path.join(ROOT, 'phantom.test.js'), 'utf8');
    labels['phantom.test.js'] = (test.match(/expect\(global\.phantom\.version\)\.toBe\(['"]([^'"]+)['"]\)/) || [])[1] || null;
  }

  return labels;
}

function checkSync(pkgVersion) {
  const display = toDisplayVersion(pkgVersion);
  const labels = collectLabels();
  const expected = {
    'scripts/package.json': pkgVersion,
    'package.json': pkgVersion,
    'phantom.js banner': display,
    'phantom.js runtime': display,
    'phantom.min.js banner': display,
    'phantom.min.js runtime': display,
    'README Version': display,
    'wiki/Home Current Version': display,
    'phantom.test.js': display
  };

  const problems = [];
  for (const [where, want] of Object.entries(expected)) {
    if (!(where in labels)) continue;
    if (labels[where] !== want) {
      problems.push(`${where}: got "${labels[where]}", want "${want}"`);
    }
  }
  return { labels, problems, display, pkgVersion };
}

function main() {
  const args = process.argv.slice(2);
  const setIdx = args.indexOf('--set');
  const doBump = args.includes('--bump');
  const doCheck = args.includes('--check');

  let pkgVersion = toPackageVersion(readJson(SCRIPTS_PKG).version);

  if (setIdx !== -1) {
    if (!args[setIdx + 1]) {
      console.error('--set requires a version, e.g. --set 0.1.8-beta');
      process.exit(1);
    }
    pkgVersion = toPackageVersion(args[setIdx + 1]);
  } else if (doBump) {
    pkgVersion = bumpPackageVersion(pkgVersion);
  }

  if (doCheck && setIdx === -1 && !doBump) {
    const { labels, problems, display } = checkSync(pkgVersion);
    console.log('Current labels:');
    for (const [k, v] of Object.entries(labels)) console.log(`  ${k}: ${v}`);
    if (problems.length) {
      console.error(`\n❌ Version labels out of sync (expected package ${pkgVersion} / display ${display}):`);
      problems.forEach((p) => console.error(`  - ${p}`));
      process.exit(1);
    }
    console.log(`\n✅ All version labels match ${display}`);
    return;
  }

  console.log(`Syncing version labels → package ${pkgVersion} / display ${toDisplayVersion(pkgVersion)}`);
  const { display, changed } = syncAll(pkgVersion);
  console.log(`Updated: ${changed.length ? changed.join(', ') : '(already in sync)'}`);

  const { problems } = checkSync(pkgVersion);
  if (problems.length) {
    console.error('❌ Sync incomplete:');
    problems.forEach((p) => console.error(`  - ${p}`));
    process.exit(1);
  }
  console.log(`✅ All version labels are ${display}`);
}

main();
