# String Operations

Phantom.js provides comprehensive string manipulation operations designed for OIE scripting environments.

---

## Overview

String operations in Phantom.js allow you to:
- Manipulate and transform strings
- Search and replace text
- Format and pad strings
- Validate string content
- Work with case conversions
- Wrap and reverse text

---

## All String Operations

### Basic Operations

#### `trim(input)`
Removes leading and trailing whitespace from a string.

```javascript
phantom.strings.operation.trim("  hello world  ");
// Returns: "hello world"
```

#### `toUpperCase(input)`
Converts string to uppercase.

```javascript
phantom.strings.operation.toUpperCase("hello");
// Returns: "HELLO"
```

#### `toLowerCase(input)`
Converts string to lowercase.

```javascript
phantom.strings.operation.toLowerCase("HELLO");
// Returns: "hello"
```

#### `capitalize(input)`
Capitalizes the first letter of a string.

```javascript
phantom.strings.operation.capitalize("hello world");
// Returns: "Hello world"
```

#### `reverse(input)`
Reverses the entire string.

```javascript
phantom.strings.operation.reverse("hello");
// Returns: "olleh"
```

#### `reverseWords(input)`
Reverses the order of words in a string.

```javascript
phantom.strings.operation.reverseWords("hello world");
// Returns: "world hello"

phantom.strings.operation.reverseWords("one two three");
// Returns: "three two one"
```

**Parameters:**
- `input` (string): The string to reverse words in

**Returns:** String with words in reversed order

**Examples:**
```javascript
// Single word
phantom.strings.operation.reverseWords("hello");
// Returns: "hello"

// Multiple words
phantom.strings.operation.reverseWords("the quick brown fox");
// Returns: "fox brown quick the"

// Handles multiple spaces
phantom.strings.operation.reverseWords("hello   world");
// Returns: "world hello"

// Empty string
phantom.strings.operation.reverseWords("");
// Returns: ""

// Null/undefined
phantom.strings.operation.reverseWords(null);
// Returns: ""
```

---

### Padding Operations

#### `leftPad(input, length, padChar)`
Pads string on the left side.

```javascript
phantom.strings.operation.leftPad("5", 3, "0");
// Returns: "005"
```

#### `rightPad(input, length, padChar)`
Pads string on the right side.

```javascript
phantom.strings.operation.rightPad("5", 3, "0");
// Returns: "500"
```

---

### Search and Replace

#### `find(input, searchString)`
Finds the position of a substring.

```javascript
phantom.strings.operation.find("hello world", "world");
// Returns: 6
```

#### `contains(input, searchString)`
Checks if string contains a substring.

```javascript
phantom.strings.operation.contains("hello world", "world");
// Returns: true
```

#### `startsWith(input, prefix)`
Checks if string starts with a prefix.

```javascript
phantom.strings.operation.startsWith("hello world", "hello");
// Returns: true
```

#### `endsWith(input, suffix)`
Checks if string ends with a suffix.

```javascript
phantom.strings.operation.endsWith("hello world", "world");
// Returns: true
```

#### `replace(input, searchString, replaceString)`
Replaces first occurrence of a substring.

```javascript
phantom.strings.operation.replace("hello world", "world", "universe");
// Returns: "hello universe"
```

#### `replaceAll(input, searchString, replaceString)`
Replaces all occurrences of a substring.

```javascript
phantom.strings.operation.replaceAll("hello hello", "hello", "hi");
// Returns: "hi hi"
```

#### `remove(input, stringToRemove)`
Removes all occurrences of a substring.

```javascript
phantom.strings.operation.remove("hello world", "lo");
// Returns: "hel world"
```

---

### Substring Operations

#### `substring(input, start, end)`
Extracts a substring.

```javascript
phantom.strings.operation.substring("hello world", 0, 5);
// Returns: "hello"
```

#### `split(input, delimiter)`
Splits string into an array.

```javascript
phantom.strings.operation.split("a,b,c", ",");
// Returns: ["a", "b", "c"]
```

---

### Text Wrapping

#### `wordwrap(input, size, cut, everything)`
Wraps text to a specified line length.

```javascript
// Wrap at default size (80 characters)
var longText = "a".repeat(100);
var wrapped = phantom.strings.operation.wordwrap(longText);
// Returns text wrapped at 80 characters

// Wrap at custom size
var text = "hello world test";
var wrapped = phantom.strings.operation.wordwrap(text, 5);
// Returns text wrapped at 5 characters per line

// Wrap with word cutting
var wrapped = phantom.strings.operation.wordwrap("hello world", 3, true);
// Cuts words at 3 characters

// Wrap at word boundaries (default)
var wrapped = phantom.strings.operation.wordwrap("hello world test", 7, false);
// Breaks at word boundaries, not in middle of words
```

**Parameters:**
- `input` (string): The text to wrap
- `size` (number, optional): Maximum line length (default: 80)
- `cut` (boolean, optional): If true, cuts words at size limit (default: false)
- `everything` (boolean, optional): If true, wraps everything including words (default: false)

**Returns:** String with text wrapped to specified line length

**Behavior:**
- If `cut` is `true` or `everything` is `true`: Words are cut at the size limit
- If `cut` is `false` (default): Text breaks at word boundaries
- If text is shorter than size, returns original text
- Invalid size values default to 80

**Examples:**
```javascript
// Default wrapping (80 characters)
var longText = "This is a very long text that needs to be wrapped";
var wrapped = phantom.strings.operation.wordwrap(longText);
// Wraps at 80 characters

// Custom size
var text = "hello world test";
var wrapped = phantom.strings.operation.wordwrap(text, 5);
// Returns:
// "hello
// world
// test"

// Word cutting
var wrapped = phantom.strings.operation.wordwrap("hello world", 3, true);
// Returns:
// "hel
// lo
// wor
// ld"

// Word boundary wrapping
var wrapped = phantom.strings.operation.wordwrap("hello world test", 7, false);
// Returns:
// "hello
// world
// test"

// Short text (no wrapping needed)
phantom.strings.operation.wordwrap("hello", 10);
// Returns: "hello"

// Empty string
phantom.strings.operation.wordwrap("", 10);
// Returns: ""

// Null/undefined
phantom.strings.operation.wordwrap(null, 10);
// Returns: ""
```

---

### Validation Operations

#### `isEmpty(input)`
Checks if string is empty.

```javascript
phantom.strings.operation.isEmpty("");
// Returns: true
```

#### `isBlank(input)`
Checks if string is blank (empty or only whitespace).

```javascript
phantom.strings.operation.isBlank("   ");
// Returns: true
```

#### `length(input)`
Returns the length of a string.

```javascript
phantom.strings.operation.length("hello");
// Returns: 5
```

---

### Repetition Operations

#### `repeat(input, count)`
Repeats a string a specified number of times.

```javascript
phantom.strings.operation.repeat("ha", 3);
// Returns: "hahaha"
```

---

## Complete Function List

1. `find` - Find substring position
2. `leftPad` - Pad on the left
3. `rightPad` - Pad on the right
4. `trim` - Remove leading/trailing whitespace
5. `split` - Split into array
6. `replace` - Replace first occurrence
7. `replaceAll` - Replace all occurrences
8. `substring` - Extract substring
9. `toUpperCase` - Convert to uppercase
10. `toLowerCase` - Convert to lowercase
11. `capitalize` - Capitalize first letter
12. `reverse` - Reverse entire string
13. `reverseWords` - Reverse word order *(NEW in v0.1.5-BETA)*
14. `length` - Get string length
15. `startsWith` - Check prefix
16. `endsWith` - Check suffix
17. `contains` - Check if contains substring
18. `repeat` - Repeat string
19. `remove` - Remove substring
20. `isEmpty` - Check if empty
21. `isBlank` - Check if blank
22. `wordwrap` - Wrap text to line length *(NEW in v0.1.4-BETA)*

---

## Error Handling

All string operations:
- Return empty string (`""`) for `null` or `undefined` input
- Handle edge cases gracefully
- Log errors with `[phantom]` prefix if logger is available
- Never throw exceptions (fail silently)

---

## Best Practices

1. **Always check for null/undefined:**
   ```javascript
   var result = phantom.strings.operation.trim(input || "");
   ```

2. **Use appropriate operations:**
   - Use `isEmpty` for empty checks
   - Use `isBlank` for whitespace-only checks
   - Use `wordwrap` for text formatting
   - Use `reverseWords` for word order manipulation

3. **Word wrapping:**
   - Use default size (80) for general text
   - Use word boundary wrapping (default) for readable text
   - Use `cut: true` only when necessary (e.g., fixed-width formats)

4. **Performance:**
   - String operations are optimized for OIE environments
   - Large text operations may take longer
   - Consider using `wordwrap` for very long texts

---

## Examples

### Text Formatting
```javascript
// Format user input
var userInput = "  HELLO WORLD  ";
var formatted = phantom.strings.operation.trim(
  phantom.strings.operation.capitalize(
    phantom.strings.operation.toLowerCase(userInput)
  )
);
// Returns: "Hello world"
```

### Text Wrapping
```javascript
// Wrap long message for display
var message = "This is a very long message that needs to be wrapped for display in a fixed-width area.";
var wrapped = phantom.strings.operation.wordwrap(message, 40);
// Returns text wrapped at 40 characters per line
```

### Word Manipulation
```javascript
// Reverse word order
var sentence = "The quick brown fox";
var reversed = phantom.strings.operation.reverseWords(sentence);
// Returns: "fox brown quick The"
```

### Data Cleaning

---

## Chaining API (NEW in v0.1.5-BETA) 🚀

### `phantom.strings.chain(input)`

Chain multiple string operations together for cleaner, more readable code!

**Before (without chaining):**
```javascript
var step1 = phantom.strings.operation.trim(raw);
var step2 = phantom.strings.operation.toLowerCase(step1);
var step3 = phantom.strings.operation.capitalize(step2);
```

**After (with chaining):**
```javascript
var result = phantom.strings.chain(raw)
  .trim()
  .toLowerCase()
  .capitalize()
  .value();
```

### Available Chainable Methods

All string operations that return a string can be chained:

- `trim()` - Remove leading/trailing whitespace
- `toUpperCase()` - Convert to uppercase
- `toLowerCase()` - Convert to lowercase
- `capitalize()` - Capitalize first letter
- `reverse()` - Reverse entire string
- `reverseWords()` - Reverse word order
- `leftTrim()` - Remove leading whitespace
- `rightTrim()` - Remove trailing whitespace
- `replace(searchString, replaceString)` - Replace first occurrence
- `replaceAll(searchString, replaceString)` - Replace all occurrences
- `remove(stringToRemove)` - Remove substring
- `leftPad(padChar, count)` - Pad on the left
- `rightPad(padChar, count)` - Pad on the right
- `substring(start, end)` - Extract substring
- `wordwrap(size, cut, everything)` - Wrap text to line length

### Getting the Result

Use `.value()` or `.toString()` to get the final result:

```javascript
// Method 1: Using .value()
var result = phantom.strings.chain("  HELLO  ")
  .trim()
  .toUpperCase()
  .value();

// Method 2: Using .toString()
var result = phantom.strings.chain("  HELLO  ")
  .trim()
  .toUpperCase()
  .toString();

// Both return: "HELLO"
```

### Examples

#### Clean and Normalize
```javascript
var cleaned = phantom.strings.chain("  HELLO WORLD  ")
  .trim()
  .toLowerCase()
  .capitalize()
  .value();
// Returns: "Hello world"
```

#### Complex Chaining
```javascript
var result = phantom.strings.chain("hello hello")
  .replaceAll("hello", "hi")
  .toUpperCase()
  .value();
// Returns: "HI HI"
```

#### Replace and Transform
```javascript
var result = phantom.strings.chain("hello world")
  .replace("world", "universe")
  .capitalize()
  .value();
// Returns: "Hello universe"
```

#### Word Manipulation
```javascript
var result = phantom.strings.chain("The quick brown fox")
  .reverseWords()
  .toUpperCase()
  .value();
// Returns: "FOX BROWN QUICK THE"
```

#### Text Formatting
```javascript
var result = phantom.strings.chain("  user@example.com  ")
  .trim()
  .toLowerCase()
  .value();
// Returns: "user@example.com"
```

#### Multiple Replacements
```javascript
var result = phantom.strings.chain("hello hello hello")
  .replaceAll("hello", "hi")
  .toUpperCase()
  .value();
// Returns: "HI HI HI"
```

### Benefits

✅ **Cleaner Code** - No need for intermediate variables  
✅ **More Readable** - Operations flow naturally  
✅ **Less Error-Prone** - Fewer variables to manage  
✅ **Flexible** - Chain any combination of operations  

### Notes

- The old way (individual function calls) still works! Chaining is optional.
- Chaining is particularly useful when applying multiple transformations.
- All chainable methods return the chainable object, allowing continuous chaining.
- Use `.value()` or `.toString()` to get the final result.

- **v0.1.3**: Initial release with 25 string operations

---

## See Also

- [Getting Started](https://github.com/OS366/phantom/wiki/Getting-Started)
- [Number Operations](https://github.com/OS366/phantom/wiki/Number-Operations)
- [Best Practices](https://github.com/OS366/phantom/wiki/Best-Practices)

