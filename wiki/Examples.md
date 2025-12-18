# Examples

Real-world examples demonstrating how to use Phantom.js in OIE scripting scenarios.

## Example 1: User Data Processing

Process and validate user input data.

```javascript
// Get user input
var firstName = phantom.maps.channel.get("firstName");
var lastName = phantom.maps.channel.get("lastName");
var email = phantom.maps.channel.get("email");

// Clean and normalize names (using chaining)
var cleanFirstName = phantom.strings.chain(firstName)
    .trim()
    .capitalize()
    .value();

var cleanLastName = phantom.strings.chain(lastName)
    .trim()
    .capitalize()
    .value();

// Alternative: Traditional way (still works)
// var cleanFirstName = phantom.strings.operation.capitalize(
//     phantom.strings.operation.trim(firstName)
// );

// Validate email
if (phantom.strings.operation.contains(email, "@") && 
    !phantom.strings.operation.isEmpty(email)) {
    
    // Create full name
    var fullName = phantom.strings.operation.join(
        cleanFirstName, 
        cleanLastName, 
        " "
    );
    
    // Save processed data
    phantom.maps.channel.save("fullName", fullName);
    phantom.maps.channel.save("validEmail", email);
}
```

## Example 2: Order Total Calculation

Calculate order totals with tax and discounts.

```javascript
// Get order data
var itemPrice = phantom.maps.channel.get("itemPrice");
var quantity = phantom.maps.channel.get("quantity");
var discountPercent = phantom.maps.channel.get("discountPercent");
var taxRate = 0.08; // 8%

// Validate and parse
if (phantom.numbers.operation.isNumber(itemPrice) && 
    phantom.numbers.operation.isNumber(quantity)) {
    
    var price = phantom.numbers.operation.parse(itemPrice);
    var qty = phantom.numbers.operation.parse(quantity);
    
    // Calculate subtotal
    var subtotal = phantom.numbers.operation.multiply(price, qty);
    
    // Apply discount
    var discount = phantom.numbers.operation.divide(
        phantom.numbers.operation.multiply(subtotal, discountPercent),
        100
    );
    
    var discountedTotal = phantom.numbers.operation.subtract(subtotal, discount);
    
    // Calculate tax
    var tax = phantom.numbers.operation.multiply(discountedTotal, taxRate);
    
    // Final total
    var total = phantom.numbers.operation.add(discountedTotal, tax);
    
    // Format and save
    phantom.maps.channel.save("subtotal", 
        phantom.numbers.operation.toFixed(subtotal, 2));
    phantom.maps.channel.save("discount", 
        phantom.numbers.operation.toFixed(discount, 2));
    phantom.maps.channel.save("tax", 
        phantom.numbers.operation.toFixed(tax, 2));
    phantom.maps.channel.save("total", 
        phantom.numbers.operation.toFixed(total, 2));
}
```

## Example 3: ID Generation and Formatting

Generate and format unique identifiers.

```javascript
// Generate random ID
var randomId = phantom.numbers.operation.randomInt(100000, 999999);

// Format as padded string
var formattedId = phantom.strings.operation.leftPad(
    randomId.toString(), 
    "0", 
    8
);

// Add prefix
var finalId = phantom.strings.operation.join("ID-", formattedId, "");

// Save
phantom.maps.channel.save("generatedId", finalId);
// Output: "ID-00123456"
```

## Example 4: Data Validation Pipeline

Validate and clean incoming data.

```javascript
// Get raw data
var rawData = phantom.maps.channel.get("rawData");

// Validation pipeline (using chaining - cleaner!)
if (!phantom.strings.operation.isBlank(rawData)) {
    // Clean and normalize in one chain
    var cleaned = phantom.strings.chain(rawData)
        .trim()
        .remove("@")
        .remove("#")
        .toLowerCase()
        .capitalize()
        .value();
    
    // Alternative: Traditional way (still works)
    // var step1 = phantom.strings.operation.trim(rawData);
    // var step2 = phantom.strings.operation.remove(step1, "@");
    // var step3 = phantom.strings.operation.remove(step2, "#");
    // var step4 = phantom.strings.operation.toLowerCase(step3);
    // var cleaned = phantom.strings.operation.capitalize(step4);
    
    // Validate length
    if (phantom.strings.operation.length(cleaned) > 0 && 
        phantom.strings.operation.length(cleaned) <= 100) {
        
        phantom.maps.channel.save("validatedData", cleaned);
    }
}
```

## Example 5: Date/Time String Processing

Process and format date/time strings.

```javascript
// Get timestamp string
var timestamp = phantom.maps.channel.get("timestamp");
// Format: "2024-01-15T10:30:00"

// Extract date part
var datePart = phantom.strings.operation.substring(timestamp, 0, 10);
// Output: "2024-01-15"

// Extract time part
var timePart = phantom.strings.operation.substring(timestamp, 11);
// Output: "10:30:00"

// Split date components
var dateParts = phantom.strings.operation.split(datePart, "-");
var year = dateParts[0];
var month = dateParts[1];
var day = dateParts[2];

// Format as display string
var displayDate = phantom.strings.operation.join(
    month, 
    phantom.strings.operation.join(day, year, "/"), 
    "/"
);
// Output: "01/15/2024"

phantom.maps.channel.save("formattedDate", displayDate);
```

## Example 6: Conditional Processing Based on Configuration

Use configuration to drive processing logic.

```javascript
// Get configuration
var processingMode = phantom.maps.configuration.get("processingMode");
var maxRetries = phantom.maps.configuration.get("maxRetries");

// Process based on mode
if (phantom.strings.operation.compare(processingMode, "strict") === 0) {
    // Strict mode: validate everything
    var data = phantom.maps.channel.get("data");
    
    if (phantom.strings.operation.isEmpty(data)) {
        phantom.maps.channel.save("error", "Data is required");
    } else {
        // Process in strict mode
        phantom.maps.channel.save("processed", processStrict(data));
    }
} else {
    // Normal mode: lenient processing
    var data = phantom.maps.channel.get("data");
    if (!phantom.strings.operation.isBlank(data)) {
        phantom.maps.channel.save("processed", processNormal(data));
    }
}

// Use max retries
if (phantom.numbers.operation.isNumber(maxRetries)) {
    var retries = phantom.numbers.operation.parse(maxRetries);
    phantom.maps.channel.save("maxRetries", retries);
}
```

## Example 7: Range Validation and Clamping

Validate and clamp numeric values to acceptable ranges.

```javascript
// Get user input
var userAge = phantom.maps.channel.get("age");
var userScore = phantom.maps.channel.get("score");

// Validate age (must be between 18 and 100)
if (phantom.numbers.operation.isNumber(userAge)) {
    var age = phantom.numbers.operation.parse(userAge);
    
    if (phantom.numbers.operation.between(age, 18, 100)) {
        phantom.maps.channel.save("validAge", age);
    } else {
        // Clamp to valid range
        var clampedAge = phantom.numbers.operation.clamp(age, 18, 100);
        phantom.maps.channel.save("validAge", clampedAge);
    }
}

// Validate score (must be between 0 and 100)
if (phantom.numbers.operation.isNumber(userScore)) {
    var score = phantom.numbers.operation.parse(userScore);
    var validScore = phantom.numbers.operation.clamp(score, 0, 100);
    phantom.maps.channel.save("validScore", validScore);
}
```

## Example 8: String Search and Replace

Find and replace patterns in text.

```javascript
// Get text content
var content = phantom.maps.channel.get("content");

// Replace placeholders (using chaining)
var processedContent = phantom.strings.chain(content)
    .replaceAll("${name}", "John")
    .replaceAll("${date}", "2024-01-15")
    .replaceAll("${company}", "Acme Corp")
    .value();

// Save processed content
phantom.maps.channel.save("processedContent", processedContent);

// Alternative: Traditional way (still works)
// var step1 = phantom.strings.operation.replaceAll(content, "${name}", "John");
// var step2 = phantom.strings.operation.replaceAll(step1, "${date}", "2024-01-15");
// var step3 = phantom.strings.operation.replaceAll(step2, "${company}", "Acme Corp");
// phantom.maps.channel.save("processedContent", step3);
```

## Example 9: Number Formatting for Display

Format numbers for user display.

```javascript
// Get numeric values
var price = phantom.maps.channel.get("price");
var quantity = phantom.maps.channel.get("quantity");

if (phantom.numbers.operation.isNumber(price) && 
    phantom.numbers.operation.isNumber(quantity)) {
    
    var priceNum = phantom.numbers.operation.parse(price);
    var qtyNum = phantom.numbers.operation.parse(quantity);
    
    // Calculate total
    var total = phantom.numbers.operation.multiply(priceNum, qtyNum);
    
    // Format for different locales
    var usFormat = "$" + phantom.numbers.operation.toFixed(total, 2);
    var euFormat = phantom.numbers.operation.toFixed(total, 2) + " EUR";
    
    // Round for display
    var roundedTotal = phantom.numbers.operation.round(total, 0);
    
    phantom.maps.channel.save("usFormatted", usFormat);
    phantom.maps.channel.save("euFormatted", euFormat);
    phantom.maps.channel.save("roundedTotal", roundedTotal);
}
```

## Example 10: Error Handling Pattern

Comprehensive error handling for operations.

```javascript
try {
    // Get and validate data
    var input = phantom.maps.channel.get("input");
    
    if (phantom.strings.operation.isBlank(input)) {
        throw new Error("Input is required");
    }
    
    // Process data (using chaining)
    var result = phantom.strings.chain(input)
        .trim()
        .toUpperCase()
        .value();
    
    // Save result
    phantom.maps.channel.save("result", result);
    
    // Alternative: Traditional way (still works)
    // var processed = phantom.strings.operation.trim(input);
    // var upper = phantom.strings.operation.toUpperCase(processed);
    // phantom.maps.channel.save("result", upper);
    
} catch (e) {
    // Handle errors
    if (e.message === "Invalid operation") {
        phantom.maps.channel.save("error", "Invalid input data");
    } else {
        phantom.maps.channel.save("error", e.message);
    }
}
```

## Example 11: JSON Data Processing

Parse and manipulate JSON data from API responses.

```javascript
// Get JSON string from map
var jsonString = phantom.maps.channel.get("apiResponse");

try {
    // Parse JSON
    var obj = phantom.json.operation.parse(jsonString);
    
    // Extract nested values
    var userName = phantom.json.operation.get(obj, "user.name");
    var userEmail = phantom.json.operation.get(obj, "user.email");
    var userId = phantom.json.operation.get(obj, "user.id");
    
    // Validate required fields
    if (phantom.json.operation.has(obj, "user.name") && 
        phantom.json.operation.has(obj, "user.email")) {
        
        // Save extracted data
        phantom.maps.channel.save("userName", userName);
        phantom.maps.channel.save("userEmail", userEmail);
        phantom.maps.channel.save("userId", userId);
    }
} catch (e) {
    phantom.maps.channel.save("error", "Failed to parse JSON");
}
```

## Example 12: JSON Transformation

Transform JSON structure for different systems.

```javascript
// Get source JSON
var sourceJson = phantom.maps.channel.get("sourceData");
var source = phantom.json.operation.parse(sourceJson);

// Create new structure
var transformed = {};
transformed = phantom.json.operation.set(transformed, "firstName", 
    phantom.json.operation.get(source, "user.firstName"));
transformed = phantom.json.operation.set(transformed, "lastName", 
    phantom.json.operation.get(source, "user.lastName"));
transformed = phantom.json.operation.set(transformed, "fullName",
    phantom.strings.operation.join(
        phantom.json.operation.get(transformed, "firstName"),
        phantom.json.operation.get(transformed, "lastName"),
        " "
    )
);

// Save transformed JSON
phantom.maps.channel.save("transformedData", 
    phantom.json.operation.stringify(transformed));
```

## Example 13: JSON Configuration Merge

Merge base configuration with overrides.

```javascript
// Get base configuration
var baseConfigJson = phantom.maps.configuration.get("baseConfig");
var baseConfig = phantom.json.operation.parse(baseConfigJson);

// Get override configuration
var overrideJson = phantom.maps.channel.get("overrides");
var overrides = phantom.json.operation.parse(overrideJson);

// Merge (overrides take precedence)
var finalConfig = phantom.json.operation.merge(baseConfig, overrides);

// Save final configuration
phantom.maps.channel.save("finalConfig", 
    phantom.json.operation.stringify(finalConfig));
```

## Example 14: Dynamic JSON Key Processing

Process all keys in a JSON object dynamically.

```javascript
// Get JSON object
var jsonString = phantom.maps.channel.get("data");
var obj = phantom.json.operation.parse(jsonString);

// Get all keys
var keys = phantom.json.operation.keys(obj);

// Process each key-value pair
var processed = {};
for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = phantom.json.operation.get(obj, key);
    
    // Transform value (using chaining)
    if (phantom.strings.operation.isBlank(value) === false) {
        var transformed = phantom.strings.chain(value)
            .trim()
            .toUpperCase()
            .value();
        processed = phantom.json.operation.set(processed, key, transformed);
    }
    
    // Alternative: Traditional way (still works)
    // var transformed = phantom.strings.operation.toUpperCase(
    //     phantom.strings.operation.trim(value)
    // );
}

// Save processed data
phantom.maps.channel.save("processedData", 
    phantom.json.operation.stringify(processed));
```

## Example 15: String Chaining - Clean User Input (NEW in v0.1.5-BETA)

Use the chaining API for cleaner, more readable code when applying multiple string transformations.

```javascript
// Get user input
var userInput = phantom.maps.channel.get("userInput");

// Clean and normalize using chaining
var cleaned = phantom.strings.chain(userInput)
    .trim()
    .toLowerCase()
    .capitalize()
    .value();

phantom.maps.channel.save("cleanedInput", cleaned);
```

## Example 16: String Chaining - Email Normalization

Normalize email addresses using chaining.

```javascript
// Get email
var email = phantom.maps.channel.get("email");

// Normalize email (trim, lowercase)
var normalized = phantom.strings.chain(email)
    .trim()
    .toLowerCase()
    .value();

phantom.maps.channel.save("normalizedEmail", normalized);
```

## Example 17: String Chaining - Text Template Processing

Process text templates with multiple replacements using chaining.

```javascript
// Get template
var template = phantom.maps.channel.get("template");
// Template: "Hello ${name}, your order ${orderId} is ready!"

// Replace all placeholders in one chain
var processed = phantom.strings.chain(template)
    .replaceAll("${name}", "John Doe")
    .replaceAll("${orderId}", "ORD-12345")
    .replaceAll("${date}", "2024-01-15")
    .value();

phantom.maps.channel.save("processedTemplate", processed);
// Output: "Hello John Doe, your order ORD-12345 is ready!"
```

## Example 18: String Chaining - ID Formatting

Format and pad IDs using chaining.

```javascript
// Get raw ID
var rawId = phantom.maps.channel.get("rawId");

// Format ID: trim, pad, add prefix
var formattedId = phantom.strings.chain(rawId)
    .trim()
    .leftPad("0", 6)
    .value();

var finalId = "ID-" + formattedId;
phantom.maps.channel.save("formattedId", finalId);
```

## Example 19: String Chaining - Data Sanitization

Sanitize user input by removing unwanted characters and normalizing.

```javascript
// Get user input
var userInput = phantom.maps.channel.get("userInput");

// Sanitize: remove special chars, trim, normalize
var sanitized = phantom.strings.chain(userInput)
    .trim()
    .remove("@")
    .remove("#")
    .remove("$")
    .toLowerCase()
    .capitalize()
    .value();

phantom.maps.channel.save("sanitizedInput", sanitized);
```

## Example 20: String Chaining - Complex Text Transformation

Apply multiple transformations in sequence using chaining.

```javascript
// Get text content
var content = phantom.maps.channel.get("content");

// Complex transformation chain
var transformed = phantom.strings.chain(content)
    .trim()
    .replaceAll("oldTerm", "newTerm")
    .toLowerCase()
    .capitalize()
    .substring(0, 100)  // Limit to 100 chars
    .value();

phantom.maps.channel.save("transformedContent", transformed);
```

## Related Topics

- [Getting Started](Getting-Started) - Learn the basics
- [String Operations](String-Operations) - All string utilities including chaining API
- [Number Operations](Number-Operations) - All number utilities
- [JSON Operations](JSON-Operations) - All JSON utilities
- [Map Operations](Map-Operations) - Working with maps
- [Best Practices](Best-Practices) - Tips and patterns

---

**Note:** Examples 15-20 demonstrate the new chaining API (v0.1.5-BETA). The chaining API provides a cleaner syntax for multiple string operations. Traditional function calls still work and are shown as alternatives in earlier examples.

