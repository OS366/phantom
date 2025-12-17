# JavaScript Version Requirements for Phantom.js

## Summary

**Minimum Required:** ECMAScript 5 (ES5) / JavaScript 1.8.5  
**Recommended:** Rhino 1.7R4+ (bundled with Java 8+)  
**Tested With:** Mirth Connect 4.5.2+ (Java 8+), OIE (Rhino), BridgeLink

---

## JavaScript Engine Compatibility

### Mirth Connect Versions

| Mirth Connect Version | Java Version | JavaScript Engine | Phantom.js Compatible |
|----------------------|--------------|-------------------|----------------------|
| 4.5.2 - 4.6.x | Java 8+ | Rhino 1.7R4 | ✅ Yes |
| 4.7.0+ | Java 17+ | Rhino 1.7R4+ | ✅ Yes |
| 3.x - 4.5.1 | Java 7+ | Rhino 1.7R3 | ⚠️ May work (untested) |
| < 3.0 | Java 6 | Rhino 1.7R2 | ❌ Not recommended |

### Open Integration Engine (OIE)

- **Engine:** Rhino (bundled with Oracle Integration Cloud)
- **Version:** Typically Rhino 1.7R4+
- **Compatibility:** ✅ Fully compatible

### BridgeLink

- **Engine:** Rhino (bundled with BridgeLink)
- **Version:** Typically Rhino 1.7R4+
- **Compatibility:** ✅ Fully compatible

---

## JavaScript Features Used by Phantom.js

Phantom.js is written using **ES5 (ECMAScript 5)** features only for maximum compatibility:

### ✅ Features Used (ES5 - All Supported)

- `var` declarations (no `let`/`const`)
- `function` declarations and expressions
- `typeof` operator
- `instanceof` operator
- `try/catch/finally` blocks
- `if/else`, `for`, `while` loops
- `return` statements
- `throw` statements
- `"use strict"` mode
- Object literal notation `{}`
- Array literal notation `[]`
- Function expressions
- IIFE (Immediately Invoked Function Expression)

### ✅ Standard APIs Used (ES5 - All Supported)

- `JSON.parse()` and `JSON.stringify()`
- `Array.isArray()`
- `Object.keys()`
- `String.prototype` methods (charAt, indexOf, lastIndexOf, replace, slice, substring, toLowerCase, toUpperCase, length, etc.)
- `Number.prototype` methods (toFixed, etc.)
- `Math` object methods (abs, ceil, floor, pow, random, round, sqrt)
- `RegExp` for pattern matching
- `Error` constructor
- `typeof` and `instanceof` operators

### ❌ Features NOT Used (ES6+ - Not Required)

- `const` / `let` (uses `var` only)
- Arrow functions `=>` (uses `function` only)
- Template literals `` `...` `` (uses string concatenation)
- Classes `class` (uses functions/objects)
- `async`/`await` (uses callbacks)
- Spread operator `...` (uses manual iteration)
- Destructuring (uses direct property access)
- `Map`/`Set` (uses objects/arrays)
- `Promise` (uses synchronous code)
- `for...of` loops (uses `for` loops)
- `Symbol` (not used)

---

## Java API Dependencies

Phantom.js conditionally uses Java APIs when available (Rhino environment):

### Required for Full Functionality

- **Java 8+** (for Base64 operations - `java.util.Base64`)
- **Java XML APIs** (for XML operations):
  - `javax.xml.parsers.DocumentBuilderFactory`
  - `javax.xml.transform.TransformerFactory`
  - `javax.xml.xpath.XPathFactory`
  - `org.xml.sax.InputSource`
- **Java I/O** (for XML operations):
  - `java.io.StringReader`
  - `java.io.StringWriter`

### Optional (with JavaScript Fallbacks)

- **Base64 Operations:** Prefers `java.util.Base64`, falls back to `btoa`/`atob` if available, or manual implementation
- **String Conversion:** Prefers `java.lang.String.valueOf()`, falls back to `String()`

---

## Compatibility Matrix

| Feature | ES5/Rhino 1.7R3 | ES5/Rhino 1.7R4+ | Notes |
|---------|-----------------|------------------|-------|
| Core Library | ✅ | ✅ | Pure ES5 |
| String Operations | ✅ | ✅ | Pure JavaScript |
| Number Operations | ✅ | ✅ | Pure JavaScript |
| JSON Operations | ✅ | ✅ | Requires JSON API (ES5) |
| Base64 Operations | ⚠️ | ✅ | Java 8+ preferred, has fallbacks |
| XML Operations | ❌ | ✅ | Requires Java XML APIs |
| Map Operations | ✅ | ✅ | Uses Java Map objects (Rhino) |

---

## Testing Recommendations

### For Mirth Connect 4.5.2 - 4.6.x (Java 8)

✅ **Fully Supported**
- All operations work
- Base64 uses Java 8 APIs
- XML operations fully functional

### For Mirth Connect 4.7.0+ (Java 17)

✅ **Fully Supported**
- All operations work
- Base64 uses Java 8+ APIs (backward compatible)
- XML operations fully functional

### For Older Versions (Pre-4.5.2)

⚠️ **Limited Support**
- Core operations (String, Number, JSON, Maps) should work
- Base64 may fall back to JavaScript implementation
- XML operations may not work (requires Java XML APIs)

---

## Verification Steps

To verify JavaScript engine compatibility in your environment:

```javascript
// Check if JSON is available (ES5 requirement)
if (typeof JSON !== "undefined" && JSON.parse && JSON.stringify) {
    logger.info("JSON API: Available");
} else {
    logger.error("JSON API: NOT Available - ES5 required");
}

// Check if Array.isArray is available (ES5 requirement)
if (typeof Array !== "undefined" && Array.isArray) {
    logger.info("Array.isArray: Available");
} else {
    logger.error("Array.isArray: NOT Available - ES5 required");
}

// Check if Object.keys is available (ES5 requirement)
if (typeof Object !== "undefined" && Object.keys) {
    logger.info("Object.keys: Available");
} else {
    logger.error("Object.keys: NOT Available - ES5 required");
}

// Check Java version (for Base64/XML operations)
if (typeof java !== "undefined") {
    try {
        if (java.util && java.util.Base64) {
            logger.info("Java Base64: Available (Java 8+)");
        } else {
            logger.warn("Java Base64: NOT Available - will use fallback");
        }
        
        if (javax && javax.xml && javax.xml.parsers) {
            logger.info("Java XML APIs: Available");
        } else {
            logger.warn("Java XML APIs: NOT Available - XML operations will fail");
        }
    } catch (e) {
        logger.warn("Java check failed: " + e.message);
    }
} else {
    logger.warn("Java not available - running in non-Rhino environment");
}
```

---

## Recommendations

### Minimum Requirements

1. **JavaScript Engine:** ES5-compliant (Rhino 1.7R3+)
2. **Java Version:** Java 8+ (for full functionality)
3. **Mirth Connect:** 4.5.2+ (recommended)

### For Production Use

1. **Test in your specific environment** before deploying
2. **Verify Java version** matches requirements
3. **Check JavaScript engine** using verification script above
4. **Test XML operations** if you plan to use them (requires Java XML APIs)

### For Development

1. Use Mirth Connect 4.5.2+ or OIE for testing
2. Ensure Java 8+ is installed
3. Test all operations you plan to use in production

---

## Known Limitations

1. **XML Operations:** Require Java XML APIs (not available in pure browser environments)
2. **Base64 Operations:** Prefer Java 8+ APIs but have JavaScript fallbacks
3. **Map Operations:** Require Rhino environment (Java Map objects)

---

## Support

If you encounter compatibility issues:

1. Check your Java version: `java -version`
2. Check Mirth Connect version
3. Run the verification script above
4. Report issues with environment details at: https://github.com/OS366/phantom/issues

---

**Last Updated:** December 2024  
**Phantom.js Version:** 0.1.3

