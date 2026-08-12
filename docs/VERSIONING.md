# Versioning Guide

Phantom.js keeps **one version** and stamps it in every label surface on every release.

## Version Format

`MAJOR.MINOR.PATCH-beta` in package files (npm-style, lowercase):

```
0.1.9-beta
```

Display form (banner, `phantom.version`, README, wiki) uses uppercase pre-release:

```
0.1.9-BETA
```

## Where the version must match

| Location | Form |
| --- | --- |
| `scripts/package.json` | `0.1.9-beta` |
| `package.json` | `0.1.9-beta` |
| `phantom.js` banner | `v0.1.9-BETA` |
| `phantom.version` | `"0.1.9-BETA"` |
| `phantom.min.js` banner + runtime | `0.1.9-BETA` |
| `README.md` `**Version:**` | `0.1.9-BETA` |
| `wiki/Home.md` `**Current Version:**` | `0.1.9-BETA` |
| `phantom.test.js` expectation | `'0.1.9-BETA'` |

## Commands

```bash
# Sync current package.json version into every label above (+ regenerate minify)
npm run version:sync

# Fail CI/local if anything drifted
npm run version:check

# Bump patch (0.1.9-beta → 0.1.9-beta) and sync everywhere
npm run version:bump

# Set an explicit version and sync
cd scripts && node sync-version.js --set 0.1.9-beta
```

## Increment Rules

1. **Patch** — each release: `0.1.8-beta` → `0.1.9-beta`
2. **Minor** — after patch reaches 9: `0.1.9-beta` → `0.2.0-beta`
3. **Major** — after minor reaches 9: `0.9.9-beta` → `1.0.0-beta`

## Release checklist

`npm run release:prepare` already runs `version:sync` + `version:check` before tests/minify/zip.

Or manually:

```bash
npm run version:bump          # or --set
npm run version:check
npm test
npm run release:prepare
```

## Why this exists

A past release tagged `v0.1.8-beta` only updated `README.md`. CI used a case-sensitive replace of `0.1.7-beta` against `0.1.7-BETA` in `phantom.js`, so the library label stayed on 0.1.7. `sync-version.js` updates banner + runtime with the correct casing so that cannot happen again.
