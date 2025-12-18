#!/usr/bin/env node
/**
 * Create Release Package
 * 
 * Creates a zip file containing only phantom.js and phantom.min.js
 * for distribution to the community.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get version from package.json or environment variable
function getVersion() {
  // Check if version is provided via environment variable (for CI)
  if (process.env.RELEASE_VERSION) {
    return process.env.RELEASE_VERSION;
  }
  
  // Get from package.json
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

const VERSION = getVersion();
const RELEASE_DIR = path.join(__dirname, '..', 'release');
// Use underscores instead of dots to prevent filename truncation: phantom-0_1_6-beta.zip
const VERSION_FOR_FILENAME = VERSION.replace(/\./g, '_');
const ZIP_NAME = `phantom-${VERSION_FOR_FILENAME}.zip`;
const ZIP_PATH = path.join(RELEASE_DIR, ZIP_NAME);

// Files to include in release
const RELEASE_FILES = [
  'phantom.js',
  'phantom.min.js'
];

console.log('📦 Creating release package...\n');

// Ensure minified file exists
if (!fs.existsSync('phantom.min.js')) {
  console.log('⚠️  phantom.min.js not found. Generating...');
  execSync('npm run minify', { stdio: 'inherit' });
}

// Create release directory
if (!fs.existsSync(RELEASE_DIR)) {
  fs.mkdirSync(RELEASE_DIR, { recursive: true });
}

// Copy files to release directory
console.log('📋 Copying files to release directory...');
RELEASE_FILES.forEach(file => {
  const srcPath = path.join(__dirname, '..', file);
  const destPath = path.join(RELEASE_DIR, file);
  
  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Error: ${file} not found!`);
    process.exit(1);
  }
  
  fs.copyFileSync(srcPath, destPath);
  const stats = fs.statSync(destPath);
  console.log(`   ✓ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
});

// Create zip file
console.log('\n🗜️  Creating zip archive...');
try {
  // Remove old zip if exists
  if (fs.existsSync(ZIP_PATH)) {
    fs.unlinkSync(ZIP_PATH);
  }
  
  // Create zip using zip command (available on macOS/Linux)
  // For Windows, user can manually zip or use 7zip
  const zipCommand = `cd "${RELEASE_DIR}" && zip -q "${ZIP_NAME}" ${RELEASE_FILES.join(' ')}`;
  execSync(zipCommand, { stdio: 'inherit' });
  
  const zipStats = fs.statSync(ZIP_PATH);
  console.log(`   ✓ ${ZIP_NAME} created (${(zipStats.size / 1024).toFixed(2)} KB)`);
  
  console.log('\n✅ Release package created successfully!');
  console.log(`\n📁 Location: ${ZIP_PATH}`);
  console.log(`\n📦 Contents:`);
  RELEASE_FILES.forEach(file => {
    console.log(`   - ${file}`);
  });
  console.log(`\n🚀 Ready for distribution!\n`);
  
} catch (error) {
  console.error('\n❌ Error creating zip file:', error.message);
  console.log('\n💡 Alternative: Manually zip the files in the release directory:');
  console.log(`   cd ${RELEASE_DIR}`);
  console.log(`   zip ${ZIP_NAME} ${RELEASE_FILES.join(' ')}\n`);
  process.exit(1);
}

