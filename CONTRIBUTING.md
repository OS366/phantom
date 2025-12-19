# Contributing to Phantom.js

Thank you for your interest in contributing to Phantom.js! This guide will help you understand how to use Phantom.js in your projects and how to contribute to the project.

---

## 📖 Table of Contents

1. [Using Phantom.js in Your Projects](#using-phantomjs-in-your-projects)
2. [Development Setup](#development-setup)
3. [Running Tests](#running-tests)
4. [Making Contributions](#making-contributions)
5. [Code Style Guidelines](#code-style-guidelines)
6. [License Requirements](#license-requirements)

---

## 🚀 Using Phantom.js in Your Projects

### Installation

Phantom.js is designed for use in **Mirth Connect**, **Open Integration Engine (OIE)**, and **BridgeLink** environments.

#### Step-by-Step Installation:

1. **Get the Library:**
   - Download `phantom.js` or `phantom.min.js` from the [releases page](https://github.com/OS366/phantom/releases)
   - Or copy the code directly from the repository

2. **Install in Mirth Connect / OIE / BridgeLink:**
   - Go to **Channels** → **Edit Code Template**
   - Click **New Library**
   - Select **New Code Templates**
   - Paste the Phantom.js code
   - Set **Context** to **Select All Context** (or specific contexts as needed)
   - Name it (e.g., "Phantom.js Library")
   - Click **Save**

3. **Use in Your Scripts:**
   ```javascript
   // No initialization needed - immediately available!
   var result = phantom.strings.operation.trim("  hello  ");
   // Output: "hello"
   
   // Check version
   logger.info("Using Phantom.js " + phantom.version);
   ```

### Quick Examples

```javascript
// String Operations
var cleaned = phantom.strings.operation.trim("  hello world  ");
var padded = phantom.strings.operation.leftPad("5", 3, "0"); // "005"

// Number Operations
var sum = phantom.numbers.operation.add(10, 20); // 30
var rounded = phantom.numbers.operation.round(3.14159, 2); // 3.14

// JSON Operations
var json = phantom.json.operation.parse('{"name": "John"}');
var value = phantom.json.operation.get(json, "name"); // "John"

// Map Operations (Mirth Connect)
phantom.maps.channel.save("key", "value");
var value = phantom.maps.channel.get("key"); // "value"

// Chaining API (v0.1.6+)
var result = phantom.numbers.chain(10)
    .add(5)
    .multiply(2)
    .round(0)
    .value(); // 30
```

### Documentation

- **[Wiki Home](https://github.com/OS366/phantom/wiki)** - Complete documentation
- **[API Reference](https://github.com/OS366/phantom/wiki/API-Reference)** - All available functions
- **[Examples](https://github.com/OS366/phantom/wiki/Examples)** - Real-world usage examples
- **[Best Practices](https://github.com/OS366/phantom/wiki/Best-Practices)** - Tips and patterns

---

## 🛠️ Development Setup

If you want to contribute code to Phantom.js, follow these steps:

### Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js)
- **Git**

### Setup Steps

1. **Fork the Repository:**
   - Click "Fork" on [GitHub](https://github.com/OS366/phantom)
   - This creates your own copy of the repository

2. **Clone Your Fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/phantom.git
   cd phantom
   ```

3. **Add Upstream Remote:**
   ```bash
   git remote add upstream https://github.com/OS366/phantom.git
   ```

4. **Install Dependencies:**
   ```bash
   cd scripts
   npm install
   ```

5. **Verify Setup:**
   ```bash
   # Run tests to make sure everything works
   npm test
   ```

---

## ✅ Running Tests

Phantom.js has comprehensive test coverage. Always run tests before submitting changes.

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Check test coverage (strict mode)
npm run test:check

# Check test coverage with diff (for CI)
npm run test:check-diff
```

### Test Structure

- **Test File:** `phantom.test.js` (in root directory)
- **Test Framework:** Jest
- **Coverage Target:** 100% (all functions must be tested)

### Writing Tests

When adding new features, you **must** add corresponding tests:

```javascript
describe('phantom.numbers.operation.newFeature', function() {
    it('should handle normal case', function() {
        var result = phantom.numbers.operation.newFeature(10);
        expect(result).toBe(20);
    });
    
    it('should handle edge cases', function() {
        var result = phantom.numbers.operation.newFeature(null);
        expect(result).toBeNull();
    });
    
    it('should handle errors', function() {
        expect(function() {
            phantom.numbers.operation.newFeature("invalid");
        }).toThrow();
    });
});
```

---

## 📝 Making Contributions

### Workflow

1. **Create a Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes:**
   - Write code following the [Code Style Guidelines](#code-style-guidelines)
   - Add tests for new features
   - Update documentation if needed

3. **Test Your Changes:**
   ```bash
   npm test
   npm run test:coverage
   ```

4. **Commit Your Changes:**
   ```bash
   git add .
   git commit -m "feat: Add new feature description"
   ```
   
   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `test:` - Test additions/changes
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance tasks

5. **Push to Your Fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request:**
   - Go to [GitHub](https://github.com/OS366/phantom)
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Submit for review

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Test coverage is 100% (`npm run test:check`)
- [ ] Code follows style guidelines
- [ ] Documentation is updated (if needed)
- [ ] Commit messages are clear and descriptive
- [ ] No merge conflicts with `main` branch

---

## 📋 Code Style Guidelines

### JavaScript Style

Phantom.js uses **ES5 (ECMAScript 5)** for maximum compatibility:

- ✅ Use `var` (not `let` or `const`)
- ✅ Use `function` declarations
- ✅ Use `"use strict"` mode
- ✅ Use traditional `for` loops (not `for...of`)
- ✅ Use `typeof` for type checking

### Code Structure

```javascript
// ✅ Good: Clear structure, error handling
phantom.category.operation.method = function(param1, param2) {
    "use strict";
    
    try {
        // Validation
        if (param1 === null || param1 === undefined) {
            throw new Error("[phantom] category.operation.method: param1 is required");
        }
        
        // Implementation
        var result = /* your logic */;
        
        return result;
    } catch (e) {
        // Error logging
        if (typeof logger !== 'undefined' && logger !== null) {
            logger.error("[phantom] category.operation.method: " + e.message);
        }
        throw e;
    }
};
```

### Naming Conventions

- **Functions:** `camelCase` (e.g., `trim`, `leftPad`, `parseJson`)
- **Objects:** `camelCase` (e.g., `phantom.maps.channel`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `FORMAT.ISO_DATE`)

### Error Handling

- Always use try-catch blocks
- Log errors with `[phantom]` prefix
- Provide specific error messages
- Throw errors (don't return null silently)

### Documentation

- Add JSDoc comments for new functions:
  ```javascript
  /**
   * Trims whitespace from both ends of a string
   * @param {string} str - The string to trim
   * @returns {string} The trimmed string
   */
  ```

---

## ⚖️ License Requirements

**Important:** Phantom.js is licensed under **GPL v3 (GNU General Public License v3.0)**.

### For Contributors

By contributing to Phantom.js, you agree that:

1. Your contributions will be licensed under GPL v3
2. You have the right to contribute the code
3. Your code follows the project's coding standards

### For Users

**Copyleft License:** If you use Phantom.js in your project, your project must also be:

- Licensed under GPL v3
- Open source (source code must be available)
- Distributed with the same license

**This means:** If you use Phantom.js, you cannot keep your project proprietary/closed-source.

### License Text

See [LICENSE](LICENSE) file for the complete GPL v3 license text.

---

## 🐛 Reporting Issues

Found a bug or have a suggestion? Please [open an issue](https://github.com/OS366/phantom/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (Mirth Connect version, Java version, etc.)

---

## 💬 Getting Help

- **Documentation:** [Wiki](https://github.com/OS366/phantom/wiki)
- **Issues:** [GitHub Issues](https://github.com/OS366/phantom/issues)
- **Discussions:** [GitHub Discussions](https://github.com/OS366/phantom/discussions) (if enabled)

---

## 🙏 Thank You!

Your contributions help make Phantom.js better for everyone. Thank you for taking the time to contribute!

---

**Questions?** Feel free to open an issue or start a discussion on GitHub.

