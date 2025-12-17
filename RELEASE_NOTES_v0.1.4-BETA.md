# Phantom.js v0.1.4-BETA - Beta Release

**Release Date:** December 2024  
**Status:** 🟡 **Beta / Pre-Release**  
**Tag:** `v0.1.4-BETA`

---

## ⚠️ Beta Release Notice

This is a **beta/pre-release version** of Phantom.js. While the library is feature-complete and thoroughly tested, we recommend:

- ✅ Testing in staging/development environments first
- ✅ Monitoring error logs in production
- ✅ Keeping backups of your integration code
- ✅ Reporting any issues via GitHub Issues

We're actively working towards v1.0.0 for full production stability.

---

## 🎉 What's New in v0.1.4-BETA

### ✨ New Features

#### Date Operations Support
- **`phantom.dates.operation.now()`** - Get current datetime
- **`phantom.dates.operation.today()`** - Get current date
- **`phantom.dates.operation.parse()`** - Parse date strings
- **`phantom.dates.operation.parseDateTime()`** - Parse datetime strings
- **`phantom.dates.operation.format()`** - Format dates to strings
- **`phantom.dates.operation.formatDateTime()`** - Format datetimes to strings
- **`phantom.dates.operation.getYear()`** - Get year from date
- **`phantom.dates.operation.getMonth()`** - Get month from date (1-12)
- **`phantom.dates.operation.getDay()`** - Get day of month
- **`phantom.dates.operation.getDayOfWeek()`** - Get day of week (MONDAY, TUESDAY, etc.)
- **`phantom.dates.operation.add()`** - Add time to date
- **`phantom.dates.operation.subtract()`** - Subtract time from date
- **`phantom.dates.operation.between()`** - Calculate difference between dates
- **`phantom.dates.operation.isBefore()`** - Check if date is before another
- **`phantom.dates.operation.isAfter()`** - Check if date is after another
- **`phantom.dates.operation.isEqual()`** - Check if dates are equal
- **`phantom.dates.operation.startOfDay()`** - Get start of day (00:00:00)
- **`phantom.dates.operation.endOfDay()`** - Get end of day (23:59:59.999)

#### Duration Operations Support
- **`phantom.dates.duration.between()`** - Calculate duration between datetimes
- **`phantom.dates.duration.of()`** - Create duration from amount and unit
- **`phantom.dates.duration.add()`** - Add duration to datetime
- **`phantom.dates.duration.subtract()`** - Subtract duration from datetime
- **`phantom.dates.duration.toDays()`** - Convert duration to days
- **`phantom.dates.duration.toHours()`** - Convert duration to hours
- **`phantom.dates.duration.toMinutes()`** - Convert duration to minutes
- **`phantom.dates.duration.toSeconds()`** - Convert duration to seconds
- **`phantom.dates.duration.toMillis()`** - Convert duration to milliseconds

#### Constants (Enums)
- **`phantom.dates.FORMAT`** - Date format constants:
  - `ISO_DATE` - "yyyy-MM-dd"
  - `ISO_DATETIME` - "yyyy-MM-dd'T'HH:mm:ss"
  - `ISO_DATETIME_MS` - "yyyy-MM-dd'T'HH:mm:ss.SSS"
  - `US_DATE` - "MM/dd/yyyy"
  - `US_DATETIME` - "MM/dd/yyyy HH:mm:ss"
  - `EU_DATE` - "dd/MM/yyyy"
  - `EU_DATETIME` - "dd/MM/yyyy HH:mm:ss"

- **`phantom.dates.UNIT`** - Time unit constants:
  - `DAYS`, `HOURS`, `MINUTES`, `SECONDS`, `MILLIS`, `WEEKS`, `MONTHS`, `YEARS`

**Note:** Date operations require Java.time APIs (OIE/Rhino environment, Java 8+).

---

## 📊 Statistics

- **Total Functions:** 115
  - Map Operations: 18
  - String Operations: 26
  - Number Operations: 27
  - JSON Operations: 15
  - Base64 Operations: 2
  - XML Operations: 5
  - Date Operations: 15 (NEW)
  - Duration Operations: 7 (NEW)
- **Test Cases:** 221 (all passing ✅)
- **New Tests:** 47 tests for date/duration operations

---

## 🚀 Quick Start

```javascript
// Date operations
var today = phantom.dates.operation.today();
var now = phantom.dates.operation.now();

// Parse dates
var date = phantom.dates.operation.parse("2024-12-16");
var date2 = phantom.dates.operation.parse("12/16/2024", phantom.dates.FORMAT.US_DATE);

// Format dates
var formatted = phantom.dates.operation.format(date, phantom.dates.FORMAT.ISO_DATE);
// Output: "2024-12-16"

// Get date components
var year = phantom.dates.operation.getYear(date);
var month = phantom.dates.operation.getMonth(date);
var day = phantom.dates.operation.getDay(date);

// Date arithmetic
var futureDate = phantom.dates.operation.add(date, 30, phantom.dates.UNIT.DAYS);
var pastDate = phantom.dates.operation.subtract(date, 7, phantom.dates.UNIT.DAYS);

// Date comparison
var isBefore = phantom.dates.operation.isBefore(date, futureDate);
var isAfter = phantom.dates.operation.isAfter(date, pastDate);
var isEqual = phantom.dates.operation.isEqual(date, date);

// Calculate difference
var daysBetween = phantom.dates.operation.between(date, futureDate, phantom.dates.UNIT.DAYS);

// Duration operations
var duration = phantom.dates.duration.between(dateTime1, dateTime2);
var days = phantom.dates.duration.toDays(duration);
var hours = phantom.dates.duration.toHours(duration);

// Create duration
var duration5Days = phantom.dates.duration.of(5, phantom.dates.UNIT.DAYS);
var newDateTime = phantom.dates.duration.add(dateTime, duration5Days);
```

---

## 📦 Installation

1. Download `phantom.js` or `phantom.min.js` from this release
2. Copy contents to OIE Code Templates (Channels → Edit Code Template → New Library)
3. Set Context to "Select All Context"
4. Save and use immediately - no initialization required!

**Compatible with:** Mirth Connect, Open Integration Engine (OIE), BridgeLink (version 4.5.2+)

**Java Requirement:** Java 8+ required for date/duration operations (uses Java.time APIs)

---

## 📚 Documentation

Full documentation: **[Phantom.js Wiki](https://github.com/OS366/phantom/wiki)**

New documentation:
- **[Date Operations](https://github.com/OS366/phantom/wiki/Date-Operations)** - Complete guide to date and duration operations

---

## ⚠️ Known Limitations

- Variables saved using `phantom.maps.*` are NOT available for drag-and-drop in Destination Mappings (OIE editor limitation)
- XML operations require Java XML APIs (OIE/Rhino environment only)
- **Date/Duration operations require Java.time APIs (OIE/Rhino environment, Java 8+ only)**

---

## 📝 Changelog

### v0.1.4-BETA (Current - Beta)
- ✨ Added Date Operations (15 functions)
- ✨ Added Duration Operations (7 functions)
- ✨ Added date format and unit constants (enums)
- 📚 Added Date Operations wiki documentation
- ✅ 221 tests passing (47 new tests)

### v0.1.3 (Beta)
- ✨ Added XML operations support
- 📚 Updated documentation
- ✅ 186 tests passing

### v0.1.2
- ✨ Added Base64 operations
- 📦 Added minified version

### v0.1.1
- ✨ Added JSON operations (15 functions)

### v0.1.0
- 🎉 Initial release

---

## 🤝 Support

- **Issues:** [GitHub Issues](https://github.com/OS366/phantom/issues)
- **Wiki:** [Documentation](https://github.com/OS366/phantom/wiki)
- **License:** See LICENSE file

---

## 🙏 Credits

**Phantom.js v0.1.4-BETA - A product of David Labs**

---

## 📥 Download

- **Full version:** [phantom.js](https://github.com/OS366/phantom/releases/download/v0.1.4-BETA/phantom.js)
- **Minified version:** [phantom.min.js](https://github.com/OS366/phantom/releases/download/v0.1.4-BETA/phantom.min.js)

---

**⚠️ Remember:** This is a beta release. Test thoroughly before production use!

