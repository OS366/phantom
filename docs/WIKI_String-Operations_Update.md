# String Operations Wiki Update

This file contains the updated String Operations documentation for the wiki. Copy this content to: https://github.com/OS366/phantom/wiki/String-Operations

---

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

## New Functions (v0.1.4-BETA and v0.1.5-BETA)

### `wordwrap(input, size, cut, everything)` - NEW in v0.1.4-BETA

Wraps text to a specified line length.

**Parameters:**
- `input` (string): The text to wrap
- `size` (number, optional): Maximum line length (default: 80)
- `cut` (boolean, optional): If true, cuts words at size limit (default: false)
- `everything` (boolean, optional): If true, wraps everything including words (default: false)

**Returns:** String with text wrapped to specified line length

**Examples:**
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

**Behavior:**
- If `cut` is `true` or `everything` is `true`: Words are cut at the size limit
- If `cut` is `false` (default): Text breaks at word boundaries
- If text is shorter than size, returns original text
- Invalid size values default to 80

---

### `reverseWords(input)` - NEW in v0.1.5-BETA

Reverses the order of words in a string.

**Parameters:**
- `input` (string): The string to reverse words in

**Returns:** String with words in reversed order

**Examples:**
```javascript
// Multiple words
phantom.strings.operation.reverseWords("hello world");
// Returns: "world hello"

phantom.strings.operation.reverseWords("one two three");
// Returns: "three two one"

// Single word
phantom.strings.operation.reverseWords("hello");
// Returns: "hello"

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

## Usage Examples

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

---

## Version History

- **v0.1.5-BETA**: Added `reverseWords` function
- **v0.1.4-BETA**: Added `wordwrap` function
- **v0.1.3**: Initial release with 25 string operations

---

**Note:** Copy the content above to update the wiki page at: https://github.com/OS366/phantom/wiki/String-Operations

