# Phantom.js Wiki

Welcome to the Phantom.js wiki! This wiki contains comprehensive documentation, examples, and best practices for using Phantom.js in your OIE (Oracle Integration Enterprise) scripting projects.

## Quick Navigation

- **[Getting Started](Getting-Started)** - Installation and basic usage
- **[Map Operations](Map-Operations)** - Complete guide to working with maps
- **[String Operations](String-Operations)** - All string utilities and examples
- **[Number Operations](Number-Operations)** - All number utilities and examples
- **[Best Practices](Best-Practices)** - Tips and patterns for effective usage
- **[Examples](Examples)** - Real-world usage examples
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions
- **[API Reference](API-Reference)** - Complete API documentation

## What is Phantom.js?

Phantom.js is a lightweight helper library designed specifically for OIE scripting environments. It provides:

- **28 String Operations** - Manipulation, transformation, and validation
- **25 Number Operations** - Mathematical operations, rounding, and validation
- **5 Map Types** - Channel, Global, Connector, Response, and Configuration maps
- **Consistent API** - All operations follow the same pattern
- **Error Handling** - Proper error handling with generic messages
- **Silent by Default** - No logging on normal operations

## Key Features

✅ **Zero Dependencies** - Pure JavaScript, no external libraries  
✅ **OIE Optimized** - Designed specifically for Oracle Integration Enterprise  
✅ **Comprehensive Testing** - 123 tests covering all operations  
✅ **Well Documented** - Complete documentation with examples  
✅ **Error Safe** - Consistent error handling throughout  

## Version

**Current Version:** 0.0.9

## Quick Start

```javascript
// Copy phantom.js into your OIE script editor

// Initialize (optional)
phantom.init();

// Use string operations
var result = phantom.strings.operation.trim("  hello  ");
// Output: "hello"

// Use number operations
var sum = phantom.numbers.operation.add(5, 3);
// Output: 8

// Use map operations
phantom.maps.channel.save("key", "value");
var value = phantom.maps.channel.get("key");
// Output: "value"
```

## Contributing

Found a bug or have a feature request? Please open an issue on the [GitHub repository](https://github.com/OS366/phantom).

## License

See the [LICENSE](../LICENSE) file for details.

---

**Next Steps:** Check out the [Getting Started](Getting-Started) guide to begin using Phantom.js in your projects.

