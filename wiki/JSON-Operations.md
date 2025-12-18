# JSON Operations

Phantom.js provides 14 JSON operations for parsing, manipulating, and querying JSON objects.

## Table of Contents

- [Basic Operations](#basic-operations)
- [Path Operations](#path-operations)
- [Object Operations](#object-operations)
- [Validation Operations](#validation-operations)

## Basic Operations

### parse

Parse a JSON string to an object.

```javascript
phantom.json.operation.parse('{"name":"John","age":30}');
// Output: { name: "John", age: 30 }

phantom.json.operation.parse('[1,2,3]');
// Output: [1, 2, 3]

phantom.json.operation.parse('"hello"');
// Output: "hello"

phantom.json.operation.parse('invalid json');
// Throws: Error("Invalid operation")
```

### stringify

Convert an object to JSON string.

```javascript
phantom.json.operation.stringify({ name: "John", age: 30 });
// Output: '{"name":"John","age":30}'

phantom.json.operation.stringify([1, 2, 3]);
// Output: '[1,2,3]'

phantom.json.operation.stringify(null);
// Throws: Error("Invalid operation")
```

## Path Operations

### get

Get a value by key path. Supports nested keys using dot notation.

```javascript
var obj = { user: { name: "John", age: 30 } };

phantom.json.operation.get(obj, "user.name");
// Output: "John"

phantom.json.operation.get(obj, "user.age");
// Output: 30

phantom.json.operation.get(obj, "user.city");
// Output: null (key doesn't exist)

// Simple key
phantom.json.operation.get({ name: "John" }, "name");
// Output: "John"
```

### set

Set a value by key path. Returns a new object (doesn't modify original).

```javascript
var obj = { name: "John" };

var result = phantom.json.operation.set(obj, "age", 30);
// Output: { name: "John", age: 30 }
// Original obj is unchanged

// Nested path - creates structure if needed
var result2 = phantom.json.operation.set({}, "user.name", "John");
// Output: { user: { name: "John" } }

// Update nested value
var obj3 = { user: { name: "John" } };
var result3 = phantom.json.operation.set(obj3, "user.age", 30);
// Output: { user: { name: "John", age: 30 } }
```

### has

Check if a key path exists.

```javascript
var obj = { user: { name: "John" } };

phantom.json.operation.has(obj, "user.name");
// Output: true

phantom.json.operation.has(obj, "user.age");
// Output: false

phantom.json.operation.has(obj, "name");
// Output: false (not at root level)
```

### remove

Remove a key from an object. Returns a new object (doesn't modify original).

```javascript
var obj = { name: "John", age: 30 };

var result = phantom.json.operation.remove(obj, "age");
// Output: { name: "John" }
// Original obj is unchanged

// Remove nested key
var obj2 = { user: { name: "John", age: 30 } };
var result2 = phantom.json.operation.remove(obj2, "user.age");
// Output: { user: { name: "John" } }
```

## Object Operations

### keys

Get all keys from an object.

```javascript
phantom.json.operation.keys({ name: "John", age: 30, city: "NYC" });
// Output: ["name", "age", "city"]

phantom.json.operation.keys({});
// Output: []

phantom.json.operation.keys([1, 2, 3]);
// Throws: Error("Invalid operation") - arrays not supported
```

### values

Get all values from an object.

```javascript
phantom.json.operation.values({ name: "John", age: 30 });
// Output: ["John", 30]

phantom.json.operation.values({});
// Output: []
```

### size

Get the size (number of keys) of an object or length of an array.

```javascript
phantom.json.operation.size({ name: "John", age: 30 });
// Output: 2

phantom.json.operation.size({});
// Output: 0

phantom.json.operation.size([1, 2, 3]);
// Output: 3

phantom.json.operation.size([]);
// Output: 0
```

### merge

Merge two objects. Second object overwrites first object's values.

```javascript
var obj1 = { name: "John", age: 30 };
var obj2 = { city: "NYC", country: "USA" };

phantom.json.operation.merge(obj1, obj2);
// Output: { name: "John", age: 30, city: "NYC", country: "USA" }

// Overwrite existing values
var obj3 = { name: "John", age: 30 };
var obj4 = { age: 31 };
phantom.json.operation.merge(obj3, obj4);
// Output: { name: "John", age: 31 }
```

## Validation Operations

### isEmpty

Check if an object or array is empty.

```javascript
phantom.json.operation.isEmpty({});
// Output: true

phantom.json.operation.isEmpty({ name: "John" });
// Output: false

phantom.json.operation.isEmpty([]);
// Output: true

phantom.json.operation.isEmpty([1, 2, 3]);
// Output: false

phantom.json.operation.isEmpty(null);
// Output: true
```

### isArray

Check if a value is an array.

```javascript
phantom.json.operation.isArray([1, 2, 3]);
// Output: true

phantom.json.operation.isArray([]);
// Output: true

phantom.json.operation.isArray({});
// Output: false

phantom.json.operation.isArray(null);
// Output: false
```

### isObject

Check if a value is an object (not an array).

```javascript
phantom.json.operation.isObject({ name: "John" });
// Output: true

phantom.json.operation.isObject({});
// Output: true

phantom.json.operation.isObject([1, 2, 3]);
// Output: false

phantom.json.operation.isObject(null);
// Output: false
```

## Common Patterns

### Pattern 1: Parse and Extract Data

```javascript
// Parse JSON string from map
var jsonString = phantom.maps.channel.get("jsonData");
var obj = phantom.json.operation.parse(jsonString);

// Extract nested values
var userName = phantom.json.operation.get(obj, "user.name");
var userAge = phantom.json.operation.get(obj, "user.age");

phantom.maps.channel.save("userName", userName);
phantom.maps.channel.save("userAge", userAge);
```

### Pattern 2: Transform JSON Structure

```javascript
// Get original object
var original = phantom.maps.channel.get("originalData");

// Create new structure
var transformed = phantom.json.operation.set({}, "newField", 
    phantom.json.operation.get(original, "oldField"));

// Save transformed data
phantom.maps.channel.save("transformedData", 
    phantom.json.operation.stringify(transformed));
```

### Pattern 3: Merge Configuration

```javascript
// Get base configuration
var baseConfig = phantom.json.operation.parse(
    phantom.maps.configuration.get("baseConfig")
);

// Get override configuration
var overrides = phantom.json.operation.parse(
    phantom.maps.channel.get("overrides")
);

// Merge (overrides take precedence)
var finalConfig = phantom.json.operation.merge(baseConfig, overrides);

// Save final configuration
phantom.maps.channel.save("finalConfig", 
    phantom.json.operation.stringify(finalConfig));
```

### Pattern 4: Validate and Process JSON

```javascript
var jsonString = phantom.maps.channel.get("input");

try {
    var obj = phantom.json.operation.parse(jsonString);
    
    // Validate structure
    if (phantom.json.operation.has(obj, "requiredField") && 
        !phantom.json.operation.isEmpty(obj)) {
        
        // Process valid JSON
        var processed = processData(obj);
        phantom.maps.channel.save("result", 
            phantom.json.operation.stringify(processed));
    }
} catch (e) {
    // Handle invalid JSON
    phantom.maps.channel.save("error", "Invalid JSON format");
}
```

### Pattern 5: Dynamic Key Access

```javascript
var obj = phantom.json.operation.parse(
    phantom.maps.channel.get("data")
);

// Get all keys
var keys = phantom.json.operation.keys(obj);

// Process each key
for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = phantom.json.operation.get(obj, key);
    
    // Process key-value pair
    processKeyValue(key, value);
}
```

## Best Practices

1. **Always validate JSON before parsing** - Use try-catch blocks
2. **Use dot notation for nested paths** - Easier than manual traversal
3. **Remember operations are immutable** - `set` and `remove` return new objects
4. **Check existence before getting** - Use `has` to avoid null values
5. **Stringify before saving to maps** - Maps store strings, not objects

## Related Topics

- [String Operations](String-Operations) - Process JSON strings
- [Map Operations](Map-Operations) - Store and retrieve JSON data
- [Examples](Examples) - Real-world JSON processing examples

