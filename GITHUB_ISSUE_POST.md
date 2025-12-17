Hi,

We created a library called Phantom.js, which includes a comprehensive set of utilities for OIE scripting. It provides a consistent API for working with maps, strings, numbers, JSON, Base64, and XML operations in Mirth Connect, Open Integration Engine (OIE), and BridgeLink environments.

## Overview

Phantom.js is a lightweight helper library designed specifically for OIE scripting environments. It offers 93 functions across multiple categories:

- **Map Operations (18 functions)**: Full support for channelMap, globalMap, connectorMap, responseMap, and configurationMap with save, get, exists, and delete operations
- **String Operations (26 functions)**: find, pad, trim, split, replace, substring, case conversion, and more
- **Number Operations (27 functions)**: parse, arithmetic, rounding, random, validation, and formatting
- **JSON Operations (15 functions)**: parse, stringify, get, set, has, remove, keys, values, merge, prettyPrint, and more
- **Base64 Operations (2 functions)**: encode and decode with UTF-8 support
- **XML Operations (5 functions)**: parse, stringify, XPath querying (get, has), and toString

## Key Features

- **Plug-and-play**: No initialization required - works immediately after installation
- **Consistent API**: All operations follow the same pattern (phantom.category.operation.method)
- **Error Handling**: Specific error messages with automatic logging
- **Silent by Default**: Operations run silently, only logging on errors
- **Comprehensive Testing**: 186 test cases, all passing
- **Full Documentation**: Complete wiki with examples and best practices

## Installation

1. Copy the contents of `phantom.js` or `phantom.min.js`
2. Go to Channels → Edit Code Template → New Library → New Code Templates
3. Paste the code, set Context to "Select All Context", and save
4. The library is immediately available as `phantom` in your script context

**Compatible with:** Mirth Connect, Open Integration Engine (OIE), and BridgeLink (version 4.5.2 and above)

## Quick Examples

```javascript
// String operations
var cleaned = phantom.strings.operation.trim("  hello world  ");

// Number operations
var result = phantom.numbers.operation.add(5, 3);

// JSON operations
var obj = phantom.json.operation.parse('{"name":"John","age":30}');
var name = phantom.json.operation.get(obj, "name");

// Base64 operations
var encoded = phantom.base64.operation.encode("Hello World");

// XML operations
var xml = phantom.xml.operation.parse('<root><name>John</name></root>');
var name = phantom.xml.operation.get(xml, "/root/name");

// Map operations
phantom.maps.channel.save("userId", "12345");
var userId = phantom.maps.channel.get("userId");
```

## Documentation

Complete documentation is available at: https://github.com/OS366/phantom/wiki

The wiki includes:
- Getting Started guide
- Detailed API reference for each operation category
- Real-world examples
- Best practices
- Troubleshooting guide

## Current Version

**Version 0.1.3 (Beta)**

This is currently a beta release. The library is feature-complete and thoroughly tested, but we recommend testing in staging environments first.

## Repository

https://github.com/OS366/phantom

## Known Limitations

- Variables saved using `phantom.maps.*` are not available for drag-and-drop in Destination Mappings (this is a known OIE editor limitation, not a Phantom bug)
- XML operations require Java XML APIs (OIE/Rhino environment only)

We would appreciate any feedback, suggestions, or contributions from the OIE community. Thank you for your consideration.

