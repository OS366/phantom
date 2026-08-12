#!/usr/bin/env node

/**
 * Version bump helper for Phantom.js.
 *
 * Prefer:
 *   node sync-version.js --bump
 *   node sync-version.js --set 0.1.8-beta
 *   node sync-version.js --check
 *
 * This file remains as a thin wrapper so existing docs/CI that call
 * `node version.js` still bump + sync every label.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const r = spawnSync(process.execPath, [path.join(__dirname, 'sync-version.js'), '--bump'], {
  stdio: 'inherit'
});
process.exit(r.status || 0);
