# Best Practices

Guidelines and patterns for effectively using Phantom.js in your OIE scripting projects.

## General Principles

### 1. Always Validate Input

Before processing data, validate it to avoid errors.

```javascript
// ❌ Bad: No validation
var value = phantom.maps.channel.get("value");
var result = phantom.numbers.operation.parse(value);

// ✅ Good: Validate first
var value = phantom.maps.channel.get("value");
if (phantom.numbers.operation.isNumber(value)) {
    var result = phantom.numbers.operation.parse(value);
    // Process result
} else {
    // Handle invalid input
}
```

### 2. Use Try-Catch for Error Handling

Wrap operations that might fail in try-catch blocks.

```javascript
try {
    var result = phantom.numbers.operation.divide(10, 0);
} catch (e) {
    // Handle error: "Invalid operation"
    logger.error("Division failed: " + e.message);
    phantom.maps.channel.save("error", "Division by zero");
}
```

### 3. Check Map Key Existence

Always check if a key exists before using it.

```javascript
// ❌ Bad: May return null/undefined
var value = phantom.maps.channel.get("key");
var processed = phantom.strings.operation.trim(value);

// ✅ Good: Check existence first
if (phantom.maps.channel.exists("key")) {
    var value = phantom.maps.channel.get("key");
    var processed = phantom.strings.operation.trim(value);
}
```

### 4. Clean Data Before Processing

Always trim and normalize string data before processing.

```javascript
// ✅ Good: Clean first, then process
var raw = phantom.maps.channel.get("data");
var cleaned = phantom.strings.operation.trim(raw);

if (!phantom.strings.operation.isBlank(cleaned)) {
    // Process cleaned data
    var processed = phantom.strings.operation.toUpperCase(cleaned);
}
```

## String Operations Best Practices

### 1. Chain Operations for Pipelines

Build transformation pipelines by chaining operations.

```javascript
// ✅ Good: Clear pipeline
var result = phantom.strings.operation.capitalize(
    phantom.strings.operation.trim(
        phantom.strings.operation.toLowerCase(input)
    )
);
```

### 2. Use Appropriate Operations

Choose the right operation for your needs.

```javascript
// For single replacement
phantom.strings.operation.replace(text, "old", "new");

// For all replacements
phantom.strings.operation.replaceAll(text, "old", "new");
```

### 3. Validate Before String Operations

Check if strings are empty or blank before processing.

```javascript
var input = phantom.maps.channel.get("input");

if (!phantom.strings.operation.isBlank(input)) {
    // Safe to process
    var processed = phantom.strings.operation.trim(input);
}
```

## Number Operations Best Practices

### 1. Validate Before Parsing

Always use `isNumber` before `parse`.

```javascript
// ❌ Bad: May throw error
var num = phantom.numbers.operation.parse(value);

// ✅ Good: Validate first
if (phantom.numbers.operation.isNumber(value)) {
    var num = phantom.numbers.operation.parse(value);
}
```

### 2. Handle Division by Zero

Always check denominator before dividing.

```javascript
var denominator = phantom.maps.channel.get("denominator");

if (phantom.numbers.operation.isNumber(denominator)) {
    var denom = phantom.numbers.operation.parse(denominator);
    
    if (!phantom.numbers.operation.isZero(denom)) {
        var result = phantom.numbers.operation.divide(10, denom);
    } else {
        // Handle division by zero
    }
}
```

### 3. Use Appropriate Rounding

Choose the right rounding method for your use case.

```javascript
// For general rounding
var rounded = phantom.numbers.operation.round(3.7, 0); // 4

// For always rounding up (pricing)
var price = phantom.numbers.operation.ceil(3.1); // 4

// For always rounding down
var count = phantom.numbers.operation.floor(3.9); // 3

// For removing decimals
var whole = phantom.numbers.operation.truncate(3.7); // 3
```

### 4. Clamp Values to Ranges

Use `clamp` to ensure values stay within acceptable ranges.

```javascript
var userInput = phantom.maps.channel.get("value");

if (phantom.numbers.operation.isNumber(userInput)) {
    var value = phantom.numbers.operation.parse(userInput);
    var safeValue = phantom.numbers.operation.clamp(value, 0, 100);
    phantom.maps.channel.save("safeValue", safeValue);
}
```

## Map Operations Best Practices

### 1. Use Appropriate Map Types

Choose the right map for your data scope.

```javascript
// Temporary data: use channel map
phantom.maps.channel.save("tempData", value);

// Shared data: use global map
phantom.maps.global.save("sharedConfig", config);

// Connector-specific: use connector map
phantom.maps.connector.save("apiKey", key);
```

### 2. Clean Up Temporary Data

Delete temporary data after use.

```javascript
// Save temporary data
phantom.maps.channel.save("tempData", value);

// Process data
var processed = processData(phantom.maps.channel.get("tempData"));

// Clean up
phantom.maps.channel.delete("tempData");
```

### 3. Check Existence Before Use

Always check if a key exists before retrieving.

```javascript
if (phantom.maps.channel.exists("userId")) {
    var userId = phantom.maps.channel.get("userId");
    // Process user
} else {
    // Handle missing data
}
```

## Performance Tips

### 1. Avoid Redundant Operations

Don't perform the same operation multiple times.

```javascript
// ❌ Bad: Multiple operations
var trimmed1 = phantom.strings.operation.trim(input);
var trimmed2 = phantom.strings.operation.trim(input);

// ✅ Good: Store result
var trimmed = phantom.strings.operation.trim(input);
var upper = phantom.strings.operation.toUpperCase(trimmed);
```

### 2. Validate Early

Validate input as early as possible to avoid unnecessary processing.

```javascript
// ✅ Good: Validate first
if (phantom.strings.operation.isBlank(input)) {
    return; // Exit early
}

// Process only if valid
var processed = processData(input);
```

## Error Handling Patterns

### 1. Generic Error Handling

```javascript
try {
    var result = phantom.numbers.operation.divide(a, b);
    phantom.maps.channel.save("result", result);
} catch (e) {
    if (e.message === "Invalid operation") {
        phantom.maps.channel.save("error", "Invalid calculation");
    }
}
```

### 2. Specific Error Handling

```javascript
try {
    var value = phantom.maps.channel.get("key");
    var parsed = phantom.numbers.operation.parse(value);
} catch (e) {
    if (e.message === "Invalid operation") {
        // Handle invalid operation
        logger.error("Failed to parse value");
    }
}
```

## Code Organization

### 1. Group Related Operations

```javascript
// Data validation
var isValid = validateData(input);

// Data processing
if (isValid) {
    var processed = processData(input);
    phantom.maps.channel.save("result", processed);
}
```

### 2. Use Descriptive Variable Names

```javascript
// ✅ Good: Descriptive names
var cleanedInput = phantom.strings.operation.trim(input);
var formattedOutput = phantom.strings.operation.capitalize(cleanedInput);

// ❌ Bad: Unclear names
var x = phantom.strings.operation.trim(input);
var y = phantom.strings.operation.capitalize(x);
```

## Common Anti-Patterns to Avoid

### 1. ❌ Not Validating Input

```javascript
// Don't do this
var result = phantom.numbers.operation.parse(phantom.maps.channel.get("value"));
```

### 2. ❌ Ignoring Errors

```javascript
// Don't do this
var result = phantom.numbers.operation.divide(10, 0);
// May throw error
```

### 3. ❌ Not Checking Map Existence

```javascript
// Don't do this
var value = phantom.maps.channel.get("nonexistent");
var processed = phantom.strings.operation.trim(value);
```

### 4. ❌ Not Cleaning Data

```javascript
// Don't do this
var result = phantom.strings.operation.toUpperCase(
    phantom.maps.channel.get("data")
);
// May have whitespace issues
```

## Related Topics

- [Getting Started](Getting-Started) - Basic usage patterns
- [Examples](Examples) - Real-world examples
- [Troubleshooting](Troubleshooting) - Common issues and solutions

