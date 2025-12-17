# XML Operations

Phantom.js provides XML parsing, stringification, and querying operations for working with XML data in Mirth Connect, Open Integration Engine (OIE), and BridgeLink scripting environments.

## Overview

XML operations allow you to parse XML strings, query XML documents using XPath or element names, and convert XML objects back to strings. This is useful for:
- Parsing XML responses from APIs
- Extracting data from XML documents
- Converting XML to strings for logging or transmission
- Working with HL7, EDI, or other XML-based formats

## Operations

### parse

Parse an XML string to a DOM object.

**Syntax:**
```javascript
phantom.xml.operation.parse(xmlString)
```

**Parameters:**
- `xmlString` (String): XML string to parse

**Returns:**
- (Object): Parsed XML DOM object

**Throws:**
- `Error` if string is null, undefined, empty, or invalid XML

**Examples:**
```javascript
var xml = '<root><name>John</name><age>30</age></root>';
var parsed = phantom.xml.operation.parse(xml);
// Returns: XML DOM object

phantom.xml.operation.parse(null);
// Throws: Error("XML string is null or undefined")

phantom.xml.operation.parse('');
// Throws: Error("XML string is empty")

phantom.xml.operation.parse('<invalid>');
// Throws: Error("Failed to parse XML")
```

**Notes:**
- In OIE/Rhino environment, uses Java DocumentBuilder
- In browser environment, uses DOMParser
- Supports namespace-aware parsing in Java environment

### stringify

Convert an XML object to a string.

**Syntax:**
```javascript
phantom.xml.operation.stringify(xmlObj)
```

**Parameters:**
- `xmlObj` (Object): XML DOM object to stringify

**Returns:**
- (String): XML string representation

**Throws:**
- `Error` if object is null, undefined, or stringification fails

**Examples:**
```javascript
var xml = '<root><name>John</name></root>';
var parsed = phantom.xml.operation.parse(xml);
var xmlString = phantom.xml.operation.stringify(parsed);
// Returns: XML string (may have formatting differences)

phantom.xml.operation.stringify(null);
// Throws: Error("XML object is null or undefined")
```

**Notes:**
- In OIE/Rhino environment, uses Java XML Transformer
- In browser environment, uses XMLSerializer
- If input is already a string, returns it as-is

### get

Get a value from XML by XPath or element name.

**Syntax:**
```javascript
phantom.xml.operation.get(xml, xpath)
```

**Parameters:**
- `xml` (Object): XML DOM object
- `xpath` (String): XPath expression or element name

**Returns:**
- (String): Text content of the matched element

**Throws:**
- `Error` if XML is null/undefined, XPath is null/undefined/empty, element not found, or element has no text content

**Examples:**
```javascript
var xml = '<root><name>John</name><age>30</age></root>';
var parsed = phantom.xml.operation.parse(xml);

phantom.xml.operation.get(parsed, 'name');
// Output: "John"

phantom.xml.operation.get(parsed, 'age');
// Output: "30"

// XPath (in Java environment)
phantom.xml.operation.get(parsed, '/root/name');
// Output: "John"

phantom.xml.operation.get(parsed, 'nonexistent');
// Throws: Error("Element 'nonexistent' not found")
```

**Notes:**
- Requires Java XML APIs (OIE/Rhino environment)
- Supports full XPath expressions via Java XPath API
- Returns text content of the first matching element

### has

Check if an element or XPath exists in XML.

**Syntax:**
```javascript
phantom.xml.operation.has(xml, xpath)
```

**Parameters:**
- `xml` (Object): XML DOM object
- `xpath` (String): XPath expression or element name

**Returns:**
- (Boolean): `true` if element/XPath exists, `false` otherwise

**Examples:**
```javascript
var xml = '<root><name>John</name><age>30</age></root>';
var parsed = phantom.xml.operation.parse(xml);

phantom.xml.operation.has(parsed, 'name');
// Output: true

phantom.xml.operation.has(parsed, 'age');
// Output: true

phantom.xml.operation.has(parsed, 'nonexistent');
// Output: false

phantom.xml.operation.has(null, 'name');
// Output: false (returns false for null/undefined)
```

**Notes:**
- Returns `false` for null/undefined XML or XPath
- In OIE/Rhino environment, supports XPath queries
- In browser environment, uses element name lookup
- Does not throw errors, returns boolean

### toString

Convert XML object to string for logging. In OIE/Rhino environment, XML objects show Java representation when logged directly. Use this method to get a readable string representation.

**Syntax:**
```javascript
phantom.xml.operation.toString(xmlObj)
```

**Parameters:**
- `xmlObj` (Object): XML DOM object

**Returns:**
- (String): XML string representation

**Throws:**
- `Error` if object is null or undefined

**Examples:**
```javascript
var xml = '<root><name>John</name></root>';
var parsed = phantom.xml.operation.parse(xml);

// ❌ Don't do this - shows Java representation
logger.info(parsed);
// Output: org.w3c.dom.Document@12345678

// ✅ Do this instead
logger.info(phantom.xml.operation.toString(parsed));
// Output: <root><name>John</name></root>

// Or use stringify directly
logger.info(phantom.xml.operation.stringify(parsed));
// Output: <root><name>John</name></root>
```

**Note:** `toString` is an alias for `stringify` - both methods work the same way.

## Usage Examples

### Example 1: Parse and Extract Data

```javascript
var xmlString = '<patient><name>John Doe</name><age>30</age><diagnosis>Healthy</diagnosis></patient>';
var xml = phantom.xml.operation.parse(xmlString);

var name = phantom.xml.operation.get(xml, 'name');
// name: "John Doe"

var age = phantom.xml.operation.get(xml, 'age');
// age: "30"

if (phantom.xml.operation.has(xml, 'diagnosis')) {
    var diagnosis = phantom.xml.operation.get(xml, 'diagnosis');
    // diagnosis: "Healthy"
}
```

### Example 2: Process XML Response

```javascript
// Get XML response from API
var responseXml = phantom.maps.channel.get('apiResponse');
var parsed = phantom.xml.operation.parse(responseXml);

// Extract values
var status = phantom.xml.operation.get(parsed, 'status');
var message = phantom.xml.operation.get(parsed, 'message');

// Save processed data
phantom.maps.channel.save('status', status);
phantom.maps.channel.save('message', message);
```

### Example 3: Logging XML Objects

```javascript
var xml = phantom.xml.operation.parse('<root><data>test</data></root>');

// Use toString for readable logging
logger.info(phantom.xml.operation.toString(xml));
// Output: <root><data>test</data></root>
```

### Example 4: XPath Queries (Java Environment)

```javascript
var xml = '<root><user><name>John</name><address><city>NYC</city></address></user></root>';
var parsed = phantom.xml.operation.parse(xml);

// XPath query (works in OIE/Rhino with Java)
var name = phantom.xml.operation.get(parsed, '/root/user/name');
// Output: "John"

var city = phantom.xml.operation.get(parsed, '/root/user/address/city');
// Output: "NYC"

// Check existence
phantom.xml.operation.has(parsed, '/root/user/address');
// Output: true
```

### Example 5: Error Handling

```javascript
try {
    var xml = phantom.xml.operation.parse('<invalid>');
} catch (e) {
    // Handle error: "Failed to parse XML"
    logger.error("XML parsing failed: " + e.message);
}

try {
    var value = phantom.xml.operation.get(parsed, 'nonexistent');
} catch (e) {
    // Handle error: "Element 'nonexistent' not found"
    logger.error("Element not found: " + e.message);
}
```

## Best Practices

1. **Always handle errors** - XML operations can throw errors for invalid input
2. **Use has() before get()** - Check existence before extracting values to avoid errors
3. **Use toString for logging** - Always use `toString()` or `stringify()` when logging XML objects
4. **XPath vs Element Names** - Use XPath in Java environments for complex queries, element names for simple lookups
5. **Validate XML structure** - Ensure XML is well-formed before parsing

## Environment Support

### OIE/Rhino (Java Environment)
- Full XPath support via Java XPath API
- Namespace-aware parsing
- Java DocumentBuilder for parsing
- Java XML Transformer for stringification

**Note:** XML operations require Java XML APIs and are designed for OIE/Mirth Connect/BridgeLink environments. They will not work in browser or Node.js environments.

## Related Operations

- **[String Operations](String-Operations)** - String manipulation utilities
- **[JSON Operations](JSON-Operations)** - JSON parsing and manipulation
- **[Map Operations](Map-Operations)** - Storing XML strings in maps

## See Also

- **[API Reference](API-Reference)** - Complete API documentation
- **[Examples](Examples)** - More usage examples
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions

