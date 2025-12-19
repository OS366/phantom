#!/usr/bin/env node

/**
 * Generate Release Notes Automatically
 * 
 * Generates release notes from git commits since last tag/release
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    return '';
  }
}

function getLastTag() {
  const tags = exec('git tag --sort=-v:refname');
  if (!tags) return null;
  const tagList = tags.split('\n').filter(t => t.startsWith('v'));
  return tagList.length > 0 ? tagList[0] : null;
}

function getCommitsSinceTag(tag) {
  if (!tag) {
    // If no tag, get all commits
    return exec('git log --pretty=format:"%h|%s|%b" --no-merges');
  }
  return exec(`git log ${tag}..HEAD --pretty=format:"%h|%s|%b" --no-merges`);
}

function categorizeCommit(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('feat') || msg.includes('add') || msg.includes('new')) {
    return 'feature';
  }
  if (msg.includes('fix') || msg.includes('bug') || msg.includes('error')) {
    return 'fix';
  }
  if (msg.includes('refactor') || msg.includes('restructure')) {
    return 'refactor';
  }
  if (msg.includes('docs') || msg.includes('documentation')) {
    return 'docs';
  }
  if (msg.includes('test') || msg.includes('coverage')) {
    return 'test';
  }
  if (msg.includes('chore') || msg.includes('update') || msg.includes('bump')) {
    return 'chore';
  }
  if (msg.includes('breaking') || msg.includes('deprecate')) {
    return 'breaking';
  }
  
  return 'other';
}

function formatCommit(commit) {
  const [hash, subject, ...bodyParts] = commit.split('|');
  const body = bodyParts.join('|').trim();
  
  // Clean up subject
  let cleanSubject = subject.trim();
  
  // Remove common prefixes
  cleanSubject = cleanSubject.replace(/^(feat|fix|refactor|docs|test|chore|style|perf|ci|build|revert)(\(.+?\))?:?\s*/i, '');
  
  // Capitalize first letter
  if (cleanSubject.length > 0) {
    cleanSubject = cleanSubject.charAt(0).toUpperCase() + cleanSubject.slice(1);
  }
  
  return {
    hash: hash.substring(0, 7),
    subject: cleanSubject,
    body: body,
    category: categorizeCommit(subject + ' ' + body)
  };
}

function generateReleaseNotes(version) {
  const lastTag = getLastTag();
  const commits = getCommitsSinceTag(lastTag);
  
  if (!commits) {
    return `## Release v${version}\n\nNo commits since last release.\n`;
  }
  
  const commitList = commits.split('\n').filter(c => c.trim());
  const categorized = {
    breaking: [],
    feature: [],
    fix: [],
    refactor: [],
    docs: [],
    test: [],
    chore: [],
    other: []
  };
  
  commitList.forEach(commit => {
    const formatted = formatCommit(commit);
    if (categorized[formatted.category]) {
      categorized[formatted.category].push(formatted);
    } else {
      categorized.other.push(formatted);
    }
  });
  
  // Count statistics
  const stats = {
    total: commitList.length,
    features: categorized.feature.length,
    fixes: categorized.fix.length,
    refactors: categorized.refactor.length
  };
  
  // Generate markdown
  let notes = `# Release Notes - v${version}\n\n`;
  
  // Summary
  notes += `## Summary\n\n`;
  notes += `This release includes **${stats.total} commits** with `;
  const changes = [];
  if (stats.features > 0) changes.push(`${stats.features} new feature${stats.features > 1 ? 's' : ''}`);
  if (stats.fixes > 0) changes.push(`${stats.fixes} bug fix${stats.fixes > 1 ? 'es' : ''}`);
  if (stats.refactors > 0) changes.push(`${stats.refactors} refactor${stats.refactors > 1 ? 's' : ''}`);
  
  if (changes.length > 0) {
    notes += changes.join(', ') + '.\n\n';
  } else {
    notes += 'various improvements.\n\n';
  }
  
  if (lastTag) {
    notes += `**Previous Release:** ${lastTag}\n\n`;
  }
  
  notes += `---\n\n`;
  
  // Breaking Changes
  if (categorized.breaking.length > 0) {
    notes += `## ⚠️ Breaking Changes\n\n`;
    categorized.breaking.forEach(commit => {
      notes += `- **${commit.subject}** (${commit.hash})\n`;
      if (commit.body) {
        notes += `  ${commit.body.split('\n')[0]}\n`;
      }
    });
    notes += `\n`;
  }
  
  // Features
  if (categorized.feature.length > 0) {
    notes += `## ✨ New Features\n\n`;
    categorized.feature.forEach(commit => {
      notes += `- ${commit.subject} (${commit.hash})\n`;
    });
    notes += `\n`;
  }
  
  // Bug Fixes
  if (categorized.fix.length > 0) {
    notes += `## 🐛 Bug Fixes\n\n`;
    categorized.fix.forEach(commit => {
      notes += `- ${commit.subject} (${commit.hash})\n`;
    });
    notes += `\n`;
  }
  
  // Refactoring
  if (categorized.refactor.length > 0) {
    notes += `## 🔧 Refactoring\n\n`;
    categorized.refactor.forEach(commit => {
      notes += `- ${commit.subject} (${commit.hash})\n`;
    });
    notes += `\n`;
  }
  
  // Documentation
  if (categorized.docs.length > 0) {
    notes += `## 📚 Documentation\n\n`;
    categorized.docs.forEach(commit => {
      notes += `- ${commit.subject} (${commit.hash})\n`;
    });
    notes += `\n`;
  }
  
  // Tests
  if (categorized.test.length > 0) {
    notes += `## ✅ Tests\n\n`;
    categorized.test.forEach(commit => {
      notes += `- ${commit.subject} (${commit.hash})\n`;
    });
    notes += `\n`;
  }
  
  // Other Changes
  if (categorized.chore.length > 0 || categorized.other.length > 0) {
    notes += `## 🔨 Other Changes\n\n`;
    [...categorized.chore, ...categorized.other].forEach(commit => {
      notes += `- ${commit.subject} (${commit.hash})\n`;
    });
    notes += `\n`;
  }
  
  // Full Changelog
  notes += `---\n\n`;
  notes += `## Full Changelog\n\n`;
  notes += `For the complete list of changes, see the [commit history](https://github.com/OS366/phantom/compare/${lastTag || 'HEAD~' + stats.total}...HEAD).\n\n`;
  
  return notes;
}

// Main execution
const version = process.argv[2] || process.env.VERSION;
if (!version) {
  console.error('Usage: node generate-release-notes.js <version>');
  console.error('   or: VERSION=<version> node generate-release-notes.js');
  process.exit(1);
}

const releaseNotes = generateReleaseNotes(version);

// Output to file
const outputPath = path.join(__dirname, '..', 'docs', `RELEASE_NOTES_v${version}.md`);
fs.writeFileSync(outputPath, releaseNotes, 'utf8');

console.log(`✅ Release notes generated: ${outputPath}`);
console.log(`\n${releaseNotes.substring(0, 500)}...\n`);

// Also output to stdout for GitHub Actions
console.log('::set-output name=notes::' + releaseNotes.replace(/\n/g, '%0A'));

