/**
 * Complex Healthcare Data Transformation Pipeline Example
 * 
 * NOTE: Full examples with detailed explanations are available in the wiki:
 * https://github.com/OS366/phantom.wiki/blob/master/Examples.md
 * 
 * See Examples 26-30 for complete healthcare data transformation pipelines:
 * - Example 26: Patient Data Processing Pipeline
 * - Example 27: Patient Demographics Normalization
 * - Example 28: Lab Results Processing Pipeline
 * - Example 29: Medication/Prescription Processing Pipeline
 * - Example 30: Complete Healthcare Data Transformation
 * 
 * This file contains simplified reference implementations.
 */

// ============================================
// EXAMPLE 1: Patient Data Processing Pipeline
// ============================================

function processPatientDataPipeline(rawPatientData) {
  /**
   * Input: Raw patient data from external system
   * Output: Cleaned, validated, and formatted patient data
   */
  
  // Step 1: Extract and clean patient name
  var patientName = phantom.strings.chain(rawPatientData.patientName)
    .trim()                    // Remove whitespace
    .toLowerCase()             // Normalize case
    .capitalize()              // Capitalize first letter
    .replaceAll("  ", " ")     // Remove double spaces
    .value();
  
  // Step 2: Clean and validate email
  var email = phantom.strings.chain(rawPatientData.email)
    .trim()
    .toLowerCase()
    .value();
  
  // Step 3: Process medical records and calculate metrics
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
    
    // Process charge amount (handle string or number)
    var charge = phantom.strings.chain(record.charge)
      .trim()
      .remove("$")
      .remove(",")
      .toNumberChain()         // Convert to number chain
      .round(2)                // Round to 2 decimals
      .clamp(0, 999999.99)     // Reasonable charge range
      .value();
    
    // Process quantity (number of procedures)
    var quantity = phantom.strings.chain(record.quantity)
      .trim()
      .toNumberChain()
      .round(0)                // Whole numbers only
      .clamp(1, 100)           // Ensure between 1-100
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
  
  // Step 4: Calculate insurance coverage (80% coverage rate)
  var coverageRate = 0.80;
  var coveredAmount = phantom.numbers.chain(totalCharges)
    .multiply(coverageRate)
    .round(2)
    .value();
  
  // Step 5: Calculate patient responsibility
  var patientResponsibility = phantom.numbers.chain(totalCharges)
    .subtract(coveredAmount)
    .round(2)
    .value();
  
  // Step 6: Format patient ID
  var patientId = phantom.strings.chain(rawPatientData.patientId)
    .trim()
    .toUpperCase()
    .leftPad("0", 10)          // Pad to 10 digits
    .value();
  
  // Step 7: Format total for display
  var formattedTotal = phantom.numbers.chain(totalCharges)
    .toFixed(2)               // Returns string chain
    .leftPad("$", 1)          // Add currency symbol
    .value();
  
  // Step 8: Create formatted patient summary
  var patientSummary = phantom.strings.chain("")
    .replace("", "Patient ID: " + patientId + "\n")
    .replace("", "Patient: " + patientName + "\n")
    .replace("", "Email: " + email + "\n")
    .replace("", "Records: " + processedRecords.length + "\n")
    .replace("", "Total Charges: $" + totalCharges.toFixed(2) + "\n")
    .replace("", "Insurance Coverage: $" + coveredAmount.toFixed(2) + "\n")
    .replace("", "Patient Responsibility: $" + patientResponsibility.toFixed(2) + "\n")
    .replace("", "Total: " + formattedTotal)
    .value();
  
  return {
    patientId: patientId,
    patientName: patientName,
    email: email,
    records: processedRecords,
    totalCharges: totalCharges,
    coveredAmount: coveredAmount,
    patientResponsibility: patientResponsibility,
    formattedTotal: formattedTotal,
    summary: patientSummary
  };
}

// ============================================
// EXAMPLE 2: Patient Demographics Normalization Pipeline
// ============================================

function normalizePatientDemographics(rawPatientData) {
  /**
   * Input: Raw patient demographics from multiple sources
   * Output: Normalized and validated patient demographics
   */
  
  // Normalize first name
  var firstName = phantom.strings.chain(rawPatientData.firstName)
    .trim()
    .toLowerCase()
    .capitalize()
    .remove("'")               // Remove apostrophes
    .replaceAll("  ", " ")     // Remove double spaces
    .value();
  
  // Normalize last name
  var lastName = phantom.strings.chain(rawPatientData.lastName)
    .trim()
    .toLowerCase()
    .capitalize()
    .remove("'")
    .replaceAll("  ", " ")
    .value();
  
  // Create full name
  var fullName = phantom.strings.chain(firstName)
    .replace("", firstName + " " + lastName)
    .trim()
    .value();
  
  // Normalize phone number (remove all non-digits, then format)
  var phoneRaw = phantom.strings.chain(rawPatientData.phone)
    .remove(" ")
    .remove("-")
    .remove("(")
    .remove(")")
    .remove(".")
    .value();
  
  // Format phone: (123) 456-7890
  var phoneFormatted = phantom.strings.chain(phoneRaw)
    .substring(0, 3)
    .replace("", "(")
    .replace("", phoneRaw.substring(0, 3) + ") " + phoneRaw.substring(3, 6) + "-" + phoneRaw.substring(6))
    .value();
  
  // Normalize and validate age
  var age = phantom.strings.chain(rawPatientData.age)
    .trim()
    .toNumberChain()
    .clamp(0, 150)             // Valid age range for healthcare
    .round(0)
    .value();
  
  // Normalize date of birth (format: YYYY-MM-DD)
  var dateOfBirth = phantom.strings.chain(rawPatientData.dateOfBirth)
    .trim()
    .substring(0, 10)          // Ensure YYYY-MM-DD format
    .value();
  
  // Normalize address
  var address = phantom.strings.chain(rawPatientData.address)
    .trim()
    .capitalize()
    .replaceAll("  ", " ")
    .value();
  
  // Normalize city
  var city = phantom.strings.chain(rawPatientData.city)
    .trim()
    .toLowerCase()
    .capitalize()
    .value();
  
  // Normalize state (uppercase, 2 letters)
  var state = phantom.strings.chain(rawPatientData.state)
    .trim()
    .toUpperCase()
    .substring(0, 2)
    .value();
  
  // Normalize zip code (5 digits, pad with zeros)
  var zipCode = phantom.strings.chain(rawPatientData.zipCode)
    .trim()
    .remove("-")
    .substring(0, 5)
    .leftPad("0", 5)
    .value();
  
  // Normalize medical record number (MRN)
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
  
  // Format patient identifier
  var patientIdentifier = phantom.strings.chain(mrn)
    .substring(0, 6)
    .replace("", lastName.substring(0, 3).toUpperCase())
    .replace("", mrn.substring(0, 6) + lastName.substring(0, 3).toUpperCase() + age)
    .leftPad("0", 12)
    .value();
  
  return {
    patientIdentifier: patientIdentifier,
    mrn: mrn,
    firstName: firstName,
    lastName: lastName,
    fullName: fullName,
    phone: phoneFormatted,
    age: age,
    dateOfBirth: dateOfBirth,
    address: address,
    city: city,
    state: state,
    zipCode: zipCode,
    insuranceId: insuranceId
  };
}

// ============================================
// EXAMPLE 3: Lab Results Processing Pipeline
// ============================================

function processLabResults(rawLabData) {
  /**
   * Input: Raw laboratory test results
   * Output: Processed and validated lab results with reference ranges
   */
  
  var labTests = rawLabData.tests || [];
  var processedTests = [];
  var abnormalResults = [];
  var totalTests = 0;
  
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
      .round(2)                // Round to 2 decimals
      .value();
    
    // Process reference range (min)
    var refMin = phantom.strings.chain(test.referenceMin)
      .trim()
      .toNumberChain()
      .round(2)
      .value();
    
    // Process reference range (max)
    var refMax = phantom.strings.chain(test.referenceMax)
      .trim()
      .toNumberChain()
      .round(2)
      .value();
    
    // Check if value is within normal range
    var isNormal = phantom.numbers.chain(testValue)
      .between(refMin, refMax);
    
    // Calculate deviation from normal (if abnormal)
    var deviation = null;
    var deviationPercent = null;
    if (!isNormal) {
      if (testValue < refMin) {
        deviation = phantom.numbers.chain(refMin)
          .subtract(testValue)
          .round(2)
          .value();
        deviationPercent = phantom.numbers.chain(deviation)
          .divide(refMin)
          .multiply(100)
          .round(2)
          .value();
      } else {
        deviation = phantom.numbers.chain(testValue)
          .subtract(refMax)
          .round(2)
          .value();
        deviationPercent = phantom.numbers.chain(deviation)
          .divide(refMax)
          .multiply(100)
          .round(2)
          .value();
      }
    }
    
    // Format test value for display
    var formattedValue = phantom.numbers.chain(testValue)
      .toFixed(2)
      .value();
    
    // Format reference range
    var formattedRange = phantom.strings.chain("")
      .replace("", refMin.toFixed(2) + " - " + refMax.toFixed(2))
      .value();
    
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
      formattedValue: formattedValue,
      referenceMin: refMin,
      referenceMax: refMax,
      formattedRange: formattedRange,
      isNormal: isNormal,
      deviation: deviation,
      deviationPercent: deviationPercent,
      status: isNormal ? "Normal" : (testValue < refMin ? "Low" : "High")
    };
    
    processedTests.push(processedTest);
    
    if (!isNormal) {
      abnormalResults.push(processedTest);
    }
    
    totalTests = phantom.numbers.chain(totalTests)
      .add(1)
      .value();
  }
  
  // Calculate statistics
  var normalCount = phantom.numbers.chain(totalTests)
    .subtract(abnormalResults.length)
    .value();
  
  var abnormalCount = abnormalResults.length;
  
  var normalPercentage = phantom.numbers.chain(normalCount)
    .divide(totalTests)
    .multiply(100)
    .round(2)
    .value();
  
  var abnormalPercentage = phantom.numbers.chain(abnormalCount)
    .divide(totalTests)
    .multiply(100)
    .round(2)
    .value();
  
  return {
    tests: processedTests,
    summary: {
      totalTests: totalTests,
      normalCount: normalCount,
      abnormalCount: abnormalCount,
      normalPercentage: normalPercentage,
      abnormalPercentage: abnormalPercentage
    },
    abnormalResults: abnormalResults
  };
}

// ============================================
// EXAMPLE 4: Medication/Prescription Processing Pipeline
// ============================================

function processMedicationData(rawMedicationData) {
  /**
   * Input: Raw medication/prescription data
   * Output: Processed and validated medication data with dosage calculations
   */
  
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
    
    // Normalize medication code (NDC - National Drug Code)
    var ndcCode = phantom.strings.chain(medication.ndcCode)
      .trim()
      .remove("-")
      .remove(" ")
      .leftPad("0", 11)        // NDC is 11 digits
      .value();
    
    // Process dosage per unit (mg, ml, etc.)
    var dosagePerUnit = phantom.strings.chain(medication.dosagePerUnit)
      .trim()
      .toNumberChain()
      .round(2)
      .clamp(0, 10000)         // Reasonable dosage range
      .value();
    
    // Process units per dose
    var unitsPerDose = phantom.strings.chain(medication.unitsPerDose)
      .trim()
      .toNumberChain()
      .round(0)                // Whole units
      .clamp(1, 10)            // Reasonable range
      .value();
    
    // Process frequency (times per day)
    var frequencyPerDay = phantom.strings.chain(medication.frequencyPerDay)
      .trim()
      .toNumberChain()
      .round(0)
      .clamp(1, 6)             // Reasonable frequency
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
    
    // Process quantity (number of pills/units)
    var quantity = phantom.strings.chain(medication.quantity)
      .trim()
      .toNumberChain()
      .round(0)
      .clamp(1, 1000)          // Reasonable quantity
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
    
    // Process cost per unit
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
    
    // Normalize route of administration
    var route = phantom.strings.chain(medication.route)
      .trim()
      .toLowerCase()
      .capitalize()
      .value();
    
    // Normalize instructions
    var instructions = phantom.strings.chain(medication.instructions)
      .trim()
      .capitalize()
      .replaceAll("  ", " ")
      .wordwrap(80)            // Wrap long instructions
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
      dosagePerUnit: dosagePerUnit,
      unitsPerDose: unitsPerDose,
      frequencyPerDay: frequencyPerDay,
      dailyDosage: dailyDosage,
      quantity: quantity,
      daysSupply: daysSupply,
      costPerUnit: costPerUnit,
      totalCost: totalCost,
      route: route,
      instructions: instructions,
      formattedDosage: dosagePerUnit + "mg x " + unitsPerDose + " units",
      formattedFrequency: frequencyPerDay + " times per day",
      formattedDailyDosage: dailyDosage.toFixed(2) + "mg/day",
      formattedCost: phantom.numbers.chain(totalCost).toFixed(2).leftPad("$", 1).value()
    });
  }
  
  // Format total daily dosage
  var formattedTotalDailyDosage = phantom.numbers.chain(totalDailyDosage)
    .toFixed(2)
    .value() + "mg/day";
  
  // Calculate total medication cost
  var totalMedicationCost = 0;
  for (var j = 0; j < processedMedications.length; j++) {
    totalMedicationCost = phantom.numbers.chain(totalMedicationCost)
      .add(processedMedications[j].totalCost)
      .round(2)
      .value();
  }
  
  var formattedTotalCost = phantom.numbers.chain(totalMedicationCost)
    .toFixed(2)
    .leftPad("$", 1)
    .value();
  
  return {
    medications: processedMedications,
    summary: {
      totalMedications: processedMedications.length,
      totalDailyDosage: totalDailyDosage,
      formattedTotalDailyDosage: formattedTotalDailyDosage,
      totalCost: totalMedicationCost,
      formattedTotalCost: formattedTotalCost
    }
  };
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Example usage for Patient Data Processing
var rawPatient = {
  patientId: "12345",
  patientName: "  john   doe  ",
  email: "  JOHN.DOE@EXAMPLE.COM  ",
  records: [
    { procedureName: "  blood test  ", charge: "50.99", quantity: "1" },
    { procedureName: "  x-ray  ", charge: "150.50", quantity: "2" },
    { procedureName: "  consultation  ", charge: "200.00", quantity: "1" }
  ]
};

var processedPatient = processPatientDataPipeline(rawPatient);
console.log("Processed Patient:", processedPatient);

// Example usage for Patient Demographics Normalization
var rawDemographics = {
  firstName: "  mary  ",
  lastName: "  o'brien  ",
  phone: "(123) 456-7890",
  age: "45",
  dateOfBirth: "1979-01-15",
  address: "  456 health street  ",
  city: "  boston  ",
  state: "ma",
  zipCode: "02101",
  mrn: "MRN-12345",
  insuranceId: "INS-ABC-123"
};

var normalizedDemographics = normalizePatientDemographics(rawDemographics);
console.log("Normalized Demographics:", normalizedDemographics);

// Example usage for Lab Results
var rawLabData = {
  tests: [
    { testCode: "GLU-001", testName: "  glucose  ", value: "95.5", referenceMin: "70", referenceMax: "100" },
    { testCode: "CHOL-002", testName: "  cholesterol  ", value: "220.0", referenceMin: "0", referenceMax: "200" },
    { testCode: "HB-003", testName: "  hemoglobin  ", value: "14.2", referenceMin: "12", referenceMax: "16" }
  ]
};

var processedLabResults = processLabResults(rawLabData);
console.log("Processed Lab Results:", processedLabResults);
console.log("Abnormal Results:", processedLabResults.abnormalResults);

// Example usage for Medication Data
var rawMedication = {
  medications: [
    { 
      prescriptionNumber: "RX-123",
      ndcCode: "12345-678-90",
      name: "  metformin  ",
      dosagePerUnit: "500",
      unitsPerDose: "1",
      frequencyPerDay: "2",
      quantity: "60",
      costPerUnit: "$0.50",
      route: "oral",
      instructions: "Take with food twice daily"
    },
    {
      prescriptionNumber: "RX-456",
      ndcCode: "98765-432-10",
      name: "  lisinopril  ",
      dosagePerUnit: "10",
      unitsPerDose: "1",
      frequencyPerDay: "1",
      quantity: "30",
      costPerUnit: "$1.25",
      route: "oral",
      instructions: "Take once daily in the morning"
    }
  ]
};

var processedMedications = processMedicationData(rawMedication);
console.log("Processed Medications:", processedMedications);
