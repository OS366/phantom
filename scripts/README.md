# Scripts

## check-test-coverage.js

Automatically verifies that all public functions in `phantom.js` have corresponding test cases in `phantom.test.js`.

### Features

- ✅ Detects all public functions in `phantom.js`
- ✅ Checks if corresponding tests exist
- ✅ **Diff mode**: Only checks new functions added in PRs
- ✅ **Strict mode**: Fails if any functions are missing tests
- ✅ Beautiful colored output

### Usage

```bash
# Check all functions
npm run test:check

# Check only new functions (diff mode)
npm run test:check-diff

# Strict mode (fails on missing tests)
npm run test:check -- --strict
```

### How It Works

1. **Function Detection**: Extracts all public functions from `phantom.js` using patterns:
   - `phantom.category.operation.functionName`
   - `phantom.category.functionName`
   - `phantom.init`

2. **Test Detection**: Finds all test cases in `phantom.test.js`:
   - `test('description', ...)`
   - `describe('suite', ...)`

3. **Matching**: Checks if each function has a corresponding test by:
   - Direct name match
   - Test description contains function name
   - Module-level test coverage

4. **Diff Mode**: When using `--diff`, compares current code with base branch to only validate new functions.

### CI Integration

The script runs automatically on:
- **Pull Requests**: Checks only new functions added
- **Main branch**: Validates all functions

If new functions are added without tests, the CI will fail and prevent merging.

### Example Output

```
🔍 Checking Test Coverage...

┌─ Test Coverage Report ────────────────────────────────┐
│ Total functions checked: 104                      │
│ ✓ Covered: 104                                   │
│ ✗ Missing tests: 0                                          │
└─────────────────────────────────────────────────────┘

Coverage: 100.0%

✅ All functions have test coverage!
```

---

## create-release.js

Creates a release package (zip file) containing only `phantom.js` and `phantom.min.js` for distribution.

### Features

- ✅ Automatically reads version from `package.json`
- ✅ Generates minified file if missing
- ✅ Creates zip archive with only essential files
- ✅ Works in CI/CD environments

### Usage

```bash
# Create release package
npm run release

# Or directly
node scripts/create-release.js
```

### Output

Creates `release/phantom-v<VERSION>.zip` containing:
- `phantom.js` (readable source)
- `phantom.min.js` (minified version)

---

## prepare-release.js

Complete release preparation workflow that automates the entire release process.

### Features

- ✅ Runs all tests
- ✅ Verifies test coverage
- ✅ Generates minified file
- ✅ Creates release package
- ✅ Creates Git tag
- ✅ Provides next steps

### Usage

```bash
# Prepare complete release
npm run release:prepare
```

### Workflow

1. **Run Tests**: Executes all test suites
2. **Check Coverage**: Verifies 100% test coverage
3. **Generate Minified**: Creates `phantom.min.js`
4. **Create Package**: Generates release zip file
5. **Create Tag**: Creates Git tag with version
6. **Instructions**: Shows next steps for pushing

### Example Output

```
🚀 Preparing Release...

📦 Version: 0.1.4-BETA
🏷️  Tag: v0.1.4-BETA

1️⃣  Running tests...
2️⃣  Checking test coverage...
3️⃣  Generating minified file...
4️⃣  Creating release package...
5️⃣  Checking Git tag...
   ✓ Tag created: v0.1.4-BETA

✅ Release preparation complete!

📋 Next steps:
   1. Review the release package
   2. Push the tag to GitHub:
      git push origin v0.1.4-BETA
   3. GitHub Actions will automatically create the release
```

---

## Release Automation

### GitHub Actions Workflow

When you push a tag (e.g., `v0.1.4-BETA`), GitHub Actions automatically:

1. ✅ Checks out the code
2. ✅ Installs dependencies
3. ✅ Generates minified file
4. ✅ Creates release package
5. ✅ Creates GitHub Release with:
   - Release notes from `docs/RELEASE_NOTES_v<VERSION>.md`
   - Zip file attachment
   - Pre-release flag for BETA/ALPHA/RC versions
   - Auto-generated release notes

### Complete Release Process

```bash
# 1. Prepare release (runs tests, creates package, creates tag)
npm run release:prepare

# 2. Push tag to GitHub (triggers automatic release)
git push origin v0.1.4-BETA

# 3. GitHub Actions automatically creates the release!
```

### Manual Release

If you prefer to create releases manually:

1. Create release package: `npm run release`
2. Create tag: `git tag -a v0.1.4-BETA -m "Release message"`
3. Push tag: `git push origin v0.1.4-BETA`
4. Create release on GitHub: https://github.com/OS366/phantom/releases/new
5. Upload the zip file from `release/` directory

---

## Adding New Functions

When adding a new function to `phantom.js`:

1. Add the function following the pattern: `phantom.category.operation.functionName`
2. Add corresponding test cases in `phantom.test.js`
3. Run `npm run test:check-diff` to verify
4. The CI will automatically check on PR creation

If you forget to add tests, the CI will fail with a clear message showing which functions need tests.
