#!/usr/bin/env node

const fs = require('fs');
const UglifyJS = require('uglify-js');

const sourceCode = fs.readFileSync('phantom.js', 'utf8');

// Remove the header comment and extract just the code
const codeStart = sourceCode.indexOf('(function (global)');
const code = sourceCode.substring(codeStart);

// Minify the code
const result = UglifyJS.minify(code, {
  compress: {
    drop_console: false,
    keep_fnames: false,
    passes: 2
  },
  mangle: false, // Don't mangle names to preserve API
  output: {
    beautify: false,
    comments: false
  }
});

if (result.error) {
  console.error('Minification error:', result.error);
  process.exit(1);
}

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Add banner with version
const banner = `/*! Phantom.js v${version} - a product by David Labs */\n`;
const minified = banner + result.code;

fs.writeFileSync('phantom.min.js', minified, 'utf8');
console.log('Minified file created: phantom.min.js');
console.log('Original size:', sourceCode.length, 'bytes');
console.log('Minified size:', minified.length, 'bytes');
console.log('Reduction:', Math.round((1 - minified.length / sourceCode.length) * 100) + '%');

