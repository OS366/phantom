# Base64 Operations

Phantom.js provides base64 encoding and decoding operations for working with base64 strings in OIE scripting environments.

## Overview

Base64 operations allow you to encode strings to base64 format and decode base64 strings back to their original form. This is useful for:
- Encoding data for transmission
- Storing binary data as text
- Working with APIs that require base64 encoding
- Encoding credentials or tokens

## Operations

### encode

Encode a string to base64.

**Syntax:**
```javascript
phantom.base64.operation.encode(str)
```

**Parameters:**
- `str` (String): String to encode

**Returns:**
- (String): Base64 encoded string

**Throws:**
- `Error` if string is null or undefined

**Examples:**
```javascript
phantom.base64.operation.encode("hello");
// Output: "aGVsbG8="

phantom.base64.operation.encode("Hello World");
// Output: "SGVsbG8gV29ybGQ="

phantom.base64.operation.encode("test");
// Output: "dGVzdA=="

phantom.base64.operation.encode("");
// Output: "" (empty string)
```

**Notes:**
- Supports UTF-8 encoding for unicode characters
- In OIE/Rhino environment, uses Java Base64
- In browser/Node.js, uses btoa with UTF-8 encoding
- Empty strings return empty strings

### decode

Decode a base64 string.

**Syntax:**
```javascript
phantom.base64.operation.decode(str)
```

**Parameters:**
- `str` (String): Base64 string to decode

**Returns:**
- (String): Decoded string

**Throws:**
- `Error` if string is null, undefined, empty, or invalid base64

**Examples:**
```javascript
phantom.base64.operation.decode("aGVsbG8=");
// Output: "hello"

phantom.base64.operation.decode("SGVsbG8gV29ybGQ=");
// Output: "Hello World"

phantom.base64.operation.decode("dGVzdA==");
// Output: "test"

phantom.base64.operation.decode(null);
// Throws: Error("String is null or undefined")

phantom.base64.operation.decode("");
// Throws: Error("Base64 string is empty")

phantom.base64.operation.decode("invalid!@#");
// Throws: Error("Invalid base64 string")
```

**Notes:**
- Supports UTF-8 decoding for unicode characters
- In OIE/Rhino environment, uses Java Base64
- In browser/Node.js, uses atob with UTF-8 decoding
- Throws error for invalid base64 strings

## Usage Examples

### Example 1: Basic Encode/Decode

```javascript
var original = "Hello World!";
var encoded = phantom.base64.operation.encode(original);
// encoded: "SGVsbG8gV29ybGQh"

var decoded = phantom.base64.operation.decode(encoded);
// decoded: "Hello World!" (matches original)
```

### Example 2: Encoding Credentials

```javascript
var username = "admin";
var password = "secret123";
var credentials = username + ":" + password;
var encoded = phantom.base64.operation.encode(credentials);
// encoded: "YWRtaW46c2VjcmV0MTIz"

// Use in HTTP Basic Auth header
var authHeader = "Basic " + encoded;
```

### Example 3: Encoding JSON Data

```javascript
var data = { name: "John", age: 30 };
var jsonString = phantom.json.operation.stringify(data);
var encoded = phantom.base64.operation.encode(jsonString);
// encoded: "eyJuYW1lIjoiSm9obiIsImFnZSI6MzB9"

// Decode and parse
var decoded = phantom.base64.operation.decode(encoded);
var obj = phantom.json.operation.parse(decoded);
// obj: { name: "John", age: 30 }
```

### Example 4: Handling Unicode

```javascript
var text = "Hello 世界";
var encoded = phantom.base64.operation.encode(text);
var decoded = phantom.base64.operation.decode(encoded);
// decoded: "Hello 世界" (preserves unicode)
```

### Example 5: Error Handling

```javascript
try {
    var encoded = phantom.base64.operation.encode(null);
} catch (e) {
    // Handle error: "String is null or undefined"
}

try {
    var decoded = phantom.base64.operation.decode("invalid!");
} catch (e) {
    // Handle error: "Invalid base64 string"
}
```

## Best Practices

1. **Always handle errors** - Base64 operations can throw errors for invalid input
2. **Use for text data** - Base64 is designed for text, not binary data
3. **Check for null/undefined** - Always validate input before encoding/decoding
4. **UTF-8 support** - Library handles UTF-8 encoding automatically
5. **Roundtrip testing** - Test encode/decode roundtrips to ensure data integrity

## Related Operations

- **[String Operations](String-Operations)** - String manipulation utilities
- **[JSON Operations](JSON-Operations)** - JSON parsing and manipulation
- **[Map Operations](Map-Operations)** - Storing encoded values in maps

## See Also

- **[API Reference](API-Reference)** - Complete API documentation
- **[Examples](Examples)** - More usage examples
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions

