# Phantom.js v0.1.5-BETA - Beta Release

**Release Date:** December 2024  
**Status:** 🟡 **Beta / Pre-Release**  
**Tag:** `v0.1.5-BETA`

---

## ⚠️ Beta Release Notice

This is a **beta/pre-release version** of Phantom.js. While the library is feature-complete and thoroughly tested, we recommend:

- ✅ Testing in staging/development environments first
- ✅ Monitoring error logs in production
- ✅ Keeping backups of your integration code
- ✅ Reporting any issues via GitHub Issues

We're actively working towards v1.0.0 for full production stability.

---

## 🎉 What's New in v0.1.5-BETA

### ✨ New Features

#### String Operations Chaining API 🚀

**`phantom.strings.chain(input)`** - Chain multiple string operations together for cleaner, more readable code!

**Before (without chaining):**
```javascript
var step1 = phantom.strings.operation.trim(raw);
var step2 = phantom.strings.operation.toLowerCase(step1);
var step3 = phantom.strings.operation.capitalize(step2);
```

**After (with chaining):**
```javascript
var result = phantom.strings.chain(raw)
  .trim()
  .toLowerCase()
  .capitalize()
  .value();
```

**Available Chainable Methods:**
- `trim()` - Remove leading/trailing whitespace
- `toUpperCase()` - Convert to uppercase
- `toLowerCase()` - Convert to lowercase
- `capitalize()` - Capitalize first letter
- `reverse()` - Reverse entire string
- `reverseWords()` - Reverse word order
- `leftTrim()` - Remove leading whitespace
- `rightTrim()` - Remove trailing whitespace
- `replace(searchString, replaceString)` - Replace first occurrence
- `replaceAll(searchString, replaceString)` - Replace all occurrences
- `remove(stringToRemove)` - Remove substring
- `leftPad(padChar, count)` - Pad on the left
- `rightPad(padChar, count)` - Pad on the right
- `substring(start, end)` - Extract substring
- `wordwrap(size, cut, everything)` - Wrap text to line length

**Examples:**
```javascript
// Clean and normalize
var cleaned = phantom.strings.chain("  HELLO WORLD  ")
  .trim()
  .toLowerCase()
  .capitalize()
  .value();
// Returns: "Hello world"

// Complex chaining
var result = phantom.strings.chain("hello hello")
  .replaceAll("hello", "hi")
  .toUpperCase()
  .value();
// Returns: "HI HI"

// With replace operations
var result = phantom.strings.chain("hello world")
  .replace("world", "universe")
  .capitalize()
  .value();
// Returns: "Hello universe"
```

**Getting the Result:**
- Use `.value()` to get the final string
- Use `.toString()` (alias for `.value()`)
- Automatic conversion when used in string context

---

### 🐛 Bug Fixes

- Fixed release workflow permissions for GitHub Actions
- Fixed YAML syntax errors in release automation
- Fixed filename truncation in release packages

---

### 🔧 Improvements

- **Release Automation:** Complete automated release workflow
  - Automatic release package creation
  - Automatic GitHub release creation
  - Release notes integration
  - Pre-release flag detection

- **Test Coverage:** 
  - Added 18 comprehensive test cases for chaining API
  - 100% test coverage maintained
  - Total: 253 test cases, all passing

- **Documentation:**
  - Updated wiki with new string functions
  - Added chaining API examples
  - Improved release notes

---

## 📊 Statistics

- **Total Functions:** 105
  - Map Operations: 20
  - String Operations: 28 (including new chaining API)
  - Number Operations: 27
  - JSON Operations: 15
  - Base64 Operations: 2
  - XML Operations: 5
  - Date Operations: 15
  - Duration Operations: 7
- **Test Cases:** 253
- **Test Coverage:** 100%

---

## 🔄 Migration Guide

### Using the New Chaining API

**Old Way:**
```javascript
var cleaned = phantom.strings.operation.trim(
  phantom.strings.operation.toLowerCase(
    phantom.strings.operation.capitalize("  HELLO  ")
  )
);
```

**New Way (Recommended):**
```javascript
var cleaned = phantom.strings.chain("  HELLO  ")
  .trim()
  .toLowerCase()
  .capitalize()
  .value();
```

**Note:** The old way still works! Chaining is optional and provides a cleaner syntax for multiple operations.

---

## 📚 Documentation

For detailed documentation, examples, and best practices, visit the [Phantom.js Wiki](https://github.com/OS366/phantom/wiki):

- **[Getting Started](https://github.com/OS366/phantom/wiki/Getting-Started)** - Installation and basic usage
- **[String Operations](https://github.com/OS366/phantom/wiki/String-Operations)** - All string utilities including chaining
- **[Best Practices](https://github.com/OS366/phantom/wiki/Best-Practices)** - Tips and patterns for effective usage
- **[Examples](https://github.com/OS366/phantom/wiki/Examples)** - Real-world usage examples

---

## 🚀 Installation

### For Mirth Connect / Open Integration Engine / BridgeLink

1. Download `phantom.js` or `phantom.min.js` from the [releases page](https://github.com/OS366/phantom/releases)
2. Copy the entire contents
3. Go to **Channels** → **Edit Code Template** → **New Library** → **New Code Templates**
4. Paste the code, set Context to "Select All Context", and save
5. The library is immediately available as `phantom` in your scripts

**Compatible with:** Mirth Connect 4.5.2+, OIE, BridgeLink

---

## ⚠️ Known Limitations

1. **Drag and Drop:** Variables saved using `phantom.maps.*` are NOT available for drag-and-drop in Destination Mappings. This is a known OIE editor limitation (not a Phantom bug).

2. **Beta Status:** This is a beta release. API may change before v1.0.0.

---

## 🔧 Error Handling

All operations include:
- ✅ Consistent error handling
- ✅ Specific error messages
- ✅ Automatic error logging (with `[phantom]` prefix)
- ✅ Silent by default (only logs on errors)

---

## 📝 Changelog

### v0.1.5-BETA (Current)
- ✨ Added `phantom.strings.chain()` API for method chaining
- ✨ Added 15+ chainable string operation methods
- 🐛 Fixed release workflow permissions
- 🐛 Fixed YAML syntax errors
- 🔧 Improved release automation
- 📚 Updated documentation

### v0.1.4-BETA
- ✨ Added Date Operations (15 functions)
- ✨ Added Duration Operations (7 functions)
- ✨ Added `wordwrap` function to strings
- 📚 Updated documentation

### v0.1.3
- Initial beta release
- Map, String, Number, JSON, Base64, XML operations

---

## 🙏 Acknowledgments

Thank you to all contributors and users who have provided feedback and suggestions!

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/OS366/phantom/issues)
- **Wiki:** [Phantom.js Wiki](https://github.com/OS366/phantom/wiki)
- **Releases:** [GitHub Releases](https://github.com/OS366/phantom/releases)

---

**Phantom.js - A product of David Labs**

