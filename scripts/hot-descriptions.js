#!/usr/bin/env node
/**
 * Hotline brain — keeps Monaco-friendly short first-line JSDoc on every
 * public `phantom.*` export. No OIE / web-client changes.
 *
 * Hotlines target ~10–12 words (narrow suggest/docs headline). Longer detail
 * stays on following JSDoc lines and @param/@returns tags.
 *
 * Hotlines are baked into phantom.js JSDoc only — never a separate release file.
 * Release artifacts remain: phantom.js + phantom.min.js.
 *
 * Usage:
 *   node hot-descriptions.js            # rewrite short first-lines in phantom.js
 *   node hot-descriptions.js --check    # exit 1 if any hotline is over budget
 *   node hot-descriptions.js --print    # list path → hotline
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PHANTOM_JS = path.join(ROOT, 'phantom.js');
const MAX_WORDS = 12;

/** Curated short headlines when naive clipping would sound dumb. */
const OVERRIDES = {
  'phantom.strings.operation.compare': 'Compare two strings lexicographically.',
  'phantom.strings.operation.wordwrap': 'Wrap text to a fixed line width.',
  'phantom.numbers.operation.parse': 'Parse a value into a finite number.',
  'phantom.numbers.operation.clamp': 'Clamp a number into a min/max range.',
  'phantom.json.operation.set': 'Set a value at a dot-separated path.',
  'phantom.json.operation.has': 'Check whether a JSON path exists.',
  'phantom.json.operation.remove': 'Remove a key at a dot-separated path.',
  'phantom.json.operation.size': 'Count own keys or array length.',
  'phantom.json.operation.merge': 'Shallow-merge two objects into a copy.',
  'phantom.json.operation.isEmpty': 'True if null, empty object, or empty array.',
  'phantom.json.operation.toString': 'Serialize an object to compact JSON.',
  'phantom.xml.operation.has': 'True if an XPath matches any node.',
  'phantom.xml.operation.toString': 'Serialize an XML object to a string.',
  'phantom.dates.operation.parse': 'Parse a date string via java.time.',
  'phantom.dates.operation.parseDateTime': 'Parse a datetime string via java.time.',
  'phantom.dates.operation.getMonth': 'Return month number (1–12) for a date.',
  'phantom.dates.operation.getDayOfWeek': 'Return weekday name for a date.',
  'phantom.dates.operation.between': 'Count units between two dates.',
};

function wordCount(s) {
  return String(s || '').trim().split(/\s+/).filter(Boolean).length;
}

function clipHotline(text) {
  const cleaned = String(text || '')
    .replace(/`[^`]*`/g, (m) => m.slice(1, -1))
    .replace(/\s+/g, ' ')
    .trim();
  // Prefer first sentence when it already fits.
  const sentence = cleaned.split(/(?<=\.)\s+/)[0] || cleaned;
  if (wordCount(sentence) <= MAX_WORDS) {
    return /[.!?]$/.test(sentence) ? sentence : sentence + '.';
  }
  const words = cleaned.split(/\s+/).filter(Boolean).slice(0, MAX_WORDS);
  let out = words.join(' ');
  out = out.replace(/[,:;–—-]+$/, '');
  if (!/[.!?]$/.test(out)) out += '.';
  return out;
}

function stripLine(raw) {
  let t = String(raw || '').replace(/^\s*\*\s?/, '').trim();
  // Drop pure tag lines; strip inline tags from one-liners.
  if (/^@[a-zA-Z]/.test(t)) return '';
  t = t.replace(/@[a-zA-Z]+(\s+\{[^}]*\})?(\s+[^\n@]*)?/g, '').trim();
  return t;
}

function firstDocLine(block) {
  for (const line of String(block || '').split('\n')) {
    const t = stripLine(line);
    if (t) return t;
  }
  return '';
}

function parseMembers(src) {
  const re = /\/\*\*([\s\S]*?)\*\/\s*(phantom(?:\.\w+)+)\s*=/g;
  const members = [];
  let m;
  while ((m = re.exec(src))) {
    members.push({
      index: m.index,
      full: m[0],
      block: m[1],
      path: m[2],
      end: m.index + m[0].length,
    });
  }
  return members;
}

function hotlineFor(memberPath, block) {
  if (OVERRIDES[memberPath]) return OVERRIDES[memberPath];
  const first = firstDocLine(block);
  if (wordCount(first) <= MAX_WORDS) return first;
  return clipHotline(first);
}

function rewriteBlock(block, hotline) {
  const lines = String(block).split('\n');
  let replaced = false;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const stripped = stripLine(raw);
    if (!replaced && stripped) {
      const star = raw.match(/^(\s*\*\s?)/);
      const prefix = star ? star[1] : ' * ';
      const oldFirst = stripped;
      // Already good — leave the block untouched.
      if (oldFirst === hotline) {
        return block;
      }
      out.push(prefix + hotline);
      // Keep the previous long first line as extra detail.
      if (wordCount(oldFirst) > MAX_WORDS) {
        out.push(prefix + oldFirst);
      }
      replaced = true;
      continue;
    }
    out.push(raw);
  }
  if (!replaced) {
    out.unshift(' * ' + hotline);
  }
  return out.join('\n');
}

function buildCatalog(src) {
  const catalog = {};
  for (const mem of parseMembers(src)) {
    catalog[mem.path] = hotlineFor(mem.path, mem.block);
  }
  return catalog;
}

function applyWrite(src) {
  const members = parseMembers(src);
  let next = src;
  for (let i = members.length - 1; i >= 0; i--) {
    const mem = members[i];
    const hotline = hotlineFor(mem.path, mem.block);
    const newBlock = rewriteBlock(mem.block, hotline);
    if (newBlock === mem.block) continue;
    const assign = mem.full.match(/phantom(?:\.\w+)+\s*=/)[0];
    const gapMatch = mem.full.match(/\*\/(\s*)phantom/);
    const gap = gapMatch ? gapMatch[1] : '\n';
    next = next.slice(0, mem.index) + `/**${newBlock}*/${gap}${assign}` + next.slice(mem.end);
  }
  return { src: next, catalog: buildCatalog(next) };
}

function check(src) {
  const problems = [];
  for (const mem of parseMembers(src)) {
    const first = firstDocLine(mem.block);
    const hot = hotlineFor(mem.path, mem.block);
    if (wordCount(first) > MAX_WORDS) {
      problems.push({
        path: mem.path,
        words: wordCount(first),
        first,
        suggest: hot,
      });
    }
  }
  return problems;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const src = fs.readFileSync(PHANTOM_JS, 'utf8');

  if (args.has('--print')) {
    const catalog = buildCatalog(src);
    for (const key of Object.keys(catalog).sort()) {
      const h = catalog[key];
      console.log(`${wordCount(h)}\t${key}\t${h}`);
    }
    return;
  }

  if (args.has('--check')) {
    const problems = check(src);
    if (problems.length) {
      console.error(`hot-descriptions: ${problems.length} hotline(s) over ${MAX_WORDS} words:`);
      for (const p of problems) {
        console.error(`  ${p.path} (${p.words}): ${p.first}`);
        console.error(`    → ${p.suggest}`);
      }
      process.exit(1);
    }
    const catalog = buildCatalog(src);
    console.log(`hot-descriptions: ok (${Object.keys(catalog).length} members, ≤${MAX_WORDS} words)`);
    return;
  }

  const { src: next, catalog } = applyWrite(src);
  fs.writeFileSync(PHANTOM_JS, next, 'utf8');
  const over = Object.entries(catalog).filter(([, h]) => wordCount(h) > MAX_WORDS);
  console.log(
    `hot-descriptions: baked ${Object.keys(catalog).length} hotlines into phantom.js`
  );
  if (over.length) {
    console.warn(`warning: ${over.length} still over budget after write`);
    process.exit(1);
  }
}

main();
