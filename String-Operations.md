# String Operations

Phantom.js provides 28 string operations for manipulation, transformation, and validation.

## Table of Contents

- [Basic Operations](#basic-operations)
- [Transformation Operations](#transformation-operations)
- [Search and Check Operations](#search-and-check-operations)
- [Padding Operations](#padding-operations)
- [Trimming Operations](#trimming-operations)
- [Advanced Operations](#advanced-operations)

## Basic Operations

### find

Check if a string contains a substring.

```javascript
phantom.strings.operation.find("hello world", "world");
// Output: true

phantom.strings.operation.find("hello world", "xyz");
// Output: false
```

### contains

Alias for `find` - check if string contains substring.

```javascript
phantom.strings.operation.contains("hello world", "world");
// Output: true
```

### length

Get the length of a string.

```javascript
phantom.strings.operation.length("hello");
// Output: 5
```

### isEmpty

Check if string is empty.

```javascript
phantom.strings.operation.isEmpty("");
// Output: true

phantom.strings.operation.isEmpty("hello");
// Output: false
```

### isBlank

Check if string is empty or only whitespace.

```javascript
phantom.strings.operation.isBlank("   ");
// Output: true

phantom.strings.operation.isBlank("hello");
// Output: false
```

## Transformation Operations

### toUpperCase

Convert string to uppercase.

```javascript
phantom.strings.operation.toUpperCase("hello");
// Output: "HELLO"
```

### toLowerCase

Convert string to lowercase.

```javascript
phantom.strings.operation.toLowerCase("HELLO");
// Output: "hello"
```

### capitalize

Capitalize first letter, lowercase the rest.

```javascript
phantom.strings.operation.capitalize("hello");
// Output: "Hello"

phantom.strings.operation.capitalize("HELLO");
// Output: "Hello"
```

### reverse

Reverse a string.

```javascript
phantom.strings.operation.reverse("hello");
// Output: "olleh"
```

## Search and Check Operations

### startsWith

Check if string starts with prefix.

```javascript
phantom.strings.operation.startsWith("hello", "he");
// Output: true
```

### endsWith

Check if string ends with suffix.

```javascript
phantom.strings.operation.endsWith("hello", "lo");
// Output: true
```

## Padding Operations

### leftPad

Pad string on the left side.

```javascript
phantom.strings.operation.leftPad("test", "0", 3);
// Output: "000test"

phantom.strings.operation.leftPad("test", undefined, 3);
// Output: "   test" (defaults to space)
```

### rightPad

Pad string on the right side.

```javascript
phantom.strings.operation.rightPad("test", "0", 3);
// Output: "test000"
```

### dualPad

Pad string on both sides.

```javascript
phantom.strings.operation.dualPad("test", "0", 2);
// Output: "00test00"
```

## Trimming Operations

### leftTrim

Remove whitespace from the left side.

```javascript
phantom.strings.operation.leftTrim("  test");
// Output: "test"
```

### rightTrim

Remove whitespace from the right side.

```javascript
phantom.strings.operation.rightTrim("test  ");
// Output: "test"
```

### trim

Remove whitespace from both sides.

```javascript
phantom.strings.operation.trim("  test  ");
// Output: "test"
```

## Advanced Operations

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

// Handles special regex characters safely
phantom.strings.operation.replaceAll("a.b.c", ".", "-");
// Output: "a-b-c"
```

### split

Split string by delimiter.

```javascript
phantom.strings.operation.split("a,b,c", ",");
// Output: ["a", "b", "c"]
```

### substring

Extract a substring.

```javascript
phantom.strings.operation.substring("hello world", 0, 5);
// Output: "hello"

phantom.strings.operation.substring("hello world", 6);
// Output: "world" (from index 6 to end)
```

### splice

Insert/delete characters in a string.

```javascript
phantom.strings.operation.splice("hello world", 5, 1, "X");
// Output: "helloXworld" (replaces space with X)

phantom.strings.operation.splice("hello", 2, 0, "XX");
// Output: "heXXllo" (inserts without deleting)
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
```

### repeat

Repeat a string N times.

```javascript
phantom.strings.operation.repeat("a", 3);
// Output: "aaa"
```

### remove

Remove all occurrences of a substring.

```javascript
phantom.strings.operation.remove("hello world", "l");
// Output: "heo word"
```

## Common Patterns

### Pattern 1: Data Cleaning Pipeline

**Using Chaining (Recommended - v0.1.5-BETA+):**
```javascript
var raw = phantom.maps.channel.get("rawData");

// Clean and normalize using chaining
var cleanedData = phantom.strings.chain(raw)
    .trim()
    .toLowerCase()
    .capitalize()
    .value();

phantom.maps.channel.save("cleanedData", cleanedData);
```

**Traditional Way (Still Works):**
```javascript
var raw = phantom.maps.channel.get("rawData");

// Clean and normalize
var step1 = phantom.strings.operation.trim(raw);
var step2 = phantom.strings.operation.toLowerCase(step1);
var step3 = phantom.strings.operation.capitalize(step2);

phantom.maps.channel.save("cleanedData", step3);
```

### Pattern 2: Format Validation

```javascript
var email = phantom.maps.channel.get("email");

if (!phantom.strings.operation.isEmpty(email) && 
    phantom.strings.operation.contains(email, "@")) {
    // Valid email format
    phantom.maps.channel.save("validEmail", email);
}
```

### Pattern 3: String Transformation

```javascript
var id = phantom.maps.channel.get("id");

// Pad with zeros
var paddedId = phantom.strings.operation.leftPad(id, "0", 8);
// Output: "00001234"

// Format as display string
var displayId = "ID-" + paddedId;
```

### Pattern 4: Data Extraction

```javascript
var fullName = "John, Doe";

// Split and process
var parts = phantom.strings.operation.split(fullName, ", ");
var firstName = phantom.strings.operation.trim(parts[0]);
var lastName = phantom.strings.operation.trim(parts[1]);
```

## Best Practices

1. **Always handle null/undefined** - Most operations convert them to empty strings
2. **Use trim before processing** - Clean input data first
3. **Chain operations** - Build transformation pipelines
4. **Validate before processing** - Check isEmpty/isBlank when needed

## Related Topics

- [Number Operations](Number-Operations) - Work with numeric data
- [Map Operations](Map-Operations) - Store and retrieve string data
- [Examples](Examples) - Real-world string processing examples

