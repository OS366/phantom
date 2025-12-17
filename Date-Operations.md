# Date Operations

Phantom.js provides comprehensive date and duration operations using Java.time APIs, designed specifically for OIE/Rhino environments.

---

## Overview

Date operations in Phantom.js allow you to:
- Parse and format dates in various formats
- Perform date arithmetic (add/subtract time)
- Compare dates
- Calculate differences between dates
- Work with durations (time spans)

**Requirements:**
- Java 8+ (for Java.time APIs)
- OIE/Rhino environment
- Date operations require Java.time APIs - no browser fallback

---

## Constants

### Date Format Constants

```javascript
phantom.dates.FORMAT.ISO_DATE          // "yyyy-MM-dd"
phantom.dates.FORMAT.ISO_DATETIME      // "yyyy-MM-dd'T'HH:mm:ss"
phantom.dates.FORMAT.ISO_DATETIME_MS   // "yyyy-MM-dd'T'HH:mm:ss.SSS"
phantom.dates.FORMAT.US_DATE           // "MM/dd/yyyy"
phantom.dates.FORMAT.US_DATETIME       // "MM/dd/yyyy HH:mm:ss"
phantom.dates.FORMAT.EU_DATE           // "dd/MM/yyyy"
phantom.dates.FORMAT.EU_DATETIME       // "dd/MM/yyyy HH:mm:ss"
```

### Time Unit Constants

```javascript
phantom.dates.UNIT.DAYS      // "DAYS"
phantom.dates.UNIT.HOURS     // "HOURS"
phantom.dates.UNIT.MINUTES   // "MINUTES"
phantom.dates.UNIT.SECONDS   // "SECONDS"
phantom.dates.UNIT.MILLIS    // "MILLIS"
phantom.dates.UNIT.WEEKS    // "WEEKS"
phantom.dates.UNIT.MONTHS    // "MONTHS"
phantom.dates.UNIT.YEARS    // "YEARS"
```

---

## Date Operations

### now()

Get current datetime.

```javascript
var now = phantom.dates.operation.now();
// Returns: Java LocalDateTime object (current date and time)
```

**Returns:** Java `LocalDateTime` object

**Throws:** Error if Java.time APIs are not available

---

### today()

Get current date (without time).

```javascript
var today = phantom.dates.operation.today();
// Returns: Java LocalDate object (current date)
```

**Returns:** Java `LocalDate` object

**Throws:** Error if Java.time APIs are not available

---

### parse(dateString, format?)

Parse a date string to a LocalDate object.

```javascript
// Parse ISO format (automatic detection)
var date1 = phantom.dates.operation.parse("2024-12-16");

// Parse with specific format
var date2 = phantom.dates.operation.parse("12/16/2024", phantom.dates.FORMAT.US_DATE);
var date3 = phantom.dates.operation.parse("16/12/2024", phantom.dates.FORMAT.EU_DATE);

// Parse with custom format
var date4 = phantom.dates.operation.parse("2024.12.16", "yyyy.MM.dd");
```

**Parameters:**
- `dateString` (String): Date string to parse
- `format` (String, optional): Format pattern (defaults to ISO or common formats)

**Returns:** Java `LocalDate` object

**Throws:** Error if string is null/empty or parsing fails

---

### parseDateTime(dateTimeString, format?)

Parse a datetime string to a LocalDateTime object.

```javascript
// Parse ISO format (automatic detection)
var dt1 = phantom.dates.operation.parseDateTime("2024-12-16T10:30:00");

// Parse with specific format
var dt2 = phantom.dates.operation.parseDateTime("12/16/2024 10:30:00", phantom.dates.FORMAT.US_DATETIME);

// Parse with custom format
var dt3 = phantom.dates.operation.parseDateTime("2024-12-16 10:30:00", "yyyy-MM-dd HH:mm:ss");
```

**Parameters:**
- `dateTimeString` (String): DateTime string to parse
- `format` (String, optional): Format pattern (defaults to ISO or common formats)

**Returns:** Java `LocalDateTime` object

**Throws:** Error if string is null/empty or parsing fails

---

### format(date, format)

Format a date to a string.

```javascript
var date = phantom.dates.operation.parse("2024-12-16");

// Format using constants
var iso = phantom.dates.operation.format(date, phantom.dates.FORMAT.ISO_DATE);
// Output: "2024-12-16"

var us = phantom.dates.operation.format(date, phantom.dates.FORMAT.US_DATE);
// Output: "12/16/2024"

// Format using custom pattern
var custom = phantom.dates.operation.format(date, "dd-MMM-yyyy");
// Output: "16-Dec-2024"
```

**Parameters:**
- `date` (LocalDate or String): Date to format
- `format` (String): Format pattern (required)

**Returns:** Formatted date string

**Throws:** Error if date or format is null/undefined

---

### formatDateTime(dateTime, format)

Format a datetime to a string.

```javascript
var dt = phantom.dates.operation.parseDateTime("2024-12-16T10:30:00");

var formatted = phantom.dates.operation.formatDateTime(dt, phantom.dates.FORMAT.ISO_DATETIME);
// Output: "2024-12-16T10:30:00"
```

**Parameters:**
- `dateTime` (LocalDateTime or String): DateTime to format
- `format` (String): Format pattern (required)

**Returns:** Formatted datetime string

**Throws:** Error if datetime or format is null/undefined

---

### getYear(date)

Get the year from a date.

```javascript
var date = phantom.dates.operation.parse("2024-12-16");
var year = phantom.dates.operation.getYear(date);
// Output: 2024
```

**Returns:** Year as number

---

### getMonth(date)

Get the month from a date (1-12).

```javascript
var date = phantom.dates.operation.parse("2024-12-16");
var month = phantom.dates.operation.getMonth(date);
// Output: 12
```

**Returns:** Month as number (1-12)

---

### getDay(date)

Get the day of month from a date.

```javascript
var date = phantom.dates.operation.parse("2024-12-16");
var day = phantom.dates.operation.getDay(date);
// Output: 16
```

**Returns:** Day of month as number

---

### getDayOfWeek(date)

Get the day of week from a date.

```javascript
var date = phantom.dates.operation.parse("2024-12-16");
var dayOfWeek = phantom.dates.operation.getDayOfWeek(date);
// Output: "MONDAY" (or "TUESDAY", "WEDNESDAY", etc.)
```

**Returns:** Day of week as string (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY)

---

### add(date, amount, unit)

Add time to a date.

```javascript
var date = phantom.dates.operation.parse("2024-12-16");

// Add 30 days
var futureDate = phantom.dates.operation.add(date, 30, phantom.dates.UNIT.DAYS);

// Add 2 months
var futureDate2 = phantom.dates.operation.add(date, 2, phantom.dates.UNIT.MONTHS);

// Add 1 year
var futureDate3 = phantom.dates.operation.add(date, 1, phantom.dates.UNIT.YEARS);
```

**Parameters:**
- `date` (LocalDate or String): Date to add to
- `amount` (Number): Amount to add
- `unit` (String): Unit constant (use `phantom.dates.UNIT.*`)

**Returns:** New LocalDate object (original date is not modified)

**Throws:** Error if date, amount, or unit is null/undefined

---

### subtract(date, amount, unit)

Subtract time from a date.

```javascript
var date = phantom.dates.operation.parse("2024-12-16");

// Subtract 7 days
var pastDate = phantom.dates.operation.subtract(date, 7, phantom.dates.UNIT.DAYS);

// Subtract 1 month
var pastDate2 = phantom.dates.operation.subtract(date, 1, phantom.dates.UNIT.MONTHS);
```

**Parameters:**
- `date` (LocalDate or String): Date to subtract from
- `amount` (Number): Amount to subtract
- `unit` (String): Unit constant (use `phantom.dates.UNIT.*`)

**Returns:** New LocalDate object (original date is not modified)

**Throws:** Error if date, amount, or unit is null/undefined

---

### between(date1, date2, unit)

Calculate the difference between two dates.

```javascript
var date1 = phantom.dates.operation.parse("2024-12-16");
var date2 = phantom.dates.operation.parse("2024-12-26");

// Calculate days between
var days = phantom.dates.operation.between(date1, date2, phantom.dates.UNIT.DAYS);
// Output: 10

// Calculate months between
var months = phantom.dates.operation.between(date1, date2, phantom.dates.UNIT.MONTHS);
// Output: 0
```

**Parameters:**
- `date1` (LocalDate or String): First date
- `date2` (LocalDate or String): Second date
- `unit` (String): Unit constant (use `phantom.dates.UNIT.*`)

**Returns:** Difference as number

**Throws:** Error if dates or unit is null/undefined

---

### isBefore(date1, date2)

Check if date1 is before date2.

```javascript
var date1 = phantom.dates.operation.parse("2024-12-16");
var date2 = phantom.dates.operation.parse("2024-12-26");

var result = phantom.dates.operation.isBefore(date1, date2);
// Output: true
```

**Returns:** Boolean

---

### isAfter(date1, date2)

Check if date1 is after date2.

```javascript
var date1 = phantom.dates.operation.parse("2024-12-26");
var date2 = phantom.dates.operation.parse("2024-12-16");

var result = phantom.dates.operation.isAfter(date1, date2);
// Output: true
```

**Returns:** Boolean

---

### isEqual(date1, date2)

Check if two dates are equal.

```javascript
var date1 = phantom.dates.operation.parse("2024-12-16");
var date2 = phantom.dates.operation.parse("2024-12-16");

var result = phantom.dates.operation.isEqual(date1, date2);
// Output: true
```

**Returns:** Boolean

---

### startOfDay(date)

Get the start of day (00:00:00) for a date.

```javascript
var date = phantom.dates.operation.parse("2024-12-16");
var start = phantom.dates.operation.startOfDay(date);
// Returns: LocalDateTime at 2024-12-16T00:00:00
```

**Returns:** Java `LocalDateTime` object

---

### endOfDay(date)

Get the end of day (23:59:59.999) for a date.

```javascript
var date = phantom.dates.operation.parse("2024-12-16");
var end = phantom.dates.operation.endOfDay(date);
// Returns: LocalDateTime at 2024-12-16T23:59:59.999
```

**Returns:** Java `LocalDateTime` object

---

## Duration Operations

Duration operations work with time spans (differences between datetimes).

### duration.between(dateTime1, dateTime2)

Calculate the duration between two datetimes.

```javascript
var dt1 = phantom.dates.operation.parseDateTime("2024-12-16T10:00:00");
var dt2 = phantom.dates.operation.parseDateTime("2024-12-16T15:30:00");

var duration = phantom.dates.duration.between(dt1, dt2);
// Returns: Java Duration object
```

**Parameters:**
- `dateTime1` (LocalDateTime or String): First datetime
- `dateTime2` (LocalDateTime or String): Second datetime

**Returns:** Java `Duration` object

**Throws:** Error if datetimes are null/undefined

---

### duration.of(amount, unit)

Create a duration from an amount and unit.

```javascript
// Create 5 day duration
var duration = phantom.dates.duration.of(5, phantom.dates.UNIT.DAYS);

// Create 2 hour duration
var duration2 = phantom.dates.duration.of(2, phantom.dates.UNIT.HOURS);
```

**Parameters:**
- `amount` (Number): Amount
- `unit` (String): Unit constant (use `phantom.dates.UNIT.*`)

**Returns:** Java `Duration` object

**Throws:** Error if amount or unit is null/undefined

---

### duration.add(dateTime, duration)

Add a duration to a datetime.

```javascript
var dt = phantom.dates.operation.parseDateTime("2024-12-16T10:00:00");
var duration = phantom.dates.duration.of(2, phantom.dates.UNIT.HOURS);

var newDt = phantom.dates.duration.add(dt, duration);
// Returns: LocalDateTime at 2024-12-16T12:00:00
```

**Parameters:**
- `dateTime` (LocalDateTime or String): DateTime to add to
- `duration` (Duration): Java Duration object

**Returns:** New LocalDateTime object

**Throws:** Error if datetime or duration is null/undefined

---

### duration.subtract(dateTime, duration)

Subtract a duration from a datetime.

```javascript
var dt = phantom.dates.operation.parseDateTime("2024-12-16T10:00:00");
var duration = phantom.dates.duration.of(2, phantom.dates.UNIT.HOURS);

var newDt = phantom.dates.duration.subtract(dt, duration);
// Returns: LocalDateTime at 2024-12-16T08:00:00
```

**Parameters:**
- `dateTime` (LocalDateTime or String): DateTime to subtract from
- `duration` (Duration): Java Duration object

**Returns:** New LocalDateTime object

**Throws:** Error if datetime or duration is null/undefined

---

### duration.toDays(duration)

Convert duration to days.

```javascript
var duration = phantom.dates.duration.between(dt1, dt2);
var days = phantom.dates.duration.toDays(duration);
// Output: 5 (if duration is 5 days)
```

**Returns:** Number of days

---

### duration.toHours(duration)

Convert duration to hours.

```javascript
var hours = phantom.dates.duration.toHours(duration);
// Output: 120 (if duration is 5 days)
```

**Returns:** Number of hours

---

### duration.toMinutes(duration)

Convert duration to minutes.

```javascript
var minutes = phantom.dates.duration.toMinutes(duration);
// Output: 7200 (if duration is 5 days)
```

**Returns:** Number of minutes

---

### duration.toSeconds(duration)

Convert duration to seconds.

```javascript
var seconds = phantom.dates.duration.toSeconds(duration);
// Output: 432000 (if duration is 5 days)
```

**Returns:** Number of seconds

---

### duration.toMillis(duration)

Convert duration to milliseconds.

```javascript
var millis = phantom.dates.duration.toMillis(duration);
// Output: 432000000 (if duration is 5 days)
```

**Returns:** Number of milliseconds

---

## Examples

### Example 1: Parse and Format Dates

```javascript
// Parse a date
var date = phantom.dates.operation.parse("2024-12-16");

// Format to US format
var usDate = phantom.dates.operation.format(date, phantom.dates.FORMAT.US_DATE);
// Output: "12/16/2024"

// Format to EU format
var euDate = phantom.dates.operation.format(date, phantom.dates.FORMAT.EU_DATE);
// Output: "16/12/2024"
```

### Example 2: Date Arithmetic

```javascript
var today = phantom.dates.operation.today();

// Get date 30 days from now
var futureDate = phantom.dates.operation.add(today, 30, phantom.dates.UNIT.DAYS);

// Get date 1 week ago
var pastDate = phantom.dates.operation.subtract(today, 7, phantom.dates.UNIT.DAYS);

// Calculate days between
var days = phantom.dates.operation.between(pastDate, futureDate, phantom.dates.UNIT.DAYS);
// Output: 37
```

### Example 3: Date Comparison

```javascript
var date1 = phantom.dates.operation.parse("2024-12-16");
var date2 = phantom.dates.operation.parse("2024-12-26");

if (phantom.dates.operation.isBefore(date1, date2)) {
    logger.info("date1 is before date2");
}

if (phantom.dates.operation.isAfter(date2, date1)) {
    logger.info("date2 is after date1");
}
```

### Example 4: Working with Durations

```javascript
var start = phantom.dates.operation.parseDateTime("2024-12-16T09:00:00");
var end = phantom.dates.operation.parseDateTime("2024-12-16T17:30:00");

// Calculate duration
var duration = phantom.dates.duration.between(start, end);

// Convert to different units
var hours = phantom.dates.duration.toHours(duration);
// Output: 8

var minutes = phantom.dates.duration.toMinutes(duration);
// Output: 510
```

### Example 5: Date Range (Start/End of Day)

```javascript
var date = phantom.dates.operation.parse("2024-12-16");

// Get start of day
var startOfDay = phantom.dates.operation.startOfDay(date);
// Returns: 2024-12-16T00:00:00

// Get end of day
var endOfDay = phantom.dates.operation.endOfDay(date);
// Returns: 2024-12-16T23:59:59.999
```

---

## Error Handling

All date operations follow consistent error handling:

- Invalid input → Throws Error with specific message
- Null/undefined where not allowed → Throws Error
- Parsing failures → Throws Error with details
- Missing Java.time APIs → Throws Error (OIE/Rhino environment required)

Errors are logged to the logger (if available) with the prefix `[phantom]`.

---

## Notes

1. **Java.time APIs Required:** Date operations require Java 8+ and Java.time APIs. They will not work in browser environments.

2. **Immutable Objects:** Java LocalDate and LocalDateTime objects are immutable. Operations like `add()` and `subtract()` return new objects without modifying the original.

3. **Format Patterns:** Use Java DateTimeFormatter patterns. Common patterns:
   - `yyyy` - 4-digit year
   - `MM` - 2-digit month (01-12)
   - `dd` - 2-digit day (01-31)
   - `HH` - 2-digit hour (00-23)
   - `mm` - 2-digit minute (00-59)
   - `ss` - 2-digit second (00-59)

4. **Unit Constants:** Always use `phantom.dates.UNIT.*` constants for units to avoid typos and ensure compatibility.

---

## Related Documentation

- [Getting Started](Getting-Started) - Installation and basic usage
- [Best Practices](Best-Practices) - Tips and patterns
- [Examples](Examples) - More usage examples
- [API Reference](API-Reference) - Complete API documentation

---

**Phantom.js - A product of David Labs**

