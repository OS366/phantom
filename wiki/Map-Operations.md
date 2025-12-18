# Map Operations

Phantom.js provides access to five types of maps commonly used in OIE scripting.

## Available Maps

1. **Channel Map** - Channel-scoped variables
2. **Global Map** - Global variables across integrations
3. **Connector Map** - Connector-specific variables
4. **Response Map** - Response context variables (read-only in some contexts)
5. **Configuration Map** - Configuration values (read-only)

## Common Operations

All maps (except Configuration) support these operations:

- `save(key, value)` - Save a value
- `get(key)` - Retrieve a value
- `exists(key)` - Check if key exists
- `delete(key)` - Remove a key

## Channel Map

Channel-scoped variables available within the current channel.

```javascript
// Save
phantom.maps.channel.save("userId", "12345");

// Get
var userId = phantom.maps.channel.get("userId");
// Output: "12345"

// Check existence
if (phantom.maps.channel.exists("userId")) {
    // Process user
}

// Delete
phantom.maps.channel.delete("userId");
```

**Use Cases:**
- Temporary data storage within a channel
- Passing data between stages in a flow
- Storing intermediate processing results

## Global Map

Global variables accessible across all integrations.

```javascript
phantom.maps.global.save("systemConfig", "production");
var config = phantom.maps.global.get("systemConfig");
```

**Use Cases:**
- System-wide configuration
- Shared data across multiple integrations
- Global flags and settings

## Connector Map

Connector-specific variables.

```javascript
phantom.maps.connector.save("apiKey", "secret123");
var apiKey = phantom.maps.connector.get("apiKey");
```

**Use Cases:**
- Connector-specific configuration
- API credentials
- Connector state management

## Response Map

Response context variables (only available in response context).

```javascript
// Only works in response context
phantom.maps.response.save("status", "success");
var status = phantom.maps.response.get("status");
```

**Important:** This map is only available when `responseMap` is defined in the context. Attempting to use it outside response context will throw an error.

**Use Cases:**
- Storing response data
- Response status information
- Response metadata

## Configuration Map (Read-Only)

Configuration values from the integration configuration.

```javascript
// Get configuration value
var timeout = phantom.maps.configuration.get("timeout");

// Check if exists
if (phantom.maps.configuration.exists("timeout")) {
    // Use timeout value
}

// Save/Delete operations are NOT allowed
phantom.maps.configuration.save("key", "value");
// Throws: Error("Invalid operation")
```

**Use Cases:**
- Reading configuration parameters
- Accessing integration settings
- Retrieving environment-specific values

## Best Practices

### 1. Use Appropriate Map Types

```javascript
// Use channel map for temporary data
phantom.maps.channel.save("tempData", value);

// Use global map for shared data
phantom.maps.global.save("sharedConfig", config);

// Use connector map for connector-specific data
phantom.maps.connector.save("connectorState", state);
```

### 2. Check Existence Before Use

```javascript
if (phantom.maps.channel.exists("userId")) {
    var userId = phantom.maps.channel.get("userId");
    // Process user
} else {
    // Handle missing data
}
```

### 3. Clean Up Temporary Data

```javascript
// After processing
phantom.maps.channel.delete("tempData");
```

### 4. Handle Errors

```javascript
try {
    var value = phantom.maps.channel.get("key");
} catch (e) {
    // Handle error: "Invalid operation"
    logger.error("Failed to get value: " + e.message);
}
```

## Common Patterns

### Pattern 1: Data Pipeline

```javascript
// Stage 1: Save raw data
phantom.maps.channel.save("rawData", inputData);

// Stage 2: Process and save
var processed = processData(phantom.maps.channel.get("rawData"));
phantom.maps.channel.save("processedData", processed);

// Stage 3: Use processed data
var result = phantom.maps.channel.get("processedData");
```

### Pattern 2: Configuration-Driven Logic

```javascript
var mode = phantom.maps.configuration.get("mode");
if (mode === "production") {
    // Production logic
} else {
    // Development logic
}
```

### Pattern 3: Conditional Processing

```javascript
if (phantom.maps.channel.exists("skipProcessing")) {
    // Skip processing
} else {
    // Normal processing
    phantom.maps.channel.save("result", processData());
}
```

## Limitations

⚠️ **Drag and Drop:** Variables saved using `phantom.maps.*` are not available for drag-and-drop in the Destination Mappings section. This is an OIE editor limitation.

## Related Topics

- [String Operations](String-Operations) - Process string data from maps
- [Number Operations](Number-Operations) - Process numeric data from maps
- [Examples](Examples) - Real-world map usage examples

