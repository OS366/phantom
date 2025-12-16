# Troubleshooting

Common issues and solutions when using Phantom.js.

## Common Errors

### Error: "Invalid operation"

This generic error occurs when:

1. **Invalid input to number operations**
   ```javascript
   // Problem: Trying to parse non-numeric value
   phantom.numbers.operation.parse("abc");
   // Solution: Validate first
   if (phantom.numbers.operation.isNumber("abc")) {
       var num = phantom.numbers.operation.parse("abc");
   }
   ```

2. **Division by zero**
   ```javascript
   // Problem: Dividing by zero
   phantom.numbers.operation.divide(10, 0);
   // Solution: Check denominator first
   if (!phantom.numbers.operation.isZero(denominator)) {
       var result = phantom.numbers.operation.divide(10, denominator);
   }
   ```

3. **Null/undefined in strict operations**
   ```javascript
   // Problem: Null value in strict operation
   phantom.numbers.operation.parse(null);
   // Solution: Check for null/undefined
   if (value != null) {
       var num = phantom.numbers.operation.parse(value);
   }
   ```

4. **Operations on read-only maps**
   ```javascript
   // Problem: Trying to save to configuration map
   phantom.maps.configuration.save("key", "value");
   // Solution: Configuration map is read-only, use get() only
   var value = phantom.maps.configuration.get("key");
   ```

5. **Null key in map operations**
   ```javascript
   // Problem: Null key
   phantom.maps.channel.save(null, "value");
   // Solution: Ensure key is not null
   if (key != null) {
       phantom.maps.channel.save(key, "value");
   }
   ```

## Map Issues

### Issue: Map returns null/undefined

**Problem:** Getting null when retrieving from map.

```javascript
var value = phantom.maps.channel.get("key");
// value is null
```

**Solutions:**

1. Check if key exists first:
   ```javascript
   if (phantom.maps.channel.exists("key")) {
       var value = phantom.maps.channel.get("key");
   }
   ```

2. Provide default value:
   ```javascript
   var value = phantom.maps.channel.get("key") || "default";
   ```

### Issue: Response map not available

**Problem:** Getting error when using response map.

```javascript
phantom.maps.response.save("key", "value");
// Error: "Invalid operation"
```

**Solution:** Response map is only available in response context. Check context:

```javascript
try {
    phantom.maps.response.save("key", "value");
} catch (e) {
    // Not in response context, use alternative map
    phantom.maps.channel.save("key", "value");
}
```

## String Operation Issues

### Issue: String operations return unexpected results

**Problem:** Operations on null/undefined return empty strings.

```javascript
phantom.strings.operation.trim(null);
// Returns: "" (empty string, not error)
```

**Solution:** This is expected behavior. Check for empty strings:

```javascript
var result = phantom.strings.operation.trim(input);
if (!phantom.strings.operation.isEmpty(result)) {
    // Process result
}
```

### Issue: Replace not working as expected

**Problem:** `replace` only replaces first occurrence.

```javascript
phantom.strings.operation.replace("hello hello", "hello", "hi");
// Returns: "hi hello" (only first replaced)
```

**Solution:** Use `replaceAll` for all occurrences:

```javascript
phantom.strings.operation.replaceAll("hello hello", "hello", "hi");
// Returns: "hi hi"
```

## Number Operation Issues

### Issue: isNumber returns true for null

**Problem:** `isNumber(null)` returns `true` because `Number(null) = 0`.

```javascript
phantom.numbers.operation.isNumber(null);
// Returns: true
```

**Solution:** Check for null explicitly if needed:

```javascript
if (value != null && phantom.numbers.operation.isNumber(value)) {
    var num = phantom.numbers.operation.parse(value);
}
```

### Issue: Floating point precision

**Problem:** Decimal calculations may have precision issues.

```javascript
phantom.numbers.operation.add(0.1, 0.2);
// Returns: 0.30000000000000004
```

**Solution:** Round results when needed:

```javascript
var result = phantom.numbers.operation.round(
    phantom.numbers.operation.add(0.1, 0.2),
    2
);
// Returns: 0.3
```

### Issue: Random numbers not truly random

**Problem:** Random numbers seem predictable.

**Solution:** This is expected - JavaScript's `Math.random()` is pseudo-random. For OIE use cases, this is typically sufficient.

## Performance Issues

### Issue: Slow operations

**Problem:** Operations seem slow.

**Solutions:**

1. Avoid redundant operations:
   ```javascript
   // Bad: Multiple trims
   var a = phantom.strings.operation.trim(input);
   var b = phantom.strings.operation.trim(input);
   
   // Good: Store result
   var trimmed = phantom.strings.operation.trim(input);
   var a = trimmed;
   var b = trimmed;
   ```

2. Validate early to avoid unnecessary processing:
   ```javascript
   if (phantom.strings.operation.isBlank(input)) {
       return; // Exit early
   }
   // Process only if valid
   ```

## Debugging Tips

### 1. Log Intermediate Values

```javascript
var step1 = phantom.strings.operation.trim(input);
logger.info("Step 1: " + step1);

var step2 = phantom.strings.operation.toUpperCase(step1);
logger.info("Step 2: " + step2);
```

### 2. Check Map Contents

```javascript
if (phantom.maps.channel.exists("key")) {
    var value = phantom.maps.channel.get("key");
    logger.info("Map value: " + value);
}
```

### 3. Validate Before Operations

```javascript
var input = phantom.maps.channel.get("input");
logger.info("Input type: " + typeof input);
logger.info("Input value: " + input);

if (phantom.numbers.operation.isNumber(input)) {
    var num = phantom.numbers.operation.parse(input);
    logger.info("Parsed number: " + num);
}
```

## Getting Help

If you encounter issues not covered here:

1. Check the [API Reference](API-Reference) for correct usage
2. Review [Examples](Examples) for similar use cases
3. Check [Best Practices](Best-Practices) for patterns
4. Open an issue on the [GitHub repository](https://github.com/OS366/phantom)

## Related Topics

- [Best Practices](Best-Practices) - Tips to avoid common issues
- [Examples](Examples) - Working examples
- [API Reference](API-Reference) - Complete API documentation

