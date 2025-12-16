# Phantom.js

A lightweight helper library for OIE (Open Integration Engine) scripting.

**Version:** 0.0.9

## Overview

Phantom.js provides a comprehensive set of utilities for working with maps, strings, and numbers in OIE scripting environments. All operations follow a consistent API pattern and include proper error handling.

## Rules

- **No logging on normal operations** - Operations run silently by default
- **Error logging only** - Only logs when there is an error
- **Generic error messages** - All errors return "Invalid operation"
- **Full file** - Includes maps + strings + numbers utilities

## Warning

Drag and drop is not possible for variables saved using `phantom.maps.*`

---

## Installation

### For OIE Scripting

1. Copy the contents of `phantom.js` into your OIE script editor
2. The library will be available as `phantom` in your script context
3. No additional setup required

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

## Initialization

```javascript
// Initialize with default settings (silent: true)
phantom.init();

// Initialize with custom settings
phantom.init({ silent: false });

// Get version
phantom.version;  // "0.0.9"
```

---

## Map Operations

### Channel Map

```javascript
// Save a value
phantom.maps.channel.save("key1", "value1");
// Output: undefined (operation succeeds)

// Get a value
phantom.maps.channel.get("key1");
// Output: "value1"

// Check if key exists
phantom.maps.channel.exists("key1");
// Output: true

phantom.maps.channel.exists("nonexistent");
// Output: false

// Delete a value
phantom.maps.channel.delete("key1");
// Output: undefined (operation succeeds)
```

### Global Map

```javascript
phantom.maps.global.save("globalKey", "globalValue");
phantom.maps.global.get("globalKey");
// Output: "globalValue"
```

### Connector Map

```javascript
phantom.maps.connector.save("connKey", "connValue");
phantom.maps.connector.get("connKey");
// Output: "connValue"
```

### Response Map

```javascript
// Only available in response context
phantom.maps.response.save("respKey", "respValue");
phantom.maps.response.get("respKey");
// Output: "respValue"

// If not in response context, throws: "Invalid operation"
```

### Configuration Map (Read-Only)

```javascript
// Get configuration value
phantom.maps.configuration.get("configKey");
// Output: "configValue"

// Check if exists
phantom.maps.configuration.exists("configKey");
// Output: true

// Save/Delete operations throw: "Invalid operation"
phantom.maps.configuration.save("key", "value");
// Throws: Error("Invalid operation")
```

---

## String Operations

### find

Check if a string contains a substring.

```javascript
phantom.strings.operation.find("hello world", "world");
// Output: true

phantom.strings.operation.find("hello world", "xyz");
// Output: false

phantom.strings.operation.find("hello", "");
// Output: false
```

### leftPad

Pad a string on the left side.

```javascript
phantom.strings.operation.leftPad("test", "0", 3);
// Output: "000test"

phantom.strings.operation.leftPad("test", undefined, 3);
// Output: "   test" (defaults to space)

phantom.strings.operation.leftPad("test", "0", 0);
// Output: "test" (returns original if count <= 0)
```

### rightPad

Pad a string on the right side.

```javascript
phantom.strings.operation.rightPad("test", "0", 3);
// Output: "test000"

phantom.strings.operation.rightPad("test", undefined, 3);
// Output: "test   " (defaults to space)
```

### dualPad

Pad a string on both sides.

```javascript
phantom.strings.operation.dualPad("test", "0", 2);
// Output: "00test00"
```

### leftTrim

Remove whitespace from the left side.

```javascript
phantom.strings.operation.leftTrim("  test");
// Output: "test"

phantom.strings.operation.leftTrim("  test  ");
// Output: "test  " (only trims left)
```

### rightTrim

Remove whitespace from the right side.

```javascript
phantom.strings.operation.rightTrim("test  ");
// Output: "test"

phantom.strings.operation.rightTrim("  test  ");
// Output: "  test" (only trims right)
```

### trim

Remove whitespace from both sides.

```javascript
phantom.strings.operation.trim("  test  ");
// Output: "test"

phantom.strings.operation.trim("\t\ntest\n\t");
// Output: "test"
```

### split

Split a string by delimiter.

```javascript
phantom.strings.operation.split("a,b,c", ",");
// Output: ["a", "b", "c"]

phantom.strings.operation.split("hello world", " ");
// Output: ["hello", "world"]
```

### splice

Insert/delete characters in a string.

```javascript
phantom.strings.operation.splice("hello world", 5, 1, "X");
// Output: "helloXworld" (replaces space with X)

phantom.strings.operation.splice("hello", 2, 0, "XX");
// Output: "heXXllo" (inserts without deleting)

phantom.strings.operation.splice("hello", 2, 1);
// Output: "helo" (deletes without inserting)
```

### compare

Compare two strings lexicographically.

```javascript
phantom.strings.operation.compare("test", "test");
// Output: 0 (equal)

phantom.strings.operation.compare("zebra", "apple");
// Output: 1 (first > second)

phantom.strings.operation.compare("apple", "zebra");
// Output: -1 (first < second)
```

### join

Join two strings with a delimiter.

```javascript
phantom.strings.operation.join("hello", "world", " ");
// Output: "hello world"

phantom.strings.operation.join("a", "b", "-");
// Output: "a-b"

phantom.strings.operation.join("hello", "world");
// Output: "helloworld" (empty delimiter)
```

### replace

Replace first occurrence of a substring.

```javascript
phantom.strings.operation.replace("hello world", "world", "universe");
// Output: "hello universe"

phantom.strings.operation.replace("hello hello", "hello", "hi");
// Output: "hi hello" (only first occurrence)
```

### replaceAll

Replace all occurrences of a substring.

```javascript
phantom.strings.operation.replaceAll("hello hello", "hello", "hi");
// Output: "hi hi"

phantom.strings.operation.replaceAll("aabbcc", "b", "x");
// Output: "aaxxcc"

// Handles special regex characters safely
phantom.strings.operation.replaceAll("a.b.c", ".", "-");
// Output: "a-b-c"
```

### substring

Extract a substring.

```javascript
phantom.strings.operation.substring("hello world", 0, 5);
// Output: "hello"

phantom.strings.operation.substring("hello world", 6);
// Output: "world" (from index 6 to end)
```

### toUpperCase

Convert string to uppercase.

```javascript
phantom.strings.operation.toUpperCase("hello");
// Output: "HELLO"

phantom.strings.operation.toUpperCase("Hello World");
// Output: "HELLO WORLD"
```

### toLowerCase

Convert string to lowercase.

```javascript
phantom.strings.operation.toLowerCase("HELLO");
// Output: "hello"

phantom.strings.operation.toLowerCase("Hello World");
// Output: "hello world"
```

### capitalize

Capitalize first letter, lowercase the rest.

```javascript
phantom.strings.operation.capitalize("hello");
// Output: "Hello"

phantom.strings.operation.capitalize("HELLO");
// Output: "Hello"

phantom.strings.operation.capitalize("hELLO");
// Output: "Hello"
```

### reverse

Reverse a string.

```javascript
phantom.strings.operation.reverse("hello");
// Output: "olleh"

phantom.strings.operation.reverse("abc");
// Output: "cba"
```

### length

Get string length.

```javascript
phantom.strings.operation.length("hello");
// Output: 5

phantom.strings.operation.length("");
// Output: 0
```

### startsWith

Check if string starts with prefix.

```javascript
phantom.strings.operation.startsWith("hello", "he");
// Output: true

phantom.strings.operation.startsWith("hello", "lo");
// Output: false
```

### endsWith

Check if string ends with suffix.

```javascript
phantom.strings.operation.endsWith("hello", "lo");
// Output: true

phantom.strings.operation.endsWith("hello", "he");
// Output: false
```

### contains

Check if string contains substring (alias for find).

```javascript
phantom.strings.operation.contains("hello world", "world");
// Output: true

phantom.strings.operation.contains("hello world", "xyz");
// Output: false
```

### repeat

Repeat a string N times.

```javascript
phantom.strings.operation.repeat("a", 3);
// Output: "aaa"

phantom.strings.operation.repeat("ab", 2);
// Output: "abab"

phantom.strings.operation.repeat("a", 0);
// Output: "" (empty string)
```

### remove

Remove all occurrences of a substring.

```javascript
phantom.strings.operation.remove("hello world", "l");
// Output: "heo word"

phantom.strings.operation.remove("aabbcc", "b");
// Output: "aacc"
```

### isEmpty

Check if string is empty.

```javascript
phantom.strings.operation.isEmpty("");
// Output: true

phantom.strings.operation.isEmpty("hello");
// Output: false

phantom.strings.operation.isEmpty(null);
// Output: true
```

### isBlank

Check if string is empty or only whitespace.

```javascript
phantom.strings.operation.isBlank("");
// Output: true

phantom.strings.operation.isBlank("   ");
// Output: true

phantom.strings.operation.isBlank("\t\n");
// Output: true

phantom.strings.operation.isBlank("hello");
// Output: false
```

---

## Number Operations

### parse

Parse a value to a number (strict validation).

```javascript
phantom.numbers.operation.parse("123");
// Output: 123

phantom.numbers.operation.parse("45.67");
// Output: 45.67

phantom.numbers.operation.parse(123);
// Output: 123

phantom.numbers.operation.parse("abc");
// Throws: Error("Invalid operation")

phantom.numbers.operation.parse(null);
// Throws: Error("Invalid operation")
```

### isNumber

Check if a value is a valid number.

```javascript
phantom.numbers.operation.isNumber("123");
// Output: true

phantom.numbers.operation.isNumber(123);
// Output: true

phantom.numbers.operation.isNumber("45.67");
// Output: true

phantom.numbers.operation.isNumber(null);
// Output: true (Number(null) = 0)

phantom.numbers.operation.isNumber("abc");
// Output: false

phantom.numbers.operation.isNumber("Infinity");
// Output: false
```

### add

Add two numbers.

```javascript
phantom.numbers.operation.add(5, 3);
// Output: 8

phantom.numbers.operation.add(10.5, 2.3);
// Output: 12.8

phantom.numbers.operation.add(-5, 3);
// Output: -2

phantom.numbers.operation.add("abc", 5);
// Throws: Error("Invalid operation")
```

### subtract

Subtract two numbers.

```javascript
phantom.numbers.operation.subtract(10, 3);
// Output: 7

phantom.numbers.operation.subtract(5.5, 2.2);
// Output: 3.3

phantom.numbers.operation.subtract(5, 10);
// Output: -5
```

### multiply

Multiply two numbers.

```javascript
phantom.numbers.operation.multiply(5, 3);
// Output: 15

phantom.numbers.operation.multiply(2.5, 4);
// Output: 10

phantom.numbers.operation.multiply(-5, 3);
// Output: -15
```

### divide

Divide two numbers.

```javascript
phantom.numbers.operation.divide(10, 2);
// Output: 5

phantom.numbers.operation.divide(15, 3);
// Output: 5

phantom.numbers.operation.divide(7, 2);
// Output: 3.5

phantom.numbers.operation.divide(10, 0);
// Throws: Error("Invalid operation")
```

### round

Round a number to specified decimal places.

```javascript
phantom.numbers.operation.round(3.14159, 2);
// Output: 3.14

phantom.numbers.operation.round(3.14159, 0);
// Output: 3

phantom.numbers.operation.round(3.5, 0);
// Output: 4

phantom.numbers.operation.round(3.7, null);
// Output: 4 (defaults to 0 decimals)
```

### min

Get the minimum of two numbers.

```javascript
phantom.numbers.operation.min(5, 10);
// Output: 5

phantom.numbers.operation.min(-5, 3);
// Output: -5

phantom.numbers.operation.min(10, 5);
// Output: 5
```

### max

Get the maximum of two numbers.

```javascript
phantom.numbers.operation.max(5, 10);
// Output: 10

phantom.numbers.operation.max(-5, 3);
// Output: 3

phantom.numbers.operation.max(10, 5);
// Output: 10
```

### abs

Get the absolute value.

```javascript
phantom.numbers.operation.abs(5);
// Output: 5

phantom.numbers.operation.abs(-5);
// Output: 5

phantom.numbers.operation.abs(0);
// Output: 0
```

### ceil

Round up to nearest integer.

```javascript
phantom.numbers.operation.ceil(3.1);
// Output: 4

phantom.numbers.operation.ceil(3.9);
// Output: 4

phantom.numbers.operation.ceil(-3.1);
// Output: -3
```

### floor

Round down to nearest integer.

```javascript
phantom.numbers.operation.floor(3.1);
// Output: 3

phantom.numbers.operation.floor(3.9);
// Output: 3

phantom.numbers.operation.floor(-3.1);
// Output: -4
```

### sqrt

Calculate square root.

```javascript
phantom.numbers.operation.sqrt(4);
// Output: 2

phantom.numbers.operation.sqrt(9);
// Output: 3

phantom.numbers.operation.sqrt(0);
// Output: 0

phantom.numbers.operation.sqrt(-1);
// Throws: Error("Invalid operation")
```

### pow

Calculate power (base^exponent).

```javascript
phantom.numbers.operation.pow(2, 3);
// Output: 8

phantom.numbers.operation.pow(5, 2);
// Output: 25

phantom.numbers.operation.pow(10, 0);
// Output: 1
```

### mod

Calculate modulo (remainder).

```javascript
phantom.numbers.operation.mod(10, 3);
// Output: 1

phantom.numbers.operation.mod(15, 5);
// Output: 0

phantom.numbers.operation.mod(7, 2);
// Output: 1

phantom.numbers.operation.mod(10, 0);
// Throws: Error("Invalid operation")
```

### random

Generate random number in range.

```javascript
phantom.numbers.operation.random(0, 10);
// Output: Random number between 0 (inclusive) and 10 (exclusive)
// Example: 7.234567

phantom.numbers.operation.random();
// Output: Random number between 0 (inclusive) and 1 (exclusive)
// Example: 0.123456

phantom.numbers.operation.random(10, 0);
// Throws: Error("Invalid operation")
```

### randomInt

Generate random integer in range.

```javascript
phantom.numbers.operation.randomInt(1, 10);
// Output: Random integer between 1 and 10 (inclusive)
// Example: 7

phantom.numbers.operation.randomInt(10, 0);
// Throws: Error("Invalid operation")
```

### between

Check if number is between two values (inclusive).

```javascript
phantom.numbers.operation.between(5, 1, 10);
// Output: true

phantom.numbers.operation.between(1, 1, 10);
// Output: true (inclusive)

phantom.numbers.operation.between(10, 1, 10);
// Output: true (inclusive)

phantom.numbers.operation.between(0, 1, 10);
// Output: false

phantom.numbers.operation.between(11, 1, 10);
// Output: false
```

### clamp

Clamp value between min and max.

```javascript
phantom.numbers.operation.clamp(5, 1, 10);
// Output: 5 (within range)

phantom.numbers.operation.clamp(0, 1, 10);
// Output: 1 (clamped to min)

phantom.numbers.operation.clamp(15, 1, 10);
// Output: 10 (clamped to max)

phantom.numbers.operation.clamp(5, 10, 1);
// Throws: Error("Invalid operation")
```

### sign

Get sign of number.

```javascript
phantom.numbers.operation.sign(5);
// Output: 1 (positive)

phantom.numbers.operation.sign(-5);
// Output: -1 (negative)

phantom.numbers.operation.sign(0);
// Output: 0 (zero)
```

### isEven

Check if number is even.

```javascript
phantom.numbers.operation.isEven(2);
// Output: true

phantom.numbers.operation.isEven(4);
// Output: true

phantom.numbers.operation.isEven(3);
// Output: false

phantom.numbers.operation.isEven(0);
// Output: true
```

### isOdd

Check if number is odd.

```javascript
phantom.numbers.operation.isOdd(3);
// Output: true

phantom.numbers.operation.isOdd(5);
// Output: true

phantom.numbers.operation.isOdd(2);
// Output: false

phantom.numbers.operation.isOdd(0);
// Output: false
```

### isPositive

Check if number is positive.

```javascript
phantom.numbers.operation.isPositive(5);
// Output: true

phantom.numbers.operation.isPositive(-5);
// Output: false

phantom.numbers.operation.isPositive(0);
// Output: false
```

### isNegative

Check if number is negative.

```javascript
phantom.numbers.operation.isNegative(-5);
// Output: true

phantom.numbers.operation.isNegative(5);
// Output: false

phantom.numbers.operation.isNegative(0);
// Output: false
```

### isZero

Check if number is zero.

```javascript
phantom.numbers.operation.isZero(0);
// Output: true

phantom.numbers.operation.isZero(5);
// Output: false

phantom.numbers.operation.isZero(-5);
// Output: false
```

### toFixed

Format number with fixed decimal places (returns string).

```javascript
phantom.numbers.operation.toFixed(3.14159, 2);
// Output: "3.14"

phantom.numbers.operation.toFixed(5, 2);
// Output: "5.00"

phantom.numbers.operation.toFixed(3.14159, 0);
// Output: "3"

phantom.numbers.operation.toFixed(5, -1);
// Throws: Error("Invalid operation")

phantom.numbers.operation.toFixed(5, 21);
// Throws: Error("Invalid operation")
```

### truncate

Truncate decimal part (remove fractional part).

```javascript
phantom.numbers.operation.truncate(3.7);
// Output: 3

phantom.numbers.operation.truncate(-3.7);
// Output: -3

phantom.numbers.operation.truncate(5);
// Output: 5
```

---

## Error Handling

All operations follow consistent error handling:

- **Invalid input** → Throws `Error("Invalid operation")`
- **Division by zero** → Throws `Error("Invalid operation")`
- **Null/undefined where not allowed** → Throws `Error("Invalid operation")`
- **Operations on read-only maps** → Throws `Error("Invalid operation")`

Errors are logged to the logger (if available) with the prefix `[phantom]`.

---

## Usage Examples

### Example 1: String Processing

```javascript
// Process a name
var name = "  john doe  ";
var cleaned = phantom.strings.operation.trim(name);
// Output: "john doe"

var capitalized = phantom.strings.operation.capitalize(cleaned);
// Output: "John doe"

var upper = phantom.strings.operation.toUpperCase(cleaned);
// Output: "JOHN DOE"
```

### Example 2: Number Calculations

```javascript
// Calculate and format a price
var price = phantom.numbers.operation.multiply(19.99, 1.08); // Add 8% tax
// Output: 21.5892

var rounded = phantom.numbers.operation.round(price, 2);
// Output: 21.59

var formatted = phantom.numbers.operation.toFixed(rounded, 2);
// Output: "21.59"
```

### Example 3: Map Operations

```javascript
// Store and retrieve data
phantom.maps.channel.save("userId", "12345");
var userId = phantom.maps.channel.get("userId");
// Output: "12345"

if (phantom.maps.channel.exists("userId")) {
    // Process user data
}
```

### Example 4: Combined Operations

```javascript
// Generate a padded ID
var id = phantom.numbers.operation.randomInt(1000, 9999);
// Output: Random integer like 5678

var paddedId = phantom.strings.operation.leftPad(id.toString(), "0", 6);
// Output: "005678"
```

---

## License

See LICENSE file for details.
