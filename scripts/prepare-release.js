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
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;
const tagName = `v${version}`;

log('\n🚀 Preparing Release...\n', 'cyan');
log(`📦 Version: ${version}`, 'blue');
log(`🏷️  Tag: ${tagName}\n`, 'blue');

// Step 1: Run tests
log('1️⃣  Running tests...', 'cyan');
exec('npm test');

// Step 2: Check test coverage
log('\n2️⃣  Checking test coverage...', 'cyan');
exec('npm run test:check');

// Step 3: Generate minified file
log('\n3️⃣  Generating minified file...', 'cyan');
exec('npm run minify');

// Step 4: Create release package
log('\n4️⃣  Creating release package...', 'cyan');
exec('npm run release');

// Step 5: Check if tag already exists
log('\n5️⃣  Checking Git tag...', 'cyan');
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

