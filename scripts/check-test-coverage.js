#!/usr/bin/env node
/**
 * Test Coverage Checker
 * 
 * This script verifies that all public functions in phantom.js have corresponding test cases.
 * It can be used in CI/CD to prevent merging code without tests.
 * 
 * Usage:
 *   node scripts/check-test-coverage.js [--strict] [--diff]
 * 
 * Options:
 *   --strict: Exit with error if any functions are missing tests
 *   --diff: Compare with previous commit to only check new functions
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Extract all public function names from phantom.js
 */
function extractFunctions(phantomCode) {
  const functions = new Set();
  
  // Pattern 1: phantom.category.operation.functionName = function
  const pattern1 = /phantom\.(\w+)\.(\w+)\.(\w+)\s*=\s*function/g;
  let match;
  while ((match = pattern1.exec(phantomCode)) !== null) {
    const [, category, subcategory, funcName] = match;
    functions.add(`${category}.${subcategory}.${funcName}`);
  }
  
  // Pattern 2: phantom.category.functionName = function (for maps, dates.duration, etc.)
  const pattern2 = /phantom\.(\w+)\.(\w+)\s*=\s*function/g;
  while ((match = pattern2.exec(phantomCode)) !== null) {
    const [, category, funcName] = match;
    // Skip if it's already captured by pattern1 or is a property assignment
    const fullPath = `${category}.${funcName}`;
    if (!functions.has(fullPath) && !phantomCode.includes(`phantom.${category}.operation.${funcName}`)) {
      functions.add(fullPath);
    }
  }
  
  // Pattern 3: phantom.init (special case)
  if (phantomCode.includes('phantom.init = function')) {
    functions.add('init');
  }
  
  return Array.from(functions).sort();
}

/**
 * Extract all test cases from phantom.test.js
 */
function extractTests(testCode) {
  const tests = new Set();
  
  // Pattern: test('description', ...) or it('description', ...)
  const testPattern = /(?:test|it)\s*\(\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = testPattern.exec(testCode)) !== null) {
    const description = match[1].toLowerCase();
    tests.add(description);
  }
  
  // Also check for describe blocks that might indicate module coverage
  const describePattern = /describe\s*\(\s*['"]([^'"]+)['"]/g;
  while ((match = describePattern.exec(testCode)) !== null) {
    const suite = match[1].toLowerCase();
    tests.add(`suite:${suite}`);
  }
  
  return tests;
}

/**
 * Check if a function has a corresponding test
 */
function hasTest(functionName, tests) {
  const funcLower = functionName.toLowerCase();
  
  // Direct match
  if (tests.has(funcLower)) return true;
  
  // Check if any test description contains the function name
  for (const test of tests) {
    if (test.includes(funcLower) || funcLower.includes(test.replace('suite:', ''))) {
      return true;
    }
  }
  
  // Check for module-level tests (e.g., "phantom.strings" has tests for all string operations)
  const parts = functionName.split('.');
  if (parts.length >= 2) {
    const module = parts[0] + '.' + parts[1];
    if (tests.has(`suite:${module}`) || tests.has(`suite:phantom.${module}`)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get diff between current and base commit
 */
function getDiff(baseCommit = 'HEAD') {
  try {
    // Try to get the base branch from GitHub context or use HEAD~1
    const baseBranch = process.env.GITHUB_BASE_REF || 'main';
    let diff = '';
    
    // For PRs, compare with base branch
    if (process.env.GITHUB_EVENT_NAME === 'pull_request' || process.env.CI) {
      try {
        // First, fetch the base branch
        execSync(`git fetch origin ${baseBranch}:refs/remotes/origin/${baseBranch} 2>/dev/null || true`, { encoding: 'utf8', stdio: 'ignore' });
        // Try to get merge base
        let mergeBase;
        try {
          mergeBase = execSync(`git merge-base HEAD origin/${baseBranch} 2>/dev/null`, { encoding: 'utf8' }).trim();
        } catch (e) {
          // If merge-base fails, try HEAD~1
          mergeBase = 'HEAD~1';
        }
        diff = execSync(`git diff ${mergeBase} -- phantom.js 2>/dev/null || echo ""`, { encoding: 'utf8' });
      } catch (e) {
        // Fallback to HEAD~1
        try {
          diff = execSync(`git diff HEAD~1 -- phantom.js 2>/dev/null || echo ""`, { encoding: 'utf8' });
        } catch (e2) {
          diff = '';
        }
      }
    } else {
      // For regular commits, compare with previous commit
      try {
        diff = execSync(`git diff ${baseCommit} -- phantom.js 2>/dev/null || echo ""`, { encoding: 'utf8' });
      } catch (e) {
        diff = '';
      }
    }
    return diff;
  } catch (e) {
    return '';
  }
}

/**
 * Extract new functions from diff
 */
function extractNewFunctionsFromDiff(diff) {
  const newFunctions = new Set();
  
  // Find added lines with function definitions
  const addedFunctionPattern = /^\+\s*phantom\.(\w+)\.(\w+)\.(\w+)\s*=\s*function/gm;
  let match;
  while ((match = addedFunctionPattern.exec(diff)) !== null) {
    const [, category, subcategory, funcName] = match;
    newFunctions.add(`${category}.${subcategory}.${funcName}`);
  }
  
  const addedFunctionPattern2 = /^\+\s*phantom\.(\w+)\.(\w+)\s*=\s*function/gm;
  while ((match = addedFunctionPattern2.exec(diff)) !== null) {
    const [, category, funcName] = match;
    newFunctions.add(`${category}.${funcName}`);
  }
  
  return Array.from(newFunctions);
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const diffMode = args.includes('--diff');
  
  log('\n🔍 Checking Test Coverage...\n', 'cyan');
  
  // Read files
  const phantomCode = fs.readFileSync('phantom.js', 'utf8');
  const testCode = fs.readFileSync('phantom.test.js', 'utf8');
  
  // Extract functions and tests
  const allFunctions = extractFunctions(phantomCode);
  const allTests = extractTests(testCode);
  
  let functionsToCheck = allFunctions;
  
  // If diff mode, only check new functions
  if (diffMode) {
    const diff = getDiff();
    const newFunctions = extractNewFunctionsFromDiff(diff);
    
    if (newFunctions.length > 0) {
      log('📊 Diff Mode: Checking only new functions\n', 'blue');
      log(`New functions detected: ${newFunctions.length}\n`, 'blue');
      newFunctions.forEach(func => {
        log(`  • ${func}`, 'blue');
      });
      log('');
      functionsToCheck = newFunctions;
    } else {
      log('ℹ️  No new functions detected in diff. Checking all functions...\n', 'yellow');
    }
  }
  
  // Check coverage
  const missingTests = [];
  const covered = [];
  
  for (const func of functionsToCheck) {
    if (hasTest(func, allTests)) {
      covered.push(func);
    } else {
      missingTests.push(func);
    }
  }
  
  // Report
  log('┌─ Test Coverage Report ────────────────────────────────┐', 'cyan');
  log(`│ Total functions checked: ${functionsToCheck.length}${' '.repeat(25 - String(functionsToCheck.length).length)}│`, 'cyan');
  log(`│ ✓ Covered: ${covered.length}${' '.repeat(38 - String(covered.length).length)}│`, 'green');
  
  if (missingTests.length > 0) {
    log(`│ ✗ Missing tests: ${missingTests.length}${' '.repeat(32 - String(missingTests.length).length)}│`, 'red');
    log('├─────────────────────────────────────────────────────┤', 'cyan');
    log('│ Functions without tests:                            │', 'red');
    missingTests.forEach(func => {
      log(`│   • ${func.padEnd(47)}│`, 'red');
    });
  } else {
    log(`│ ✗ Missing tests: 0${' '.repeat(42)}│`, 'green');
  }
  log('└─────────────────────────────────────────────────────┘\n', 'cyan');
  
  // Summary
  const coverage = ((covered.length / functionsToCheck.length) * 100).toFixed(1);
  log(`Coverage: ${coverage}%`, coverage === '100.0' ? 'green' : 'yellow');
  
  if (missingTests.length > 0) {
    log(`\n⚠️  ${missingTests.length} function(s) are missing test cases!`, 'yellow');
    
    if (strict) {
      log('\n❌ Strict mode enabled. Exiting with error.', 'red');
      process.exit(1);
    } else {
      log('\n💡 Run with --strict to fail on missing tests.', 'yellow');
    }
  } else {
    log('\n✅ All functions have test coverage!', 'green');
  }
  
  log('');
}

if (require.main === module) {
  main();
}

module.exports = { extractFunctions, extractTests, hasTest };

