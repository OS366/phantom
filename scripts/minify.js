#!/usr/bin/env node
/**
 * Build phantom.min.js — compressed + obfuscated, public API preserved.
 *
 * Release ships exactly two files:
 *   - phantom.js     readable source + baked-in JSDoc hotlines
 *   - phantom.min.js obfuscated runtime (same API)
 *
 * Object keys / dotted public paths stay intact so OIE scripts keep working:
 *   phantom.strings.operation.trim(...)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { minify: terserMinify } = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'phantom.js');
const OUT = path.join(ROOT, 'phantom.min.js');

async function build() {
  const sourceCode = fs.readFileSync(SRC, 'utf8');
  const codeStart = sourceCode.indexOf('(function (global)');
  if (codeStart < 0) {
    console.error('minify: could not find IIFE start in phantom.js');
    process.exit(1);
  }
  const code = sourceCode.substring(codeStart);

  const runtimeMatch = sourceCode.match(/phantom\.version\s*=\s*["']([^"']+)["']/);
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const version = runtimeMatch
    ? runtimeMatch[1]
    : String(packageJson.version).replace(
        /-(beta|alpha|rc)(\.\d+)?$/i,
        (_, p, n) => `-${p.toUpperCase()}${n || ''}`
      );

  // Pass 1: terser — strip comments, mangle locals, keep property names.
  const terser = await terserMinify(code, {
    compress: {
      drop_console: false,
      passes: 3,
      pure_getters: true,
      unsafe: false,
    },
    mangle: {
      toplevel: false,
      reserved: ['phantom', 'logger', 'java', 'javax', 'org', 'global'],
    },
    format: {
      comments: false,
      beautify: false,
      ecma: 5,
      wrap_iife: false,
    },
    ecma: 5,
  });

  if (terser.error) {
    console.error('terser error:', terser.error);
    process.exit(1);
  }

  // Pass 2: obfuscator — scramble local identifiers.
  // stringArray OFF: keeps phantom.version / phantom.strings.* literally callable
  // and safe for OIE/Rhino (no decodeURIComponent string tables).
  const obfuscated = JavaScriptObfuscator.obfuscate(terser.code, {
    compact: true,
    target: 'browser',
    seed: 0x5048414e, // 'PHAN' — stable across CI
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.4,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: false,
    simplify: true,
    splitStrings: false,
    stringArray: false,
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
    reservedNames: [
      '^phantom$',
      '^logger$',
      '^java$',
      '^javax$',
      '^org$',
      '^global$',
    ],
  }).getObfuscatedCode();

  const banner = `/*! Phantom.js v${version} | (c) 2025 David Labs | GPL-3.0 */\n`;
  const minified = banner + obfuscated;
  fs.writeFileSync(OUT, minified, 'utf8');

  const sandbox = { console, java: undefined, logger: undefined };
  vm.createContext(sandbox);
  vm.runInContext(minified, sandbox);
  const phantom = sandbox.phantom;
  if (!phantom || phantom.version !== version) {
    console.error('minify smoke: phantom.version mismatch', phantom && phantom.version);
    process.exit(1);
  }
  if (typeof phantom.strings?.operation?.trim !== 'function') {
    console.error('minify smoke: public API path missing');
    process.exit(1);
  }
  if (phantom.strings.operation.trim('  x  ') !== 'x') {
    console.error('minify smoke: strings.operation.trim failed');
    process.exit(1);
  }
  if (phantom.numbers.operation.add(2, 3) !== 5) {
    console.error('minify smoke: numbers.operation.add failed');
    process.exit(1);
  }
  if (!/phantom(?:\.version|\[[\s'"]*version[\s'"]*\])\s*=/.test(minified)) {
    console.error('minify smoke: version assignment not present');
    process.exit(1);
  }

  console.log('Obfuscated file created: phantom.min.js');
  console.log('Original size:', sourceCode.length, 'bytes');
  console.log('Obfuscated size:', minified.length, 'bytes');
  console.log(
    'Delta:',
    (minified.length >= sourceCode.length ? '+' : '') +
      Math.round((minified.length / sourceCode.length - 1) * 100) +
      '%'
  );
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
