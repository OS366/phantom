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
│ Total functions checked: 103                      │
│ ✓ Covered: 103                                   │
│ ✗ Missing tests: 0                                          │
└─────────────────────────────────────────────────────┘

Coverage: 100.0%

✅ All functions have test coverage!
```

### Adding New Functions

When adding a new function to `phantom.js`:

1. Add the function following the pattern: `phantom.category.operation.functionName`
2. Add corresponding test cases in `phantom.test.js`
3. Run `npm run test:check-diff` to verify
4. The CI will automatically check on PR creation

If you forget to add tests, the CI will fail with a clear message showing which functions need tests.

