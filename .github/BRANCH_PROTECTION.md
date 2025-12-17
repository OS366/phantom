# Branch Protection Setup Guide

This repository uses GitHub Actions CI pipeline to ensure code quality. To enforce that tests must pass before merging to main, you need to configure branch protection rules.

## Setup Branch Protection

1. Go to your GitHub repository: `https://github.com/OS366/phantom`
2. Navigate to **Settings** → **Branches**
3. Under **Branch protection rules**, click **Add rule** or edit the existing rule for `main`
4. Configure the following:

### Required Settings:

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: 1 (optional, but recommended)
  
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - ✅ Status checks required:
    - `test (18.x)` - Run Tests
    - `test (20.x)` - Run Tests

- ✅ **Require conversation resolution before merging** (optional)

- ✅ **Do not allow bypassing the above settings** (recommended for production)

### Optional Settings:

- ✅ **Require linear history** (optional)
- ✅ **Include administrators** (optional - applies rules to admins too)

## How It Works

1. When code is pushed to main or a PR is created:
   - GitHub Actions automatically runs the CI pipeline
   - Tests are executed using `npm test`
   - Tests run on Node.js 18.x and 20.x

2. If tests pass:
   - ✅ Status check shows green
   - PR can be merged to main

3. If tests fail:
   - ❌ Status check shows red
   - PR cannot be merged to main
   - Developer must fix failing tests and push again

## Manual Testing

You can test the CI pipeline locally:

```bash
# Install dependencies
npm ci

# Run tests
npm test
```

If tests pass locally, they should pass in CI as well.

## CI Pipeline Details

The CI pipeline (`.github/workflows/ci.yml`) does the following:

1. **Triggers:**
   - On push to `main` branch
   - On pull requests to `main` branch

2. **Steps:**
   - Checkout code
   - Setup Node.js (18.x and 20.x)
   - Install dependencies (`npm ci`)
   - Run tests (`npm test`)
   - Report results

3. **Matrix Strategy:**
   - Tests run on multiple Node.js versions for compatibility

## Troubleshooting

### Tests fail in CI but pass locally

- Check Node.js version compatibility
- Ensure all dependencies are in `package-lock.json`
- Run `npm ci` locally (not `npm install`)

### Status checks not showing

- Make sure branch protection is configured correctly
- Check that workflow file is in `.github/workflows/ci.yml`
- Verify workflow has run at least once

### Cannot merge even though tests pass

- Check that all required status checks are passing
- Ensure branch is up to date with main
- Verify branch protection rules are configured correctly

---

**Note:** This setup ensures code quality and prevents broken code from being merged to main.

