#!/usr/bin/env node

/**
 * Version increment helper for Phantom.js
 * 
 * Versioning rules:
 * - Each commit increments patch: 0.0.1 -> 0.0.2 -> 0.0.3 ...
 * - Every 10 patch increments, increment minor: 0.0.9 -> 0.1.0
 * - Every 10 minor increments, increment major: 0.9.9 -> 1.0.0
 */

const fs = require('fs');
const path = require('path');

function parseVersion(version) {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0],
    minor: parts[1],
    patch: parts[2]
  };
}

function formatVersion(parts) {
  return `${parts.major}.${parts.minor}.${parts.patch}`;
}

function incrementVersion(currentVersion) {
  const v = parseVersion(currentVersion);
  
  // Increment patch
  v.patch++;
  
  // If patch reaches 10, increment minor and reset patch
  if (v.patch >= 10) {
    v.patch = 0;
    v.minor++;
  }
  
  // If minor reaches 10, increment major and reset minor
  if (v.minor >= 10) {
    v.minor = 0;
    v.major++;
  }
  
  return formatVersion(v);
}

function updateVersionInFile(filePath, oldVersion, newVersion) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(new RegExp(oldVersion.replace(/\./g, '\\.'), 'g'), newVersion);
  fs.writeFileSync(filePath, updated, 'utf8');
}

// Get current version from package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Calculate new version
const newVersion = incrementVersion(currentVersion);

console.log(`Incrementing version: ${currentVersion} -> ${newVersion}`);

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

// Update phantom.js
const phantomJsPath = path.join(__dirname, 'phantom.js');
updateVersionInFile(phantomJsPath, currentVersion, newVersion);

console.log(`Version updated to ${newVersion} in package.json and phantom.js`);


