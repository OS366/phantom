# Examples

Real-world examples demonstrating how to use Phantom.js in OIE scripting scenarios.

## Example 1: User Data Processing

Process and validate user input data.

```javascript
// Get user input
var firstName = phantom.maps.channel.get("firstName");
var lastName = phantom.maps.channel.get("lastName");
var email = phantom.maps.channel.get("email");

// Clean and normalize names
var cleanFirstName = phantom.strings.operation.capitalize(
    phantom.strings.operation.trim(firstName)
);

var cleanLastName = phantom.strings.operation.capitalize(
    phantom.strings.operation.trim(lastName)
);

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

// Validation pipeline
if (!phantom.strings.operation.isBlank(rawData)) {
    // Step 1: Trim whitespace
    var step1 = phantom.strings.operation.trim(rawData);
    
    // Step 2: Remove special characters
    var step2 = phantom.strings.operation.remove(step1, "@");
    var step3 = phantom.strings.operation.remove(step2, "#");
    
    // Step 3: Normalize case
    var step4 = phantom.strings.operation.toLowerCase(step3);
    
    // Step 4: Capitalize
    var cleaned = phantom.strings.operation.capitalize(step4);
    
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

// Replace placeholders
var step1 = phantom.strings.operation.replaceAll(content, "${name}", "John");
var step2 = phantom.strings.operation.replaceAll(step1, "${date}", "2024-01-15");
var step3 = phantom.strings.operation.replaceAll(step2, "${company}", "Acme Corp");

// Save processed content
phantom.maps.channel.save("processedContent", step3);
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
    
    // Process data
    var processed = phantom.strings.operation.trim(input);
    var upper = phantom.strings.operation.toUpperCase(processed);
    
    // Save result
    phantom.maps.channel.save("result", upper);
    
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
    
    // Transform value (example: uppercase strings)
    if (phantom.strings.operation.isBlank(value) === false) {
        var transformed = phantom.strings.operation.toUpperCase(
            phantom.strings.operation.trim(value)
        );
        processed = phantom.json.operation.set(processed, key, transformed);
    }
}

// Save processed data
phantom.maps.channel.save("processedData", 
    phantom.json.operation.stringify(processed));
```

## Example 26: Patient Data Processing Pipeline (NEW in v0.1.6-BETA)

Process patient medical records, calculate insurance coverage, and determine patient responsibility using chaining API.

```javascript
// Get raw patient data
var rawPatientData = phantom.maps.channel.get("rawPatientData");

// Process patient name
var patientName = phantom.strings.chain(rawPatientData.patientName)
    .trim()
    .toLowerCase()
    .capitalize()
    .replaceAll("  ", " ")
    .value();

// Process email
var email = phantom.strings.chain(rawPatientData.email)
    .trim()
    .toLowerCase()
    .value();

// Process medical records
var medicalRecords = rawPatientData.records || [];
var totalCharges = 0;
var processedRecords = [];

for (var i = 0; i < medicalRecords.length; i++) {
    var record = medicalRecords[i];
    
    // Process procedure name
    var procedureName = phantom.strings.chain(record.procedureName)
        .trim()
        .capitalize()
        .value();
    
    // Process charge amount
    var charge = phantom.strings.chain(record.charge)
        .trim()
        .remove("$")
        .remove(",")
        .toNumberChain()
        .round(2)
        .clamp(0, 999999.99)
        .value();
    
    // Process quantity
    var quantity = phantom.strings.chain(record.quantity)
        .trim()
        .toNumberChain()
        .round(0)
        .clamp(1, 100)
        .value();
    
    // Calculate line total
    var lineTotal = phantom.numbers.chain(charge)
        .multiply(quantity)
        .round(2)
        .value();
    
    // Add to total charges
    totalCharges = phantom.numbers.chain(totalCharges)
        .add(lineTotal)
        .round(2)
        .value();
    
    processedRecords.push({
        procedure: procedureName,
        charge: charge,
        quantity: quantity,
        total: lineTotal
    });
}

// Calculate insurance coverage (80% coverage rate)
var coverageRate = 0.80;
var coveredAmount = phantom.numbers.chain(totalCharges)
    .multiply(coverageRate)
    .round(2)
    .value();

// Calculate patient responsibility
var patientResponsibility = phantom.numbers.chain(totalCharges)
    .subtract(coveredAmount)
    .round(2)
    .value();

// Format patient ID
var patientId = phantom.strings.chain(rawPatientData.patientId)
    .trim()
    .toUpperCase()
    .leftPad("0", 10)
    .value();

// Save processed data
phantom.maps.channel.save("patientId", patientId);
phantom.maps.channel.save("patientName", patientName);
phantom.maps.channel.save("totalCharges", totalCharges);
phantom.maps.channel.save("coveredAmount", coveredAmount);
phantom.maps.channel.save("patientResponsibility", patientResponsibility);
```

## Example 27: Patient Demographics Normalization (NEW in v0.1.6-BETA)

Normalize and validate patient demographics including MRN, insurance ID, and date of birth.

```javascript
// Get raw patient demographics
var rawPatientData = phantom.maps.channel.get("rawPatientData");

// Normalize first name
var firstName = phantom.strings.chain(rawPatientData.firstName)
    .trim()
    .toLowerCase()
    .capitalize()
    .remove("'")
    .replaceAll("  ", " ")
    .value();

// Normalize last name
var lastName = phantom.strings.chain(rawPatientData.lastName)
    .trim()
    .toLowerCase()
    .capitalize()
    .remove("'")
    .replaceAll("  ", " ")
    .value();

// Normalize phone number
var phoneRaw = phantom.strings.chain(rawPatientData.phone)
    .remove(" ")
    .remove("-")
    .remove("(")
    .remove(")")
    .remove(".")
    .value();

// Format phone: (123) 456-7890
var phoneFormatted = "(" + phoneRaw.substring(0, 3) + ") " + 
    phoneRaw.substring(3, 6) + "-" + phoneRaw.substring(6);

// Normalize and validate age
var age = phantom.strings.chain(rawPatientData.age)
    .trim()
    .toNumberChain()
    .clamp(0, 150)
    .round(0)
    .value();

// Normalize date of birth
var dateOfBirth = phantom.strings.chain(rawPatientData.dateOfBirth)
    .trim()
    .substring(0, 10)
    .value();

// Normalize MRN (Medical Record Number)
var mrn = phantom.strings.chain(rawPatientData.mrn)
    .trim()
    .toUpperCase()
    .remove("-")
    .remove(" ")
    .leftPad("0", 10)
    .value();

// Normalize insurance ID
var insuranceId = phantom.strings.chain(rawPatientData.insuranceId)
    .trim()
    .toUpperCase()
    .remove("-")
    .remove(" ")
    .value();

// Save normalized data
phantom.maps.channel.save("firstName", firstName);
phantom.maps.channel.save("lastName", lastName);
phantom.maps.channel.save("phone", phoneFormatted);
phantom.maps.channel.save("age", age);
phantom.maps.channel.save("dateOfBirth", dateOfBirth);
phantom.maps.channel.save("mrn", mrn);
phantom.maps.channel.save("insuranceId", insuranceId);
```

## Example 28: Lab Results Processing Pipeline (NEW in v0.1.6-BETA)

Process laboratory test results, validate against reference ranges, and detect abnormal values.

```javascript
// Get raw lab data
var rawLabData = phantom.maps.channel.get("rawLabData");

var labTests = rawLabData.tests || [];
var processedTests = [];
var abnormalResults = [];

for (var i = 0; i < labTests.length; i++) {
    var test = labTests[i];
    
    // Normalize test name
    var testName = phantom.strings.chain(test.testName)
        .trim()
        .capitalize()
        .replaceAll("  ", " ")
        .value();
    
    // Process test value
    var testValue = phantom.strings.chain(test.value)
        .trim()
        .remove(",")
        .toNumberChain()
        .round(2)
        .value();
    
    // Process reference range
    var refMin = phantom.strings.chain(test.referenceMin)
        .trim()
        .toNumberChain()
        .round(2)
        .value();
    
    var refMax = phantom.strings.chain(test.referenceMax)
        .trim()
        .toNumberChain()
        .round(2)
        .value();
    
    // Check if value is within normal range
    var isNormal = phantom.numbers.chain(testValue)
        .between(refMin, refMax);
    
    // Calculate deviation if abnormal
    var deviation = null;
    if (!isNormal) {
        if (testValue < refMin) {
            deviation = phantom.numbers.chain(refMin)
                .subtract(testValue)
                .round(2)
                .value();
        } else {
            deviation = phantom.numbers.chain(testValue)
                .subtract(refMax)
                .round(2)
                .value();
        }
    }
    
    // Format test code
    var testCode = phantom.strings.chain(test.testCode)
        .trim()
        .toUpperCase()
        .remove("-")
        .remove(" ")
        .leftPad("0", 6)
        .value();
    
    var processedTest = {
        testCode: testCode,
        testName: testName,
        value: testValue,
        referenceMin: refMin,
        referenceMax: refMax,
        isNormal: isNormal,
        deviation: deviation,
        status: isNormal ? "Normal" : (testValue < refMin ? "Low" : "High")
    };
    
    processedTests.push(processedTest);
    
    if (!isNormal) {
        abnormalResults.push(processedTest);
    }
}

// Save processed results
phantom.maps.channel.save("processedTests", processedTests);
phantom.maps.channel.save("abnormalResults", abnormalResults);
```

## Example 29: Medication/Prescription Processing Pipeline (NEW in v0.1.6-BETA)

Process medication data with NDC codes, calculate dosages, and determine days supply.

```javascript
// Get raw medication data
var rawMedicationData = phantom.maps.channel.get("rawMedicationData");

var medications = rawMedicationData.medications || [];
var processedMedications = [];
var totalDailyDosage = 0;

for (var i = 0; i < medications.length; i++) {
    var medication = medications[i];
    
    // Normalize medication name
    var medicationName = phantom.strings.chain(medication.name)
        .trim()
        .capitalize()
        .replaceAll("  ", " ")
        .value();
    
    // Normalize NDC code (National Drug Code)
    var ndcCode = phantom.strings.chain(medication.ndcCode)
        .trim()
        .remove("-")
        .remove(" ")
        .leftPad("0", 11)
        .value();
    
    // Process dosage per unit
    var dosagePerUnit = phantom.strings.chain(medication.dosagePerUnit)
        .trim()
        .toNumberChain()
        .round(2)
        .clamp(0, 10000)
        .value();
    
    // Process units per dose
    var unitsPerDose = phantom.strings.chain(medication.unitsPerDose)
        .trim()
        .toNumberChain()
        .round(0)
        .clamp(1, 10)
        .value();
    
    // Process frequency per day
    var frequencyPerDay = phantom.strings.chain(medication.frequencyPerDay)
        .trim()
        .toNumberChain()
        .round(0)
        .clamp(1, 6)
        .value();
    
    // Calculate total daily dosage
    var dailyDosage = phantom.numbers.chain(dosagePerUnit)
        .multiply(unitsPerDose)
        .multiply(frequencyPerDay)
        .round(2)
        .value();
    
    // Add to total
    totalDailyDosage = phantom.numbers.chain(totalDailyDosage)
        .add(dailyDosage)
        .round(2)
        .value();
    
    // Process quantity
    var quantity = phantom.strings.chain(medication.quantity)
        .trim()
        .toNumberChain()
        .round(0)
        .clamp(1, 1000)
        .value();
    
    // Calculate days supply
    var dailyUnits = phantom.numbers.chain(unitsPerDose)
        .multiply(frequencyPerDay)
        .round(0)
        .value();
    
    var daysSupply = phantom.numbers.chain(quantity)
        .divide(dailyUnits)
        .round(0)
        .value();
    
    // Process cost
    var costPerUnit = phantom.strings.chain(medication.costPerUnit)
        .trim()
        .remove("$")
        .remove(",")
        .toNumberChain()
        .round(2)
        .clamp(0, 9999.99)
        .value();
    
    // Calculate total cost
    var totalCost = phantom.numbers.chain(costPerUnit)
        .multiply(quantity)
        .round(2)
        .value();
    
    // Format prescription number
    var prescriptionNumber = phantom.strings.chain(medication.prescriptionNumber)
        .trim()
        .toUpperCase()
        .remove("-")
        .leftPad("0", 10)
        .value();
    
    processedMedications.push({
        prescriptionNumber: prescriptionNumber,
        ndcCode: ndcCode,
        name: medicationName,
        dailyDosage: dailyDosage,
        quantity: quantity,
        daysSupply: daysSupply,
        totalCost: totalCost
    });
}

// Save processed medications
phantom.maps.channel.save("processedMedications", processedMedications);
phantom.maps.channel.save("totalDailyDosage", totalDailyDosage);
```

## Example 30: Complete Healthcare Data Transformation (NEW in v0.1.6-BETA)

Complete end-to-end healthcare data transformation combining all pipelines.

```javascript
// Get raw healthcare data from channel map
var rawHealthcareData = phantom.maps.channel.get("rawHealthcareData");

// Step 1: Normalize patient demographics
var demographics = {
    firstName: phantom.strings.chain(rawHealthcareData.firstName)
        .trim().toLowerCase().capitalize().value(),
    lastName: phantom.strings.chain(rawHealthcareData.lastName)
        .trim().toLowerCase().capitalize().value(),
    mrn: phantom.strings.chain(rawHealthcareData.mrn)
        .trim().toUpperCase().remove("-").leftPad("0", 10).value(),
    dateOfBirth: phantom.strings.chain(rawHealthcareData.dateOfBirth)
        .trim().substring(0, 10).value()
};

// Step 2: Process lab results
var labResults = rawHealthcareData.labResults || [];
var processedLabResults = [];
for (var i = 0; i < labResults.length; i++) {
    var test = labResults[i];
    var testValue = phantom.strings.chain(test.value)
        .trim().toNumberChain().round(2).value();
    var isNormal = phantom.numbers.chain(testValue)
        .between(test.referenceMin, test.referenceMax);
    
    processedLabResults.push({
        testName: phantom.strings.chain(test.testName).trim().capitalize().value(),
        value: testValue,
        isNormal: isNormal
    });
}

// Step 3: Process medications
var medications = rawHealthcareData.medications || [];
var totalDailyDosage = 0;
for (var j = 0; j < medications.length; j++) {
    var med = medications[j];
    var dailyDosage = phantom.strings.chain(med.dosagePerUnit)
        .trim().toNumberChain()
        .multiply(med.unitsPerDose)
        .multiply(med.frequencyPerDay)
        .round(2).value();
    
    totalDailyDosage = phantom.numbers.chain(totalDailyDosage)
        .add(dailyDosage)
        .round(2).value();
}

// Step 4: Calculate billing totals
var totalCharges = phantom.strings.chain(rawHealthcareData.totalCharges)
    .trim().remove("$").remove(",")
    .toNumberChain().round(2).value();

var coveredAmount = phantom.numbers.chain(totalCharges)
    .multiply(0.80)  // 80% insurance coverage
    .round(2).value();

var patientResponsibility = phantom.numbers.chain(totalCharges)
    .subtract(coveredAmount)
    .round(2).value();

// Step 5: Format summary
var summary = phantom.strings.chain("")
    .replace("", "Patient: " + demographics.firstName + " " + demographics.lastName + "\n")
    .replace("", "MRN: " + demographics.mrn + "\n")
    .replace("", "Lab Tests: " + processedLabResults.length + "\n")
    .replace("", "Medications: " + medications.length + "\n")
    .replace("", "Total Daily Dosage: " + totalDailyDosage.toFixed(2) + "mg/day\n")
    .replace("", "Total Charges: $" + totalCharges.toFixed(2) + "\n")
    .replace("", "Patient Responsibility: $" + patientResponsibility.toFixed(2))
    .value();

// Save all processed data
phantom.maps.channel.save("demographics", demographics);
phantom.maps.channel.save("labResults", processedLabResults);
phantom.maps.channel.save("totalDailyDosage", totalDailyDosage);
phantom.maps.channel.save("totalCharges", totalCharges);
phantom.maps.channel.save("patientResponsibility", patientResponsibility);
phantom.maps.channel.save("summary", summary);
```

## Related Topics

- [Getting Started](Getting-Started) - Learn the basics
- [String Operations](String-Operations) - All string utilities including chaining API
- [Number Operations](Number-Operations) - All number utilities including chaining API
- [JSON Operations](JSON-Operations) - All JSON utilities
- [Map Operations](Map-Operations) - Working with maps
- [Best Practices](Best-Practices) - Tips and patterns

