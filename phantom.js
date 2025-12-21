/*!
 * Phantom.js v0.1.6-BETA
 * ============================================
 * A product of David Labs
 * Copyright (C) 2025 OS366 / David Labs
 * 
 * Lightweight helper library for OIE scripting
 *
 * Documentation: https://github.com/OS366/phantom/wiki
 * 
 * LICENSE: GNU General Public License v3.0 (GPL-3.0)
 * This software is open source and free to use, modify, and distribute
 * under the terms of GPL v3. However, you MUST maintain the attribution
 * "Product of David Labs" in all copies and modified versions.
 *
 * Available Categories (type "phantom." to see):
 *   - phantom.maps       - Map operations (channel, global, connector, response, configuration)
 *   - phantom.strings    - String operations (trim, replace, split, etc.)
 *   - phantom.numbers    - Number operations (add, subtract, round, etc.)
 *   - phantom.json       - JSON operations (parse, stringify, get, set, etc.)
 *   - phantom.base64     - Base64 operations (encode, decode)
 *   - phantom.xml        - XML operations (parse, stringify, get, has)
 *   - phantom.dates      - Date operations (now, parse, format, etc.)
 *
 * Helper Functions:
 *   - phantom.help()           - Show all available operations
 *   - phantom.help('maps')     - Show operations for specific category
 *   - phantom.autocomplete()  - Get array of available options
 *   - phantom._()             - Quick reference guide
 *   - phantom.version         - Get current version
 *
 * WARNING
 * -------
 * Drag and drop is not possible for variables saved using phantom.maps.*
 */

/**
 * @typedef {Object} Phantom
 * @property {Object} maps - Map operations
 * @property {Object} strings - String operations
 * @property {Object} numbers - Number operations
 * @property {Object} json - JSON operations
 * @property {Object} base64 - Base64 operations
 * @property {Object} xml - XML operations
 * @property {Object} dates - Date operations
 * @property {string} version - Current version
 * @property {Function} help - Show help documentation
 * @property {Function} autocomplete - Get autocomplete suggestions
 * @property {Function} _ - Quick reference guide
 * @property {Object} _autocomplete - Autocomplete metadata for OIE editor
 * @property {Function} _getSuggestions - Get suggestions for a given path
 */

/**
 * OIE Editor Autocomplete Support
 * 
 * When typing "phantom." in OIE transformer editor, the following properties are available:
 * 
 * phantom.maps - Map operations (channel, global, connector, response, configuration)
 *   phantom.maps.channel.save(key, value)
 *   phantom.maps.channel.get(key)
 *   phantom.maps.channel.exists(key)
 *   phantom.maps.channel.delete(key)
 * 
 * phantom.strings - String operations
 *   phantom.strings.operation.trim(str)
 *   phantom.strings.operation.replace(str, search, replace)
 *   phantom.strings.chain(str) - Chaining API
 * 
 * phantom.numbers - Number operations
 *   phantom.numbers.operation.add(a, b)
 *   phantom.numbers.operation.round(num, decimals)
 *   phantom.numbers.chain(num) - Chaining API
 * 
 * phantom.json - JSON operations
 *   phantom.json.operation.parse(str)
 *   phantom.json.operation.stringify(obj)
 *   phantom.json.operation.get(obj, path)
 * 
 * phantom.base64 - Base64 operations
 *   phantom.base64.operation.encode(str)
 *   phantom.base64.operation.decode(str)
 * 
 * phantom.xml - XML operations
 *   phantom.xml.operation.parse(str)
 *   phantom.xml.operation.get(xml, xpath)
 * 
 * phantom.dates - Date operations
 *   phantom.dates.operation.now()
 *   phantom.dates.operation.parse(str)
 *   phantom.dates.format.detect(str)
 */

(function (global) {
    "use strict";
  
    var phantom = global.phantom || {};
    global.phantom = phantom;
  
    phantom.version = "0.1.6-BETA";
  
    phantom.config = { silent: true };
  
    phantom.init = function (o) {
      o = o || {};
      if (typeof o.silent === "boolean") phantom.config.silent = o.silent;
      return phantom;
    };
  
    /* --------------------------------------------------
     * HELP & AUTOCOMPLETE SYSTEM
     * For OIE scripting environments without native autocomplete
     * -------------------------------------------------- */
  
    // Help documentation for all operations
    var helpDocs = {
      maps: {
        description: "Map operations for storing and retrieving data",
        operations: {
          channel: {
            description: "Channel map operations (save, get, exists, delete)",
            methods: {
              save: "Save a value to channel map: phantom.maps.channel.save(key, value)",
              get: "Get a value from channel map: phantom.maps.channel.get(key)",
              exists: "Check if key exists: phantom.maps.channel.exists(key)",
              delete: "Delete a key: phantom.maps.channel.delete(key)"
            }
          },
          global: {
            description: "Global map operations (save, get, exists, delete)",
            methods: {
              save: "Save a value to global map: phantom.maps.global.save(key, value)",
              get: "Get a value from global map: phantom.maps.global.get(key)",
              exists: "Check if key exists: phantom.maps.global.exists(key)",
              delete: "Delete a key: phantom.maps.global.delete(key)"
            }
          },
          connector: {
            description: "Connector map operations (save, get, exists, delete)",
            methods: {
              save: "Save a value to connector map: phantom.maps.connector.save(key, value)",
              get: "Get a value from connector map: phantom.maps.connector.get(key)",
              exists: "Check if key exists: phantom.maps.connector.exists(key)",
              delete: "Delete a key: phantom.maps.connector.delete(key)"
            }
          },
          response: {
            description: "Response map operations (save, get, exists, delete) - Available only in response context",
            methods: {
              save: "Save a value to response map: phantom.maps.response.save(key, value)",
              get: "Get a value from response map: phantom.maps.response.get(key)",
              exists: "Check if key exists: phantom.maps.response.exists(key)",
              delete: "Delete a key: phantom.maps.response.delete(key)"
            }
          },
          configuration: {
            description: "Configuration map operations (read-only: get, exists)",
            methods: {
              get: "Get a value from configuration map: phantom.maps.configuration.get(key)",
              exists: "Check if key exists: phantom.maps.configuration.exists(key)"
            }
          }
        }
      },
      strings: {
        description: "String operations for text manipulation",
        operations: {
          operation: {
            description: "String utility functions",
            methods: {
              trim: "Remove whitespace from both ends: phantom.strings.operation.trim(str)",
              leftPad: "Pad string on the left: phantom.strings.operation.leftPad(str, count, padChar)",
              rightPad: "Pad string on the right: phantom.strings.operation.rightPad(str, count, padChar)",
              find: "Find substring position: phantom.strings.operation.find(str, search)",
              replace: "Replace substring: phantom.strings.operation.replace(str, search, replace)",
              split: "Split string into array: phantom.strings.operation.split(str, delimiter)",
              substring: "Extract substring: phantom.strings.operation.substring(str, start, end)",
              toUpperCase: "Convert to uppercase: phantom.strings.operation.toUpperCase(str)",
              toLowerCase: "Convert to lowercase: phantom.strings.operation.toLowerCase(str)",
              capitalize: "Capitalize first letter: phantom.strings.operation.capitalize(str)",
              reverse: "Reverse string: phantom.strings.operation.reverse(str)",
              length: "Get string length: phantom.strings.operation.length(str)",
              startsWith: "Check if starts with: phantom.strings.operation.startsWith(str, prefix)",
              endsWith: "Check if ends with: phantom.strings.operation.endsWith(str, suffix)",
              contains: "Check if contains: phantom.strings.operation.contains(str, search)",
              repeat: "Repeat string: phantom.strings.operation.repeat(str, count)",
              remove: "Remove substring: phantom.strings.operation.remove(str, search)",
              isEmpty: "Check if empty: phantom.strings.operation.isEmpty(str)",
              isBlank: "Check if blank: phantom.strings.operation.isBlank(str)",
              wordwrap: "Wrap text to lines: phantom.strings.operation.wordwrap(str, width)"
            }
          },
          chain: {
            description: "String chaining API for fluent operations",
            methods: {
              value: "Get final value: phantom.strings.chain(str).value()",
              toNumberChain: "Convert to number chain: phantom.strings.chain(str).toNumberChain()"
            }
          }
        }
      },
      numbers: {
        description: "Number operations for mathematical calculations",
        operations: {
          operation: {
            description: "Number utility functions",
            methods: {
              parse: "Parse string to number: phantom.numbers.operation.parse(str)",
              isNumber: "Check if number: phantom.numbers.operation.isNumber(value)",
              add: "Add two numbers: phantom.numbers.operation.add(a, b)",
              subtract: "Subtract: phantom.numbers.operation.subtract(a, b)",
              multiply: "Multiply: phantom.numbers.operation.multiply(a, b)",
              divide: "Divide: phantom.numbers.operation.divide(a, b)",
              round: "Round number: phantom.numbers.operation.round(num, decimals)",
              min: "Get minimum: phantom.numbers.operation.min(a, b)",
              max: "Get maximum: phantom.numbers.operation.max(a, b)",
              abs: "Absolute value: phantom.numbers.operation.abs(num)",
              ceil: "Round up: phantom.numbers.operation.ceil(num)",
              floor: "Round down: phantom.numbers.operation.floor(num)",
              sqrt: "Square root: phantom.numbers.operation.sqrt(num)",
              pow: "Power: phantom.numbers.operation.pow(base, exponent)",
              mod: "Modulo: phantom.numbers.operation.mod(a, b)",
              random: "Random number: phantom.numbers.operation.random()",
              randomInt: "Random integer: phantom.numbers.operation.randomInt(min, max)",
              between: "Check if between: phantom.numbers.operation.between(num, min, max)",
              clamp: "Clamp value: phantom.numbers.operation.clamp(num, min, max)",
              sign: "Get sign: phantom.numbers.operation.sign(num)",
              isEven: "Check if even: phantom.numbers.operation.isEven(num)",
              isOdd: "Check if odd: phantom.numbers.operation.isOdd(num)",
              isPositive: "Check if positive: phantom.numbers.operation.isPositive(num)",
              isNegative: "Check if negative: phantom.numbers.operation.isNegative(num)",
              isZero: "Check if zero: phantom.numbers.operation.isZero(num)",
              toFixed: "Format number: phantom.numbers.operation.toFixed(num, decimals)",
              truncate: "Truncate number: phantom.numbers.operation.truncate(num)"
            }
          },
          chain: {
            description: "Number chaining API for fluent operations",
            methods: {
              value: "Get final value: phantom.numbers.chain(num).value()",
              toStringChain: "Convert to string chain: phantom.numbers.chain(num).toStringChain()"
            }
          }
        }
      },
      json: {
        description: "JSON operations for parsing and manipulating JSON data",
        operations: {
          operation: {
            description: "JSON utility functions",
            methods: {
              parse: "Parse JSON string: phantom.json.operation.parse(str)",
              stringify: "Stringify object: phantom.json.operation.stringify(obj)",
              get: "Get value by path: phantom.json.operation.get(obj, path)",
              set: "Set value by path: phantom.json.operation.set(obj, path, value)",
              has: "Check if path exists: phantom.json.operation.has(obj, path)",
              remove: "Remove path: phantom.json.operation.remove(obj, path)",
              keys: "Get all keys: phantom.json.operation.keys(obj)",
              values: "Get all values: phantom.json.operation.values(obj)",
              size: "Get object size: phantom.json.operation.size(obj)",
              merge: "Merge objects: phantom.json.operation.merge(obj1, obj2)",
              isEmpty: "Check if empty: phantom.json.operation.isEmpty(obj)",
              isArray: "Check if array: phantom.json.operation.isArray(value)",
              isObject: "Check if object: phantom.json.operation.isObject(value)",
              toString: "Convert to string: phantom.json.operation.toString(obj)",
              prettyPrint: "Pretty print: phantom.json.operation.prettyPrint(obj)"
            }
          }
        }
      },
      base64: {
        description: "Base64 encoding and decoding operations",
        operations: {
          operation: {
            description: "Base64 utility functions",
            methods: {
              encode: "Encode to base64: phantom.base64.operation.encode(str)",
              decode: "Decode from base64: phantom.base64.operation.decode(str)"
            }
          }
        }
      },
      xml: {
        description: "XML operations for parsing and querying XML data",
        operations: {
          operation: {
            description: "XML utility functions",
            methods: {
              parse: "Parse XML string: phantom.xml.operation.parse(str)",
              stringify: "Stringify XML object: phantom.xml.operation.stringify(obj)",
              get: "Get value by XPath: phantom.xml.operation.get(xml, xpath)",
              has: "Check if XPath exists: phantom.xml.operation.has(xml, xpath)",
              toString: "Convert to string: phantom.xml.operation.toString(xml)"
            }
          }
        }
      },
      dates: {
        description: "Date and time operations using Java.time APIs",
        operations: {
          operation: {
            description: "Date utility functions",
            methods: {
              now: "Get current datetime: phantom.dates.operation.now()",
              today: "Get current date: phantom.dates.operation.today()",
              parse: "Parse date string: phantom.dates.operation.parse(str, format)",
              parseDateTime: "Parse datetime string: phantom.dates.operation.parseDateTime(str, format)",
              format: "Format date: phantom.dates.operation.format(date, format)",
              formatDateTime: "Format datetime: phantom.dates.operation.formatDateTime(dt, format)",
              getYear: "Get year: phantom.dates.operation.getYear(date)",
              getMonth: "Get month: phantom.dates.operation.getMonth(date)",
              getDay: "Get day: phantom.dates.operation.getDay(date)",
              getDayOfWeek: "Get day of week: phantom.dates.operation.getDayOfWeek(date)",
              add: "Add time: phantom.dates.operation.add(date, amount, unit)",
              subtract: "Subtract time: phantom.dates.operation.subtract(date, amount, unit)",
              between: "Calculate difference: phantom.dates.operation.between(date1, date2, unit)",
              isBefore: "Check if before: phantom.dates.operation.isBefore(date1, date2)",
              isAfter: "Check if after: phantom.dates.operation.isAfter(date1, date2)",
              isEqual: "Check if equal: phantom.dates.operation.isEqual(date1, date2)",
              startOfDay: "Get start of day: phantom.dates.operation.startOfDay(date)",
              endOfDay: "Get end of day: phantom.dates.operation.endOfDay(date)"
            }
          },
          format: {
            description: "Date format detection and utilities",
            methods: {
              detect: "Detect date format: phantom.dates.format.detect(dateString)"
            }
          },
          duration: {
            description: "Duration operations",
            methods: {
              between: "Calculate duration: phantom.dates.duration.between(dt1, dt2)",
              of: "Create duration: phantom.dates.duration.of(amount, unit)",
              add: "Add duration: phantom.dates.duration.add(dt, duration)",
              subtract: "Subtract duration: phantom.dates.duration.subtract(dt, duration)",
              toDays: "Convert to days: phantom.dates.duration.toDays(duration)",
              toHours: "Convert to hours: phantom.dates.duration.toHours(duration)",
              toMinutes: "Convert to minutes: phantom.dates.duration.toMinutes(duration)",
              toSeconds: "Convert to seconds: phantom.dates.duration.toSeconds(duration)",
              toMillis: "Convert to milliseconds: phantom.dates.duration.toMillis(duration)"
            }
          }
        }
      }
    };
  
    // Help function - shows available operations
    phantom.help = function (path) {
      try {
        if (!path) {
          // Show all categories
          var output = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
          output += "📚 Phantom.js Help - Available Categories\n";
          output += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
          output += "Usage: phantom.help('category') or phantom.help('category.operation')\n\n";
          
          for (var category in helpDocs) {
            output += "📦 phantom." + category + "\n";
            output += "   " + helpDocs[category].description + "\n";
            output += "   Example: phantom.help('" + category + "')\n\n";
          }
          
          output += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
          return output;
        }
        
        var parts = path.split('.');
        var current = helpDocs;
        
        // Navigate through the path
        for (var i = 0; i < parts.length; i++) {
          if (current && current[parts[i]]) {
            current = current[parts[i]];
          } else if (current && current.operations && current.operations[parts[i]]) {
            current = current.operations[parts[i]];
          } else {
            return "❌ Path not found: phantom." + path + "\n\nUse phantom.help() to see all available categories.";
          }
        }
        
        // Display the help
        var output = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        output += "📚 phantom." + path + "\n";
        output += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        
        if (current.description) {
          output += "Description: " + current.description + "\n\n";
        }
        
        if (current.methods) {
          output += "Available Methods:\n";
          output += "────────────────────────────────────────────────────\n";
          for (var method in current.methods) {
            output += "• " + method + "\n";
            output += "  " + current.methods[method] + "\n\n";
          }
        } else if (current.operations) {
          output += "Available Operations:\n";
          output += "────────────────────────────────────────────────────\n";
          for (var op in current.operations) {
            output += "• " + op + "\n";
            if (current.operations[op].description) {
              output += "  " + current.operations[op].description + "\n";
            }
            output += "  Example: phantom.help('" + path + "." + op + "')\n\n";
          }
        }
        
        output += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        return output;
      } catch (e) {
        return "Error: " + (e.message || String(e));
      }
    };
  
    // Autocomplete function - returns available options
    phantom.autocomplete = function (path) {
      try {
        if (!path) {
          // Return all top-level categories
          return Object.keys(helpDocs);
        }
        
        var parts = path.split('.');
        var current = helpDocs;
        
        // Navigate through the path
        for (var i = 0; i < parts.length; i++) {
          if (current && current[parts[i]]) {
            current = current[parts[i]];
          } else if (current && current.operations && current.operations[parts[i]]) {
            current = current.operations[parts[i]];
          } else {
            return [];
          }
        }
        
        var options = [];
        
        // If we have operations, return them
        if (current.operations) {
          options = Object.keys(current.operations);
        } else if (current.methods) {
          options = Object.keys(current.methods);
        } else if (typeof current === 'object') {
          // Return direct properties
          for (var key in current) {
            if (key !== 'description' && key !== 'operations' && key !== 'methods') {
              options.push(key);
            }
          }
        }
        
        return options;
      } catch (e) {
        return [];
      }
    };
  
    // Quick reference - shows what's available after typing "phantom."
    phantom._ = function() {
      var output = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
      output += "🔍 Quick Reference: phantom.*\n";
      output += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
      output += "Available categories:\n\n";
      
      var categories = Object.keys(helpDocs);
      for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        output += "  phantom." + cat + "\n";
        output += "    → " + helpDocs[cat].description + "\n";
        output += "    → Try: phantom.help('" + cat + "')\n\n";
      }
      
      output += "Helper functions:\n\n";
      output += "  phantom.help()           - Show all categories\n";
      output += "  phantom.help('maps')     - Show map operations\n";
      output += "  phantom.autocomplete()  - Get available options\n";
      output += "  phantom.version         - Get version\n";
      output += "  phantom._               - Show this quick reference\n\n";
      output += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
      return output;
    };
  
    // Make it easy to see what's available - add a toString for phantom object
    phantom.toString = function() {
      return "Phantom.js v" + phantom.version + " - Use phantom._() or phantom.help() for help";
    };
  
    // Only log on error (as requested)
    function logError(msg) {
      if (typeof logger !== "undefined") {
        logger.error("[phantom] " + msg);
      }
    }
  
    function fail(msg) {
      // Use specific error message if provided, otherwise use generic
      var errorMsg = msg || "Invalid operation";
      logError(errorMsg);
      throw new Error(errorMsg);
    }
  
    /* --------------------------------------------------
     * MAP RESOLUTION
     * -------------------------------------------------- */
  
    function isResponseContext() {
      try { 
        if (typeof responseMap !== "undefined") return true;
        if (global && global.responseMap) return true;
        return false;
      }
      catch (e) { return false; }
    }
  
    function resolveMap(name) {
      try {
        // In OIE/Rhino, these are global variables accessible directly
        // In Node.js test environment (VM context), access via the 'global' parameter passed to IIFE
        // The 'global' parameter is the context object in VM, so maps are on it
        
        // Try global object first (works in both environments)
        if (global) {
          if (name === "channelMap" && global.channelMap) { 
            return global.channelMap; 
          }
          if (name === "globalMap" && global.globalMap) { 
            return global.globalMap; 
          }
          if (name === "connectorMap" && global.connectorMap) { 
            return global.connectorMap; 
          }
          if (name === "responseMap" && global.responseMap) { 
            return global.responseMap; 
          }
          if (name === "configurationMap" && global.configurationMap) { 
            return global.configurationMap; 
          }
        }
        
        // Fallback: try direct access (OIE/Rhino environment where variables are in global scope)
        // Use eval to safely check without throwing ReferenceError in strict mode
        try {
          if (name === "channelMap") {
            var result = eval("typeof channelMap !== 'undefined' ? channelMap : null");
            if (result) return result;
          }
          if (name === "globalMap") {
            var result = eval("typeof globalMap !== 'undefined' ? globalMap : null");
            if (result) return result;
          }
          if (name === "connectorMap") {
            var result = eval("typeof connectorMap !== 'undefined' ? connectorMap : null");
            if (result) return result;
          }
          if (name === "responseMap") {
            var result = eval("typeof responseMap !== 'undefined' ? responseMap : null");
            if (result) return result;
          }
          if (name === "configurationMap") {
            var result = eval("typeof configurationMap !== 'undefined' ? configurationMap : null");
            if (result) return result;
          }
        } catch (e) {
          // Direct access failed, return null
        }
        
        return null;
      } catch (e) {
        return null;
      }
    }
  
    function toJavaString(x) {
      try {
        if (typeof java !== "undefined" && java.lang && java.lang.String) {
          return java.lang.String.valueOf(x);
        }
      } catch (e) {}
      return String(x);
    }
  
    function putSafe(m, k, v) {
      if (!m) return fail("Map is null or undefined");
      if (k == null) return fail("Key is null or undefined");
  
      var jKey = toJavaString(k);
  
      try {
        if (m.put) { m.put(jKey, v); return; }
        if (m.set) { m.set(jKey, v); return; }
      } catch (e) {
        return fail("Failed to save to map: " + (e.message || String(e)));
      }
  
      return fail("Map does not support put or set operations");
    }
  
    function getSafe(m, k) {
      if (!m) return fail("Map is null or undefined");
      if (k == null) return fail("Key is null or undefined");
  
      try {
        if (m.get) return m.get(toJavaString(k));
      } catch (e) {
        return fail("Failed to get from map: " + (e.message || String(e)));
      }
  
      return fail("Map does not support get operation");
    }
  
    function delSafe(m, k) {
      if (!m) return fail("Map is null or undefined");
      if (k == null) return fail("Key is null or undefined");
  
      try {
        var jKey = toJavaString(k);
        if (m.remove) { m.remove(jKey); return; }
        if (m.put) { m.put(jKey, null); return; }
        if (m.set) { m.set(jKey, null); return; }
      } catch (e) {
        return fail("Failed to delete from map: " + (e.message || String(e)));
      }
  
      return fail("Map does not support remove, put, or set operations");
    }
  
    /* --------------------------------------------------
     * phantom.maps.*
     * -------------------------------------------------- */
  
    phantom.maps = {};
  
    function mapFacade(mapName, responseOnly, readOnly) {
      function getMap() {
        if (responseOnly && !isResponseContext()) return fail("Response map is only available in response context");
        var map = resolveMap(mapName);
        if (!map) return fail("Map '" + mapName + "' is not available");
        return map;
      }
  
      return {
        save: function (k, v) {
          if (readOnly) return fail("Map is read-only");
          return putSafe(getMap(), k, v);
        },
        get: function (k) {
          return getSafe(getMap(), k);
        },
        exists: function (k) {
          try {
            var m = getMap();
            var v = m.get(toJavaString(k));
            return v !== null && typeof v !== "undefined";
          } catch (e) {
            return fail("Failed to check if key exists: " + (e.message || String(e)));
          }
        },
        delete: function (k) {
          if (readOnly) return fail("Map is read-only");
          return delSafe(getMap(), k);
        }
      };
    }
  
    phantom.maps.channel = mapFacade("channelMap", false, false);
    phantom.maps.global = mapFacade("globalMap", false, false);
    phantom.maps.connector = mapFacade("connectorMap", false, false);
    phantom.maps.response = mapFacade("responseMap", true, false);
  
    phantom.maps.configuration = {
      get: function (k) {
        var map = resolveMap("configurationMap");
        if (!map) return fail("Configuration map is not available");
        return getSafe(map, k);
      },
      exists: function (k) {
        try {
          var m = resolveMap("configurationMap");
          if (!m) return fail("Configuration map is not available");
          var v = m.get(toJavaString(k));
          return v !== null && typeof v !== "undefined";
        } catch (e) {
          return fail("Failed to check if configuration key exists: " + (e.message || String(e)));
        }
      },
      save: function () { return fail("Configuration map is read-only"); },
      delete: function () { return fail("Configuration map is read-only"); }
    };
  
    /* --------------------------------------------------
     * phantom.strings.operation.*
     * (no logging on success)
     * -------------------------------------------------- */
  
    phantom.strings = { operation: {} };
  
    function toStr(x) {
      if (x === null || typeof x === "undefined") return "";
      return String(x);
    }
  
    phantom.strings.operation.find = function (input, stringToFind) {
      var s = toStr(input);
      var f = toStr(stringToFind);
      if (f.length === 0) return false;
      return s.indexOf(f) !== -1;
    };
  
    phantom.strings.operation.leftPad = function (input, padChar, count) {
      var s = toStr(input);
      var p = toStr(padChar || " ");
      var n = parseInt(count, 10);
      if (isNaN(n) || n <= 0) return s;
  
      var out = "";
      for (var i = 0; i < n; i++) out += p;
      return out + s;
    };
  
    phantom.strings.operation.rightPad = function (input, padChar, count) {
      var s = toStr(input);
      var p = toStr(padChar || " ");
      var n = parseInt(count, 10);
      if (isNaN(n) || n <= 0) return s;
  
      var out = s;
      for (var i = 0; i < n; i++) out += p;
      return out;
    };
  
    phantom.strings.operation.dualPad = function (input, padChar, count) {
      var s = toStr(input);
      var p = toStr(padChar || " ");
      var n = parseInt(count, 10);
      if (isNaN(n) || n <= 0) return s;
  
      var pad = "";
      for (var i = 0; i < n; i++) pad += p;
      return pad + s + pad;
    };
  
    phantom.strings.operation.leftTrim = function (input) {
      return toStr(input).replace(/^[ \t\r\n]+/, "");
    };
  
    phantom.strings.operation.rightTrim = function (input) {
      return toStr(input).replace(/[ \t\r\n]+$/, "");
    };
  
    phantom.strings.operation.trim = function (input) {
      return phantom.strings.operation.leftTrim(
        phantom.strings.operation.rightTrim(input)
      );
    };
  
    phantom.strings.operation.split = function (input, delimiter) {
      return toStr(input).split(toStr(delimiter));
    };
  
    phantom.strings.operation.splice = function (input, start, deleteCount, insertString) {
      var s = toStr(input);
      var st = parseInt(start, 10);
      var dc = parseInt(deleteCount, 10);
  
      if (isNaN(st) || st < 0) st = 0;
      if (isNaN(dc) || dc < 0) dc = 0;
  
      var ins = toStr(insertString || "");
      return s.slice(0, st) + ins + s.slice(st + dc);
    };
  
    phantom.strings.operation.compare = function (a, b) {
      var s1 = toStr(a);
      var s2 = toStr(b);
      if (s1 === s2) return 0;
      return s1 > s2 ? 1 : -1;
    };
  
    phantom.strings.operation.join = function (a, b, joinCharacters) {
      return toStr(a) + toStr(joinCharacters || "") + toStr(b);
    };

    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    phantom.strings.operation.replace = function (input, searchString, replaceString) {
      var s = toStr(input);
      var search = toStr(searchString);
      var replace = toStr(replaceString);
      if (search.length === 0) return s;
      return s.replace(search, replace);
    };

    phantom.strings.operation.replaceAll = function (input, searchString, replaceString) {
      var s = toStr(input);
      var search = toStr(searchString);
      var replace = toStr(replaceString);
      if (search.length === 0) return s;
      var regex = new RegExp(escapeRegex(search), "g");
      return s.replace(regex, replace);
    };

    phantom.strings.operation.substring = function (input, start, end) {
      var s = toStr(input);
      var st = parseInt(start, 10);
      var e = end != null ? parseInt(end, 10) : undefined;
      if (isNaN(st)) st = 0;
      if (e != null && isNaN(e)) e = undefined;
      if (e == null) return s.substring(st);
      return s.substring(st, e);
    };

    phantom.strings.operation.toUpperCase = function (input) {
      return toStr(input).toUpperCase();
    };

    phantom.strings.operation.toLowerCase = function (input) {
      return toStr(input).toLowerCase();
    };

    phantom.strings.operation.capitalize = function (input) {
      var s = toStr(input);
      if (s.length === 0) return s;
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

    phantom.strings.operation.reverse = function (input) {
      var s = toStr(input);
      var result = "";
      for (var i = s.length - 1; i >= 0; i--) {
        result += s.charAt(i);
      }
      return result;
    };

    phantom.strings.operation.length = function (input) {
      return toStr(input).length;
    };

    phantom.strings.operation.startsWith = function (input, prefix) {
      var s = toStr(input);
      var p = toStr(prefix);
      return s.indexOf(p) === 0;
    };

    phantom.strings.operation.endsWith = function (input, suffix) {
      var s = toStr(input);
      var suf = toStr(suffix);
      if (suf.length === 0) return true;
      return s.lastIndexOf(suf) === s.length - suf.length;
    };

    phantom.strings.operation.contains = function (input, stringToFind) {
      return phantom.strings.operation.find(input, stringToFind);
    };

    phantom.strings.operation.repeat = function (input, count) {
      var s = toStr(input);
      var n = parseInt(count, 10);
      if (isNaN(n) || n <= 0) return "";
      var result = "";
      for (var i = 0; i < n; i++) {
        result += s;
      }
      return result;
    };

    phantom.strings.operation.remove = function (input, stringToRemove) {
      return phantom.strings.operation.replaceAll(input, stringToRemove, "");
    };

    phantom.strings.operation.isEmpty = function (input) {
      return toStr(input).length === 0;
    };

    phantom.strings.operation.isBlank = function (input) {
      var s = toStr(input);
      return s.length === 0 || /^\s*$/.test(s);
    };

    phantom.strings.operation.wordwrap = function (input, size, cut, everything) {
      var s = toStr(input);
      var wrapSize = size != null ? parseInt(size, 10) : 80;
      if (isNaN(wrapSize) || wrapSize <= 0) wrapSize = 80;
      var shouldCut = cut === true;
      var wrapEverything = everything === true;
      
      if (s.length <= wrapSize) return s;
      
      var result = "";
      var i = 0;
      while (i < s.length) {
        if (i > 0) result += "\n";
        var chunk = s.substring(i, i + wrapSize);
        if (shouldCut || wrapEverything) {
          result += chunk;
          i += wrapSize;
        } else {
          var lastSpace = chunk.lastIndexOf(" ");
          if (lastSpace > 0 && i + lastSpace < s.length) {
            result += chunk.substring(0, lastSpace);
            i += lastSpace + 1;
          } else {
            result += chunk;
            i += wrapSize;
          }
        }
      }
      return result;
    };

    phantom.strings.operation.reverseWords = function (input) {
      var s = toStr(input);
      if (s.length === 0) return s;
      var words = s.split(/\s+/);
      return words.reverse().join(" ");
    };

    /* --------------------------------------------------
     * phantom.strings.chain() - Chaining API
     * Allows chaining multiple string operations
     * -------------------------------------------------- */
    
    phantom.strings.chain = function (input) {
      var value = toStr(input);
      
      // Create a function that returns the chainable object
      // This allows automatic conversion in string contexts
      function ChainableObject() {
        return value;
      }
      
      // Chainable wrapper object
      var chainable = {
        // Get the final value
        value: function () {
          return value;
        },
        
        // Get the final value (alias for .value())
        toString: function () {
          return value;
        },
        
        // Return value when used in primitive context
        valueOf: function () {
          return value;
        },
        
        // For Java/Rhino compatibility - return value when object is converted
        // This helps with logger.info() and other Java interop
        toJavaString: function() {
          if (typeof java !== "undefined" && java.lang && java.lang.String) {
            return java.lang.String.valueOf(value);
          }
          return value;
        },
        
        // Convert to number chain
        toNumberChain: function () {
          return phantom.numbers.chain(value);
        },
        
        // String operations that can be chained
        trim: function () {
          value = phantom.strings.operation.trim(value);
          return chainable;
        },
        
        toUpperCase: function () {
          value = phantom.strings.operation.toUpperCase(value);
          return chainable;
        },
        
        toLowerCase: function () {
          value = phantom.strings.operation.toLowerCase(value);
          return chainable;
        },
        
        capitalize: function () {
          value = phantom.strings.operation.capitalize(value);
          return chainable;
        },
        
        reverse: function () {
          value = phantom.strings.operation.reverse(value);
          return chainable;
        },
        
        reverseWords: function () {
          value = phantom.strings.operation.reverseWords(value);
          return chainable;
        },
        
        leftTrim: function () {
          value = phantom.strings.operation.leftTrim(value);
          return chainable;
        },
        
        rightTrim: function () {
          value = phantom.strings.operation.rightTrim(value);
          return chainable;
        },
        
        replace: function (searchString, replaceString) {
          value = phantom.strings.operation.replace(value, searchString, replaceString);
          return chainable;
        },
        
        replaceAll: function (searchString, replaceString) {
          value = phantom.strings.operation.replaceAll(value, searchString, replaceString);
          return chainable;
        },
        
        remove: function (stringToRemove) {
          value = phantom.strings.operation.remove(value, stringToRemove);
          return chainable;
        },
        
        leftPad: function (padChar, count) {
          value = phantom.strings.operation.leftPad(value, padChar, count);
          return chainable;
        },
        
        rightPad: function (padChar, count) {
          value = phantom.strings.operation.rightPad(value, padChar, count);
          return chainable;
        },
        
        substring: function (start, end) {
          value = phantom.strings.operation.substring(value, start, end);
          return chainable;
        },
        
        wordwrap: function (size, cut, everything) {
          value = phantom.strings.operation.wordwrap(value, size, cut, everything);
          return chainable;
        }
      };
      
      return chainable;
    };
  
    /* --------------------------------------------------
     * phantom.numbers.operation.*
     * (no logging on success; throw only on error)
     * -------------------------------------------------- */
  
    phantom.numbers = { operation: {} };
  
    function toNumStrict(x) {
      if (x === null || typeof x === "undefined") return fail("Value is null or undefined");
      var n = Number(x);
      if (isNaN(n) || !isFinite(n)) return fail("Value is not a valid number: " + String(x));
      return n;
    }
  
    phantom.numbers.operation.parse = function (value) {
      return toNumStrict(value);
    };
  
    phantom.numbers.operation.isNumber = function (value) {
      try {
        var n = Number(value);
        return !(isNaN(n) || !isFinite(n));
      } catch (e) {
        return false;
      }
    };
  
    phantom.numbers.operation.add = function (a, b) {
      return toNumStrict(a) + toNumStrict(b);
    };
  
    phantom.numbers.operation.subtract = function (a, b) {
      return toNumStrict(a) - toNumStrict(b);
    };
  
    phantom.numbers.operation.multiply = function (a, b) {
      return toNumStrict(a) * toNumStrict(b);
    };
  
    phantom.numbers.operation.divide = function (a, b) {
      var denom = toNumStrict(b);
      if (denom === 0) return fail("Division by zero");
      return toNumStrict(a) / denom;
    };
  
    phantom.numbers.operation.round = function (value, decimals) {
      var n = toNumStrict(value);
      var d = toNumStrict(decimals == null ? 0 : decimals);
      var p = Math.pow(10, d);
      return Math.round(n * p) / p;
    };
  
    phantom.numbers.operation.min = function (a, b) {
      var x = toNumStrict(a), y = toNumStrict(b);
      return x < y ? x : y;
    };
  
    phantom.numbers.operation.max = function (a, b) {
      var x = toNumStrict(a), y = toNumStrict(b);
      return x > y ? x : y;
    };
  
    phantom.numbers.operation.abs = function (value) {
      return Math.abs(toNumStrict(value));
    };

    phantom.numbers.operation.ceil = function (value) {
      return Math.ceil(toNumStrict(value));
    };

    phantom.numbers.operation.floor = function (value) {
      return Math.floor(toNumStrict(value));
    };

    phantom.numbers.operation.sqrt = function (value) {
      var n = toNumStrict(value);
      if (n < 0) return fail("Cannot calculate square root of negative number: " + n);
      return Math.sqrt(n);
    };

    phantom.numbers.operation.pow = function (base, exponent) {
      return Math.pow(toNumStrict(base), toNumStrict(exponent));
    };

    phantom.numbers.operation.mod = function (dividend, divisor) {
      var d = toNumStrict(divisor);
      if (d === 0) return fail("Modulo by zero");
      return toNumStrict(dividend) % d;
    };

    phantom.numbers.operation.random = function (min, max) {
      var minVal = min != null ? toNumStrict(min) : 0;
      var maxVal = max != null ? toNumStrict(max) : 1;
      if (minVal > maxVal) return fail("Minimum value (" + minVal + ") is greater than maximum value (" + maxVal + ")");
      return Math.random() * (maxVal - minVal) + minVal;
    };

    phantom.numbers.operation.randomInt = function (min, max) {
      var minVal = min != null ? toNumStrict(min) : 0;
      var maxVal = max != null ? toNumStrict(max) : 1;
      if (minVal > maxVal) return fail("Minimum value (" + minVal + ") is greater than maximum value (" + maxVal + ")");
      return Math.floor(Math.random() * (Math.floor(maxVal) - Math.ceil(minVal) + 1)) + Math.ceil(minVal);
    };

    phantom.numbers.operation.between = function (value, min, max) {
      var v = toNumStrict(value);
      var minVal = toNumStrict(min);
      var maxVal = toNumStrict(max);
      return v >= minVal && v <= maxVal;
    };

    phantom.numbers.operation.clamp = function (value, min, max) {
      var v = toNumStrict(value);
      var minVal = toNumStrict(min);
      var maxVal = toNumStrict(max);
      if (minVal > maxVal) return fail("Minimum value (" + minVal + ") is greater than maximum value (" + maxVal + ")");
      if (v < minVal) return minVal;
      if (v > maxVal) return maxVal;
      return v;
    };

    phantom.numbers.operation.sign = function (value) {
      var n = toNumStrict(value);
      if (n > 0) return 1;
      if (n < 0) return -1;
      return 0;
    };

    phantom.numbers.operation.isEven = function (value) {
      var n = toNumStrict(value);
      return n % 2 === 0;
    };

    phantom.numbers.operation.isOdd = function (value) {
      var n = toNumStrict(value);
      return n % 2 !== 0;
    };

    phantom.numbers.operation.isPositive = function (value) {
      return toNumStrict(value) > 0;
    };

    phantom.numbers.operation.isNegative = function (value) {
      return toNumStrict(value) < 0;
    };

    phantom.numbers.operation.isZero = function (value) {
      return toNumStrict(value) === 0;
    };

    phantom.numbers.operation.toFixed = function (value, decimals) {
      var n = toNumStrict(value);
      var d = decimals != null ? toNumStrict(decimals) : 0;
      if (d < 0 || d > 20) return fail("Decimal places must be between 0 and 20, got: " + d);
      return n.toFixed(Math.floor(d));
    };

    phantom.numbers.operation.truncate = function (value) {
      var n = toNumStrict(value);
      return n < 0 ? Math.ceil(n) : Math.floor(n);
    };

    /* --------------------------------------------------
     * phantom.numbers.chain() - Chaining API
     * Allows chaining multiple number operations
     * -------------------------------------------------- */
    
    phantom.numbers.chain = function (input) {
      var value = toNumStrict(input);
      
      // Chainable wrapper object
      var chainable = {
        // Get the final value
        value: function () {
          return value;
        },
        
        // Get the final value as string
        toString: function () {
          return String(value);
        },
        
        // Return value when used in primitive context
        valueOf: function () {
          return value;
        },
        
        // Convert to string chain
        toStringChain: function () {
          return phantom.strings.chain(String(value));
        },
        
        // Unary operations (modify the value)
        abs: function () {
          value = phantom.numbers.operation.abs(value);
          return chainable;
        },
        
        round: function (decimals) {
          value = phantom.numbers.operation.round(value, decimals);
          return chainable;
        },
        
        ceil: function () {
          value = phantom.numbers.operation.ceil(value);
          return chainable;
        },
        
        floor: function () {
          value = phantom.numbers.operation.floor(value);
          return chainable;
        },
        
        truncate: function () {
          value = phantom.numbers.operation.truncate(value);
          return chainable;
        },
        
        sqrt: function () {
          value = phantom.numbers.operation.sqrt(value);
          return chainable;
        },
        
        // Binary operations (take second operand as parameter)
        add: function (b) {
          value = phantom.numbers.operation.add(value, b);
          return chainable;
        },
        
        subtract: function (b) {
          value = phantom.numbers.operation.subtract(value, b);
          return chainable;
        },
        
        multiply: function (b) {
          value = phantom.numbers.operation.multiply(value, b);
          return chainable;
        },
        
        divide: function (b) {
          value = phantom.numbers.operation.divide(value, b);
          return chainable;
        },
        
        mod: function (divisor) {
          value = phantom.numbers.operation.mod(value, divisor);
          return chainable;
        },
        
        pow: function (exponent) {
          value = phantom.numbers.operation.pow(value, exponent);
          return chainable;
        },
        
        min: function (b) {
          value = phantom.numbers.operation.min(value, b);
          return chainable;
        },
        
        max: function (b) {
          value = phantom.numbers.operation.max(value, b);
          return chainable;
        },
        
        clamp: function (min, max) {
          value = phantom.numbers.operation.clamp(value, min, max);
          return chainable;
        },
        
        // Formatting (returns string chain)
        toFixed: function (decimals) {
          var str = phantom.numbers.operation.toFixed(value, decimals);
          return phantom.strings.chain(str);
        },
        
        // Validation operations (return boolean, break chain)
        isEven: function () {
          return phantom.numbers.operation.isEven(value);
        },
        
        isOdd: function () {
          return phantom.numbers.operation.isOdd(value);
        },
        
        isPositive: function () {
          return phantom.numbers.operation.isPositive(value);
        },
        
        isNegative: function () {
          return phantom.numbers.operation.isNegative(value);
        },
        
        isZero: function () {
          return phantom.numbers.operation.isZero(value);
        },
        
        isNumber: function () {
          return phantom.numbers.operation.isNumber(value);
        },
        
        between: function (min, max) {
          return phantom.numbers.operation.between(value, min, max);
        },
        
        sign: function () {
          return phantom.numbers.operation.sign(value);
        }
      };
      
      return chainable;
    };
  
    /* --------------------------------------------------
     * phantom.json.operation.*
     * (no logging on success; throw only on error)
     * -------------------------------------------------- */
  
    phantom.json = { operation: {} };
  
    function parseJsonSafe(str) {
      try {
        if (str === null || typeof str === "undefined") return fail("JSON string is null or undefined");
        var s = toStr(str);
        if (s.length === 0) return fail("JSON string is empty");
        return JSON.parse(s);
      } catch (e) {
        return fail("Invalid JSON: " + (e.message || String(e)));
      }
    }
  
    function stringifyJsonSafe(obj) {
      try {
        if (obj === null || typeof obj === "undefined") return fail("Object is null or undefined");
        return JSON.stringify(obj);
      } catch (e) {
        return fail("Failed to stringify JSON: " + (e.message || String(e)));
      }
    }
  
    function getNestedValue(obj, path) {
      if (obj == null) return fail("Object is null or undefined");
      var keys = path.split(".");
      var current = obj;
      for (var i = 0; i < keys.length; i++) {
        if (current == null || typeof current !== "object") return fail("Path '" + path + "' is invalid: intermediate value is not an object");
        var key = keys[i];
        if (!(key in current)) return fail("Key '" + key + "' not found in path '" + path + "'");
        current = current[key];
        if (current === undefined) return fail("Value at path '" + path + "' is undefined");
      }
      return current;
    }
  
    function setNestedValue(obj, path, value) {
      if (obj == null || typeof obj !== "object") return fail();
      var keys = path.split(".");
      var current = obj;
      for (var i = 0; i < keys.length - 1; i++) {
        var key = keys[i];
        if (current[key] == null || typeof current[key] !== "object") {
          current[key] = {};
        }
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;
      return obj;
    }
  
    phantom.json.operation.parse = function (jsonString) {
      return parseJsonSafe(jsonString);
    };
  
    phantom.json.operation.stringify = function (obj) {
      return stringifyJsonSafe(obj);
    };
  
    phantom.json.operation.get = function (obj, keyPath) {
      if (obj == null) return fail("Object is null or undefined");
      if (keyPath == null) return fail("Key path is null or undefined");
      var path = toStr(keyPath);
      if (path.length === 0) return fail("Key path is empty");
      return getNestedValue(obj, path);
    };
  
    phantom.json.operation.set = function (obj, keyPath, value) {
      if (obj == null) return fail("Object is null or undefined");
      if (keyPath == null) return fail("Key path is null or undefined");
      var path = toStr(keyPath);
      if (path.length === 0) return fail("Key path is empty");
      try {
        var result = JSON.parse(JSON.stringify(obj)); // Deep clone
        setNestedValue(result, path, value);
        return result;
      } catch (e) {
        return fail("Failed to set value at path '" + path + "': " + (e.message || String(e)));
      }
    };
  
    phantom.json.operation.has = function (obj, keyPath) {
      if (obj == null) return fail("Object is null or undefined");
      if (keyPath == null) return fail("Key path is null or undefined");
      var path = toStr(keyPath);
      if (path.length === 0) return fail("Key path is empty");
      try {
        var keys = path.split(".");
        var current = obj;
        for (var i = 0; i < keys.length; i++) {
          if (current == null || typeof current !== "object") return false;
          var key = keys[i];
          if (!(key in current)) return false;
          current = current[key];
          if (current === undefined) return false;
        }
        return true;
      } catch (e) {
        return false;
      }
    };
  
    phantom.json.operation.remove = function (obj, keyPath) {
      if (obj == null) return fail("Object is null or undefined");
      if (keyPath == null) return fail("Key path is null or undefined");
      var path = toStr(keyPath);
      if (path.length === 0) return fail("Key path is empty");
      try {
        var result = JSON.parse(JSON.stringify(obj)); // Deep clone
        var keys = path.split(".");
        var current = result;
        for (var i = 0; i < keys.length - 1; i++) {
          if (current == null || typeof current !== "object") return fail("Path '" + path + "' is invalid: intermediate value is not an object");
          current = current[keys[i]];
        }
        if (current == null || typeof current !== "object") return fail("Path '" + path + "' is invalid: cannot remove from non-object");
        delete current[keys[keys.length - 1]];
        return result;
      } catch (e) {
        return fail("Failed to remove key at path '" + path + "': " + (e.message || String(e)));
      }
    };
  
    phantom.json.operation.keys = function (obj) {
      if (obj == null || typeof obj !== "object") return fail("Object is null, undefined, or not an object");
      if (Array.isArray(obj)) return fail("Cannot get keys from array, use size() for array length");
      try {
        return Object.keys(obj);
      } catch (e) {
        return fail("Failed to get keys: " + (e.message || String(e)));
      }
    };
  
    phantom.json.operation.values = function (obj) {
      if (obj == null || typeof obj !== "object") return fail("Object is null, undefined, or not an object");
      if (Array.isArray(obj)) return fail("Cannot get values from array");
      try {
        var keys = Object.keys(obj);
        var vals = [];
        for (var i = 0; i < keys.length; i++) {
          vals.push(obj[keys[i]]);
        }
        return vals;
      } catch (e) {
        return fail("Failed to get values: " + (e.message || String(e)));
      }
    };
  
    phantom.json.operation.size = function (obj) {
      if (obj == null || typeof obj !== "object") return fail("Object is null, undefined, or not an object");
      if (Array.isArray(obj)) return obj.length;
      try {
        return Object.keys(obj).length;
      } catch (e) {
        return fail("Failed to get size: " + (e.message || String(e)));
      }
    };
  
    phantom.json.operation.merge = function (obj1, obj2) {
      if (obj1 == null || typeof obj1 !== "object") return fail("First object is null, undefined, or not an object");
      if (obj2 == null || typeof obj2 !== "object") return fail("Second object is null, undefined, or not an object");
      if (Array.isArray(obj1) || Array.isArray(obj2)) return fail("Cannot merge arrays, only objects");
      try {
        var result = JSON.parse(JSON.stringify(obj1)); // Deep clone
        var keys = Object.keys(obj2);
        for (var i = 0; i < keys.length; i++) {
          result[keys[i]] = obj2[keys[i]];
        }
        return result;
      } catch (e) {
        return fail("Failed to merge objects: " + (e.message || String(e)));
      }
    };
  
    phantom.json.operation.isEmpty = function (obj) {
      if (obj == null) return true;
      if (typeof obj !== "object") return fail("Value is not an object or array");
      if (Array.isArray(obj)) return obj.length === 0;
      try {
        return Object.keys(obj).length === 0;
      } catch (e) {
        return fail("Failed to check if empty: " + (e.message || String(e)));
      }
    };
  
    phantom.json.operation.isArray = function (obj) {
      if (obj == null) return false;
      return Array.isArray(obj);
    };
  
    phantom.json.operation.isObject = function (obj) {
      if (obj == null) return false;
      return typeof obj === "object" && !Array.isArray(obj);
    };
  
    phantom.json.operation.toString = function (obj) {
      // Helper method to convert JSON object/array to string for logging
      // In OIE/Rhino environment, objects/arrays show Java representation when logged directly
      return stringifyJsonSafe(obj);
    };
  
    phantom.json.operation.prettyPrint = function (obj, indent) {
      // Pretty print JSON with indentation
      try {
        if (obj === null || typeof obj === "undefined") return fail("Object is null or undefined");
        var indentSize = indent != null ? toNumStrict(indent) : 2;
        if (indentSize < 0 || indentSize > 10) return fail("Indent size must be between 0 and 10, got: " + indentSize);
        return JSON.stringify(obj, null, indentSize);
      } catch (e) {
        return fail("Failed to pretty print JSON: " + (e.message || String(e)));
      }
    };
  
    /* --------------------------------------------------
     * phantom.base64.operation.*
     * (no logging on success; throw only on error)
     * -------------------------------------------------- */
  
    phantom.base64 = { operation: {} };
  
    function encodeBase64Safe(str) {
      try {
        if (str === null || typeof str === "undefined") return fail("String is null or undefined");
        var s = toStr(str);
        
        // Try Java Base64 first (for OIE/Rhino environment)
        try {
          if (typeof java !== "undefined" && java.util && java.util.Base64) {
            var encoder = java.util.Base64.getEncoder();
            var bytes = new java.lang.String(s).getBytes("UTF-8");
            return encoder.encodeToString(bytes);
          }
        } catch (e) {}
        
        // Fallback to btoa with UTF-8 encoding (browser/Node.js)
        if (typeof btoa !== "undefined") {
          try {
            // For unicode, encode to UTF-8 first
            var utf8 = unescape(encodeURIComponent(s));
            return btoa(utf8);
          } catch (e) {
            // Fallback to simple btoa for ASCII
            return btoa(s);
          }
        }
        
        // Manual base64 encoding if neither is available (ASCII only)
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var result = "";
        var i = 0;
        while (i < s.length) {
          var a = s.charCodeAt(i++);
          var b = i < s.length ? s.charCodeAt(i++) : 0;
          var c = i < s.length ? s.charCodeAt(i++) : 0;
          var bitmap = (a << 16) | (b << 8) | c;
          result += chars.charAt((bitmap >> 18) & 63);
          result += chars.charAt((bitmap >> 12) & 63);
          result += i - 2 < s.length ? chars.charAt((bitmap >> 6) & 63) : "=";
          result += i - 1 < s.length ? chars.charAt(bitmap & 63) : "=";
        }
        return result;
      } catch (e) {
        return fail("Failed to encode base64: " + (e.message || String(e)));
      }
    }
  
    function decodeBase64Safe(str) {
      try {
        if (str === null || typeof str === "undefined") return fail("String is null or undefined");
        var s = toStr(str);
        if (s.length === 0) return fail("Base64 string is empty");
        
        // Try Java Base64 first (for OIE/Rhino environment)
        try {
          if (typeof java !== "undefined" && java.util && java.util.Base64) {
            var decoder = java.util.Base64.getDecoder();
            var bytes = decoder.decode(s);
            return new java.lang.String(bytes, "UTF-8").toString();
          }
        } catch (e) {
          return fail("Invalid base64 string: " + (e.message || String(e)));
        }
        
        // Fallback to atob with UTF-8 decoding (browser/Node.js)
        if (typeof atob !== "undefined") {
          try {
            var decoded = atob(s);
            // Decode UTF-8 if needed
            try {
              return decodeURIComponent(escape(decoded));
            } catch (e) {
              return decoded;
            }
          } catch (e) {
            return fail("Invalid base64 string: " + (e.message || String(e)));
          }
        }
        
        // Manual base64 decoding if neither is available (ASCII only)
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var result = "";
        var i = 0;
        s = s.replace(/[^A-Za-z0-9\+\/]/g, "");
        while (i < s.length) {
          var encoded1 = chars.indexOf(s.charAt(i++));
          var encoded2 = chars.indexOf(s.charAt(i++));
          var encoded3 = chars.indexOf(s.charAt(i++));
          var encoded4 = chars.indexOf(s.charAt(i++));
          if (encoded1 < 0 || encoded2 < 0 || encoded3 < 0 || encoded4 < 0) {
            return fail("Invalid base64 string");
          }
          var bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
          if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 16) & 255);
          if (encoded4 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
          result += String.fromCharCode(bitmap & 255);
        }
        return result;
      } catch (e) {
        return fail("Failed to decode base64: " + (e.message || String(e)));
      }
    }
  
    phantom.base64.operation.encode = function (str) {
      return encodeBase64Safe(str);
    };
  
    phantom.base64.operation.decode = function (str) {
      return decodeBase64Safe(str);
    };
  
    /* --------------------------------------------------
     * phantom.xml.operation.*
     * (no logging on success; throw only on error)
     * -------------------------------------------------- */
  
    phantom.xml = { operation: {} };
  
    function parseXmlSafe(str) {
      try {
        if (str === null || typeof str === "undefined") return fail("XML string is null or undefined");
        var s = toStr(str);
        if (s.length === 0) return fail("XML string is empty");
        
        // Use Java XML parsing (for OIE/Rhino environment)
        try {
          if (typeof java !== "undefined" && java.io && java.io.StringReader) {
            var factory = javax.xml.parsers.DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            var builder = factory.newDocumentBuilder();
            var reader = new java.io.StringReader(s);
            var doc = builder.parse(new org.xml.sax.InputSource(reader));
            return doc;
          }
        } catch (e) {
          return fail("Failed to parse XML: " + (e.message || String(e)));
        }
        
        return fail("XML parsing not available - Java XML APIs required (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to parse XML: " + (e.message || String(e)));
      }
    }
  
    function stringifyXmlSafe(obj) {
      try {
        if (obj === null || typeof obj === "undefined") return fail("XML object is null or undefined");
        
        // If it's already a string, return it
        if (typeof obj === "string") return obj;
        
        // Use Java XML serialization (for OIE/Rhino environment)
        try {
          if (typeof java !== "undefined" && obj.getDocumentElement) {
            var transformer = javax.xml.transform.TransformerFactory.newInstance().newTransformer();
            var source = new javax.xml.transform.dom.DOMSource(obj);
            var writer = new java.io.StringWriter();
            var result = new javax.xml.transform.stream.StreamResult(writer);
            transformer.transform(source, result);
            return writer.toString();
          }
        } catch (e) {
          return fail("Failed to stringify XML: " + (e.message || String(e)));
        }
        
        return fail("XML stringification not available - Java XML APIs required (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to stringify XML: " + (e.message || String(e)));
      }
    }
  
    function getXmlValue(xml, xpath) {
      try {
        if (xml == null) return fail("XML object is null or undefined");
        if (xpath == null) return fail("XPath is null or undefined");
        var path = toStr(xpath);
        if (path.length === 0) return fail("XPath is empty");
        
        // Try Java XPath (for OIE/Rhino environment)
        try {
          if (typeof java !== "undefined" && javax.xml.xpath) {
            var xpathFactory = javax.xml.xpath.XPathFactory.newInstance();
            var xpathObj = xpathFactory.newXPath();
            var expr = xpathObj.compile(path);
            var result = expr.evaluate(xml, javax.xml.xpath.XPathConstants.STRING);
            if (result == null || result === "") return fail("XPath '" + path + "' not found or empty");
            return String(result);
          }
        } catch (e) {
          return fail("XPath evaluation failed: " + (e.message || String(e)));
        }
        
        return fail("XML querying not available - Java XPath APIs required (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get XML value: " + (e.message || String(e)));
      }
    }
  
    function hasXmlValue(xml, xpath) {
      try {
        if (xml == null) return false;
        if (xpath == null) return false;
        var path = toStr(xpath);
        if (path.length === 0) return false;
        
        // Try Java XPath (for OIE/Rhino environment)
        try {
          if (typeof java !== "undefined" && javax.xml.xpath) {
            var xpathFactory = javax.xml.xpath.XPathFactory.newInstance();
            var xpathObj = xpathFactory.newXPath();
            var expr = xpathObj.compile(path);
            var result = expr.evaluate(xml, javax.xml.xpath.XPathConstants.NODE);
            return result != null;
          }
        } catch (e) {
          return false;
        }
        
        return false;
      } catch (e) {
        return false;
      }
    }
  
    phantom.xml.operation.parse = function (xmlString) {
      return parseXmlSafe(xmlString);
    };
  
    phantom.xml.operation.stringify = function (xmlObj) {
      return stringifyXmlSafe(xmlObj);
    };
  
    phantom.xml.operation.get = function (xml, xpath) {
      return getXmlValue(xml, xpath);
    };
  
    phantom.xml.operation.has = function (xml, xpath) {
      return hasXmlValue(xml, xpath);
    };
  
    phantom.xml.operation.toString = function (xmlObj) {
      // Helper method to convert XML object to string for logging
      return stringifyXmlSafe(xmlObj);
    };
  
    /* --------------------------------------------------
     * phantom.dates.operation.*
     * (no logging on success; throw only on error)
     * -------------------------------------------------- */
  
    phantom.dates = { operation: {}, format: {} };
  
    // Date format constants (enum-like)
    phantom.dates.FORMAT = {
      ISO_DATE: "yyyy-MM-dd",
      ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss",
      ISO_DATETIME_MS: "yyyy-MM-dd'T'HH:mm:ss.SSS",
      US_DATE: "MM/dd/yyyy",
      US_DATETIME: "MM/dd/yyyy HH:mm:ss",
      EU_DATE: "dd/MM/yyyy",
      EU_DATETIME: "dd/MM/yyyy HH:mm:ss"
    };
  
    // ChronoUnit constants (Java.time enum values)
    phantom.dates.UNIT = {
      DAYS: "DAYS",
      HOURS: "HOURS",
      MINUTES: "MINUTES",
      SECONDS: "SECONDS",
      MILLIS: "MILLIS",
      WEEKS: "WEEKS",
      MONTHS: "MONTHS",
      YEARS: "YEARS"
    };
  
    function getJavaLocalDate(dateInput) {
      try {
        if (dateInput == null) return fail("Date input is null or undefined");
        
        // Try Java.time APIs first (for OIE/Rhino environment)
        try {
          if (typeof java !== "undefined" && java.time) {
            // If already a LocalDate
            if (dateInput.getClass && dateInput.getClass().getName() === "java.time.LocalDate") {
              return dateInput;
            }
            // If already a LocalDateTime
            if (dateInput.getClass && dateInput.getClass().getName() === "java.time.LocalDateTime") {
              return dateInput.toLocalDate();
            }
            // If string, try to parse
            if (typeof dateInput === "string" || (dateInput.getClass && dateInput.getClass().getName() === "java.lang.String")) {
              var s = String(dateInput);
              if (s.length === 0) return fail("Date string is empty");
              // Try ISO format first
              try {
                return java.time.LocalDate.parse(s);
              } catch (e) {
                // Try common formats
                var formatters = [
                  java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"),
                  java.time.format.DateTimeFormatter.ofPattern("MM/dd/yyyy"),
                  java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")
                ];
                for (var i = 0; i < formatters.length; i++) {
                  try {
                    return java.time.LocalDate.parse(s, formatters[i]);
                  } catch (e2) {}
                }
                return fail("Failed to parse date string: " + s);
              }
            }
            // If number (timestamp), convert
            if (typeof dateInput === "number" || (dateInput.getClass && dateInput.getClass().getName() === "java.lang.Long")) {
              var timestamp = Number(dateInput);
              var instant = java.time.Instant.ofEpochMilli(timestamp);
              return java.time.LocalDate.ofInstant(instant, java.time.ZoneId.systemDefault());
            }
          }
        } catch (e) {}
        
        // Fallback to JavaScript Date
        if (dateInput instanceof Date) {
          try {
            if (typeof java !== "undefined" && java.time) {
              var year = dateInput.getFullYear();
              var month = dateInput.getMonth() + 1; // JS months are 0-based
              var day = dateInput.getDate();
              return java.time.LocalDate.of(year, month, day);
            }
          } catch (e) {}
        }
        
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get date: " + (e.message || String(e)));
      }
    }
  
    function getJavaLocalDateTime(dateInput) {
      try {
        if (dateInput == null) return fail("Date input is null or undefined");
        
        // Try Java.time APIs first
        try {
          if (typeof java !== "undefined" && java.time) {
            // If already a LocalDateTime
            if (dateInput.getClass && dateInput.getClass().getName() === "java.time.LocalDateTime") {
              return dateInput;
            }
            // If already a LocalDate
            if (dateInput.getClass && dateInput.getClass().getName() === "java.time.LocalDate") {
              return dateInput.atStartOfDay();
            }
            // If string, try to parse
            if (typeof dateInput === "string" || (dateInput.getClass && dateInput.getClass().getName() === "java.lang.String")) {
              var s = String(dateInput);
              if (s.length === 0) return fail("Date string is empty");
              // Try ISO format first
              try {
                return java.time.LocalDateTime.parse(s);
              } catch (e) {
                // Try common formats
                var formatters = [
                  java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"),
                  java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
                  java.time.format.DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss")
                ];
                for (var i = 0; i < formatters.length; i++) {
                  try {
                    return java.time.LocalDateTime.parse(s, formatters[i]);
                  } catch (e2) {}
                }
                return fail("Failed to parse datetime string: " + s);
              }
            }
            // If number (timestamp), convert
            if (typeof dateInput === "number" || (dateInput.getClass && dateInput.getClass().getName() === "java.lang.Long")) {
              var timestamp = Number(dateInput);
              var instant = java.time.Instant.ofEpochMilli(timestamp);
              return java.time.LocalDateTime.ofInstant(instant, java.time.ZoneId.systemDefault());
            }
          }
        } catch (e) {}
        
        // Fallback to JavaScript Date
        if (dateInput instanceof Date) {
          try {
            if (typeof java !== "undefined" && java.time) {
              var year = dateInput.getFullYear();
              var month = dateInput.getMonth() + 1;
              var day = dateInput.getDate();
              var hour = dateInput.getHours();
              var minute = dateInput.getMinutes();
              var second = dateInput.getSeconds();
              return java.time.LocalDateTime.of(year, month, day, hour, minute, second);
            }
          } catch (e) {}
        }
        
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get datetime: " + (e.message || String(e)));
      }
    }
  
    function getChronoUnit(unit) {
      if (unit == null) return fail("Unit is null or undefined");
      var unitStr = String(unit).toUpperCase();
      try {
        if (typeof java !== "undefined" && java.time.temporal) {
          return java.time.temporal.ChronoUnit.valueOf(unitStr);
        }
      } catch (e) {
        return fail("Invalid unit: " + unitStr + ". Use DAYS, HOURS, MINUTES, SECONDS, MILLIS, WEEKS, MONTHS, or YEARS");
      }
      return fail("ChronoUnit not available - Java.time APIs required");
    }
  
    phantom.dates.operation.now = function () {
      try {
        if (typeof java !== "undefined" && java.time) {
          return java.time.LocalDateTime.now();
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get current date: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.today = function () {
      try {
        if (typeof java !== "undefined" && java.time) {
          return java.time.LocalDate.now();
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get today's date: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.parse = function (dateString, format) {
      try {
        if (dateString == null) return fail("Date string is null or undefined");
        var s = toStr(dateString);
        if (s.length === 0) return fail("Date string is empty");
        
        if (typeof java !== "undefined" && java.time) {
          if (format == null) {
            // Try ISO format first
            try {
              return java.time.LocalDate.parse(s);
            } catch (e) {
              // Try common formats
              var formatters = [
                java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"),
                java.time.format.DateTimeFormatter.ofPattern("MM/dd/yyyy"),
                java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")
              ];
              for (var i = 0; i < formatters.length; i++) {
                try {
                  return java.time.LocalDate.parse(s, formatters[i]);
                } catch (e2) {}
              }
              return fail("Failed to parse date string: " + s);
            }
          } else {
            var formatter = java.time.format.DateTimeFormatter.ofPattern(toStr(format));
            return java.time.LocalDate.parse(s, formatter);
          }
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to parse date: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.parseDateTime = function (dateTimeString, format) {
      try {
        if (dateTimeString == null) return fail("DateTime string is null or undefined");
        var s = toStr(dateTimeString);
        if (s.length === 0) return fail("DateTime string is empty");
        
        if (typeof java !== "undefined" && java.time) {
          if (format == null) {
            // Try ISO format first
            try {
              return java.time.LocalDateTime.parse(s);
            } catch (e) {
              // Try common formats
              var formatters = [
                java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"),
                java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
                java.time.format.DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss")
              ];
              for (var i = 0; i < formatters.length; i++) {
                try {
                  return java.time.LocalDateTime.parse(s, formatters[i]);
                } catch (e2) {}
              }
              return fail("Failed to parse datetime string: " + s);
            }
          } else {
            var formatter = java.time.format.DateTimeFormatter.ofPattern(toStr(format));
            return java.time.LocalDateTime.parse(s, formatter);
          }
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to parse datetime: " + (e.message || String(e)));
      }
    };
  
    // Format detection intelligence engine
    phantom.dates.format.detect = function (dateString) {
      try {
        if (dateString == null) return fail("Date string is null or undefined");
        var s = toStr(dateString);
        if (s.length === 0) return fail("Date string is empty");
        
        if (typeof java !== "undefined" && java.time) {
          // Comprehensive list of common date/datetime formats to try
          // Ordered by most common first
          var formats = [
            // ISO formats (most common)
            { pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS", name: "ISO_DATETIME_MS" },
            { pattern: "yyyy-MM-dd'T'HH:mm:ss", name: "ISO_DATETIME" },
            { pattern: "yyyy-MM-dd HH:mm:ss.SSS", name: "ISO_DATETIME_MS_SPACE" },
            { pattern: "yyyy-MM-dd HH:mm:ss", name: "ISO_DATETIME_SPACE" },
            { pattern: "yyyy-MM-dd", name: "ISO_DATE" },
            
            // US formats
            { pattern: "MM/dd/yyyy HH:mm:ss", name: "US_DATETIME" },
            { pattern: "MM/dd/yyyy", name: "US_DATE" },
            { pattern: "M/d/yyyy HH:mm:ss", name: "US_DATETIME_SHORT" },
            { pattern: "M/d/yyyy", name: "US_DATE_SHORT" },
            { pattern: "MM-dd-yyyy HH:mm:ss", name: "US_DATETIME_DASH" },
            { pattern: "MM-dd-yyyy", name: "US_DATE_DASH" },
            
            // EU formats
            { pattern: "dd/MM/yyyy HH:mm:ss", name: "EU_DATETIME" },
            { pattern: "dd/MM/yyyy", name: "EU_DATE" },
            { pattern: "d/M/yyyy HH:mm:ss", name: "EU_DATETIME_SHORT" },
            { pattern: "d/M/yyyy", name: "EU_DATE_SHORT" },
            { pattern: "dd-MM-yyyy HH:mm:ss", name: "EU_DATETIME_DASH" },
            { pattern: "dd-MM-yyyy", name: "EU_DATE_DASH" },
            
            // Other common formats
            { pattern: "yyyy/MM/dd HH:mm:ss", name: "ISO_DATE_SLASH_DATETIME" },
            { pattern: "yyyy/MM/dd", name: "ISO_DATE_SLASH" },
            { pattern: "dd.MM.yyyy HH:mm:ss", name: "EU_DATETIME_DOT" },
            { pattern: "dd.MM.yyyy", name: "EU_DATE_DOT" },
            { pattern: "MM.dd.yyyy HH:mm:ss", name: "US_DATETIME_DOT" },
            { pattern: "MM.dd.yyyy", name: "US_DATE_DOT" },
            
            // Time-only formats (for datetime detection)
            { pattern: "HH:mm:ss.SSS", name: "TIME_MS" },
            { pattern: "HH:mm:ss", name: "TIME" },
            { pattern: "HH:mm", name: "TIME_SHORT" },
            
            // Year formats
            { pattern: "yyyy", name: "YEAR" },
            { pattern: "MM/yyyy", name: "MONTH_YEAR" },
            { pattern: "yyyy-MM", name: "YEAR_MONTH" }
          ];
          
          // Try each format
          for (var i = 0; i < formats.length; i++) {
            try {
              var formatter = java.time.format.DateTimeFormatter.ofPattern(formats[i].pattern);
              
              // Check if it's a datetime format (contains time components)
              var isDateTime = formats[i].pattern.indexOf("HH") >= 0 || 
                              formats[i].pattern.indexOf("mm") >= 0 || 
                              formats[i].pattern.indexOf("ss") >= 0;
              
              if (isDateTime) {
                // Try parsing as LocalDateTime
                try {
                  java.time.LocalDateTime.parse(s, formatter);
                  return {
                    format: formats[i].pattern,
                    name: formats[i].name,
                    type: "datetime",
                    valid: true
                  };
                } catch (e) {}
              } else {
                // Try parsing as LocalDate
                try {
                  java.time.LocalDate.parse(s, formatter);
                  return {
                    format: formats[i].pattern,
                    name: formats[i].name,
                    type: "date",
                    valid: true
                  };
                } catch (e) {}
              }
            } catch (e) {
              // Continue to next format
            }
          }
          
          // If no format matched, return null
          return {
            format: null,
            name: null,
            type: null,
            valid: false
          };
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to detect date format: " + (e.message || String(e)));
      }
    };

    phantom.dates.operation.format = function (date, format) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (format == null) return fail("Format is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var formatter = java.time.format.DateTimeFormatter.ofPattern(toStr(format));
          var localDate = getJavaLocalDate(date);
          return localDate.format(formatter);
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to format date: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.formatDateTime = function (dateTime, format) {
      try {
        if (dateTime == null) return fail("DateTime is null or undefined");
        if (format == null) return fail("Format is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var formatter = java.time.format.DateTimeFormatter.ofPattern(toStr(format));
          var localDateTime = getJavaLocalDateTime(dateTime);
          return localDateTime.format(formatter);
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to format datetime: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.getYear = function (date) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (typeof java !== "undefined" && java.time) {
          var localDate = getJavaLocalDate(date);
          return localDate.getYear();
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get year: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.getMonth = function (date) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (typeof java !== "undefined" && java.time) {
          var localDate = getJavaLocalDate(date);
          return localDate.getMonthValue(); // 1-12
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get month: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.getDay = function (date) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (typeof java !== "undefined" && java.time) {
          var localDate = getJavaLocalDate(date);
          return localDate.getDayOfMonth();
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get day: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.getDayOfWeek = function (date) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (typeof java !== "undefined" && java.time) {
          var localDate = getJavaLocalDate(date);
          return localDate.getDayOfWeek().toString(); // MONDAY, TUESDAY, etc.
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get day of week: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.add = function (date, amount, unit) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (amount == null) return fail("Amount is null or undefined");
        if (unit == null) return fail("Unit is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var localDate = getJavaLocalDate(date);
          var amt = toNumStrict(amount);
          var chronoUnit = getChronoUnit(unit);
          return localDate.plus(amt, chronoUnit);
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to add to date: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.subtract = function (date, amount, unit) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (amount == null) return fail("Amount is null or undefined");
        if (unit == null) return fail("Unit is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var localDate = getJavaLocalDate(date);
          var amt = toNumStrict(amount);
          var chronoUnit = getChronoUnit(unit);
          return localDate.minus(amt, chronoUnit);
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to subtract from date: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.between = function (date1, date2, unit) {
      try {
        if (date1 == null) return fail("First date is null or undefined");
        if (date2 == null) return fail("Second date is null or undefined");
        if (unit == null) return fail("Unit is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var localDate1 = getJavaLocalDate(date1);
          var localDate2 = getJavaLocalDate(date2);
          var chronoUnit = getChronoUnit(unit);
          return chronoUnit.between(localDate1, localDate2);
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to calculate between dates: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.isBefore = function (date1, date2) {
      try {
        if (date1 == null) return fail("First date is null or undefined");
        if (date2 == null) return fail("Second date is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var localDate1 = getJavaLocalDate(date1);
          var localDate2 = getJavaLocalDate(date2);
          return localDate1.isBefore(localDate2);
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to compare dates: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.isAfter = function (date1, date2) {
      try {
        if (date1 == null) return fail("First date is null or undefined");
        if (date2 == null) return fail("Second date is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var localDate1 = getJavaLocalDate(date1);
          var localDate2 = getJavaLocalDate(date2);
          return localDate1.isAfter(localDate2);
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to compare dates: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.isEqual = function (date1, date2) {
      try {
        if (date1 == null) return fail("First date is null or undefined");
        if (date2 == null) return fail("Second date is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var localDate1 = getJavaLocalDate(date1);
          var localDate2 = getJavaLocalDate(date2);
          return localDate1.isEqual(localDate2);
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to compare dates: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.startOfDay = function (date) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (typeof java !== "undefined" && java.time) {
          var localDate = getJavaLocalDate(date);
          return localDate.atStartOfDay();
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get start of day: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.operation.endOfDay = function (date) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (typeof java !== "undefined" && java.time) {
          var localDate = getJavaLocalDate(date);
          return localDate.atTime(23, 59, 59, 999000000); // 23:59:59.999
        }
        return fail("Date operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to get end of day: " + (e.message || String(e)));
      }
    };
  
    /* --------------------------------------------------
     * phantom.dates.duration.*
     * (no logging on success; throw only on error)
     * -------------------------------------------------- */
  
    phantom.dates.duration = {};
  
    phantom.dates.duration.between = function (dateTime1, dateTime2) {
      try {
        if (dateTime1 == null) return fail("First datetime is null or undefined");
        if (dateTime2 == null) return fail("Second datetime is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var localDateTime1 = getJavaLocalDateTime(dateTime1);
          var localDateTime2 = getJavaLocalDateTime(dateTime2);
          return java.time.Duration.between(localDateTime1, localDateTime2);
        }
        return fail("Duration operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to calculate duration: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.duration.of = function (amount, unit) {
      try {
        if (amount == null) return fail("Amount is null or undefined");
        if (unit == null) return fail("Unit is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var amt = toNumStrict(amount);
          var chronoUnit = getChronoUnit(unit);
          return java.time.Duration.of(amt, chronoUnit);
        }
        return fail("Duration operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to create duration: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.duration.add = function (dateTime, duration) {
      try {
        if (dateTime == null) return fail("DateTime is null or undefined");
        if (duration == null) return fail("Duration is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var localDateTime = getJavaLocalDateTime(dateTime);
          if (duration.getClass && duration.getClass().getName() === "java.time.Duration") {
            return localDateTime.plus(duration);
          }
          return fail("Duration must be a Java Duration object");
        }
        return fail("Duration operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to add duration: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.duration.subtract = function (dateTime, duration) {
      try {
        if (dateTime == null) return fail("DateTime is null or undefined");
        if (duration == null) return fail("Duration is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var localDateTime = getJavaLocalDateTime(dateTime);
          if (duration.getClass && duration.getClass().getName() === "java.time.Duration") {
            return localDateTime.minus(duration);
          }
          return fail("Duration must be a Java Duration object");
        }
        return fail("Duration operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to subtract duration: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.duration.toDays = function (duration) {
      try {
        if (duration == null) return fail("Duration is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          if (duration.getClass && duration.getClass().getName() === "java.time.Duration") {
            return duration.toDays();
          }
          return fail("Duration must be a Java Duration object");
        }
        return fail("Duration operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to convert duration to days: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.duration.toHours = function (duration) {
      try {
        if (duration == null) return fail("Duration is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          if (duration.getClass && duration.getClass().getName() === "java.time.Duration") {
            return duration.toHours();
          }
          return fail("Duration must be a Java Duration object");
        }
        return fail("Duration operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to convert duration to hours: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.duration.toMinutes = function (duration) {
      try {
        if (duration == null) return fail("Duration is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          if (duration.getClass && duration.getClass().getName() === "java.time.Duration") {
            return duration.toMinutes();
          }
          return fail("Duration must be a Java Duration object");
        }
        return fail("Duration operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to convert duration to minutes: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.duration.toSeconds = function (duration) {
      try {
        if (duration == null) return fail("Duration is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          if (duration.getClass && duration.getClass().getName() === "java.time.Duration") {
            return duration.toSeconds();
          }
          return fail("Duration must be a Java Duration object");
        }
        return fail("Duration operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to convert duration to seconds: " + (e.message || String(e)));
      }
    };
  
    phantom.dates.duration.toMillis = function (duration) {
      try {
        if (duration == null) return fail("Duration is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          if (duration.getClass && duration.getClass().getName() === "java.time.Duration") {
            return duration.toMillis();
          }
          return fail("Duration must be a Java Duration object");
        }
        return fail("Duration operations require Java.time APIs (OIE/Rhino environment)");
      } catch (e) {
        return fail("Failed to convert duration to milliseconds: " + (e.message || String(e)));
      }
    };
  
    /* --------------------------------------------------
     * STRING PROTOTYPE EXTENSION
     * Add .phantom and .ps properties to strings for direct method access
     * 
     * Usage:
     *   message.phantom.strings.toUpperCase().trim().value()
     *   message.ps.toUpperCase().trim().value()
     *   String(message.phantom.strings.toUpperCase().trim())
     * 
     * Note: Always call .value() at the end or wrap in String()
     *       when passing to logger.info() or other functions
     * -------------------------------------------------- */
    
    // Helper function to create chainable string methods object
    function createStringChainMethods(self) {
      return {
        // Direct access to chain API
        chain: function() {
          return phantom.strings.chain(self);
        },
        // Direct access to operations (returns chainable)
        toUpperCase: function() {
          return phantom.strings.chain(self).toUpperCase();
        },
        toLowerCase: function() {
          return phantom.strings.chain(self).toLowerCase();
        },
        trim: function() {
          return phantom.strings.chain(self).trim();
        },
        leftTrim: function() {
          return phantom.strings.chain(self).leftTrim();
        },
        rightTrim: function() {
          return phantom.strings.chain(self).rightTrim();
        },
        capitalize: function() {
          return phantom.strings.chain(self).capitalize();
        },
        reverse: function() {
          return phantom.strings.chain(self).reverse();
        },
        reverseWords: function() {
          return phantom.strings.chain(self).reverseWords();
        },
        replace: function(search, replace) {
          return phantom.strings.chain(self).replace(search, replace);
        },
        replaceAll: function(search, replace) {
          return phantom.strings.chain(self).replaceAll(search, replace);
        },
        remove: function(str) {
          return phantom.strings.chain(self).remove(str);
        },
        leftPad: function(padChar, count) {
          return phantom.strings.chain(self).leftPad(padChar, count);
        },
        rightPad: function(padChar, count) {
          return phantom.strings.chain(self).rightPad(padChar, count);
        },
        substring: function(start, end) {
          return phantom.strings.chain(self).substring(start, end);
        },
        wordwrap: function(size, cut, everything) {
          return phantom.strings.chain(self).wordwrap(size, cut, everything);
        },
        // Direct operation access (non-chainable, returns value)
        operation: phantom.strings.operation
      };
    }
    
    // Add phantom property to String prototype
    if (typeof String !== "undefined" && String.prototype) {
      Object.defineProperty(String.prototype, 'phantom', {
        get: function() {
          var self = this;
          return {
            strings: createStringChainMethods(self),
            numbers: {
              chain: function() {
                return phantom.numbers.chain(self);
              }
            }
          };
        },
        enumerable: false,
        configurable: true
      });
      
      // Add .ps as alias for .phantom.strings (shorter syntax)
      Object.defineProperty(String.prototype, 'ps', {
        get: function() {
          return createStringChainMethods(this);
        },
        enumerable: false,
        configurable: true
      });
    }
    
    // default init
    phantom.init({ silent: true });
  
    /* --------------------------------------------------
     * AUTOCOMPLETE SUPPORT FOR OIE EDITOR
     * Explicitly define all properties to ensure OIE editor can detect them
     * -------------------------------------------------- */
    
    // OIE Editor Autocomplete Support
    // Explicitly expose all properties to ensure OIE editor can detect them
    // This pattern helps OIE's static analysis detect available properties
    (function() {
      // Force property access to ensure they're discoverable
      var _props = ['maps', 'strings', 'numbers', 'json', 'base64', 'xml', 'dates', 'version', 'help', 'autocomplete', '_'];
      for (var p = 0; p < _props.length; p++) {
        var propName = _props[p];
        if (phantom[propName] !== undefined) {
          // Access property to ensure it's in the object's property list
          void phantom[propName];
        }
      }
    })();
    
    // Create autocomplete metadata object for OIE editor introspection
    phantom._autocomplete = {
      categories: ['maps', 'strings', 'numbers', 'json', 'base64', 'xml', 'dates'],
      maps: {
        operations: ['channel', 'global', 'connector', 'response', 'configuration'],
        methods: ['save', 'get', 'exists', 'delete']
      },
      strings: {
        operations: ['operation', 'chain'],
        methods: ['trim', 'replace', 'split', 'substring', 'toUpperCase', 'toLowerCase', 'padLeft', 'padRight', 'leftPad', 'rightPad', 'find', 'findAll', 'startsWith', 'endsWith', 'contains', 'isEmpty', 'isNotEmpty', 'length', 'reverse', 'repeat', 'remove', 'removeAll', 'toNumberChain']
      },
      numbers: {
        operations: ['operation', 'chain'],
        methods: ['parse', 'add', 'subtract', 'multiply', 'divide', 'mod', 'pow', 'round', 'ceil', 'floor', 'truncate', 'abs', 'sqrt', 'min', 'max', 'clamp', 'random', 'randomInt', 'isEven', 'isOdd', 'isPositive', 'isNegative', 'isZero', 'isNumber', 'between', 'sign', 'toFixed', 'toStringChain']
      },
      json: {
        operations: ['operation'],
        methods: ['parse', 'stringify', 'get', 'set', 'has', 'remove', 'keys', 'values', 'size', 'isEmpty', 'isNotEmpty', 'merge', 'prettyPrint', 'validate']
      },
      base64: {
        operations: ['operation'],
        methods: ['encode', 'decode']
      },
      xml: {
        operations: ['operation'],
        methods: ['parse', 'stringify', 'get', 'has', 'toString']
      },
      dates: {
        operations: ['operation', 'format'],
        methods: ['now', 'parse', 'format', 'addDays', 'addHours', 'addMinutes', 'addSeconds', 'addMonths', 'addYears', 'diffDays', 'diffHours', 'diffMinutes', 'diffSeconds', 'isBefore', 'isAfter', 'isBetween', 'detect']
      }
    };
    
    // Helper to get autocomplete suggestions (for OIE editor integration)
    phantom._getSuggestions = function(path) {
      if (!path || path === 'phantom' || path === '') {
        return phantom._autocomplete.categories;
      }
      
      var parts = path.split('.').slice(1); // Remove 'phantom' from path
      if (parts.length === 0) return phantom._autocomplete.categories;
      
      var category = parts[0];
      if (!phantom._autocomplete[category]) return [];
      
      if (parts.length === 1) {
        // Return operations for this category
        return phantom._autocomplete[category].operations || [];
      }
      
      if (parts.length === 2) {
        var operation = parts[1];
        if (operation === 'operation' || operation === 'format' || operation === 'chain') {
          return phantom._autocomplete[category].methods || [];
        }
        // For maps, operations are direct (channel, global, etc.)
        if (category === 'maps') {
          return phantom._autocomplete.maps.methods || [];
        }
      }
      
      return [];
    };
    
    // OIE Editor Autocomplete: Final property assignment
    // Ensure all properties are explicitly assigned to global.phantom for editor detection
    global.phantom = phantom;
    global.phantom.maps = phantom.maps;
    global.phantom.strings = phantom.strings;
    global.phantom.numbers = phantom.numbers;
    global.phantom.json = phantom.json;
    global.phantom.base64 = phantom.base64;
    global.phantom.xml = phantom.xml;
    global.phantom.dates = phantom.dates;
    global.phantom.version = phantom.version;
    global.phantom.help = phantom.help;
    global.phantom.autocomplete = phantom.autocomplete;
    global.phantom._ = phantom._;
    global.phantom._autocomplete = phantom._autocomplete;
    global.phantom._getSuggestions = phantom._getSuggestions;
  
  })(this);
  