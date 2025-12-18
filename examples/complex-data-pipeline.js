/**
 * Complex Data Transformation Pipeline Example
 * 
 * This example demonstrates a real-world data transformation pipeline
 * using Phantom.js chaining API for processing order data.
 * 
 * Scenario: Process raw order data from multiple sources, validate,
 * transform, calculate totals, and format for display.
 */

// ============================================
// EXAMPLE 1: Order Processing Pipeline
// ============================================

function processOrderPipeline(rawOrderData) {
  /**
   * Input: Raw order data from external system
   * Output: Cleaned, validated, and formatted order data
   */
  
  // Step 1: Extract and clean customer name
  var customerName = phantom.strings.chain(rawOrderData.customerName)
    .trim()                    // Remove whitespace
    .toLowerCase()             // Normalize case
    .capitalize()              // Capitalize first letter
    .replaceAll("  ", " ")     // Remove double spaces
    .value();
  
  // Step 2: Clean and validate email
  var email = phantom.strings.chain(rawOrderData.email)
    .trim()
    .toLowerCase()
    .value();
  
  // Step 3: Process order items and calculate totals
  var orderItems = rawOrderData.items || [];
  var subtotal = 0;
  var processedItems = [];
  
  for (var i = 0; i < orderItems.length; i++) {
    var item = orderItems[i];
    
    // Process item name
    var itemName = phantom.strings.chain(item.name)
      .trim()
      .capitalize()
      .value();
    
    // Process price (handle string or number)
    var price = phantom.strings.chain(item.price)
      .trim()
      .toNumberChain()         // Convert to number chain
      .round(2)                // Round to 2 decimals
      .value();
    
    // Process quantity
    var quantity = phantom.strings.chain(item.quantity)
      .trim()
      .toNumberChain()
      .round(0)                // Whole numbers only
      .clamp(1, 100)           // Ensure between 1-100
      .value();
    
    // Calculate line total
    var lineTotal = phantom.numbers.chain(price)
      .multiply(quantity)
      .round(2)
      .value();
    
    // Add to subtotal
    subtotal = phantom.numbers.chain(subtotal)
      .add(lineTotal)
      .round(2)
      .value();
    
    processedItems.push({
      name: itemName,
      price: price,
      quantity: quantity,
      total: lineTotal
    });
  }
  
  // Step 4: Calculate tax (8% tax rate)
  var taxRate = 0.08;
  var tax = phantom.numbers.chain(subtotal)
    .multiply(taxRate)
    .round(2)
    .value();
  
  // Step 5: Calculate total
  var total = phantom.numbers.chain(subtotal)
    .add(tax)
    .round(2)
    .value();
  
  // Step 6: Format order ID
  var orderId = phantom.strings.chain(rawOrderData.orderId)
    .trim()
    .toUpperCase()
    .leftPad("0", 8)           // Pad to 8 digits
    .value();
  
  // Step 7: Format total for display
  var formattedTotal = phantom.numbers.chain(total)
    .toFixed(2)               // Returns string chain
    .leftPad("$", 1)          // Add currency symbol
    .value();
  
  // Step 8: Create formatted order summary
  var orderSummary = phantom.strings.chain("")
    .replace("", "Order #" + orderId + "\n")
    .replace("", "Customer: " + customerName + "\n")
    .replace("", "Email: " + email + "\n")
    .replace("", "Items: " + processedItems.length + "\n")
    .replace("", "Subtotal: $" + subtotal.toFixed(2) + "\n")
    .replace("", "Tax: $" + tax.toFixed(2) + "\n")
    .replace("", "Total: " + formattedTotal)
    .value();
  
  return {
    orderId: orderId,
    customerName: customerName,
    email: email,
    items: processedItems,
    subtotal: subtotal,
    tax: tax,
    total: total,
    formattedTotal: formattedTotal,
    summary: orderSummary
  };
}

// ============================================
// EXAMPLE 2: User Data Normalization Pipeline
// ============================================

function normalizeUserData(rawUserData) {
  /**
   * Input: Raw user data from multiple sources
   * Output: Normalized and validated user data
   */
  
  // Normalize first name
  var firstName = phantom.strings.chain(rawUserData.firstName)
    .trim()
    .toLowerCase()
    .capitalize()
    .remove("'")               // Remove apostrophes
    .replaceAll("  ", " ")     // Remove double spaces
    .value();
  
  // Normalize last name
  var lastName = phantom.strings.chain(rawUserData.lastName)
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
  var phoneRaw = phantom.strings.chain(rawUserData.phone)
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
  var age = phantom.strings.chain(rawUserData.age)
    .trim()
    .toNumberChain()
    .clamp(18, 120)            // Valid age range
    .round(0)
    .value();
  
  // Normalize address
  var address = phantom.strings.chain(rawUserData.address)
    .trim()
    .capitalize()
    .replaceAll("  ", " ")
    .value();
  
  // Normalize city
  var city = phantom.strings.chain(rawUserData.city)
    .trim()
    .toLowerCase()
    .capitalize()
    .value();
  
  // Normalize state (uppercase, 2 letters)
  var state = phantom.strings.chain(rawUserData.state)
    .trim()
    .toUpperCase()
    .substring(0, 2)
    .value();
  
  // Normalize zip code (5 digits, pad with zeros)
  var zipCode = phantom.strings.chain(rawUserData.zipCode)
    .trim()
    .remove("-")
    .substring(0, 5)
    .leftPad("0", 5)
    .value();
  
  // Format user ID
  var userId = phantom.strings.chain(firstName)
    .toLowerCase()
    .substring(0, 3)
    .replace("", lastName.toLowerCase().substring(0, 3))
    .replace("", firstName.substring(0, 3).toLowerCase() + lastName.substring(0, 3).toLowerCase() + age)
    .leftPad("0", 8)
    .value();
  
  return {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    fullName: fullName,
    phone: phoneFormatted,
    age: age,
    address: address,
    city: city,
    state: state,
    zipCode: zipCode
  };
}

// ============================================
// EXAMPLE 3: Financial Data Processing Pipeline
// ============================================

function processFinancialData(rawFinancialData) {
  /**
   * Input: Raw financial transaction data
   * Output: Processed and aggregated financial data
   */
  
  var transactions = rawFinancialData.transactions || [];
  var processedTransactions = [];
  var totalDebits = 0;
  var totalCredits = 0;
  
  for (var i = 0; i < transactions.length; i++) {
    var tx = transactions[i];
    
    // Normalize transaction description
    var description = phantom.strings.chain(tx.description)
      .trim()
      .capitalize()
      .replaceAll("  ", " ")
      .value();
    
    // Process amount
    var amount = phantom.strings.chain(tx.amount)
      .trim()
      .remove("$")
      .remove(",")
      .toNumberChain()
      .abs()                   // Always positive
      .round(2)
      .value();
    
    // Determine transaction type
    var isDebit = phantom.strings.chain(tx.type)
      .toLowerCase()
      .find("debit");
    
    // Format amount with sign
    var signedAmount = isDebit 
      ? phantom.numbers.chain(amount).multiply(-1).value()
      : amount;
    
    // Format amount for display
    var formattedAmount = phantom.numbers.chain(Math.abs(amount))
      .toFixed(2)
      .leftPad("$", 1)
      .value();
    
    if (isDebit) {
      formattedAmount = "-" + formattedAmount;
      totalDebits = phantom.numbers.chain(totalDebits)
        .add(amount)
        .round(2)
        .value();
    } else {
      totalCredits = phantom.numbers.chain(totalCredits)
        .add(amount)
        .round(2)
        .value();
    }
    
    // Format transaction date
    var date = phantom.strings.chain(tx.date)
      .trim()
      .substring(0, 10)        // YYYY-MM-DD format
      .value();
    
    // Format transaction ID
    var txId = phantom.strings.chain(tx.id)
      .trim()
      .toUpperCase()
      .leftPad("0", 10)
      .value();
    
    processedTransactions.push({
      id: txId,
      date: date,
      description: description,
      amount: signedAmount,
      formattedAmount: formattedAmount,
      type: isDebit ? "debit" : "credit"
    });
  }
  
  // Calculate net balance
  var netBalance = phantom.numbers.chain(totalCredits)
    .subtract(totalDebits)
    .round(2)
    .value();
  
  // Format totals
  var formattedDebits = phantom.numbers.chain(totalDebits)
    .toFixed(2)
    .leftPad("$", 1)
    .value();
  
  var formattedCredits = phantom.numbers.chain(totalCredits)
    .toFixed(2)
    .leftPad("$", 1)
    .value();
  
  var formattedBalance = phantom.numbers.chain(Math.abs(netBalance))
    .toFixed(2)
    .leftPad("$", 1)
    .value();
  
  if (netBalance < 0) {
    formattedBalance = "-" + formattedBalance;
  }
  
  return {
    transactions: processedTransactions,
    summary: {
      totalDebits: totalDebits,
      totalCredits: totalCredits,
      netBalance: netBalance,
      formattedDebits: formattedDebits,
      formattedCredits: formattedCredits,
      formattedBalance: formattedBalance,
      transactionCount: processedTransactions.length
    }
  };
}

// ============================================
// EXAMPLE 4: Product Catalog Processing Pipeline
// ============================================

function processProductCatalog(rawCatalogData) {
  /**
   * Input: Raw product catalog data
   * Output: Processed and enriched product catalog
   */
  
  var products = rawCatalogData.products || [];
  var processedProducts = [];
  var totalValue = 0;
  
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    
    // Normalize product name
    var productName = phantom.strings.chain(product.name)
      .trim()
      .capitalize()
      .replaceAll("  ", " ")
      .value();
    
    // Normalize SKU (Stock Keeping Unit)
    var sku = phantom.strings.chain(product.sku)
      .trim()
      .toUpperCase()
      .remove(" ")
      .remove("-")
      .leftPad("0", 8)
      .value();
    
    // Process price
    var price = phantom.strings.chain(product.price)
      .trim()
      .remove("$")
      .remove(",")
      .toNumberChain()
      .round(2)
      .clamp(0, 999999.99)      // Reasonable price range
      .value();
    
    // Process cost
    var cost = phantom.strings.chain(product.cost)
      .trim()
      .remove("$")
      .remove(",")
      .toNumberChain()
      .round(2)
      .clamp(0, 999999.99)
      .value();
    
    // Calculate margin
    var margin = phantom.numbers.chain(price)
      .subtract(cost)
      .round(2)
      .value();
    
    // Calculate margin percentage
    var marginPercent = phantom.numbers.chain(margin)
      .divide(price)
      .multiply(100)
      .round(2)
      .value();
    
    // Process quantity
    var quantity = phantom.strings.chain(product.quantity)
      .trim()
      .toNumberChain()
      .round(0)
      .clamp(0, 99999)          // Reasonable quantity
      .value();
    
    // Calculate inventory value
    var inventoryValue = phantom.numbers.chain(cost)
      .multiply(quantity)
      .round(2)
      .value();
    
    // Add to total
    totalValue = phantom.numbers.chain(totalValue)
      .add(inventoryValue)
      .round(2)
      .value();
    
    // Normalize category
    var category = phantom.strings.chain(product.category)
      .trim()
      .toLowerCase()
      .capitalize()
      .value();
    
    // Normalize description
    var description = phantom.strings.chain(product.description)
      .trim()
      .capitalize()
      .replaceAll("  ", " ")
      .wordwrap(80)             // Wrap long descriptions
      .value();
    
    // Format product code
    var productCode = phantom.strings.chain(category)
      .toUpperCase()
      .substring(0, 3)
      .replace("", sku)
      .value();
    
    processedProducts.push({
      sku: sku,
      productCode: productCode,
      name: productName,
      category: category,
      description: description,
      price: price,
      cost: cost,
      margin: margin,
      marginPercent: marginPercent,
      quantity: quantity,
      inventoryValue: inventoryValue,
      formattedPrice: phantom.numbers.chain(price).toFixed(2).leftPad("$", 1).value(),
      formattedCost: phantom.numbers.chain(cost).toFixed(2).leftPad("$", 1).value(),
      formattedMargin: phantom.numbers.chain(margin).toFixed(2).leftPad("$", 1).value(),
      formattedInventoryValue: phantom.numbers.chain(inventoryValue).toFixed(2).leftPad("$", 1).value()
    });
  }
  
  // Format total inventory value
  var formattedTotalValue = phantom.numbers.chain(totalValue)
    .toFixed(2)
    .leftPad("$", 1)
    .value();
  
  return {
    products: processedProducts,
    summary: {
      totalProducts: processedProducts.length,
      totalInventoryValue: totalValue,
      formattedTotalValue: formattedTotalValue
    }
  };
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Example usage for Order Processing
var rawOrder = {
  orderId: "12345",
  customerName: "  john   doe  ",
  email: "  JOHN.DOE@EXAMPLE.COM  ",
  items: [
    { name: "  widget a  ", price: "10.99", quantity: "2" },
    { name: "  widget b  ", price: "5.50", quantity: "3" }
  ]
};

var processedOrder = processOrderPipeline(rawOrder);
console.log("Processed Order:", processedOrder);

// Example usage for User Data Normalization
var rawUser = {
  firstName: "  john  ",
  lastName: "  o'brien  ",
  phone: "(123) 456-7890",
  age: "25",
  address: "  123 main street  ",
  city: "  new york  ",
  state: "ny",
  zipCode: "10001"
};

var normalizedUser = normalizeUserData(rawUser);
console.log("Normalized User:", normalizedUser);

// Example usage for Financial Data
var rawFinancial = {
  transactions: [
    { id: "1", date: "2024-12-18", description: "  purchase  ", amount: "$100.50", type: "debit" },
    { id: "2", date: "2024-12-18", description: "  payment  ", amount: "$250.00", type: "credit" }
  ]
};

var processedFinancial = processFinancialData(rawFinancial);
console.log("Processed Financial:", processedFinancial);

// Example usage for Product Catalog
var rawCatalog = {
  products: [
    { name: "  product a  ", sku: "ABC-123", price: "$19.99", cost: "$10.00", quantity: "50", category: "electronics", description: "A great product" },
    { name: "  product b  ", sku: "DEF-456", price: "$29.99", cost: "$15.00", quantity: "30", category: "electronics", description: "Another great product" }
  ]
};

var processedCatalog = processProductCatalog(rawCatalog);
console.log("Processed Catalog:", processedCatalog);

