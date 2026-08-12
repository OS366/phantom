#!/usr/bin/env node
/**
 * Prepare Release
 * 
 * Complete release preparation workflow:
 * 1. Run tests
 * 2. Check test coverage
 * 3. Generate minified file
 * 4. Create release package
 * 5. Create Git tag
 * 6. Provide instructions for pushing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'inherit', ...options });
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Get version from package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;
const tagName = `v${version}`;

log('\n🚀 Preparing Release...\n', 'cyan');
log(`📦 Version: ${version}`, 'blue');
log(`🏷️  Tag: ${tagName}\n`, 'blue');

// Step 0: Sync every version label (banner, runtime, README, wiki, tests, minify)
log('0️⃣  Syncing version labels everywhere...', 'cyan');
exec('npm run version:sync');
exec('npm run version:check');

// Step 1: Bake ≤12-word hotline JSDoc into phantom.js (no extra release files)
log('\n1️⃣  Baking hotline descriptions into phantom.js...', 'cyan');
exec('npm run hotlines');
exec('npm run hotlines:check');

// Step 2: Run tests
log('\n2️⃣  Running tests...', 'cyan');
exec('npm test');

// Step 3: Check test coverage
log('\n3️⃣  Checking test coverage...', 'cyan');
exec('npm run test:check');

// Step 4: Generate obfuscated phantom.min.js
log('\n4️⃣  Generating obfuscated phantom.min.js...', 'cyan');
exec('npm run minify');

// Step 5: Create release package (phantom.js + phantom.min.js only)
log('\n5️⃣  Creating release package...', 'cyan');
exec('npm run release');

// Step 6: Check if tag already exists
log('\n6️⃣  Checking Git tag...', 'cyan');
try {
  execSync(`git rev-parse -q --verify "refs/tags/${tagName}" > /dev/null 2>&1`, { encoding: 'utf8' });
  log(`⚠️  Tag ${tagName} already exists!`, 'yellow');
  log('   Skipping tag creation. Use --force to overwrite.', 'yellow');
} catch (e) {
  // Tag doesn't exist, create it
  log(`   Creating tag: ${tagName}`, 'blue');
  const tagMessage = `Release ${tagName}: ${packageJson.description || 'Phantom.js release'}`;
  exec(`git tag -a ${tagName} -m "${tagMessage}"`);
  log(`   ✓ Tag created: ${tagName}`, 'green');
}

// Summary
log('\n' + '='.repeat(60), 'cyan');
log('✅ Release preparation complete!', 'green');
log('='.repeat(60) + '\n', 'cyan');

log('📦 Release package:', 'blue');
log(`   ${path.join(__dirname, '..', 'release', `phantom-v${version}.zip`)}`, 'reset');

log('\n📋 Next steps:', 'yellow');
log('   1. Review the release package', 'reset');
log('   2. Push the tag to GitHub:', 'reset');
log(`      git push origin ${tagName}`, 'cyan');
log('   3. GitHub Actions will automatically create the release', 'reset');
log('   4. Or manually create release at:', 'reset');
log(`      https://github.com/OS366/phantom/releases/new`, 'cyan');
log('\n');

