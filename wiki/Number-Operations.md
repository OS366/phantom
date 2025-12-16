# Number Operations

Phantom.js provides 25 number operations for mathematical calculations, rounding, validation, and more.

## Table of Contents

- [Basic Math Operations](#basic-math-operations)
- [Rounding Operations](#rounding-operations)
- [Advanced Math Operations](#advanced-math-operations)
- [Validation Operations](#validation-operations)
- [Utility Operations](#utility-operations)

## Basic Math Operations

### add

Add two numbers.

```javascript
phantom.numbers.operation.add(5, 3);
// Output: 8

phantom.numbers.operation.add(10.5, 2.3);
// Output: 12.8
```

### subtract

Subtract two numbers.

```javascript
phantom.numbers.operation.subtract(10, 3);
// Output: 7

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
```

### divide

Divide two numbers.

```javascript
phantom.numbers.operation.divide(10, 2);
// Output: 5

phantom.numbers.operation.divide(7, 2);
// Output: 3.5

phantom.numbers.operation.divide(10, 0);
// Throws: Error("Invalid operation")
```

### mod

Calculate modulo (remainder).

```javascript
phantom.numbers.operation.mod(10, 3);
// Output: 1

phantom.numbers.operation.mod(15, 5);
// Output: 0
```

## Rounding Operations

### round

Round to specified decimal places.

```javascript
phantom.numbers.operation.round(3.14159, 2);
// Output: 3.14

phantom.numbers.operation.round(3.5, 0);
// Output: 4
```

### ceil

Round up to nearest integer.

```javascript
phantom.numbers.operation.ceil(3.1);
// Output: 4

phantom.numbers.operation.ceil(-3.1);
// Output: -3
```

### floor

Round down to nearest integer.

```javascript
phantom.numbers.operation.floor(3.9);
// Output: 3

phantom.numbers.operation.floor(-3.1);
// Output: -4
```

### truncate

Truncate decimal part.

```javascript
phantom.numbers.operation.truncate(3.7);
// Output: 3

phantom.numbers.operation.truncate(-3.7);
// Output: -3
```

### toFixed

Format number with fixed decimal places (returns string).

```javascript
phantom.numbers.operation.toFixed(3.14159, 2);
// Output: "3.14"

phantom.numbers.operation.toFixed(5, 2);
// Output: "5.00"
```

## Advanced Math Operations

### pow

Calculate power (base^exponent).

```javascript
phantom.numbers.operation.pow(2, 3);
// Output: 8

phantom.numbers.operation.pow(5, 2);
// Output: 25
```

### sqrt

Calculate square root.

```javascript
phantom.numbers.operation.sqrt(4);
// Output: 2

phantom.numbers.operation.sqrt(9);
// Output: 3

phantom.numbers.operation.sqrt(-1);
// Throws: Error("Invalid operation")
```

### abs

Get absolute value.

```javascript
phantom.numbers.operation.abs(-5);
// Output: 5

phantom.numbers.operation.abs(5);
// Output: 5
```

### min

Get the minimum of two numbers.

```javascript
phantom.numbers.operation.min(5, 10);
// Output: 5
```

### max

Get the maximum of two numbers.

```javascript
phantom.numbers.operation.max(5, 10);
// Output: 10
```

## Validation Operations

### parse

Parse a value to a number (strict validation).

```javascript
phantom.numbers.operation.parse("123");
// Output: 123

phantom.numbers.operation.parse("abc");
// Throws: Error("Invalid operation")
```

### isNumber

Check if a value is a valid number.

```javascript
phantom.numbers.operation.isNumber("123");
// Output: true

phantom.numbers.operation.isNumber("abc");
// Output: false

phantom.numbers.operation.isNumber(null);
// Output: true (Number(null) = 0)
```

### isEven

Check if number is even.

```javascript
phantom.numbers.operation.isEven(2);
// Output: true

phantom.numbers.operation.isEven(3);
// Output: false
```

### isOdd

Check if number is odd.

```javascript
phantom.numbers.operation.isOdd(3);
// Output: true

phantom.numbers.operation.isOdd(2);
// Output: false
```

### isPositive

Check if number is positive.

```javascript
phantom.numbers.operation.isPositive(5);
// Output: true

phantom.numbers.operation.isPositive(-5);
// Output: false
```

### isNegative

Check if number is negative.

```javascript
phantom.numbers.operation.isNegative(-5);
// Output: true

phantom.numbers.operation.isNegative(5);
// Output: false
```

### isZero

Check if number is zero.

```javascript
phantom.numbers.operation.isZero(0);
// Output: true

phantom.numbers.operation.isZero(5);
// Output: false
```

## Utility Operations

### random

Generate random number in range.

```javascript
phantom.numbers.operation.random(0, 10);
// Output: Random number between 0 (inclusive) and 10 (exclusive)
// Example: 7.234567

phantom.numbers.operation.random();
// Output: Random number between 0 and 1
```

### randomInt

Generate random integer in range.

```javascript
phantom.numbers.operation.randomInt(1, 10);
// Output: Random integer between 1 and 10 (inclusive)
// Example: 7
```

### between

Check if number is between two values (inclusive).

```javascript
phantom.numbers.operation.between(5, 1, 10);
// Output: true

phantom.numbers.operation.between(0, 1, 10);
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

## Common Patterns

### Pattern 1: Price Calculation

```javascript
var price = phantom.maps.channel.get("price");
var quantity = phantom.maps.channel.get("quantity");
var taxRate = 0.08; // 8%

// Calculate
var subtotal = phantom.numbers.operation.multiply(
    phantom.numbers.operation.parse(price),
    phantom.numbers.operation.parse(quantity)
);

var tax = phantom.numbers.operation.multiply(subtotal, taxRate);
var total = phantom.numbers.operation.add(subtotal, tax);

// Format for display
var formattedTotal = phantom.numbers.operation.toFixed(total, 2);
// Output: "21.60"
```

### Pattern 2: Validation and Range Checking

```javascript
var age = phantom.maps.channel.get("age");

if (phantom.numbers.operation.isNumber(age)) {
    var ageNum = phantom.numbers.operation.parse(age);
    
    if (phantom.numbers.operation.between(ageNum, 18, 65)) {
        // Valid age range
        phantom.maps.channel.save("validAge", true);
    }
}
```

### Pattern 3: Percentage Calculation

```javascript
var value = 100;
var percentage = 15;

var result = phantom.numbers.operation.divide(
    phantom.numbers.operation.multiply(value, percentage),
    100
);
// Output: 15 (15% of 100)
```

### Pattern 4: Random ID Generation

```javascript
var randomId = phantom.numbers.operation.randomInt(100000, 999999);
// Output: Random 6-digit number

var paddedId = phantom.strings.operation.leftPad(
    randomId.toString(), 
    "0", 
    8
);
// Output: "00123456"
```

## Best Practices

1. **Always validate before parsing** - Use `isNumber` before `parse`
2. **Handle division by zero** - Check denominator before dividing
3. **Use appropriate rounding** - Choose `round`, `ceil`, `floor`, or `truncate` based on needs
4. **Clamp values to ranges** - Use `clamp` to ensure values stay within bounds
5. **Format for display** - Use `toFixed` when displaying numbers to users

## Related Topics

- [String Operations](String-Operations) - Convert numbers to strings
- [Map Operations](Map-Operations) - Store and retrieve numeric data
- [Examples](Examples) - Real-world number processing examples

