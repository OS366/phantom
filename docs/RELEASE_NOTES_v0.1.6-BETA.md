# Release Notes - v0.1.6-BETA

**Release Date:** December 18, 2024  
**Version:** 0.1.6-BETA

## 🎉 What's New

### Full Chaining Support for Numbers API

This release introduces comprehensive chaining support for number operations, completing the chaining API across both strings and numbers modules.

#### New Features

1. **`phantom.numbers.chain()` API**
   - Full chaining support for all 27 number operations
   - Fluent, readable API for complex calculations
   - Seamless integration with existing operations

2. **Cross-Module Chaining**
   - `toNumberChain()` - Convert string chains to number chains
   - `toStringChain()` - Convert number chains to string chains
   - `toFixed()` - Returns string chain for continued formatting

3. **Comprehensive Test Coverage**
   - 30+ new test cases for numbers chaining
   - All 284 tests passing
   - 100% coverage maintained

## 📊 Statistics

- **Total Functions:** 104+
- **Test Cases:** 284 (up from 253)
- **New Test Cases:** 31 for numbers chaining API
- **Test Coverage:** 100%

## 🔧 Available Chain Methods

### Unary Operations
- `abs()`, `round(decimals)`, `ceil()`, `floor()`, `truncate()`, `sqrt()`

### Binary Operations
- `add(b)`, `subtract(b)`, `multiply(b)`, `divide(b)`, `mod(divisor)`, `pow(exponent)`
- `min(b)`, `max(b)`, `clamp(min, max)`

### Formatting
- `toFixed(decimals)` - Returns string chain

### Validation (return boolean)
- `isEven()`, `isOdd()`, `isPositive()`, `isNegative()`, `isZero()`
- `isNumber()`, `between(min, max)`, `sign()`

### Cross-Module
- `toStringChain()` - Convert to string chain
- `toNumberChain()` - Available in `phantom.strings.chain()`

## 💡 Examples

### Basic Number Chaining
```javascript
var result = phantom.numbers.chain(10)
    .add(5)
    .multiply(2)
    .round(0)
    .value();
// Returns: 30
```

### Cross-Module Chaining
```javascript
// Number to String
var formatted = phantom.numbers.chain(123.456)
    .round(2)
    .toFixed(2)    // Returns string chain
    .leftPad("0", 6)
    .value();
// Returns: "000000123.46"

// String to Number
var result = phantom.strings.chain("123.45")
    .trim()
    .toNumberChain()
    .round(1)
    .value();
// Returns: 123.5
```

### Complex Calculation
```javascript
var price = phantom.numbers.chain(100)
    .multiply(1.08)  // Add 8% tax
    .round(2)
    .value();
// Returns: 108
```

## 📚 Documentation Updates

- Updated `Number-Operations.md` with complete chaining API documentation
- Added 5 new examples in `Examples.md` demonstrating number chaining
- Updated wiki navigation with organized categories
- All wiki files organized in `wiki/` directory

## 🐛 Bug Fixes

- Fixed test expectations for `leftPad` behavior (adds count chars, not pad to length)
- Resolved merge conflicts during rebase from main

## 🔄 Migration Guide

### From v0.1.5-BETA

No breaking changes. The new chaining API is additive and fully backward compatible.

**Before:**
```javascript
var step1 = phantom.numbers.operation.add(10, 5);
var step2 = phantom.numbers.operation.multiply(step1, 2);
var result = phantom.numbers.operation.round(step2, 0);
```

**After (Optional - Chaining):**
```javascript
var result = phantom.numbers.chain(10)
    .add(5)
    .multiply(2)
    .round(0)
    .value();
```

## 📦 Files Changed

- `phantom.js` - Added `phantom.numbers.chain()` and `toNumberChain()` in strings chain
- `phantom.test.js` - Added 31 comprehensive test cases
- `Number-Operations.md` - Complete chaining documentation
- `Examples.md` - 5 new chaining examples
- `wiki/Home.md` - Updated navigation and statistics
- All wiki files moved to `wiki/` directory for better organization

## 🎯 Next Steps

- Continue using the chaining API for cleaner, more readable code
- Explore cross-module chaining for complex data transformations
- Check out the updated wiki documentation for more examples

## 🙏 Acknowledgments

Thank you for using Phantom.js! Your feedback and contributions help make this library better.

---

**Full Changelog:** [Compare v0.1.5-BETA...v0.1.6-BETA](https://github.com/OS366/phantom/compare/v0.1.5-BETA...v0.1.6-BETA)

