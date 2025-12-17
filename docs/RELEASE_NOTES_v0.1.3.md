# Phantom.js v0.1.3 - Beta Release

**Release Date:** December 2024  
**Status:** 🟡 **Beta / Pre-Release**  
**Tag:** `v0.1.3`

---

## ⚠️ Beta Release Notice

This is a **beta/pre-release version** of Phantom.js. While the library is feature-complete and thoroughly tested, we recommend:

- ✅ Testing in staging/development environments first
- ✅ Monitoring error logs in production
- ✅ Keeping backups of your integration code
- ✅ Reporting any issues via GitHub Issues

We're actively working towards v1.0.0 for full production stability.

---

## 🎉 What's New in v0.1.3

### ✨ New Features

#### XML Operations Support
- **`phantom.xml.operation.parse()`** - Parse XML strings to DOM objects
- **`phantom.xml.operation.stringify()`** - Convert XML objects to strings
- **`phantom.xml.operation.get()`** - Query XML using XPath expressions
- **`phantom.xml.operation.has()`** - Check if XPath exists in XML
- **`phantom.xml.operation.toString()`** - Convert XML to string for logging

**Note:** XML operations require Java XML APIs (OIE/Rhino environment). See [XML Operations Wiki](https://github.com/OS366/phantom/wiki/XML-Operations) for details.

---

## 📊 Library Statistics

- **Total Functions:** 93
  - Map Operations: 18 (5 maps with save/get/exists/delete methods)
  - String Operations: 26
  - Number Operations: 27
  - JSON Operations: 15
  - Base64 Operations: 2
  - XML Operations: 5 (NEW in v0.1.3)
- **Test Cases:** 186 (all passing ✅)
- **Test Coverage:** Comprehensive coverage for all operations

---

## 🚀 Complete Feature Set

### Map Operations
Full support for 5 map types:
- `phantom.maps.channel` - Channel map operations
- `phantom.maps.global` - Global map operations
- `phantom.maps.connector` - Connector map operations
- `phantom.maps.response` - Response map operations (response context only)
- `phantom.maps.configuration` - Configuration map (read-only)

### String Operations (26 functions)
find, leftPad, rightPad, dualPad, leftTrim, rightTrim, trim, split, splice, compare, join, replace, replaceAll, substring, toUpperCase, toLowerCase, capitalize, reverse, length, startsWith, endsWith, contains, repeat, remove, isEmpty, isBlank

### Number Operations (27 functions)
parse, isNumber, add, subtract, multiply, divide, round, min, max, abs, ceil, floor, sqrt, pow, mod, random, randomInt, between, clamp, sign, isEven, isOdd, isPositive, isNegative, isZero, toFixed, truncate

### JSON Operations (15 functions)
parse, stringify, get, set, has, remove, keys, values, size, merge, isEmpty, isArray, isObject, toString, prettyPrint

### Base64 Operations (2 functions)
encode, decode (with UTF-8 support)

### XML Operations (5 functions) - NEW
parse, stringify, get, has, toString

---

## 📦 Installation

### For Mirth Connect / Open Integration Engine / BridgeLink

**Compatible with version 4.5.2 and above**

1. **Copy the library code:**
   - Download `phantom.js` or `phantom.min.js` from this release
   - Copy the entire contents

2. **Navigate to Code Templates:**
   - Go to **Channels** → **Edit Code Template**
   - Click **New Library** → **New Code Templates**

3. **Create the library:**
   - Paste the Phantom.js code
   - Set **Context** to **Select All Context**
   - Name it (e.g., "Phantom.js Library")
   - Click **Save**

4. **Use in your scripts:**
   - The library is immediately available as `phantom` in your script context
   - No initialization required - plug and play!

**Note:** Use `phantom.min.js` for production (smaller size) or `phantom.js` for development (readable).

---

## 💡 Quick Start Example

```javascript
// String operations
var cleaned = phantom.strings.operation.trim("  hello world  ");
// Output: "hello world"

// Number operations
var result = phantom.numbers.operation.add(5, 3);
// Output: 8

// JSON operations
var obj = phantom.json.operation.parse('{"name":"John","age":30}');
var name = phantom.json.operation.get(obj, "name");
// Output: "John"

// Base64 operations
var encoded = phantom.base64.operation.encode("Hello World");
// Output: "SGVsbG8gV29ybGQ="

// XML operations (NEW)
var xml = phantom.xml.operation.parse('<root><name>John</name></root>');
var name = phantom.xml.operation.get(xml, "/root/name");
// Output: "John"

// Map operations
phantom.maps.channel.save("userId", "12345");
var userId = phantom.maps.channel.get("userId");
// Output: "12345"
```

---

## 📚 Documentation

Comprehensive documentation available at: **[Phantom.js Wiki](https://github.com/OS366/phantom/wiki)**

- [Getting Started](https://github.com/OS366/phantom/wiki/Getting-Started)
- [Map Operations](https://github.com/OS366/phantom/wiki/Map-Operations)
- [String Operations](https://github.com/OS366/phantom/wiki/String-Operations)
- [Number Operations](https://github.com/OS366/phantom/wiki/Number-Operations)
- [JSON Operations](https://github.com/OS366/phantom/wiki/JSON-Operations)
- [Base64 Operations](https://github.com/OS366/phantom/wiki/Base64-Operations)
- [XML Operations](https://github.com/OS366/phantom/wiki/XML-Operations) (NEW)
- [Best Practices](https://github.com/OS366/phantom/wiki/Best-Practices)
- [Examples](https://github.com/OS366/phantom/wiki/Examples)
- [Troubleshooting](https://github.com/OS366/phantom/wiki/Troubleshooting)
- [API Reference](https://github.com/OS366/phantom/wiki/API-Reference)

---

## ⚠️ Known Limitations

1. **Drag and Drop:** Variables saved using `phantom.maps.*` are NOT available for drag-and-drop in Destination Mappings. This is a known OIE editor limitation (not a Phantom bug).

2. **XML Operations:** Require Java XML APIs (OIE/Rhino environment). Browser environments are not supported.

3. **Beta Status:** This is a beta release. API may change before v1.0.0.

---

## 🔧 Error Handling

All operations include:
- ✅ Consistent error handling
- ✅ Specific error messages
- ✅ Automatic error logging (with `[phantom]` prefix)
- ✅ Silent operation by default (no logging on success)

---

## 🧪 Testing

- **186 test cases** - All passing ✅
- **Comprehensive coverage** for all operations
- Tested in Node.js environment (mocked OIE/Rhino APIs)

Run tests locally:
```bash
npm install
npm test
npm run test:coverage
```

---

## 📝 Changelog

### v0.1.3 (Current - Beta)
- ✨ Added XML operations support (parse, stringify, get, has, toString)
- 📚 Updated documentation and wiki
- 🐛 Fixed XML operations to require Java XML APIs (OIE/Rhino only)
- ✅ Updated test suite (186 tests)

### v0.1.2
- ✨ Added Base64 operations (encode, decode)
- 📦 Added minified version (phantom.min.js)
- 📝 Updated documentation

### v0.1.1
- ✨ Added JSON operations (15 functions)
- ✨ Added prettyPrint for JSON
- 🐛 Fixed error messages to be specific

### v0.1.0
- 🎉 Initial release
- ✨ Map operations
- ✨ String operations (26 functions)
- ✨ Number operations (27 functions)

---

## 🤝 Support

- **Issues:** [GitHub Issues](https://github.com/OS366/phantom/issues)
- **Wiki:** [Documentation](https://github.com/OS366/phantom/wiki)
- **License:** See LICENSE file

---

## 🙏 Credits

**Phantom.js v0.1.3 - A product of David Labs**

---

## 📥 Download

- **Full version:** [phantom.js](https://github.com/OS366/phantom/releases/download/v0.1.3/phantom.js)
- **Minified version:** [phantom.min.js](https://github.com/OS366/phantom/releases/download/v0.1.3/phantom.min.js)

---

**⚠️ Remember:** This is a beta release. Test thoroughly before production use!

