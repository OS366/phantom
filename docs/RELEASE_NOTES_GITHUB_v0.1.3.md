# 🚀 Phantom.js v0.1.3 - Beta Release

**Status:** 🟡 **Beta / Pre-Release**

---

## ⚠️ Beta Release Notice

This is a **beta/pre-release version**. While feature-complete and thoroughly tested, we recommend testing in staging environments first before production use.

---

## ✨ What's New

### XML Operations Support (NEW)
- `phantom.xml.operation.parse()` - Parse XML strings to DOM objects
- `phantom.xml.operation.stringify()` - Convert XML objects to strings  
- `phantom.xml.operation.get()` - Query XML using XPath expressions
- `phantom.xml.operation.has()` - Check if XPath exists in XML
- `phantom.xml.operation.toString()` - Convert XML to string for logging

**Note:** XML operations require Java XML APIs (OIE/Rhino environment).

---

## 📊 Statistics

- **Total Functions:** 93
  - Map Operations: 18
  - String Operations: 26
  - Number Operations: 27
  - JSON Operations: 15
  - Base64 Operations: 2
  - XML Operations: 5 (NEW)
- **Test Cases:** 186 (all passing ✅)

---

## 🚀 Quick Start

```javascript
// String operations
var cleaned = phantom.strings.operation.trim("  hello world  ");

// Number operations
var result = phantom.numbers.operation.add(5, 3);

// JSON operations
var obj = phantom.json.operation.parse('{"name":"John","age":30}');

// Base64 operations
var encoded = phantom.base64.operation.encode("Hello World");

// XML operations (NEW)
var xml = phantom.xml.operation.parse('<root><name>John</name></root>');
var name = phantom.xml.operation.get(xml, "/root/name");

// Map operations
phantom.maps.channel.save("userId", "12345");
```

---

## 📦 Installation

1. Download `phantom.js` or `phantom.min.js` from this release
2. Copy contents to OIE Code Templates (Channels → Edit Code Template → New Library)
3. Set Context to "Select All Context"
4. Save and use immediately - no initialization required!

**Compatible with:** Mirth Connect, Open Integration Engine (OIE), BridgeLink (version 4.5.2+)

---

## 📚 Documentation

Full documentation: **[Phantom.js Wiki](https://github.com/OS366/phantom/wiki)**

---

## ⚠️ Known Limitations

- Variables saved using `phantom.maps.*` are NOT available for drag-and-drop in Destination Mappings (OIE editor limitation)
- XML operations require Java XML APIs (OIE/Rhino environment only)

---

## 📝 Changelog

### v0.1.3 (Beta)
- ✨ Added XML operations support
- 📚 Updated documentation
- ✅ 186 tests passing

### v0.1.2
- ✨ Added Base64 operations
- 📦 Added minified version

### v0.1.1
- ✨ Added JSON operations (15 functions)

### v0.1.0
- 🎉 Initial release

---

**Phantom.js v0.1.3 - A product of David Labs**

