# Phantom.js Wiki

Welcome to the Phantom.js wiki! This wiki contains comprehensive documentation, examples, and best practices for using Phantom.js in Mirth Connect, Open Integration Engine (OIE), and BridgeLink environments.

## Quick Navigation

### Getting Started
- **[Getting Started](Getting-Started)** - Installation and basic usage

### Core Operations
- **[Map Operations](Map-Operations)** - Complete guide to working with maps
- **[String Operations](String-Operations)** - All string utilities and examples (includes chaining API)
- **[Number Operations](Number-Operations)** - All number utilities and examples (includes chaining API)
- **[JSON Operations](JSON-Operations)** - All JSON utilities and examples
- **[Base64 Operations](Base64-Operations)** - Base64 encode/decode operations
- **[XML Operations](XML-Operations)** - XML parse, stringify, query operations
- **[Date Operations](Date-Operations)** - Date and duration operations using Java.time

### Resources
- **[Examples](Examples)** - Real-world usage examples
- **[Best Practices](Best-Practices)** - Tips and patterns for effective usage
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions
- **[API Reference](API-Reference)** - Complete API documentation

## What is Phantom.js?

Phantom.js is a lightweight helper library designed specifically for Mirth Connect, Open Integration Engine (OIE), and BridgeLink scripting environments. It provides:

- **26 String Operations** - Manipulation, transformation, and validation (with chaining API)
- **27 Number Operations** - Mathematical operations, rounding, and validation (with chaining API)
- **15 JSON Operations** - Parse, manipulate, and query JSON objects
- **2 Base64 Operations** - Encode and decode base64 strings
- **5 XML Operations** - Parse, stringify, query XML documents
- **18 Map Operations** - 5 map types (Channel, Global, Connector, Response, Configuration) with save/get/exists/delete methods
- **Consistent API** - All operations follow the same pattern
- **Error Handling** - Proper error handling with specific error messages
- **Silent by Default** - No logging on normal operations

## Key Features

✅ **Zero Dependencies** - Pure JavaScript, no external libraries  
✅ **OIE Optimized** - Designed specifically for Oracle Integration Enterprise  
✅ **Comprehensive Testing** - 284 tests covering all operations  
✅ **Well Documented** - Complete documentation with examples  
✅ **Error Safe** - Consistent error handling throughout  
✅ **104+ Total Functions** - Comprehensive utility library with chaining APIs

## Version

**Current Version:** 0.1.6-BETA

## Quick Start

```javascript
// Copy phantom.js into your OIE code templates

// Use string operations directly (no initialization needed)
var result = phantom.strings.operation.trim("  hello  ");
// Output: "hello"

// Use number operations
var sum = phantom.numbers.operation.add(5, 3);
// Output: 8

// Use map operations
phantom.maps.channel.save("key", "value");
var value = phantom.maps.channel.get("key");
// Output: "value"

// Use JSON operations
var obj = phantom.json.operation.parse('{"name":"John","age":30}');
var name = phantom.json.operation.get(obj, "name");
// Output: "John"

// Use base64 operations
var encoded = phantom.base64.operation.encode("Hello World");
// Output: "SGVsbG8gV29ybGQ="
var decoded = phantom.base64.operation.decode(encoded);
// Output: "Hello World"

// Use XML operations
var xml = phantom.xml.operation.parse('<root><name>John</name></root>');
var name = phantom.xml.operation.get(xml, 'name');
// Output: "John"
```

## Contributing

Found a bug or have a feature request? Please open an issue on the [GitHub repository](https://github.com/OS366/phantom).

## License

See the [LICENSE](../LICENSE) file for details.

---

**Next Steps:** Check out the [Getting Started](Getting-Started) guide to begin using Phantom.js in your projects.

