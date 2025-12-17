# Phantom.js

A lightweight helper library for Mirth Connect, Open Integration Engine (OIE), and BridgeLink scripting.

**Version:** 0.1.3

## Overview

Phantom.js provides a comprehensive set of utilities for working with maps, strings, numbers, JSON, base64, and XML operations in Mirth Connect, Open Integration Engine (OIE), and BridgeLink scripting environments. All operations follow a consistent API pattern and include proper error handling.

## Statistics

- **Total Functions:** 93
  - Map Operations: 18 (5 maps with save/get/exists/delete methods)
  - String Operations: 26
  - Number Operations: 27
  - JSON Operations: 15
  - Base64 Operations: 2
  - XML Operations: 5
- **Test Cases:** 174
- **Test Coverage:** Comprehensive coverage for all operations

## Documentation

For detailed documentation, examples, and best practices, visit the [Phantom.js Wiki](https://github.com/OS366/phantom/wiki):

- **[Getting Started](https://github.com/OS366/phantom/wiki/Getting-Started)** - Installation and basic usage
- **[Map Operations](https://github.com/OS366/phantom/wiki/Map-Operations)** - Complete guide to working with maps
- **[String Operations](https://github.com/OS366/phantom/wiki/String-Operations)** - All string utilities and examples
- **[Number Operations](https://github.com/OS366/phantom/wiki/Number-Operations)** - All number utilities and examples
- **[JSON Operations](https://github.com/OS366/phantom/wiki/JSON-Operations)** - All JSON utilities and examples
- **[Base64 Operations](https://github.com/OS366/phantom/wiki/Base64-Operations)** - Base64 encode/decode operations
- **[XML Operations](https://github.com/OS366/phantom/wiki/XML-Operations)** - XML parse, stringify, query operations
- **[Best Practices](https://github.com/OS366/phantom/wiki/Best-Practices)** - Tips and patterns for effective usage
- **[Examples](https://github.com/OS366/phantom/wiki/Examples)** - Real-world usage examples
- **[Troubleshooting](https://github.com/OS366/phantom/wiki/Troubleshooting)** - Common issues and solutions
- **[API Reference](https://github.com/OS366/phantom/wiki/API-Reference)** - Complete API documentation

## Rules

- **No logging on normal operations** - Operations run silently by default
- **Error logging only** - Only logs when there is an error
- **Specific error messages** - Errors show detailed messages when available
- **Full file** - Includes maps + strings + numbers + JSON + base64 + XML utilities

## Warning

Drag and drop is not possible for variables saved using `phantom.maps.*`

---

## Installation

### For Mirth Connect / Open Integration Engine / BridgeLink

**Compatible with version 4.5.2 and above**

#### Step-by-Step Instructions:

1. **Copy the library code:**
   - Open `phantom.js` or `phantom.min.js` from this repository
   - Copy the entire contents of the file

2. **Navigate to Code Templates:**
   - Go to **Channels** → **Edit Code Template**
   - Click **New Library**
   - Select **New Code Templates**

3. **Create the library:**
   - Paste the copied Phantom.js code into the editor
   - Set **Context** to **Select All Context** (or choose specific contexts as needed)
   - Give it a name (e.g., "Phantom.js Library")
   - Click **Save**

4. **Use in your scripts:**
   - The library will be available as `phantom` in your script context
   - No additional setup required
   - You can now use all Phantom.js operations in your channel scripts

**Note:** You can use either `phantom.js` (readable) or `phantom.min.js` (minified, smaller size). Both work identically.

### For Development/Testing

```bash
# Clone the repository
git clone https://github.com/OS366/phantom.git
cd phantom

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## Usage

Phantom.js is a plug-and-play library - no initialization required! Once installed, it's immediately available in your scripts.

```javascript
// Get version (optional)
phantom.version;  // "0.1.3"

// Use any operation directly
var result = phantom.strings.operation.trim("  hello  ");
// Output: "hello"
```

**Note:** Initialization with `phantom.init()` is optional and only needed if you want to customize settings (e.g., `phantom.init({ silent: false })`).

---

## Quick Reference

### Map Operations

- `phantom.maps.channel` - Channel map operations (save, get, exists, delete)
- `phantom.maps.global` - Global map operations
- `phantom.maps.connector` - Connector map operations
- `phantom.maps.response` - Response map operations (response context only)
- `phantom.maps.configuration` - Configuration map (read-only: get, exists)

See [Map Operations Wiki](https://github.com/OS366/phantom/wiki/Map-Operations) for details.

### String Operations

26 operations including: find, leftPad, rightPad, trim, split, replace, substring, toUpperCase, toLowerCase, capitalize, reverse, length, startsWith, endsWith, contains, repeat, remove, isEmpty, isBlank, and more.

See [String Operations Wiki](https://github.com/OS366/phantom/wiki/String-Operations) for details.

### Number Operations

27 operations including: parse, isNumber, add, subtract, multiply, divide, round, min, max, abs, ceil, floor, sqrt, pow, mod, random, randomInt, between, clamp, sign, isEven, isOdd, isPositive, isNegative, isZero, toFixed, truncate.

See [Number Operations Wiki](https://github.com/OS366/phantom/wiki/Number-Operations) for details.

### JSON Operations

15 operations including: parse, stringify, get, set, has, remove, keys, values, size, merge, isEmpty, isArray, isObject, toString, prettyPrint.

See [JSON Operations Wiki](https://github.com/OS366/phantom/wiki/JSON-Operations) for details.

### Base64 Operations

2 operations: encode, decode.

See [Base64 Operations Wiki](https://github.com/OS366/phantom/wiki/Base64-Operations) for details.

### XML Operations

5 operations: parse, stringify, get, has, toString.

See [XML Operations Wiki](https://github.com/OS366/phantom/wiki/XML-Operations) for details.

---

## Error Handling

All operations follow consistent error handling with specific error messages. Errors are logged to the logger (if available) with the prefix `[phantom]`.

See [Troubleshooting Wiki](https://github.com/OS366/phantom/wiki/Troubleshooting) for common issues and solutions.

---

## License

See LICENSE file for details.
