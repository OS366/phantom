/*! Phantom.js v0.1.7-BETA | (c) 2025 David Labs | GPL-3.0
 * Docs: github.com/OS366/phantom/wiki
 * 
 * MODULES: maps | strings | numbers | json | base64 | xml | dates | intelligence
 */
(function (global) {
  "use strict";
  var phantom = global.phantom || {};
  phantom.version = "0.1.7-BETA";
  phantom.docs = "https://github.com/OS366/phantom/wiki";
  phantom.config = { silent: true };
  phantom.init = function(o) { if (o && typeof o.silent === "boolean") phantom.config.silent = o.silent; return phantom; };
  phantom.toString = function() { return "Phantom.js v" + phantom.version + " - " + phantom.docs; };

  function logError(msg) { if (typeof logger !== "undefined") logger.error("[phantom] " + msg); }
  function fail(msg) { var m = msg || "Invalid operation"; logError(m); throw new Error(m); }

  /* === MAPS === */
  
    function isResponseContext() {
      try { 
        if (typeof responseMap !== "undefined") return true;
        if (global && global.responseMap) return true;
        return false;
      }
      catch (e) { return false; }
    }
  
  function resolveMap(name) {
    // Access maps from global context (works in both OIE/Rhino and Node.js test environment)
    try {
      if (global && global[name]) return global[name];
    } catch (e) { /* ignore */ }
    return null;
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
  
  /* phantom.maps */
  
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
  
  /* === STRINGS === */
  
    phantom.strings = { operation: {} };
  
    function toStr(x) {
      if (x === null || typeof x === "undefined") return "";
      return String(x);
    }

    // Implicit chaining wrapper - returns a chainable string object
    function chainable(str) {
      // Extract value if input is already chainable
      var value = (str && typeof str.value === 'function') ? str.value() : toStr(str);
      var obj = {
        value: function() { return value; },
        toString: function() { return value; },
        valueOf: function() { return value; },
        // Chainable string operations
        trim: function() { return chainable(value.replace(/^\s+|\s+$/g, '')); },
        leftTrim: function() { return chainable(value.replace(/^\s+/, '')); },
        rightTrim: function() { return chainable(value.replace(/\s+$/, '')); },
        toUpperCase: function() { return chainable(value.toUpperCase()); },
        toLowerCase: function() { return chainable(value.toLowerCase()); },
        capitalize: function() { return chainable(value.charAt(0).toUpperCase() + value.slice(1)); },
        replace: function(s, r) { return chainable(value.replace(s, r || '')); },
        replaceAll: function(s, r) { return chainable(value.split(s).join(r || '')); },
        substring: function(s, e) { return chainable(e !== undefined ? value.substring(s, e) : value.substring(s)); },
        leftPad: function(c, n) { var p = toStr(c || ' '); for(var i=0; i<n; i++) value = p + value; return chainable(value); },
        rightPad: function(c, n) { var p = toStr(c || ' '); for(var i=0; i<n; i++) value = value + p; return chainable(value); },
        reverse: function() { return chainable(value.split('').reverse().join('')); },
        remove: function(s) { return chainable(value.replace(s, '')); },
        removeAll: function(s) { return chainable(value.split(s).join('')); },
        // Non-chainable (return primitives)
        split: function(d) { return value.split(d || ''); },
        length: function() { return value.length; },
        contains: function(s) { return value.indexOf(s) >= 0; },
        startsWith: function(p) { return value.indexOf(p) === 0; },
        endsWith: function(s) { return value.indexOf(s, value.length - s.length) !== -1; },
        isEmpty: function() { return value.length === 0; },
        find: function(s) { return value.indexOf(s); }
      };
      return obj;
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

  /* phantom.strings.chain */
    
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
  
  /* === NUMBERS === */
  
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

  /* phantom.numbers.chain */
    
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
  
  /* === JSON === */
  
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
  
  /* === BASE64 === */
  
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
  
  /* === XML === */
  
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
  
  /* === DATES === */
  
    phantom.dates = { operation: {} };
  
    // Date format constants (enum-like)
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

    phantom.dates.operation.format = function (date, format) {
      try {
        if (date == null) return fail("Date is null or undefined");
        if (format == null) return fail("Format is null or undefined");
        
        if (typeof java !== "undefined" && java.time) {
          var formatter = java.time.format.DateTimeFormatter.ofPattern(toStr(format));
          var localDate = getJavaLocalDate(date);
          return chainable(localDate.format(formatter));
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
          return chainable(localDateTime.format(formatter));
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
  
  /* phantom.dates.duration */
  
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

  /* === INTELLIGENCE === */

    phantom.intelligence = { dates: {} };

    /**
     * Dynamically detect the format of a date string using pattern analysis.
     * Returns the Java date format pattern string.
     * 
     * @param {string} dateString - The date string to analyze
     * @param {Object} [options] - Detection options
     * @param {string} [options.locale] - Locale hint: 'US' (MM/dd), 'EU' (dd/MM), or 'auto' (default)
     * @returns {string} The detected Java date format pattern (e.g., "yyyy-MM-dd", "yyyyMMdd")
     */
    phantom.intelligence.dates.detect = function (dateString, options) {
      try {
        if (dateString == null) return fail("Invalid date");
        var s = toStr(dateString).trim();
        if (s.length === 0) return fail("Invalid date");

        options = options || {};
        var localeHint = (options.locale || "auto").toUpperCase();

        var match;

        // ISO 8601 with timezone: 2024-12-26T10:30:45.123Z or 2024-12-26T10:30:45+05:30
        if ((match = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})?$/))) {
          var fmt = "yyyy-MM-dd'T'HH:mm:ss";
          if (match[7]) fmt += "." + "S".repeat(match[7].length);
          if (match[8]) fmt += match[8] === "Z" ? "'Z'" : "XXX";
          return fmt;
        }

        // ISO date with optional space-separated time
        if ((match = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?)?$/))) {
          if (match[4]) {
            var fmt = "yyyy-MM-dd HH:mm";
            if (match[6]) fmt += ":ss";
            if (match[7]) fmt += "." + "S".repeat(match[7].length);
            return fmt;
          }
          return "yyyy-MM-dd";
        }

        // Year-first slash format (2024/12/26)
        if ((match = s.match(/^(\d{4})\/(\d{2})\/(\d{2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?)?$/))) {
          if (match[4]) {
            var fmt = "yyyy/MM/dd HH:mm";
            if (match[6]) fmt += ":ss";
            if (match[7]) fmt += "." + "S".repeat(match[7].length);
            return fmt;
          }
          return "yyyy/MM/dd";
        }

        // Helper to determine US vs EU format
        function detectLocale(part1, part2) {
          var p1 = parseInt(part1, 10);
          var p2 = parseInt(part2, 10);
          if (localeHint === "US") return "US";
          if (localeHint === "EU") return "EU";
          if (p1 > 12 && p2 <= 12) return "EU";
          if (p2 > 12 && p1 <= 12) return "US";
          return null;
        }

        // Helper to build format string
        function buildFormat(day, month, year, locale, delimiter, timeMatch) {
          var dayFmt = day.length === 1 ? "d" : "dd";
          var monthFmt = month.length === 1 ? "M" : "MM";
          var yearFmt = year.length === 2 ? "yy" : "yyyy";
          var fmt = locale === "US" 
            ? monthFmt + delimiter + dayFmt + delimiter + yearFmt
            : dayFmt + delimiter + monthFmt + delimiter + yearFmt;
          if (timeMatch && timeMatch.hour) {
            var hourFmt = timeMatch.hour.length === 1 ? "H" : "HH";
            fmt += " " + hourFmt + ":mm";
            if (timeMatch.second) fmt += ":ss";
            if (timeMatch.ms) fmt += "." + "S".repeat(timeMatch.ms.length);
          }
          return fmt;
        }

        // Slash-separated dates (US/EU): 12/26/2024 or 26/12/2024
        if ((match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}|\d{2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?)?$/))) {
          var locale = detectLocale(match[1], match[2]);
          var isUS = locale !== "EU";
          var day = isUS ? match[2] : match[1];
          var month = isUS ? match[1] : match[2];
          var timeInfo = match[4] ? { hour: match[4], second: match[6], ms: match[7] } : null;
          return buildFormat(day, month, match[3], isUS ? "US" : "EU", "/", timeInfo);
        }

        // Dash-separated non-ISO: 12-26-2024 or 26-12-2024
        if ((match = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4}|\d{2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?)?$/))) {
          var locale = detectLocale(match[1], match[2]);
          var isUS = locale !== "EU";
          var day = isUS ? match[2] : match[1];
          var month = isUS ? match[1] : match[2];
          var timeInfo = match[4] ? { hour: match[4], second: match[6], ms: match[7] } : null;
          return buildFormat(day, month, match[3], isUS ? "US" : "EU", "-", timeInfo);
        }

        // Dot-separated (common in EU): 26.12.2024
        if ((match = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4}|\d{2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?)?$/))) {
          var locale = detectLocale(match[1], match[2]);
          var isEU = locale !== "US";
          var day = isEU ? match[1] : match[2];
          var month = isEU ? match[2] : match[1];
          var timeInfo = match[4] ? { hour: match[4], second: match[6], ms: match[7] } : null;
          return buildFormat(day, month, match[3], isEU ? "EU" : "US", ".", timeInfo);
        }

        // Time only
        if ((match = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/))) {
          var fmt = (match[1].length === 1 ? "H" : "HH") + ":mm";
          if (match[3]) fmt += ":ss";
          if (match[4]) fmt += "." + "S".repeat(match[4].length);
          return fmt;
        }

        // Year-month only
        if ((match = s.match(/^(\d{4})-(\d{2})$/))) {
          return "yyyy-MM";
        }

        // Month/Year
        if ((match = s.match(/^(\d{1,2})\/(\d{4})$/))) {
          return (match[1].length === 1 ? "M" : "MM") + "/yyyy";
        }

        // Compact date (YYYYMMDD)
        if ((match = s.match(/^(\d{4})(\d{2})(\d{2})$/))) {
          var month = parseInt(match[2], 10);
          var day = parseInt(match[3], 10);
          if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            return "yyyyMMdd";
          }
        }

        // Compact datetime (YYYYMMDDHHmmss or YYYYMMDDHHmmssSSS)
        if ((match = s.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{3})?$/))) {
          var month = parseInt(match[2], 10);
          var day = parseInt(match[3], 10);
          var hour = parseInt(match[4], 10);
          var minute = parseInt(match[5], 10);
          var second = parseInt(match[6], 10);
          if (month >= 1 && month <= 12 && day >= 1 && day <= 31 &&
              hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59) {
            return match[7] ? "yyyyMMddHHmmssSSS" : "yyyyMMddHHmmss";
          }
        }

        // No pattern matched
        return fail("Invalid date");

      } catch (e) {
        if (e.message === "Invalid date") throw e;
        return fail("Invalid date");
      }
    };

    phantom.init({ silent: true });
    global.phantom = phantom;
  })(this);
  