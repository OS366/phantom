/*!
 * Phantom.js v0.0.9
 * ==================
 * Lightweight helper library for OIE scripting
 *
 * RULES (as requested)
 * --------------------
 * - Do NOT log normal operations (no "numbers.add" logs, etc.)
 * - Only log when there is an error
 * - Errors should be generic: "Invalid operation"
 * - Keep full file: maps + strings + numbers
 *
 * WARNING / KNOWN ISSUE
 * ---------------------
 * Variables saved using phantom.maps.* are NOT available for drag-and-drop inside
 * the Destination Mappings section because Destination Mapping uses code templates,
 * not runtime variables. This is a known OIE editor limitation (not a Phantom bug).
 */

(function (global) {
    "use strict";
  
    var phantom = global.phantom || {};
    global.phantom = phantom;
  
    phantom.version = "0.0.9";
  
    phantom.config = { silent: true };
  
    phantom.init = function (o) {
      o = o || {};
      if (typeof o.silent === "boolean") phantom.config.silent = o.silent;
      return phantom;
    };
  
    // Only log on error (as requested)
    function logError(msg) {
      if (typeof logger !== "undefined") {
        logger.error("[phantom] " + msg);
      }
    }
  
    function fail() {
      // Generic error message only (as requested)
      logError("Invalid operation");
      throw new Error("Invalid operation");
    }
  
    /* --------------------------------------------------
     * MAP RESOLUTION
     * -------------------------------------------------- */
  
    function isResponseContext() {
      try { return typeof responseMap !== "undefined"; }
      catch (e) { return false; }
    }
  
    function resolveMap(name) {
      try {
        if (name === "channelMap") return channelMap;
        if (name === "globalMap") return globalMap;
        if (name === "connectorMap") return connectorMap;
        if (name === "responseMap") return responseMap;
        if (name === "configurationMap") return configurationMap;
      } catch (e) {}
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
      if (!m) return fail();
      if (k == null) return fail();
  
      var jKey = toJavaString(k);
  
      try {
        if (m.put) { m.put(jKey, v); return; }
        if (m.set) { m.set(jKey, v); return; }
      } catch (e) {
        return fail();
      }
  
      return fail();
    }
  
    function getSafe(m, k) {
      if (!m) return fail();
      if (k == null) return fail();
  
      try {
        if (m.get) return m.get(toJavaString(k));
      } catch (e) {
        return fail();
      }
  
      return fail();
    }
  
    function delSafe(m, k) {
      if (!m) return fail();
      if (k == null) return fail();
  
      try {
        var jKey = toJavaString(k);
        if (m.remove) { m.remove(jKey); return; }
        if (m.put) { m.put(jKey, null); return; }
        if (m.set) { m.set(jKey, null); return; }
      } catch (e) {
        return fail();
      }
  
      return fail();
    }
  
    /* --------------------------------------------------
     * phantom.maps.*
     * -------------------------------------------------- */
  
    phantom.maps = {};
  
    function mapFacade(mapName, responseOnly, readOnly) {
      function getMap() {
        if (responseOnly && !isResponseContext()) return fail();
        return resolveMap(mapName);
      }
  
      return {
        save: function (k, v) {
          if (readOnly) return fail();
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
            return fail();
          }
        },
        delete: function (k) {
          if (readOnly) return fail();
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
        return getSafe(resolveMap("configurationMap"), k);
      },
      exists: function (k) {
        try {
          var m = resolveMap("configurationMap");
          var v = m.get(toJavaString(k));
          return v !== null && typeof v !== "undefined";
        } catch (e) {
          return fail();
        }
      },
      save: function () { return fail(); },
      delete: function () { return fail(); }
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
  
    /* --------------------------------------------------
     * phantom.numbers.operation.*
     * (no logging on success; throw only on error)
     * -------------------------------------------------- */
  
    phantom.numbers = { operation: {} };
  
    function toNumStrict(x) {
      if (x === null || typeof x === "undefined") return fail();
      var n = Number(x);
      if (isNaN(n) || !isFinite(n)) return fail();
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
      if (denom === 0) return fail();
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
      if (n < 0) return fail();
      return Math.sqrt(n);
    };

    phantom.numbers.operation.pow = function (base, exponent) {
      return Math.pow(toNumStrict(base), toNumStrict(exponent));
    };

    phantom.numbers.operation.mod = function (dividend, divisor) {
      var d = toNumStrict(divisor);
      if (d === 0) return fail();
      return toNumStrict(dividend) % d;
    };

    phantom.numbers.operation.random = function (min, max) {
      var minVal = min != null ? toNumStrict(min) : 0;
      var maxVal = max != null ? toNumStrict(max) : 1;
      if (minVal > maxVal) return fail();
      return Math.random() * (maxVal - minVal) + minVal;
    };

    phantom.numbers.operation.randomInt = function (min, max) {
      var minVal = min != null ? toNumStrict(min) : 0;
      var maxVal = max != null ? toNumStrict(max) : 1;
      if (minVal > maxVal) return fail();
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
      if (minVal > maxVal) return fail();
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
      if (d < 0 || d > 20) return fail();
      return n.toFixed(Math.floor(d));
    };

    phantom.numbers.operation.truncate = function (value) {
      var n = toNumStrict(value);
      return n < 0 ? Math.ceil(n) : Math.floor(n);
    };
  
    // default init
    phantom.init({ silent: true });
  
  })(this);
  