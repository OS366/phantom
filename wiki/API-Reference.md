# API Reference

Complete API reference for all Phantom.js operations.

## Table of Contents

- [Initialization](#initialization)
- [Map Operations](#map-operations)
- [String Operations](#string-operations)
- [Number Operations](#number-operations)
- [JSON Operations](#json-operations)
- [Intelligence Operations](#intelligence-operations)

## Initialization

### `phantom.init(options)`

Initialize Phantom.js with optional configuration.

**Parameters:**
- `options` (Object, optional): Configuration object
  - `silent` (Boolean, optional): Enable/disable silent mode (default: true)

**Returns:** `phantom` object (for chaining)

**Example:**
```javascript
phantom.init({ silent: false });
```

### `phantom.version`

Get the current version string.

**Returns:** String (e.g., "0.0.9")

### `phantom.config`

Access configuration object.

**Properties:**
- `silent` (Boolean): Silent mode setting

---

## Map Operations

### Channel Map

#### `phantom.maps.channel.save(key, value)`

Save a value to the channel map.

**Parameters:**
- `key` (String): Map key
- `value` (Any): Value to save

**Throws:** `Error("Invalid operation")` if key is null or map is unavailable

#### `phantom.maps.channel.get(key)`

Get a value from the channel map.

**Parameters:**
- `key` (String): Map key

**Returns:** Value or null if not found

**Throws:** `Error("Invalid operation")` if key is null or map is unavailable

#### `phantom.maps.channel.exists(key)`

Check if a key exists in the channel map.

**Parameters:**
- `key` (String): Map key

**Returns:** Boolean

**Throws:** `Error("Invalid operation")` if map is unavailable

#### `phantom.maps.channel.delete(key)`

Delete a key from the channel map.

**Parameters:**
- `key` (String): Map key

**Throws:** `Error("Invalid operation")` if key is null or map is unavailable

### Global Map

Same API as Channel Map:
- `phantom.maps.global.save(key, value)`
- `phantom.maps.global.get(key)`
- `phantom.maps.global.exists(key)`
- `phantom.maps.global.delete(key)`

### Connector Map

Same API as Channel Map:
- `phantom.maps.connector.save(key, value)`
- `phantom.maps.connector.get(key)`
- `phantom.maps.connector.exists(key)`
- `phantom.maps.connector.delete(key)`

### Response Map

Same API as Channel Map, but only available in response context:
- `phantom.maps.response.save(key, value)`
- `phantom.maps.response.get(key)`
- `phantom.maps.response.exists(key)`
- `phantom.maps.response.delete(key)`

**Note:** Throws error if not in response context.

### Configuration Map (Read-Only)

#### `phantom.maps.configuration.get(key)`

Get a configuration value.

**Parameters:**
- `key` (String): Configuration key

**Returns:** Configuration value or null

#### `phantom.maps.configuration.exists(key)`

Check if a configuration key exists.

**Parameters:**
- `key` (String): Configuration key

**Returns:** Boolean

**Note:** `save()` and `delete()` always throw errors (read-only).

---

## String Operations

All string operations are under `phantom.strings.operation.*`

### `find(input, stringToFind)`

Check if string contains substring.

**Parameters:**
- `input` (String): Input string
- `stringToFind` (String): Substring to find

**Returns:** Boolean

### `contains(input, stringToFind)`

Alias for `find`.

### `length(input)`

Get string length.

**Parameters:**
- `input` (String): Input string

**Returns:** Number

### `isEmpty(input)`

Check if string is empty.

**Parameters:**
- `input` (String): Input string

**Returns:** Boolean

### `isBlank(input)`

Check if string is empty or only whitespace.

**Parameters:**
- `input` (String): Input string

**Returns:** Boolean

### `toUpperCase(input)`

Convert to uppercase.

**Parameters:**
- `input` (String): Input string

**Returns:** String

### `toLowerCase(input)`

Convert to lowercase.

**Parameters:**
- `input` (String): Input string

**Returns:** String

### `capitalize(input)`

Capitalize first letter, lowercase rest.

**Parameters:**
- `input` (String): Input string

**Returns:** String

### `reverse(input)`

Reverse a string.

**Parameters:**
- `input` (String): Input string

**Returns:** String

### `startsWith(input, prefix)`

Check if string starts with prefix.

**Parameters:**
- `input` (String): Input string
- `prefix` (String): Prefix to check

**Returns:** Boolean

### `endsWith(input, suffix)`

Check if string ends with suffix.

**Parameters:**
- `input` (String): Input string
- `suffix` (String): Suffix to check

**Returns:** Boolean

### `leftPad(input, padChar, count)`

Pad string on the left.

**Parameters:**
- `input` (String): Input string
- `padChar` (String, optional): Character to pad with (default: space)
- `count` (Number): Number of characters to pad

**Returns:** String

### `rightPad(input, padChar, count)`

Pad string on the right.

**Parameters:**
- `input` (String): Input string
- `padChar` (String, optional): Character to pad with (default: space)
- `count` (Number): Number of characters to pad

**Returns:** String

### `dualPad(input, padChar, count)`

Pad string on both sides.

**Parameters:**
- `input` (String): Input string
- `padChar` (String, optional): Character to pad with (default: space)
- `count` (Number): Number of characters to pad on each side

**Returns:** String

### `leftTrim(input)`

Remove whitespace from left.

**Parameters:**
- `input` (String): Input string

**Returns:** String

### `rightTrim(input)`

Remove whitespace from right.

**Parameters:**
- `input` (String): Input string

**Returns:** String

### `trim(input)`

Remove whitespace from both sides.

**Parameters:**
- `input` (String): Input string

**Returns:** String

### `replace(input, searchString, replaceString)`

Replace first occurrence.

**Parameters:**
- `input` (String): Input string
- `searchString` (String): String to search for
- `replaceString` (String): Replacement string

**Returns:** String

### `replaceAll(input, searchString, replaceString)`

Replace all occurrences.

**Parameters:**
- `input` (String): Input string
- `searchString` (String): String to search for
- `replaceString` (String): Replacement string

**Returns:** String

### `split(input, delimiter)`

Split string by delimiter.

**Parameters:**
- `input` (String): Input string
- `delimiter` (String): Delimiter

**Returns:** Array of strings

### `substring(input, start, end)`

Extract substring.

**Parameters:**
- `input` (String): Input string
- `start` (Number): Start index
- `end` (Number, optional): End index (if omitted, returns to end)

**Returns:** String

### `splice(input, start, deleteCount, insertString)`

Insert/delete characters.

**Parameters:**
- `input` (String): Input string
- `start` (Number): Start position
- `deleteCount` (Number): Number of characters to delete
- `insertString` (String, optional): String to insert

**Returns:** String

### `compare(a, b)`

Compare two strings lexicographically.

**Parameters:**
- `a` (String): First string
- `b` (String): Second string

**Returns:** Number (-1 if a < b, 0 if a === b, 1 if a > b)

### `join(a, b, joinCharacters)`

Join two strings with delimiter.

**Parameters:**
- `a` (String): First string
- `b` (String): Second string
- `joinCharacters` (String, optional): Delimiter (default: empty string)

**Returns:** String

### `repeat(input, count)`

Repeat string N times.

**Parameters:**
- `input` (String): Input string
- `count` (Number): Number of times to repeat

**Returns:** String

### `remove(input, stringToRemove)`

Remove all occurrences of substring.

**Parameters:**
- `input` (String): Input string
- `stringToRemove` (String): Substring to remove

**Returns:** String

---

## Number Operations

All number operations are under `phantom.numbers.operation.*`

### `parse(value)`

Parse value to number (strict).

**Parameters:**
- `value` (Any): Value to parse

**Returns:** Number

**Throws:** `Error("Invalid operation")` if value is not a valid number

### `isNumber(value)`

Check if value is a valid number.

**Parameters:**
- `value` (Any): Value to check

**Returns:** Boolean

### `add(a, b)`

Add two numbers.

**Parameters:**
- `a` (Number): First number
- `b` (Number): Second number

**Returns:** Number

**Throws:** `Error("Invalid operation")` if inputs are invalid

### `subtract(a, b)`

Subtract two numbers.

**Parameters:**
- `a` (Number): First number
- `b` (Number): Second number

**Returns:** Number

**Throws:** `Error("Invalid operation")` if inputs are invalid

### `multiply(a, b)`

Multiply two numbers.

**Parameters:**
- `a` (Number): First number
- `b` (Number): Second number

**Returns:** Number

**Throws:** `Error("Invalid operation")` if inputs are invalid

### `divide(a, b)`

Divide two numbers.

**Parameters:**
- `a` (Number): Dividend
- `b` (Number): Divisor

**Returns:** Number

**Throws:** `Error("Invalid operation")` if inputs are invalid or divisor is zero

### `mod(dividend, divisor)`

Calculate modulo (remainder).

**Parameters:**
- `dividend` (Number): Dividend
- `divisor` (Number): Divisor

**Returns:** Number

**Throws:** `Error("Invalid operation")` if inputs are invalid or divisor is zero

### `round(value, decimals)`

Round to specified decimal places.

**Parameters:**
- `value` (Number): Value to round
- `decimals` (Number, optional): Number of decimal places (default: 0)

**Returns:** Number

**Throws:** `Error("Invalid operation")` if value is invalid

### `ceil(value)`

Round up to nearest integer.

**Parameters:**
- `value` (Number): Value to round

**Returns:** Number

**Throws:** `Error("Invalid operation")` if value is invalid

### `floor(value)`

Round down to nearest integer.

**Parameters:**
- `value` (Number): Value to round

**Returns:** Number

**Throws:** `Error("Invalid operation")` if value is invalid

### `truncate(value)`

Truncate decimal part.

**Parameters:**
- `value` (Number): Value to truncate

**Returns:** Number

**Throws:** `Error("Invalid operation")` if value is invalid

### `toFixed(value, decimals)`

Format number with fixed decimals (returns string).

**Parameters:**
- `value` (Number): Value to format
- `decimals` (Number): Number of decimal places (0-20)

**Returns:** String

**Throws:** `Error("Invalid operation")` if value is invalid or decimals out of range

### `pow(base, exponent)`

Calculate power (base^exponent).

**Parameters:**
- `base` (Number): Base number
- `exponent` (Number): Exponent

**Returns:** Number

**Throws:** `Error("Invalid operation")` if inputs are invalid

### `sqrt(value)`

Calculate square root.

**Parameters:**
- `value` (Number): Value (must be >= 0)

**Returns:** Number

**Throws:** `Error("Invalid operation")` if value is invalid or negative

### `abs(value)`

Get absolute value.

**Parameters:**
- `value` (Number): Value

**Returns:** Number

**Throws:** `Error("Invalid operation")` if value is invalid

### `min(a, b)`

Get minimum of two numbers.

**Parameters:**
- `a` (Number): First number
- `b` (Number): Second number

**Returns:** Number

**Throws:** `Error("Invalid operation")` if inputs are invalid

### `max(a, b)`

Get maximum of two numbers.

**Parameters:**
- `a` (Number): First number
- `b` (Number): Second number

**Returns:** Number

**Throws:** `Error("Invalid operation")` if inputs are invalid

### `random(min, max)`

Generate random number in range.

**Parameters:**
- `min` (Number, optional): Minimum value (default: 0)
- `max` (Number, optional): Maximum value (default: 1)

**Returns:** Number (between min inclusive and max exclusive)

**Throws:** `Error("Invalid operation")` if min > max

### `randomInt(min, max)`

Generate random integer in range.

**Parameters:**
- `min` (Number, optional): Minimum value (default: 0)
- `max` (Number, optional): Maximum value (default: 1)

**Returns:** Integer (between min and max inclusive)

**Throws:** `Error("Invalid operation")` if min > max

### `between(value, min, max)`

Check if number is between two values (inclusive).

**Parameters:**
- `value` (Number): Value to check
- `min` (Number): Minimum value
- `max` (Number): Maximum value

**Returns:** Boolean

**Throws:** `Error("Invalid operation")` if inputs are invalid

### `clamp(value, min, max)`

Clamp value between min and max.

**Parameters:**
- `value` (Number): Value to clamp
- `min` (Number): Minimum value
- `max` (Number): Maximum value

**Returns:** Number

**Throws:** `Error("Invalid operation")` if inputs are invalid or min > max

### `sign(value)`

Get sign of number.

**Parameters:**
- `value` (Number): Value

**Returns:** Number (-1 for negative, 0 for zero, 1 for positive)

**Throws:** `Error("Invalid operation")` if value is invalid

### `isEven(value)`

Check if number is even.

**Parameters:**
- `value` (Number): Value to check

**Returns:** Boolean

**Throws:** `Error("Invalid operation")` if value is invalid

### `isOdd(value)`

Check if number is odd.

**Parameters:**
- `value` (Number): Value to check

**Returns:** Boolean

**Throws:** `Error("Invalid operation")` if value is invalid

### `isPositive(value)`

Check if number is positive.

**Parameters:**
- `value` (Number): Value to check

**Returns:** Boolean

**Throws:** `Error("Invalid operation")` if value is invalid

### `isNegative(value)`

Check if number is negative.

**Parameters:**
- `value` (Number): Value to check

**Returns:** Boolean

**Throws:** `Error("Invalid operation")` if value is invalid

### `isZero(value)`

Check if number is zero.

**Parameters:**
- `value` (Number): Value to check

**Returns:** Boolean

**Throws:** `Error("Invalid operation")` if value is invalid

---

## Error Handling

All operations that can fail will throw `Error("Invalid operation")` with the following conditions:

- Invalid input types (e.g., non-numeric strings to number operations)
- Division by zero
- Null/undefined where not allowed
- Operations on read-only maps
- Invalid ranges (e.g., min > max)

Always wrap operations in try-catch blocks when appropriate.

---

## JSON Operations

All JSON operations are under `phantom.json.operation.*`

### `parse(jsonString)`

Parse JSON string to object.

**Parameters:**
- `jsonString` (String): JSON string to parse

**Returns:** Object or Array

**Throws:** `Error("Invalid operation")` if string is invalid JSON

### `stringify(obj)`

Convert object to JSON string.

**Parameters:**
- `obj` (Object or Array): Object to stringify

**Returns:** String

**Throws:** `Error("Invalid operation")` if obj is null or undefined

### `get(obj, keyPath)`

Get value by key path (supports nested keys with dot notation).

**Parameters:**
- `obj` (Object): Object to query
- `keyPath` (String): Key path (e.g., "user.name")

**Returns:** Value or null if not found

**Throws:** `Error("Invalid operation")` if obj is null or keyPath is invalid

### `set(obj, keyPath, value)`

Set value by key path. Returns new object (doesn't modify original).

**Parameters:**
- `obj` (Object): Object to modify
- `keyPath` (String): Key path (e.g., "user.name")
- `value` (Any): Value to set

**Returns:** New object with updated value

**Throws:** `Error("Invalid operation")` if obj is null or keyPath is invalid

### `has(obj, keyPath)`

Check if key path exists.

**Parameters:**
- `obj` (Object): Object to check
- `keyPath` (String): Key path to check

**Returns:** Boolean

**Throws:** `Error("Invalid operation")` if obj is null or keyPath is invalid

### `remove(obj, keyPath)`

Remove key from object. Returns new object (doesn't modify original).

**Parameters:**
- `obj` (Object): Object to modify
- `keyPath` (String): Key path to remove

**Returns:** New object with key removed

**Throws:** `Error("Invalid operation")` if obj is null or keyPath is invalid

### `keys(obj)`

Get all keys from object.

**Parameters:**
- `obj` (Object): Object

**Returns:** Array of strings

**Throws:** `Error("Invalid operation")` if obj is null, not an object, or is an array

### `values(obj)`

Get all values from object.

**Parameters:**
- `obj` (Object): Object

**Returns:** Array of values

**Throws:** `Error("Invalid operation")` if obj is null, not an object, or is an array

### `size(obj)`

Get size of object (number of keys) or length of array.

**Parameters:**
- `obj` (Object or Array): Object or array

**Returns:** Number

**Throws:** `Error("Invalid operation")` if obj is null or not an object/array

### `merge(obj1, obj2)`

Merge two objects. Second object overwrites first.

**Parameters:**
- `obj1` (Object): First object
- `obj2` (Object): Second object (overwrites obj1)

**Returns:** Merged object

**Throws:** `Error("Invalid operation")` if inputs are invalid or are arrays

### `isEmpty(obj)`

Check if object or array is empty.

**Parameters:**
- `obj` (Object or Array): Object or array

**Returns:** Boolean

**Throws:** `Error("Invalid operation")` if obj is not an object/array

### `isArray(obj)`

Check if value is an array.

**Parameters:**
- `obj` (Any): Value to check

**Returns:** Boolean

### `isObject(obj)`

Check if value is an object (not array).

**Parameters:**
- `obj` (Any): Value to check

**Returns:** Boolean

---

## Intelligence Operations

Smart detection and analysis utilities under `phantom.intelligence.*`

### `phantom.intelligence.dates.detect(dateString, options?)`

Dynamically detect the format of a date string.

**Parameters:**
- `dateString` (String): The date string to analyze
- `options` (Object, optional): Detection options
  - `locale` (String, optional): Locale hint - `"US"` (MM/dd), `"EU"` (dd/MM), or `"auto"` (default)

**Returns:** Java date format pattern string (e.g., `"yyyy-MM-dd"`, `"yyyyMMdd"`)

**Throws:** `Error("Invalid date")` if the format cannot be detected

**Example:**
```javascript
// Detect ISO format
phantom.intelligence.dates.detect("2024-12-16");
// Returns: "yyyy-MM-dd"

// Detect US format
phantom.intelligence.dates.detect("12/16/2024");
// Returns: "MM/dd/yyyy"

// Detect with locale hint
phantom.intelligence.dates.detect("16/12/2024", { locale: "EU" });
// Returns: "dd/MM/yyyy"

// Detect compact format
phantom.intelligence.dates.detect("20241216");
// Returns: "yyyyMMdd"

// Auto-detect and use for parsing
var dateStr = "2024-12-16";
var format = phantom.intelligence.dates.detect(dateStr);
var date = phantom.dates.operation.parse(dateStr, format);
```

**Supported Formats:**
- ISO: `yyyy-MM-dd`, `yyyy-MM-dd'T'HH:mm:ss`, with optional milliseconds and timezone
- US: `MM/dd/yyyy`, `MM-dd-yyyy`, with optional time
- EU: `dd/MM/yyyy`, `dd-MM-yyyy`, with optional time  
- Compact: `yyyyMMdd`, `yyyyMMddHHmmss`, `yyyyMMddHHmmssSSS`

---

## Related Topics

- [Getting Started](Getting-Started) - Learn the basics
- [Examples](Examples) - Usage examples
- [Best Practices](Best-Practices) - Best practices guide

