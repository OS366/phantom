# Versioning Guide

Phantom.js follows a structured versioning system:

## Version Format

`MAJOR.MINOR.PATCH` (e.g., `0.1.0`)

## Increment Rules

1. **Patch increment (0.0.X)**: Each commit increments the patch version
   - `0.0.1` → `0.0.2` → `0.0.3` ... → `0.0.9`

2. **Minor increment (0.X.0)**: After 10 patch increments, increment minor and reset patch
   - `0.0.9` → `0.1.0`
   - `0.1.9` → `0.2.0`
   - `0.9.9` → `1.0.0`

3. **Major increment (X.0.0)**: After 10 minor increments, increment major and reset minor
   - `0.9.9` → `1.0.0`
   - `1.9.9` → `2.0.0`

## Examples

```
0.0.1 → 0.0.2 → 0.0.3 → ... → 0.0.9 → 0.1.0
0.1.0 → 0.1.1 → 0.1.2 → ... → 0.1.9 → 0.2.0
0.9.9 → 1.0.0
1.0.0 → 1.0.1 → ... → 1.0.9 → 1.1.0
```

## Usage

Before committing, run:

```bash
node version.js
```

This will automatically:
1. Read current version from `package.json`
2. Increment according to the rules above
3. Update `package.json` and `phantom.js` with the new version

Then commit and push:

```bash
git add package.json phantom.js
git commit -m "v<new-version>: <your commit message>"
git push origin main
```

## Current Version

Check `package.json` or `phantom.js` for the current version.

