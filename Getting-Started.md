# Getting Started with Phantom.js

This guide will help you get started with Phantom.js in your OIE scripting projects.

## Installation

### For OIE Scripting

1. **Copy the Library**
   - Open `phantom.js` from this repository
   - Copy the entire contents
   - Paste into your OIE script editor

2. **That's It!**
   - The library is immediately available as `phantom` in your script context
   - No additional setup or configuration needed

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

## Basic Usage

### Initialization (Optional)

```javascript
// Default initialization (silent mode)
phantom.init();

// Custom initialization
phantom.init({ silent: false });
```

### String Operations

```javascript
// Trim whitespace
var cleaned = phantom.strings.operation.trim("  hello world  ");
// Output: "hello world"

// Capitalize
var name = phantom.strings.operation.capitalize("john doe");
// Output: "John doe"

// Replace
var text = phantom.strings.operation.replace("hello", "he", "hi");
// Output: "hillo"
```

### Number Operations

```javascript
// Basic math
var sum = phantom.numbers.operation.add(10, 5);
// Output: 15

var product = phantom.numbers.operation.multiply(3, 4);
// Output: 12

// Rounding
var rounded = phantom.numbers.operation.round(3.14159, 2);
// Output: 3.14
```

### Map Operations

```javascript
// Save to channel map
phantom.maps.channel.save("userId", "12345");

// Retrieve from channel map
var userId = phantom.maps.channel.get("userId");
// Output: "12345"

// Check if exists
if (phantom.maps.channel.exists("userId")) {
    // Process user data
}
```

## Common Patterns

### Pattern 1: Data Transformation

```javascript
// Get data from map
var rawData = phantom.maps.channel.get("rawData");

// Transform it
var cleaned = phantom.strings.operation.trim(rawData);
var upper = phantom.strings.operation.toUpperCase(cleaned);

// Save back
phantom.maps.channel.save("processedData", upper);
```

### Pattern 2: Validation and Calculation

```javascript
// Get values
var price = phantom.maps.channel.get("price");
var quantity = phantom.maps.channel.get("quantity");

// Validate and calculate
if (phantom.numbers.operation.isNumber(price) && 
    phantom.numbers.operation.isNumber(quantity)) {
    
    var total = phantom.numbers.operation.multiply(
        phantom.numbers.operation.parse(price),
        phantom.numbers.operation.parse(quantity)
    );
    
    phantom.maps.channel.save("total", total);
}
```

### Pattern 3: String Processing Pipeline

```javascript
var input = phantom.maps.channel.get("input");

// Process through multiple operations
var step1 = phantom.strings.operation.trim(input);
var step2 = phantom.strings.operation.toLowerCase(step1);
var step3 = phantom.strings.operation.capitalize(step2);

phantom.maps.channel.save("output", step3);
```

## Error Handling

All operations throw `Error("Invalid operation")` on invalid input:

```javascript
try {
    var result = phantom.numbers.operation.divide(10, 0);
} catch (e) {
    // Handle error: "Invalid operation"
    logger.error("Division failed: " + e.message);
}
```

## Next Steps

- Explore [String Operations](String-Operations) for all string utilities
- Check out [Number Operations](Number-Operations) for all number utilities
- Learn about [Map Operations](Map-Operations) for working with maps
- See [Examples](Examples) for real-world use cases
- Review [Best Practices](Best-Practices) for tips and patterns

