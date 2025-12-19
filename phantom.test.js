/*!
 * Test suite for phantom.js
 * Tests all functionality including maps, strings, and numbers operations
 */

const fs = require('fs');
const vm = require('vm');

// Helper function to load phantom.js with proper context
function loadPhantom() {
  const phantomCode = fs.readFileSync(require.resolve('./phantom.js'), 'utf8');
  const script = new vm.Script(phantomCode);
  const context = vm.createContext(global);
  script.runInContext(context);
  return global.phantom;
}

// Shared setup function for all test suites
function setupPhantomTests() {
  beforeEach(() => {
    // Mock Java environment
    global.mockJava = {
      lang: {
        String: {
          valueOf: jest.fn((x) => String(x))
        }
      }
    };
    global.java = global.mockJava;

    // Mock logger
    global.mockLogger = {
      error: jest.fn()
    };
    global.logger = global.mockLogger;

    // Mock map objects with get, put, remove methods
    const createMockMap = () => {
      const map = new Map();
      return {
        get: jest.fn((key) => map.get(String(key))),
        put: jest.fn((key, value) => {
          map.set(String(key), value);
          return value;
        }),
        set: jest.fn((key, value) => {
          map.set(String(key), value);
          return value;
        }),
        remove: jest.fn((key) => {
          const had = map.has(String(key));
          map.delete(String(key));
          return had;
        }),
        _internal: map // for testing
      };
    };

    global.mockChannelMap = createMockMap();
    global.mockGlobalMap = createMockMap();
    global.mockConnectorMap = createMockMap();
    global.mockResponseMap = createMockMap();
    global.mockConfigurationMap = createMockMap();

    global.channelMap = global.mockChannelMap;
    global.globalMap = global.mockGlobalMap;
    global.connectorMap = global.mockConnectorMap;
    global.responseMap = global.mockResponseMap;
    global.configurationMap = global.mockConfigurationMap;

    // Clear any existing phantom
    delete global.phantom;

    // Load the phantom.js library using vm to ensure 'this' refers to global
    global.phantom = loadPhantom();
  });

  afterEach(() => {
    delete global.phantom;
    delete global.java;
    delete global.logger;
    delete global.channelMap;
    delete global.globalMap;
    delete global.connectorMap;
    delete global.responseMap;
    delete global.configurationMap;
    delete global.mockJava;
    delete global.mockLogger;
    delete global.mockChannelMap;
    delete global.mockGlobalMap;
    delete global.mockConnectorMap;
    delete global.mockResponseMap;
    delete global.mockConfigurationMap;
  });
}

describe('Initialization', () => {
  setupPhantomTests();

  test('should initialize phantom object', () => {
    expect(global.phantom).toBeDefined();
    expect(global.phantom.version).toBe('0.1.6-BETA');
  });

  test('should have default silent config', () => {
    expect(global.phantom.config.silent).toBe(true);
  });

  test('init should update config', () => {
    global.phantom.init({ silent: false });
    expect(global.phantom.config.silent).toBe(false);
  });

  test('init should return phantom for chaining', () => {
    const result = global.phantom.init({ silent: false });
    expect(result).toBe(global.phantom);
  });
});

describe('Help & Autocomplete', () => {
  setupPhantomTests();

  describe('help', () => {
    test('should show all categories when called without arguments', () => {
      var result = phantom.help();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('maps');
      expect(result).toContain('strings');
      expect(result).toContain('numbers');
      expect(result).toContain('json');
    });

    test('should show help for specific category', () => {
      var result = phantom.help('maps');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('phantom.maps');
      expect(result).toContain('channel');
      expect(result).toContain('global');
    });

    test('should show help for specific operation', () => {
      var result = phantom.help('maps.channel');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('save');
      expect(result).toContain('get');
      expect(result).toContain('exists');
      expect(result).toContain('delete');
    });

    test('should show help for string operations', () => {
      var result = phantom.help('strings.operation');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('trim');
      expect(result).toContain('replace');
    });

    test('should return error message for invalid path', () => {
      var result = phantom.help('invalid.path');
      expect(result).toBeDefined();
      expect(result).toContain('not found');
    });
  });

  describe('autocomplete', () => {
    test('should return all categories when called without arguments', () => {
      var result = phantom.autocomplete();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('maps');
      expect(result).toContain('strings');
      expect(result).toContain('numbers');
    });

    test('should return operations for category', () => {
      var result = phantom.autocomplete('maps');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('channel');
      expect(result).toContain('global');
    });

    test('should return methods for operation', () => {
      var result = phantom.autocomplete('maps.channel');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('save');
      expect(result).toContain('get');
      expect(result).toContain('exists');
      expect(result).toContain('delete');
    });

    test('should return empty array for invalid path', () => {
      var result = phantom.autocomplete('invalid.path');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    test('should return string operations', () => {
      var result = phantom.autocomplete('strings.operation');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('trim');
      expect(result).toContain('replace');
    });
  });
});

describe('phantom.maps', () => {
  setupPhantomTests();

  describe('Channel Map', () => {
    test('should save value to channel map', () => {
      global.phantom.maps.channel.save('key1', 'value1');
      expect(global.mockChannelMap.put).toHaveBeenCalledWith('key1', 'value1');
      expect(global.mockChannelMap._internal.get('key1')).toBe('value1');
    });

    test('should get value from channel map', () => {
      global.mockChannelMap._internal.set('key1', 'value1');
      const result = global.phantom.maps.channel.get('key1');
      expect(result).toBe('value1');
      expect(global.mockChannelMap.get).toHaveBeenCalledWith('key1');
    });

    test('should check if key exists in channel map', () => {
      global.mockChannelMap._internal.set('key1', 'value1');
      expect(global.phantom.maps.channel.exists('key1')).toBe(true);
      expect(global.phantom.maps.channel.exists('nonexistent')).toBe(false);
    });

    test('should delete value from channel map', () => {
      global.mockChannelMap._internal.set('key1', 'value1');
      global.phantom.maps.channel.delete('key1');
      expect(global.mockChannelMap.remove).toHaveBeenCalledWith('key1');
      expect(global.mockChannelMap._internal.has('key1')).toBe(false);
    });

    test('should fail on null key', () => {
      expect(() => global.phantom.maps.channel.save(null, 'value')).toThrow();
      expect(() => global.phantom.maps.channel.get(null)).toThrow();
      expect(() => global.phantom.maps.channel.delete(null)).toThrow();
    });

    test('should fail on null map', () => {
      delete global.channelMap;
      expect(() => global.phantom.maps.channel.save('key', 'value')).toThrow();
    });
  });

  describe('Global Map', () => {
    test('should save and get from global map', () => {
      phantom.maps.global.save('globalKey', 'globalValue');
      expect(mockGlobalMap.put).toHaveBeenCalledWith('globalKey', 'globalValue');
      
      mockGlobalMap._internal.set('globalKey', 'globalValue');
      const result = phantom.maps.global.get('globalKey');
      expect(result).toBe('globalValue');
    });
  });

  describe('Connector Map', () => {
    test('should save and get from connector map', () => {
      phantom.maps.connector.save('connKey', 'connValue');
      expect(mockConnectorMap.put).toHaveBeenCalledWith('connKey', 'connValue');
      
      mockConnectorMap._internal.set('connKey', 'connValue');
      const result = phantom.maps.connector.get('connKey');
      expect(result).toBe('connValue');
    });
  });

  describe('Response Map', () => {
    test('should save and get from response map when in response context', () => {
      phantom.maps.response.save('respKey', 'respValue');
      expect(mockResponseMap.put).toHaveBeenCalledWith('respKey', 'respValue');
      
      mockResponseMap._internal.set('respKey', 'respValue');
      const result = phantom.maps.response.get('respKey');
      expect(result).toBe('respValue');
    });

    test('should fail when not in response context', () => {
      // Mock isResponseContext to return false
      delete global.responseMap;
      expect(() => phantom.maps.response.save('key', 'value')).toThrow();
    });
  });

  describe('Configuration Map', () => {
    test('should get from configuration map', () => {
      mockConfigurationMap._internal.set('configKey', 'configValue');
      const result = phantom.maps.configuration.get('configKey');
      expect(result).toBe('configValue');
    });

    test('should check if key exists in configuration map', () => {
      mockConfigurationMap._internal.set('configKey', 'configValue');
      expect(phantom.maps.configuration.exists('configKey')).toBe(true);
      expect(phantom.maps.configuration.exists('nonexistent')).toBe(false);
    });

    test('should fail on save to configuration map', () => {
      expect(() => phantom.maps.configuration.save('key', 'value')).toThrow();
    });

    test('should fail on delete from configuration map', () => {
      expect(() => phantom.maps.configuration.delete('key')).toThrow();
    });
  });
});

describe('phantom.strings', () => {
  setupPhantomTests();

  describe('find', () => {
    test('should find string in input', () => {
      expect(phantom.strings.operation.find('hello world', 'world')).toBe(true);
      expect(phantom.strings.operation.find('hello world', 'hello')).toBe(true);
    });

    test('should not find string not in input', () => {
      expect(phantom.strings.operation.find('hello world', 'xyz')).toBe(false);
    });

    test('should return false for empty search string', () => {
      expect(phantom.strings.operation.find('hello', '')).toBe(false);
    });

    test('should handle null/undefined', () => {
      expect(phantom.strings.operation.find(null, 'test')).toBe(false);
      expect(phantom.strings.operation.find(undefined, 'test')).toBe(false);
    });
  });

  describe('leftPad', () => {
    test('should pad left with default space', () => {
      expect(phantom.strings.operation.leftPad('test', undefined, 3)).toBe('   test');
    });

    test('should pad left with custom character', () => {
      expect(phantom.strings.operation.leftPad('test', '0', 3)).toBe('000test');
    });

    test('should return original if count <= 0', () => {
      expect(phantom.strings.operation.leftPad('test', '0', 0)).toBe('test');
      expect(phantom.strings.operation.leftPad('test', '0', -1)).toBe('test');
    });

    test('should handle null/undefined input', () => {
      expect(phantom.strings.operation.leftPad(null, '0', 2)).toBe('00');
      expect(phantom.strings.operation.leftPad(undefined, '0', 2)).toBe('00');
    });
  });

  describe('rightPad', () => {
    test('should pad right with default space', () => {
      expect(phantom.strings.operation.rightPad('test', undefined, 3)).toBe('test   ');
    });

    test('should pad right with custom character', () => {
      expect(phantom.strings.operation.rightPad('test', '0', 3)).toBe('test000');
    });

    test('should return original if count <= 0', () => {
      expect(phantom.strings.operation.rightPad('test', '0', 0)).toBe('test');
    });
  });

  describe('dualPad', () => {
    test('should pad both sides', () => {
      expect(phantom.strings.operation.dualPad('test', '0', 2)).toBe('00test00');
    });

    test('should return original if count <= 0', () => {
      expect(phantom.strings.operation.dualPad('test', '0', 0)).toBe('test');
    });
  });

  describe('leftTrim', () => {
    test('should trim left whitespace', () => {
      expect(phantom.strings.operation.leftTrim('  test')).toBe('test');
      expect(phantom.strings.operation.leftTrim('\t\ntest')).toBe('test');
    });

    test('should not trim right whitespace', () => {
      expect(phantom.strings.operation.leftTrim('  test  ')).toBe('test  ');
    });
  });

  describe('rightTrim', () => {
    test('should trim right whitespace', () => {
      expect(phantom.strings.operation.rightTrim('test  ')).toBe('test');
      expect(phantom.strings.operation.rightTrim('test\t\n')).toBe('test');
    });

    test('should not trim left whitespace', () => {
      expect(phantom.strings.operation.rightTrim('  test  ')).toBe('  test');
    });
  });

  describe('trim', () => {
    test('should trim both sides', () => {
      expect(phantom.strings.operation.trim('  test  ')).toBe('test');
      expect(phantom.strings.operation.trim('\t\ntest\n\t')).toBe('test');
    });
  });

  describe('split', () => {
    test('should split string by delimiter', () => {
      expect(phantom.strings.operation.split('a,b,c', ',')).toEqual(['a', 'b', 'c']);
      expect(phantom.strings.operation.split('hello world', ' ')).toEqual(['hello', 'world']);
    });

    test('should handle null/undefined', () => {
      expect(phantom.strings.operation.split(null, ',')).toEqual(['']);
      expect(phantom.strings.operation.split(undefined, ',')).toEqual(['']);
    });
  });

  describe('splice', () => {
    test('should splice string correctly', () => {
      expect(phantom.strings.operation.splice('hello world', 5, 1, 'X')).toBe('helloXworld');
      expect(phantom.strings.operation.splice('hello', 2, 0, 'XX')).toBe('heXXllo');
    });

    test('should handle negative start/deleteCount', () => {
      expect(phantom.strings.operation.splice('hello', -1, -1, 'X')).toBe('Xhello');
    });

    test('should handle missing insertString', () => {
      expect(phantom.strings.operation.splice('hello', 2, 1)).toBe('helo');
    });
  });

  describe('compare', () => {
    test('should return 0 for equal strings', () => {
      expect(phantom.strings.operation.compare('test', 'test')).toBe(0);
    });

    test('should return 1 if first > second', () => {
      expect(phantom.strings.operation.compare('zebra', 'apple')).toBe(1);
    });

    test('should return -1 if first < second', () => {
      expect(phantom.strings.operation.compare('apple', 'zebra')).toBe(-1);
    });

    test('should handle null/undefined', () => {
      expect(phantom.strings.operation.compare(null, 'test')).toBe(-1);
      expect(phantom.strings.operation.compare('test', null)).toBe(1);
    });
  });

  describe('join', () => {
    test('should join strings with delimiter', () => {
      expect(phantom.strings.operation.join('hello', 'world', ' ')).toBe('hello world');
      expect(phantom.strings.operation.join('a', 'b', '-')).toBe('a-b');
    });

    test('should use empty string if delimiter missing', () => {
      expect(phantom.strings.operation.join('hello', 'world')).toBe('helloworld');
    });

    test('should handle null/undefined', () => {
      expect(phantom.strings.operation.join(null, 'world')).toBe('world');
      expect(phantom.strings.operation.join('hello', null)).toBe('hello');
    });
  });

  describe('replace', () => {
    test('should replace first occurrence', () => {
      expect(phantom.strings.operation.replace('hello world', 'world', 'universe')).toBe('hello universe');
      expect(phantom.strings.operation.replace('hello hello', 'hello', 'hi')).toBe('hi hello');
    });

    test('should handle empty search string', () => {
      expect(phantom.strings.operation.replace('hello', '', 'x')).toBe('hello');
    });

    test('should handle null/undefined', () => {
      expect(phantom.strings.operation.replace(null, 'a', 'b')).toBe('');
    });
  });

  describe('replaceAll', () => {
    test('should replace all occurrences', () => {
      expect(phantom.strings.operation.replaceAll('hello hello', 'hello', 'hi')).toBe('hi hi');
      expect(phantom.strings.operation.replaceAll('aabbcc', 'b', 'x')).toBe('aaxxcc');
    });

    test('should handle special regex characters', () => {
      expect(phantom.strings.operation.replaceAll('a.b.c', '.', '-')).toBe('a-b-c');
      expect(phantom.strings.operation.replaceAll('a*b*c', '*', '-')).toBe('a-b-c');
    });
  });

  describe('substring', () => {
    test('should extract substring with start and end', () => {
      expect(phantom.strings.operation.substring('hello world', 0, 5)).toBe('hello');
      expect(phantom.strings.operation.substring('hello world', 6)).toBe('world');
    });

    test('should handle invalid indices', () => {
      expect(phantom.strings.operation.substring('hello', 'abc', 3)).toBe('hel');
      expect(phantom.strings.operation.substring('hello', 0, 'abc')).toBe('hello');
    });
  });

  describe('toUpperCase', () => {
    test('should convert to uppercase', () => {
      expect(phantom.strings.operation.toUpperCase('hello')).toBe('HELLO');
      expect(phantom.strings.operation.toUpperCase('Hello World')).toBe('HELLO WORLD');
    });
  });

  describe('toLowerCase', () => {
    test('should convert to lowercase', () => {
      expect(phantom.strings.operation.toLowerCase('HELLO')).toBe('hello');
      expect(phantom.strings.operation.toLowerCase('Hello World')).toBe('hello world');
    });
  });

  describe('capitalize', () => {
    test('should capitalize first letter', () => {
      expect(phantom.strings.operation.capitalize('hello')).toBe('Hello');
      expect(phantom.strings.operation.capitalize('HELLO')).toBe('Hello');
      expect(phantom.strings.operation.capitalize('hELLO')).toBe('Hello');
    });

    test('should handle empty string', () => {
      expect(phantom.strings.operation.capitalize('')).toBe('');
    });
  });

  describe('reverse', () => {
    test('should reverse string', () => {
      expect(phantom.strings.operation.reverse('hello')).toBe('olleh');
      expect(phantom.strings.operation.reverse('abc')).toBe('cba');
    });

    test('should handle empty string', () => {
      expect(phantom.strings.operation.reverse('')).toBe('');
    });
  });

  describe('length', () => {
    test('should return string length', () => {
      expect(phantom.strings.operation.length('hello')).toBe(5);
      expect(phantom.strings.operation.length('')).toBe(0);
    });
  });

  describe('startsWith', () => {
    test('should check if string starts with prefix', () => {
      expect(phantom.strings.operation.startsWith('hello', 'he')).toBe(true);
      expect(phantom.strings.operation.startsWith('hello', 'lo')).toBe(false);
    });

    test('should handle empty prefix', () => {
      expect(phantom.strings.operation.startsWith('hello', '')).toBe(true);
    });
  });

  describe('endsWith', () => {
    test('should check if string ends with suffix', () => {
      expect(phantom.strings.operation.endsWith('hello', 'lo')).toBe(true);
      expect(phantom.strings.operation.endsWith('hello', 'he')).toBe(false);
    });

    test('should handle empty suffix', () => {
      expect(phantom.strings.operation.endsWith('hello', '')).toBe(true);
    });
  });

  describe('contains', () => {
    test('should check if string contains substring', () => {
      expect(phantom.strings.operation.contains('hello world', 'world')).toBe(true);
      expect(phantom.strings.operation.contains('hello world', 'xyz')).toBe(false);
    });
  });

  describe('repeat', () => {
    test('should repeat string', () => {
      expect(phantom.strings.operation.repeat('a', 3)).toBe('aaa');
      expect(phantom.strings.operation.repeat('ab', 2)).toBe('abab');
    });

    test('should return empty for invalid count', () => {
      expect(phantom.strings.operation.repeat('a', 0)).toBe('');
      expect(phantom.strings.operation.repeat('a', -1)).toBe('');
    });
  });

  describe('remove', () => {
    test('should remove all occurrences', () => {
      expect(phantom.strings.operation.remove('hello world', 'l')).toBe('heo word');
      expect(phantom.strings.operation.remove('aabbcc', 'b')).toBe('aacc');
    });
  });

  describe('isEmpty', () => {
    test('should check if string is empty', () => {
      expect(phantom.strings.operation.isEmpty('')).toBe(true);
      expect(phantom.strings.operation.isEmpty('hello')).toBe(false);
      expect(phantom.strings.operation.isEmpty(null)).toBe(true);
    });
  });

  describe('isBlank', () => {
    test('should check if string is blank', () => {
      expect(phantom.strings.operation.isBlank('')).toBe(true);
      expect(phantom.strings.operation.isBlank('   ')).toBe(true);
      expect(phantom.strings.operation.isBlank('\t\n')).toBe(true);
      expect(phantom.strings.operation.isBlank('hello')).toBe(false);
    });
  });

  describe('wordwrap', () => {
    test('should wrap text at default size (80)', () => {
      const longText = 'a'.repeat(100);
      const result = phantom.strings.operation.wordwrap(longText);
      expect(result).toContain('\n');
      expect(result.split('\n')[0].length).toBeLessThanOrEqual(80);
    });

    test('should wrap text at specified size', () => {
      const text = 'hello world test';
      const result = phantom.strings.operation.wordwrap(text, 5);
      expect(result).toContain('\n');
      const lines = result.split('\n');
      lines.forEach(line => {
        expect(line.length).toBeLessThanOrEqual(5);
      });
    });

    test('should not wrap if text is shorter than size', () => {
      const text = 'hello';
      const result = phantom.strings.operation.wordwrap(text, 10);
      expect(result).toBe('hello');
      expect(result).not.toContain('\n');
    });

    test('should cut words when cut is true', () => {
      const text = 'hello world';
      const result = phantom.strings.operation.wordwrap(text, 3, true);
      expect(result).toContain('\n');
      const lines = result.split('\n');
      expect(lines[0].length).toBe(3);
    });

    test('should wrap at word boundaries when cut is false', () => {
      const text = 'hello world test';
      const result = phantom.strings.operation.wordwrap(text, 7, false);
      expect(result).toContain('\n');
      // Should break at word boundaries, not in middle of words
      expect(result.split('\n')[0]).toBe('hello');
    });

    test('should handle empty string', () => {
      const result = phantom.strings.operation.wordwrap('', 10);
      expect(result).toBe('');
    });

    test('should handle null/undefined', () => {
      expect(phantom.strings.operation.wordwrap(null, 10)).toBe('');
      expect(phantom.strings.operation.wordwrap(undefined, 10)).toBe('');
    });

    test('should use default size if invalid size provided', () => {
      const longText = 'a'.repeat(100);
      const result = phantom.strings.operation.wordwrap(longText, -5);
      expect(result).toContain('\n');
      expect(result.split('\n')[0].length).toBeLessThanOrEqual(80);
    });
  });

  describe('reverseWords', () => {
    test('should reverse words in a string', () => {
      expect(phantom.strings.operation.reverseWords('hello world')).toBe('world hello');
      expect(phantom.strings.operation.reverseWords('one two three')).toBe('three two one');
    });

    test('should handle single word', () => {
      expect(phantom.strings.operation.reverseWords('hello')).toBe('hello');
    });

    test('should handle empty string', () => {
      expect(phantom.strings.operation.reverseWords('')).toBe('');
    });

    test('should handle multiple spaces', () => {
      expect(phantom.strings.operation.reverseWords('hello   world')).toBe('world hello');
    });

    test('should handle null/undefined', () => {
      expect(phantom.strings.operation.reverseWords(null)).toBe('');
      expect(phantom.strings.operation.reverseWords(undefined)).toBe('');
    });
  });

  describe('chain', () => {
    test('should chain trim, toLowerCase, and capitalize', () => {
      const result = phantom.strings.chain("  HELLO WORLD  ")
        .trim()
        .toLowerCase()
        .capitalize()
        .value();
      expect(result).toBe("Hello world");
    });

    test('should chain multiple operations', () => {
      const result = phantom.strings.chain("  hello world  ")
        .trim()
        .toUpperCase()
        .value();
      expect(result).toBe("HELLO WORLD");
    });

    test('should support toString() method', () => {
      const result = phantom.strings.chain("  test  ")
        .trim()
        .toUpperCase()
        .toString();
      expect(result).toBe("TEST");
    });

    test('should chain replace operations', () => {
      const result = phantom.strings.chain("hello hello")
        .replaceAll("hello", "hi")
        .toUpperCase()
        .value();
      expect(result).toBe("HI HI");
    });

    test('should chain replace and capitalize', () => {
      const result = phantom.strings.chain("hello world")
        .replace("world", "universe")
        .capitalize()
        .value();
      expect(result).toBe("Hello universe");
    });

    test('should chain remove operation', () => {
      const result = phantom.strings.chain("hello world")
        .remove("lo")
        .trim()
        .value();
      expect(result).toBe("hel world");
    });

    test('should chain reverse operations', () => {
      const result = phantom.strings.chain("hello")
        .reverse()
        .toUpperCase()
        .value();
      expect(result).toBe("OLLEH");
    });

    test('should chain reverseWords', () => {
      const result = phantom.strings.chain("hello world")
        .reverseWords()
        .capitalize()
        .value();
      expect(result).toBe("World hello");
    });

    test('should chain leftTrim and rightTrim', () => {
      const result = phantom.strings.chain("  hello  ")
        .leftTrim()
        .rightTrim()
        .value();
      expect(result).toBe("hello");
    });

    test('should chain padding operations', () => {
      const result = phantom.strings.chain("5")
        .leftPad("0", 2)
        .value();
      expect(result).toBe("005");
    });

    test('should chain substring', () => {
      const result = phantom.strings.chain("hello world")
        .substring(0, 5)
        .toUpperCase()
        .value();
      expect(result).toBe("HELLO");
    });

    test('should chain wordwrap', () => {
      const longText = "a".repeat(100);
      const result = phantom.strings.chain(longText)
        .wordwrap(10)
        .value();
      expect(result).toContain('\n');
      expect(result.split('\n')[0].length).toBeLessThanOrEqual(10);
    });

    test('should handle empty string in chain', () => {
      const result = phantom.strings.chain("")
        .trim()
        .toUpperCase()
        .value();
      expect(result).toBe("");
    });

    test('should handle null in chain', () => {
      const result = phantom.strings.chain(null)
        .trim()
        .toLowerCase()
        .value();
      expect(result).toBe("");
    });

    test('should handle undefined in chain', () => {
      const result = phantom.strings.chain(undefined)
        .trim()
        .capitalize()
        .value();
      expect(result).toBe("");
    });

    test('should allow complex chaining', () => {
      const result = phantom.strings.chain("  Hello World  ")
        .trim()
        .toLowerCase()
        .replace("world", "universe")
        .capitalize()
        .value();
      expect(result).toBe("Hello universe");
    });

    test('should allow multiple replace operations', () => {
      const result = phantom.strings.chain("hello hello hello")
        .replaceAll("hello", "hi")
        .toUpperCase()
        .value();
      expect(result).toBe("HI HI HI");
    });

    test('should chain operations in different order', () => {
      const result1 = phantom.strings.chain("  HELLO  ")
        .trim()
        .toLowerCase()
        .capitalize()
        .value();
      
      const result2 = phantom.strings.chain("  HELLO  ")
        .toLowerCase()
        .trim()
        .capitalize()
        .value();
      
      expect(result1).toBe("Hello");
      expect(result2).toBe("Hello");
    });

    test('should return same chainable object for method chaining', () => {
      const chain = phantom.strings.chain("test");
      const chain1 = chain.trim();
      const chain2 = chain1.toLowerCase();
      expect(chain1).toBe(chain2);
      expect(chain.value()).toBe("test");
    });
  });
});

describe('phantom.numbers', () => {
  setupPhantomTests();

  describe('parse', () => {
    test('should parse valid numbers', () => {
      expect(phantom.numbers.operation.parse('123')).toBe(123);
      expect(phantom.numbers.operation.parse('45.67')).toBe(45.67);
      expect(phantom.numbers.operation.parse(123)).toBe(123);
    });

    test('should fail on invalid numbers', () => {
      expect(() => phantom.numbers.operation.parse('abc')).toThrow();
      expect(() => phantom.numbers.operation.parse(null)).toThrow();
      expect(() => phantom.numbers.operation.parse(undefined)).toThrow();
      expect(() => phantom.numbers.operation.parse('Infinity')).toThrow();
    });
  });

  describe('isNumber', () => {
    test('should return true for valid numbers', () => {
      expect(phantom.numbers.operation.isNumber('123')).toBe(true);
      expect(phantom.numbers.operation.isNumber(123)).toBe(true);
      expect(phantom.numbers.operation.isNumber('45.67')).toBe(true);
      expect(phantom.numbers.operation.isNumber(-10)).toBe(true);
      // Note: Number(null) = 0, which is a valid number
      expect(phantom.numbers.operation.isNumber(null)).toBe(true);
    });

    test('should return false for invalid numbers', () => {
      expect(phantom.numbers.operation.isNumber('abc')).toBe(false);
      // Note: Number(null) = 0, which is a valid number, so isNumber(null) returns true
      expect(phantom.numbers.operation.isNumber(undefined)).toBe(false);
      expect(phantom.numbers.operation.isNumber('Infinity')).toBe(false);
      expect(phantom.numbers.operation.isNumber('NaN')).toBe(false);
    });
  });

  describe('add', () => {
    test('should add two numbers', () => {
      expect(phantom.numbers.operation.add(5, 3)).toBe(8);
      expect(phantom.numbers.operation.add(10.5, 2.3)).toBe(12.8);
      expect(phantom.numbers.operation.add(-5, 3)).toBe(-2);
    });

    test('should fail on invalid numbers', () => {
      expect(() => phantom.numbers.operation.add('abc', 5)).toThrow();
      expect(() => phantom.numbers.operation.add(5, null)).toThrow();
    });
  });

  describe('subtract', () => {
    test('should subtract two numbers', () => {
      expect(phantom.numbers.operation.subtract(10, 3)).toBe(7);
      expect(phantom.numbers.operation.subtract(5.5, 2.2)).toBeCloseTo(3.3);
      expect(phantom.numbers.operation.subtract(5, 10)).toBe(-5);
    });

    test('should fail on invalid numbers', () => {
      expect(() => phantom.numbers.operation.subtract('abc', 5)).toThrow();
    });
  });

  describe('multiply', () => {
    test('should multiply two numbers', () => {
      expect(phantom.numbers.operation.multiply(5, 3)).toBe(15);
      expect(phantom.numbers.operation.multiply(2.5, 4)).toBe(10);
      expect(phantom.numbers.operation.multiply(-5, 3)).toBe(-15);
    });

    test('should fail on invalid numbers', () => {
      expect(() => phantom.numbers.operation.multiply('abc', 5)).toThrow();
    });
  });

  describe('divide', () => {
    test('should divide two numbers', () => {
      expect(phantom.numbers.operation.divide(10, 2)).toBe(5);
      expect(phantom.numbers.operation.divide(15, 3)).toBe(5);
      expect(phantom.numbers.operation.divide(7, 2)).toBe(3.5);
    });

    test('should fail on division by zero', () => {
      expect(() => phantom.numbers.operation.divide(10, 0)).toThrow();
    });

    test('should fail on invalid numbers', () => {
      expect(() => phantom.numbers.operation.divide('abc', 5)).toThrow();
    });
  });

  describe('round', () => {
    test('should round to specified decimals', () => {
      expect(phantom.numbers.operation.round(3.14159, 2)).toBe(3.14);
      expect(phantom.numbers.operation.round(3.14159, 0)).toBe(3);
      expect(phantom.numbers.operation.round(3.5, 0)).toBe(4);
    });

    test('should default to 0 decimals if not specified', () => {
      expect(phantom.numbers.operation.round(3.7, null)).toBe(4);
      expect(phantom.numbers.operation.round(3.7, undefined)).toBe(4);
    });

    test('should fail on invalid numbers', () => {
      expect(() => phantom.numbers.operation.round('abc', 2)).toThrow();
    });
  });

  describe('min', () => {
    test('should return minimum of two numbers', () => {
      expect(phantom.numbers.operation.min(5, 10)).toBe(5);
      expect(phantom.numbers.operation.min(-5, 3)).toBe(-5);
      expect(phantom.numbers.operation.min(10, 5)).toBe(5);
    });

    test('should fail on invalid numbers', () => {
      expect(() => phantom.numbers.operation.min('abc', 5)).toThrow();
    });
  });

  describe('max', () => {
    test('should return maximum of two numbers', () => {
      expect(phantom.numbers.operation.max(5, 10)).toBe(10);
      expect(phantom.numbers.operation.max(-5, 3)).toBe(3);
      expect(phantom.numbers.operation.max(10, 5)).toBe(10);
    });

    test('should fail on invalid numbers', () => {
      expect(() => phantom.numbers.operation.max('abc', 5)).toThrow();
    });
  });

  describe('abs', () => {
    test('should return absolute value', () => {
      expect(phantom.numbers.operation.abs(5)).toBe(5);
      expect(phantom.numbers.operation.abs(-5)).toBe(5);
      expect(phantom.numbers.operation.abs(0)).toBe(0);
    });

    test('should fail on invalid numbers', () => {
      expect(() => phantom.numbers.operation.abs('abc')).toThrow();
    });
  });

  describe('ceil', () => {
    test('should round up to nearest integer', () => {
      expect(phantom.numbers.operation.ceil(3.1)).toBe(4);
      expect(phantom.numbers.operation.ceil(3.9)).toBe(4);
      expect(phantom.numbers.operation.ceil(-3.1)).toBe(-3);
    });
  });

  describe('floor', () => {
    test('should round down to nearest integer', () => {
      expect(phantom.numbers.operation.floor(3.1)).toBe(3);
      expect(phantom.numbers.operation.floor(3.9)).toBe(3);
      expect(phantom.numbers.operation.floor(-3.1)).toBe(-4);
    });
  });

  describe('sqrt', () => {
    test('should calculate square root', () => {
      expect(phantom.numbers.operation.sqrt(4)).toBe(2);
      expect(phantom.numbers.operation.sqrt(9)).toBe(3);
      expect(phantom.numbers.operation.sqrt(0)).toBe(0);
    });

    test('should fail on negative numbers', () => {
      expect(() => phantom.numbers.operation.sqrt(-1)).toThrow();
    });
  });

  describe('pow', () => {
    test('should calculate power', () => {
      expect(phantom.numbers.operation.pow(2, 3)).toBe(8);
      expect(phantom.numbers.operation.pow(5, 2)).toBe(25);
      expect(phantom.numbers.operation.pow(10, 0)).toBe(1);
    });
  });

  describe('mod', () => {
    test('should calculate modulo', () => {
      expect(phantom.numbers.operation.mod(10, 3)).toBe(1);
      expect(phantom.numbers.operation.mod(15, 5)).toBe(0);
      expect(phantom.numbers.operation.mod(7, 2)).toBe(1);
    });

    test('should fail on division by zero', () => {
      expect(() => phantom.numbers.operation.mod(10, 0)).toThrow();
    });
  });

  describe('random', () => {
    test('should generate random number in range', () => {
      const result = phantom.numbers.operation.random(0, 10);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(10);
    });

    test('should use default range 0-1', () => {
      const result = phantom.numbers.operation.random();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    test('should fail if min > max', () => {
      expect(() => phantom.numbers.operation.random(10, 0)).toThrow();
    });
  });

  describe('randomInt', () => {
    test('should generate random integer in range', () => {
      const result = phantom.numbers.operation.randomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    });

    test('should fail if min > max', () => {
      expect(() => phantom.numbers.operation.randomInt(10, 0)).toThrow();
    });
  });

  describe('between', () => {
    test('should check if number is between two values', () => {
      expect(phantom.numbers.operation.between(5, 1, 10)).toBe(true);
      expect(phantom.numbers.operation.between(1, 1, 10)).toBe(true);
      expect(phantom.numbers.operation.between(10, 1, 10)).toBe(true);
      expect(phantom.numbers.operation.between(0, 1, 10)).toBe(false);
      expect(phantom.numbers.operation.between(11, 1, 10)).toBe(false);
    });
  });

  describe('clamp', () => {
    test('should clamp value to range', () => {
      expect(phantom.numbers.operation.clamp(5, 1, 10)).toBe(5);
      expect(phantom.numbers.operation.clamp(0, 1, 10)).toBe(1);
      expect(phantom.numbers.operation.clamp(15, 1, 10)).toBe(10);
    });

    test('should fail if min > max', () => {
      expect(() => phantom.numbers.operation.clamp(5, 10, 1)).toThrow();
    });
  });

  describe('sign', () => {
    test('should return sign of number', () => {
      expect(phantom.numbers.operation.sign(5)).toBe(1);
      expect(phantom.numbers.operation.sign(-5)).toBe(-1);
      expect(phantom.numbers.operation.sign(0)).toBe(0);
    });
  });

  describe('isEven', () => {
    test('should check if number is even', () => {
      expect(phantom.numbers.operation.isEven(2)).toBe(true);
      expect(phantom.numbers.operation.isEven(4)).toBe(true);
      expect(phantom.numbers.operation.isEven(3)).toBe(false);
      expect(phantom.numbers.operation.isEven(0)).toBe(true);
    });
  });

  describe('isOdd', () => {
    test('should check if number is odd', () => {
      expect(phantom.numbers.operation.isOdd(3)).toBe(true);
      expect(phantom.numbers.operation.isOdd(5)).toBe(true);
      expect(phantom.numbers.operation.isOdd(2)).toBe(false);
      expect(phantom.numbers.operation.isOdd(0)).toBe(false);
    });
  });

  describe('isPositive', () => {
    test('should check if number is positive', () => {
      expect(phantom.numbers.operation.isPositive(5)).toBe(true);
      expect(phantom.numbers.operation.isPositive(-5)).toBe(false);
      expect(phantom.numbers.operation.isPositive(0)).toBe(false);
    });
  });

  describe('isNegative', () => {
    test('should check if number is negative', () => {
      expect(phantom.numbers.operation.isNegative(-5)).toBe(true);
      expect(phantom.numbers.operation.isNegative(5)).toBe(false);
      expect(phantom.numbers.operation.isNegative(0)).toBe(false);
    });
  });

  describe('isZero', () => {
    test('should check if number is zero', () => {
      expect(phantom.numbers.operation.isZero(0)).toBe(true);
      expect(phantom.numbers.operation.isZero(5)).toBe(false);
      expect(phantom.numbers.operation.isZero(-5)).toBe(false);
    });
  });

  describe('toFixed', () => {
    test('should format number with fixed decimals', () => {
      expect(phantom.numbers.operation.toFixed(3.14159, 2)).toBe('3.14');
      expect(phantom.numbers.operation.toFixed(5, 2)).toBe('5.00');
      expect(phantom.numbers.operation.toFixed(3.14159, 0)).toBe('3');
    });

    test('should fail on invalid decimal places', () => {
      expect(() => phantom.numbers.operation.toFixed(5, -1)).toThrow();
      expect(() => phantom.numbers.operation.toFixed(5, 21)).toThrow();
    });
  });

  describe('truncate', () => {
    test('should truncate decimal part', () => {
      expect(phantom.numbers.operation.truncate(3.7)).toBe(3);
      expect(phantom.numbers.operation.truncate(-3.7)).toBe(-3);
      expect(phantom.numbers.operation.truncate(5)).toBe(5);
    });
  });

  describe('chain', () => {
    test('should chain basic operations', () => {
      const result = phantom.numbers.chain(10)
        .add(5)
        .multiply(2)
        .value();
      expect(result).toBe(30);
    });

    test('should chain subtract and divide', () => {
      const result = phantom.numbers.chain(100)
        .subtract(20)
        .divide(4)
        .value();
      expect(result).toBe(20);
    });

    test('should chain abs operation', () => {
      const result = phantom.numbers.chain(-10)
        .abs()
        .value();
      expect(result).toBe(10);
    });

    test('should chain round operation', () => {
      const result = phantom.numbers.chain(123.456)
        .round(2)
        .value();
      expect(result).toBe(123.46);
    });

    test('should chain ceil operation', () => {
      const result = phantom.numbers.chain(123.1)
        .ceil()
        .value();
      expect(result).toBe(124);
    });

    test('should chain floor operation', () => {
      const result = phantom.numbers.chain(123.9)
        .floor()
        .value();
      expect(result).toBe(123);
    });

    test('should chain truncate operation', () => {
      const result = phantom.numbers.chain(123.9)
        .truncate()
        .value();
      expect(result).toBe(123);
    });

    test('should chain sqrt operation', () => {
      const result = phantom.numbers.chain(16)
        .sqrt()
        .value();
      expect(result).toBe(4);
    });

    test('should chain mod operation', () => {
      const result = phantom.numbers.chain(10)
        .mod(3)
        .value();
      expect(result).toBe(1);
    });

    test('should chain pow operation', () => {
      const result = phantom.numbers.chain(2)
        .pow(3)
        .value();
      expect(result).toBe(8);
    });

    test('should chain min operation', () => {
      const result = phantom.numbers.chain(10)
        .min(5)
        .value();
      expect(result).toBe(5);
    });

    test('should chain max operation', () => {
      const result = phantom.numbers.chain(10)
        .max(5)
        .value();
      expect(result).toBe(10);
    });

    test('should chain clamp operation', () => {
      const result1 = phantom.numbers.chain(5)
        .clamp(0, 10)
        .value();
      expect(result1).toBe(5);

      const result2 = phantom.numbers.chain(-5)
        .clamp(0, 10)
        .value();
      expect(result2).toBe(0);

      const result3 = phantom.numbers.chain(15)
        .clamp(0, 10)
        .value();
      expect(result3).toBe(10);
    });

    test('should chain complex calculation', () => {
      const result = phantom.numbers.chain(10)
        .add(5)        // 15
        .multiply(2)   // 30
        .subtract(10)  // 20
        .divide(4)     // 5
        .round(0)
        .value();
      expect(result).toBe(5);
    });

    test('should chain multiple rounding operations', () => {
      const result = phantom.numbers.chain(123.456)
        .round(1)      // 123.5
        .ceil()        // 124
        .value();
      expect(result).toBe(124);
    });

    test('should convert to string chain with toFixed', () => {
      const result = phantom.numbers.chain(123.456)
        .round(2)
        .toFixed(2)    // Returns string chain: "123.46"
        .leftPad("0", 6)  // Adds 6 zeros: "000000123.46"
        .value();
      expect(result).toBe("000000123.46");
    });

    test('should convert to string chain with toStringChain', () => {
      const result = phantom.numbers.chain(123.45)
        .round(1)
        .toStringChain()  // "123.5"
        .leftPad("0", 6)  // Adds 6 zeros: "000000123.5"
        .value();
      expect(result).toBe("000000123.5");
    });

    test('should convert from string chain to number chain', () => {
      const result = phantom.strings.chain("123.45")
        .trim()
        .toNumberChain()
        .round(1)
        .value();
      expect(result).toBe(123.5);
    });

    test('should return boolean for isEven', () => {
      const result = phantom.numbers.chain(10)
        .isEven();
      expect(result).toBe(true);
    });

    test('should return boolean for isOdd', () => {
      const result = phantom.numbers.chain(11)
        .isOdd();
      expect(result).toBe(true);
    });

    test('should return boolean for isPositive', () => {
      const result = phantom.numbers.chain(10)
        .isPositive();
      expect(result).toBe(true);
    });

    test('should return boolean for isNegative', () => {
      const result = phantom.numbers.chain(-10)
        .isNegative();
      expect(result).toBe(true);
    });

    test('should return boolean for isZero', () => {
      const result = phantom.numbers.chain(0)
        .isZero();
      expect(result).toBe(true);
    });

    test('should return boolean for between', () => {
      const result = phantom.numbers.chain(5)
        .between(0, 10);
      expect(result).toBe(true);
    });

    test('should return sign value', () => {
      const result1 = phantom.numbers.chain(10)
        .sign();
      expect(result1).toBe(1);

      const result2 = phantom.numbers.chain(-10)
        .sign();
      expect(result2).toBe(-1);

      const result3 = phantom.numbers.chain(0)
        .sign();
      expect(result3).toBe(0);
    });

    test('should return string with toString', () => {
      const result = phantom.numbers.chain(123.45)
        .toString();
      expect(result).toBe("123.45");
    });

    test('should handle zero in chain', () => {
      const result = phantom.numbers.chain(0)
        .add(10)
        .multiply(2)
        .value();
      expect(result).toBe(20);
    });

    test('should handle negative numbers in chain', () => {
      const result = phantom.numbers.chain(-10)
        .abs()
        .multiply(2)
        .value();
      expect(result).toBe(20);
    });

    test('should handle decimal operations', () => {
      const result = phantom.numbers.chain(10.5)
        .add(5.3)
        .round(1)
        .value();
      expect(result).toBe(15.8);
    });

    test('should calculate price with tax using chain', () => {
      const result = phantom.numbers.chain(100)
        .multiply(1.08)  // Add 8% tax
        .round(2)
        .value();
      expect(result).toBe(108);
    });

    test('should format ID with number and string chaining', () => {
      const result = phantom.numbers.chain(123)
        .toFixed(0)  // "123"
        .leftPad("0", 6)  // Adds 6 zeros: "000000123"
        .value();
      expect(result).toBe("000000123");
    });
  });
});

describe('Error Handling', () => {
  setupPhantomTests();

  test('should log error when logger is available', () => {
    try {
      phantom.maps.channel.save(null, 'value');
    } catch (e) {
      // Expected to throw
    }
    expect(mockLogger.error).toHaveBeenCalled();
    var lastCall = mockLogger.error.mock.calls[mockLogger.error.mock.calls.length - 1];
    expect(lastCall[0]).toMatch(/^\[phantom\]/);
  });

  test('should not fail when logger is not available', () => {
    delete global.logger;
    expect(() => phantom.maps.channel.save(null, 'value')).toThrow();
  });
});

describe('Java String Conversion', () => {
  setupPhantomTests();

  test('should use Java String.valueOf when available', () => {
    const key = 123;
    mockChannelMap._internal.set('123', 'value');
    phantom.maps.channel.get(key);
    expect(mockJava.lang.String.valueOf).toHaveBeenCalledWith(key);
  });

  test('should fallback to String() when Java not available', () => {
    delete global.java;
    // Reload phantom to test without Java
    delete global.phantom;
    const phantomWithoutJava = loadPhantom();

    mockChannelMap._internal.set('123', 'value');
    const result = phantomWithoutJava.maps.channel.get('123');
    expect(result).toBe('value');
  });
});

describe('Map with set method', () => {
  setupPhantomTests();

  test('should use set method if put is not available', () => {
    const mapWithSet = {
      get: jest.fn((key) => 'value'),
      set: jest.fn((key, value) => value),
      _internal: new Map()
    };
    global.channelMap = mapWithSet;

    delete global.phantom;
    const phantom = loadPhantom();

    phantom.maps.channel.save('key', 'value');
    expect(mapWithSet.set).toHaveBeenCalledWith('key', 'value');
  });
});

describe('phantom.json', () => {
  setupPhantomTests();

  describe('parse', () => {
    test('should parse valid JSON string', () => {
      expect(phantom.json.operation.parse('{"name":"John","age":30}')).toEqual({ name: 'John', age: 30 });
      expect(phantom.json.operation.parse('[1,2,3]')).toEqual([1, 2, 3]);
      expect(phantom.json.operation.parse('"hello"')).toBe('hello');
    });

    test('should fail on invalid JSON', () => {
      expect(() => phantom.json.operation.parse('invalid json')).toThrow();
      expect(() => phantom.json.operation.parse('{name:}')).toThrow();
      expect(() => phantom.json.operation.parse(null)).toThrow();
      expect(() => phantom.json.operation.parse('')).toThrow();
    });
  });

  describe('stringify', () => {
    test('should stringify object to JSON', () => {
      expect(phantom.json.operation.stringify({ name: 'John', age: 30 })).toBe('{"name":"John","age":30}');
      expect(phantom.json.operation.stringify([1, 2, 3])).toBe('[1,2,3]');
      expect(phantom.json.operation.stringify('hello')).toBe('"hello"');
    });

    test('should fail on null/undefined', () => {
      expect(() => phantom.json.operation.stringify(null)).toThrow();
      expect(() => phantom.json.operation.stringify(undefined)).toThrow();
    });
  });

  describe('get', () => {
    test('should get value by simple key', () => {
      var obj = { name: 'John', age: 30 };
      expect(phantom.json.operation.get(obj, 'name')).toBe('John');
      expect(phantom.json.operation.get(obj, 'age')).toBe(30);
    });

    test('should get nested value by path', () => {
      var obj = { user: { name: 'John', address: { city: 'NYC' } } };
      expect(phantom.json.operation.get(obj, 'user.name')).toBe('John');
      expect(phantom.json.operation.get(obj, 'user.address.city')).toBe('NYC');
    });

    test('should throw error for non-existent key', () => {
      var obj = { name: 'John' };
      expect(() => phantom.json.operation.get(obj, 'age')).toThrow();
      expect(() => phantom.json.operation.get(obj, 'user.name')).toThrow();
    });

    test('should fail on invalid input', () => {
      expect(() => phantom.json.operation.get(null, 'key')).toThrow();
      expect(() => phantom.json.operation.get({}, null)).toThrow();
      expect(() => phantom.json.operation.get({}, '')).toThrow();
    });
  });

  describe('set', () => {
    test('should set value by simple key', () => {
      var obj = { name: 'John' };
      var result = phantom.json.operation.set(obj, 'age', 30);
      expect(result.age).toBe(30);
      expect(obj.age).toBeUndefined(); // Original should not be modified
    });

    test('should set nested value by path', () => {
      var obj = { user: { name: 'John' } };
      var result = phantom.json.operation.set(obj, 'user.age', 30);
      expect(result.user.age).toBe(30);
      expect(result.user.name).toBe('John');
    });

    test('should create nested structure if needed', () => {
      var obj = {};
      var result = phantom.json.operation.set(obj, 'user.name', 'John');
      expect(result.user.name).toBe('John');
    });

    test('should fail on invalid input', () => {
      expect(() => phantom.json.operation.set(null, 'key', 'value')).toThrow();
      expect(() => phantom.json.operation.set({}, null, 'value')).toThrow();
    });
  });

  describe('has', () => {
    test('should check if key exists', () => {
      var obj = { name: 'John', age: 30 };
      expect(phantom.json.operation.has(obj, 'name')).toBe(true);
      expect(phantom.json.operation.has(obj, 'age')).toBe(true);
      expect(phantom.json.operation.has(obj, 'city')).toBe(false);
    });

    test('should check nested keys', () => {
      var obj = { user: { name: 'John' } };
      expect(phantom.json.operation.has(obj, 'user.name')).toBe(true);
      expect(phantom.json.operation.has(obj, 'user.age')).toBe(false);
    });

    test('should fail on invalid input', () => {
      expect(() => phantom.json.operation.has(null, 'key')).toThrow();
    });
  });

  describe('remove', () => {
    test('should remove key from object', () => {
      var obj = { name: 'John', age: 30 };
      var result = phantom.json.operation.remove(obj, 'age');
      expect(result.age).toBeUndefined();
      expect(result.name).toBe('John');
      expect(obj.age).toBe(30); // Original should not be modified
    });

    test('should remove nested keys', () => {
      var obj = { user: { name: 'John', age: 30 } };
      var result = phantom.json.operation.remove(obj, 'user.age');
      expect(result.user.age).toBeUndefined();
      expect(result.user.name).toBe('John');
    });

    test('should fail on invalid input', () => {
      expect(() => phantom.json.operation.remove(null, 'key')).toThrow();
    });
  });

  describe('keys', () => {
    test('should get all keys from object', () => {
      var obj = { name: 'John', age: 30, city: 'NYC' };
      var keys = phantom.json.operation.keys(obj);
      expect(keys).toContain('name');
      expect(keys).toContain('age');
      expect(keys).toContain('city');
      expect(keys.length).toBe(3);
    });

    test('should fail on arrays', () => {
      expect(() => phantom.json.operation.keys([1, 2, 3])).toThrow();
    });

    test('should fail on invalid input', () => {
      expect(() => phantom.json.operation.keys(null)).toThrow();
    });
  });

  describe('values', () => {
    test('should get all values from object', () => {
      var obj = { name: 'John', age: 30 };
      var values = phantom.json.operation.values(obj);
      expect(values).toContain('John');
      expect(values).toContain(30);
      expect(values.length).toBe(2);
    });

    test('should fail on arrays', () => {
      expect(() => phantom.json.operation.values([1, 2, 3])).toThrow();
    });
  });

  describe('size', () => {
    test('should get size of object', () => {
      expect(phantom.json.operation.size({ name: 'John', age: 30 })).toBe(2);
      expect(phantom.json.operation.size({})).toBe(0);
    });

    test('should get length of array', () => {
      expect(phantom.json.operation.size([1, 2, 3])).toBe(3);
      expect(phantom.json.operation.size([])).toBe(0);
    });

    test('should fail on invalid input', () => {
      expect(() => phantom.json.operation.size(null)).toThrow();
    });
  });

  describe('merge', () => {
    test('should merge two objects', () => {
      var obj1 = { name: 'John', age: 30 };
      var obj2 = { city: 'NYC', country: 'USA' };
      var result = phantom.json.operation.merge(obj1, obj2);
      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
      expect(result.city).toBe('NYC');
      expect(result.country).toBe('USA');
    });

    test('should overwrite with second object values', () => {
      var obj1 = { name: 'John', age: 30 };
      var obj2 = { age: 31 };
      var result = phantom.json.operation.merge(obj1, obj2);
      expect(result.age).toBe(31);
      expect(result.name).toBe('John');
    });

    test('should fail on arrays', () => {
      expect(() => phantom.json.operation.merge({}, [])).toThrow();
      expect(() => phantom.json.operation.merge([], {})).toThrow();
    });
  });

  describe('isEmpty', () => {
    test('should check if object is empty', () => {
      expect(phantom.json.operation.isEmpty({})).toBe(true);
      expect(phantom.json.operation.isEmpty({ name: 'John' })).toBe(false);
    });

    test('should check if array is empty', () => {
      expect(phantom.json.operation.isEmpty([])).toBe(true);
      expect(phantom.json.operation.isEmpty([1, 2, 3])).toBe(false);
    });

    test('should return true for null', () => {
      expect(phantom.json.operation.isEmpty(null)).toBe(true);
    });
  });

  describe('isArray', () => {
    test('should check if value is array', () => {
      expect(phantom.json.operation.isArray([1, 2, 3])).toBe(true);
      expect(phantom.json.operation.isArray([])).toBe(true);
      expect(phantom.json.operation.isArray({})).toBe(false);
      expect(phantom.json.operation.isArray(null)).toBe(false);
    });
  });

  describe('isObject', () => {
    test('should check if value is object', () => {
      expect(phantom.json.operation.isObject({})).toBe(true);
      expect(phantom.json.operation.isObject({ name: 'John' })).toBe(true);
      expect(phantom.json.operation.isObject([1, 2, 3])).toBe(false);
      expect(phantom.json.operation.isObject(null)).toBe(false);
    });
  });

  describe('toString', () => {
    test('should convert object to string for logging', () => {
      expect(phantom.json.operation.toString({ name: 'John', age: 30 })).toBe('{"name":"John","age":30}');
      expect(phantom.json.operation.toString([1, 2, 3])).toBe('[1,2,3]');
    });

    test('should fail on null/undefined', () => {
      expect(() => phantom.json.operation.toString(null)).toThrow();
      expect(() => phantom.json.operation.toString(undefined)).toThrow();
    });
  });

  describe('prettyPrint', () => {
    test('should pretty print JSON with default indent', () => {
      var obj = { name: 'John', age: 30 };
      var result = phantom.json.operation.prettyPrint(obj);
      expect(result).toContain('\n');
      expect(result).toContain('"name"');
      expect(result).toContain('"age"');
    });

    test('should pretty print JSON with custom indent', () => {
      var obj = { name: 'John', age: 30 };
      var result = phantom.json.operation.prettyPrint(obj, 4);
      expect(result).toContain('\n');
      expect(result).toContain('    '); // 4 spaces
    });

    test('should pretty print with indent 0 (compact)', () => {
      var obj = { name: 'John', age: 30 };
      var result = phantom.json.operation.prettyPrint(obj, 0);
      expect(result).toBe('{"name":"John","age":30}');
    });

    test('should fail on null/undefined', () => {
      expect(() => phantom.json.operation.prettyPrint(null)).toThrow();
      expect(() => phantom.json.operation.prettyPrint(undefined)).toThrow();
    });

    test('should fail on invalid indent size', () => {
      var obj = { name: 'John' };
      expect(() => phantom.json.operation.prettyPrint(obj, -1)).toThrow();
      expect(() => phantom.json.operation.prettyPrint(obj, 11)).toThrow();
    });
  });
});

describe('phantom.base64', () => {
  setupPhantomTests();

  describe('encode', () => {
    test('should encode string to base64', () => {
      expect(phantom.base64.operation.encode('hello')).toBe('aGVsbG8=');
      expect(phantom.base64.operation.encode('Hello World')).toBe('SGVsbG8gV29ybGQ=');
      expect(phantom.base64.operation.encode('test')).toBe('dGVzdA==');
    });

    test('should encode empty string', () => {
      expect(phantom.base64.operation.encode('')).toBe('');
    });

    test('should fail on null/undefined', () => {
      expect(() => phantom.base64.operation.encode(null)).toThrow();
      expect(() => phantom.base64.operation.encode(undefined)).toThrow();
    });
  });

  describe('decode', () => {
    test('should decode base64 to string', () => {
      expect(phantom.base64.operation.decode('aGVsbG8=')).toBe('hello');
      expect(phantom.base64.operation.decode('SGVsbG8gV29ybGQ=')).toBe('Hello World');
      expect(phantom.base64.operation.decode('dGVzdA==')).toBe('test');
    });

    test('should fail on null/undefined', () => {
      expect(() => phantom.base64.operation.decode(null)).toThrow();
      expect(() => phantom.base64.operation.decode(undefined)).toThrow();
    });

    test('should fail on empty string', () => {
      expect(() => phantom.base64.operation.decode('')).toThrow();
    });

    test('should fail on invalid base64', () => {
      expect(() => phantom.base64.operation.decode('invalid!@#')).toThrow();
    });
  });

  describe('encode/decode roundtrip', () => {
    test('should encode and decode correctly', () => {
      var original = 'Hello World!';
      var encoded = phantom.base64.operation.encode(original);
      var decoded = phantom.base64.operation.decode(encoded);
      expect(decoded).toBe(original);
    });

    test('should handle special characters', () => {
      var original = 'test@123#$%';
      var encoded = phantom.base64.operation.encode(original);
      var decoded = phantom.base64.operation.decode(encoded);
      expect(decoded).toBe(original);
    });

    test('should handle unicode characters', () => {
      var original = 'Hello 世界';
      var encoded = phantom.base64.operation.encode(original);
      var decoded = phantom.base64.operation.decode(encoded);
      expect(decoded).toBe(original);
    });
  });
});

describe('phantom.xml', () => {
  setupPhantomTests();

  describe('parse', () => {
    test('should fail on null/undefined', () => {
      expect(() => phantom.xml.operation.parse(null)).toThrow();
      expect(() => phantom.xml.operation.parse(undefined)).toThrow();
    });

    test('should fail on empty string', () => {
      expect(() => phantom.xml.operation.parse('')).toThrow();
    });

    test('should fail on invalid XML or when Java APIs not available', () => {
      // In Node.js test environment, Java XML APIs are not available
      // So it will throw an error about environment requirement
      expect(() => phantom.xml.operation.parse('<invalid>')).toThrow();
    });
  });

  describe('stringify', () => {
    test('should fail on null/undefined', () => {
      expect(() => phantom.xml.operation.stringify(null)).toThrow();
      expect(() => phantom.xml.operation.stringify(undefined)).toThrow();
    });
  });

  describe('get', () => {
    test('should fail on null/undefined XML', () => {
      expect(() => phantom.xml.operation.get(null, 'name')).toThrow();
      expect(() => phantom.xml.operation.get(undefined, 'name')).toThrow();
    });

    test('should fail on null/undefined XPath', () => {
      // Create a mock XML object for testing
      var mockXml = { getElementsByTagName: function() { return []; } };
      expect(() => phantom.xml.operation.get(mockXml, null)).toThrow();
      expect(() => phantom.xml.operation.get(mockXml, undefined)).toThrow();
    });

    test('should fail on empty XPath', () => {
      var mockXml = { getElementsByTagName: function() { return []; } };
      expect(() => phantom.xml.operation.get(mockXml, '')).toThrow();
    });
  });

  describe('has', () => {
    test('should return false on null/undefined XML', () => {
      expect(phantom.xml.operation.has(null, 'name')).toBe(false);
      expect(phantom.xml.operation.has(undefined, 'name')).toBe(false);
    });

    test('should return false on null/undefined XPath', () => {
      var mockXml = { getElementsByTagName: function() { return []; } };
      expect(phantom.xml.operation.has(mockXml, null)).toBe(false);
      expect(phantom.xml.operation.has(mockXml, undefined)).toBe(false);
    });

    test('should return false on empty XPath', () => {
      var mockXml = { getElementsByTagName: function() { return []; } };
      expect(phantom.xml.operation.has(mockXml, '')).toBe(false);
    });

    test('should check if element exists', () => {
      var mockXml = {
        getElementsByTagName: function(name) {
          if (name === 'name') {
            return [{ textContent: 'John' }];
          }
          return [];
        }
      };
      // In Node.js environment, XML operations may not work as expected
      // So we test the basic functionality
      var result = phantom.xml.operation.has(mockXml, 'name');
      expect(typeof result).toBe('boolean');
      expect(phantom.xml.operation.has(mockXml, 'nonexistent')).toBe(false);
    });
  });

  describe('toString', () => {
    test('should fail on null/undefined', () => {
      expect(() => phantom.xml.operation.toString(null)).toThrow();
      expect(() => phantom.xml.operation.toString(undefined)).toThrow();
    });
  });
});

describe('phantom.dates', () => {
  setupPhantomTests();
  let mockJavaTime, mockLocalDate, mockLocalDateTime, mockDuration, mockChronoUnit;

  beforeEach(() => {
    // Mock Java.time APIs
    mockLocalDate = {
      getClass: () => ({ getName: () => 'java.time.LocalDate' }),
      getYear: jest.fn(() => 2024),
      getMonthValue: jest.fn(() => 12),
      getDayOfMonth: jest.fn(() => 16),
      getDayOfWeek: jest.fn(() => ({ toString: () => 'MONDAY' })),
      format: jest.fn(() => '2024-12-16'),
      isBefore: jest.fn(() => false),
      isAfter: jest.fn(() => false),
      isEqual: jest.fn(() => true),
      plus: jest.fn(function(amount, unit) { return this; }),
      minus: jest.fn(function(amount, unit) { return this; }),
      atStartOfDay: jest.fn(() => mockLocalDateTime),
      atTime: jest.fn(() => mockLocalDateTime)
    };

    mockLocalDateTime = {
      getClass: () => ({ getName: () => 'java.time.LocalDateTime' }),
      toLocalDate: jest.fn(() => mockLocalDate),
      format: jest.fn(() => '2024-12-16T10:30:00'),
      plus: jest.fn(function(duration) { return this; }),
      minus: jest.fn(function(duration) { return this; })
    };

    mockDuration = {
      getClass: () => ({ getName: () => 'java.time.Duration' }),
      toDays: jest.fn(() => 5),
      toHours: jest.fn(() => 120),
      toMinutes: jest.fn(() => 7200),
      toSeconds: jest.fn(() => 432000),
      toMillis: jest.fn(() => 432000000)
    };

    mockChronoUnit = {
      between: jest.fn(() => 5)
    };

    mockJavaTime = {
      LocalDate: {
        now: jest.fn(() => mockLocalDate),
        parse: jest.fn(() => mockLocalDate),
        of: jest.fn(() => mockLocalDate),
        ofInstant: jest.fn(() => mockLocalDate)
      },
      LocalDateTime: {
        now: jest.fn(() => mockLocalDateTime),
        parse: jest.fn(() => mockLocalDateTime),
        of: jest.fn(() => mockLocalDateTime),
        ofInstant: jest.fn(() => mockLocalDateTime)
      },
      Duration: {
        between: jest.fn(() => mockDuration),
        of: jest.fn(() => mockDuration)
      },
      format: {
        DateTimeFormatter: {
          ofPattern: jest.fn(() => ({}))
        }
      },
      ZoneId: {
        systemDefault: jest.fn(() => ({}))
      },
      Instant: {
        ofEpochMilli: jest.fn(() => ({}))
      },
      temporal: {
        ChronoUnit: {
          valueOf: jest.fn(() => mockChronoUnit),
          DAYS: mockChronoUnit,
          HOURS: mockChronoUnit,
          MINUTES: mockChronoUnit,
          SECONDS: mockChronoUnit,
          MILLIS: mockChronoUnit,
          WEEKS: mockChronoUnit,
          MONTHS: mockChronoUnit,
          YEARS: mockChronoUnit
        }
      }
    };

    global.java = {
      ...global.java,
      time: mockJavaTime
    };
  });

  describe('FORMAT constants', () => {
    test('should have format constants', () => {
      expect(phantom.dates.FORMAT.ISO_DATE).toBe('yyyy-MM-dd');
      expect(phantom.dates.FORMAT.ISO_DATETIME).toBe("yyyy-MM-dd'T'HH:mm:ss");
      expect(phantom.dates.FORMAT.US_DATE).toBe('MM/dd/yyyy');
    });
  });

  describe('format.detect', () => {
    var originalOfPattern;
    var originalLocalDateParse;
    var originalLocalDateTimeParse;
    
    beforeEach(() => {
      // Store originals
      originalOfPattern = mockJavaTime.format.DateTimeFormatter.ofPattern;
      originalLocalDateParse = mockJavaTime.LocalDate.parse;
      originalLocalDateTimeParse = mockJavaTime.LocalDateTime.parse;
      
      // Create a smart mock that simulates format matching
      mockJavaTime.format.DateTimeFormatter.ofPattern = jest.fn((pattern) => {
        var formatter = {
          parse: jest.fn((str) => {
            // Simulate format matching based on pattern and string
            var s = String(str);
            
            // Check if pattern matches the string structure
            if (pattern === 'yyyy-MM-dd' && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
              return mockLocalDate;
            }
            if (pattern === "yyyy-MM-dd'T'HH:mm:ss" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(s)) {
              return mockLocalDateTime;
            }
            if (pattern === "yyyy-MM-dd'T'HH:mm:ss.SSS" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(s)) {
              return mockLocalDateTime;
            }
            if (pattern === 'yyyy-MM-dd HH:mm:ss' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
              return mockLocalDateTime;
            }
            // US format: MM/dd/yyyy - month must be 01-12
            if (pattern === 'MM/dd/yyyy' && /^(\d{2})\/(\d{2})\/(\d{4})$/.test(s)) {
              var parts = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
              var month = parseInt(parts[1], 10);
              if (month >= 1 && month <= 12) {
                return mockLocalDate;
              }
            }
            if (pattern === 'MM/dd/yyyy HH:mm:ss' && /^(\d{2})\/(\d{2})\/(\d{4}) \d{2}:\d{2}:\d{2}$/.test(s)) {
              var parts = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
              var month = parseInt(parts[1], 10);
              if (month >= 1 && month <= 12) {
                return mockLocalDateTime;
              }
            }
            // EU format: dd/MM/yyyy - day must be 01-31, month 01-12
            if (pattern === 'dd/MM/yyyy' && /^(\d{2})\/(\d{2})\/(\d{4})$/.test(s)) {
              var parts = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
              var day = parseInt(parts[1], 10);
              var month = parseInt(parts[2], 10);
              // If day > 12, it's likely EU format (day first)
              // If month > 12, it's definitely EU format
              if (day > 12 || month > 12) {
                return mockLocalDate;
              }
              // Ambiguous case - try both, but prefer EU if day > 12
              if (day > 12) {
                return mockLocalDate;
              }
            }
            if (pattern === 'dd/MM/yyyy HH:mm:ss' && /^(\d{2})\/(\d{2})\/(\d{4}) \d{2}:\d{2}:\d{2}$/.test(s)) {
              var parts = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
              var day = parseInt(parts[1], 10);
              var month = parseInt(parts[2], 10);
              // If day > 12, it's likely EU format (day first)
              if (day > 12 || month > 12) {
                return mockLocalDateTime;
              }
            }
            if (pattern === 'MM-dd-yyyy' && /^\d{2}-\d{2}-\d{4}$/.test(s)) {
              return mockLocalDate;
            }
            if (pattern === 'dd.MM.yyyy' && /^\d{2}\.\d{2}\.\d{4}$/.test(s)) {
              return mockLocalDate;
            }
            
            // If no match, throw error
            throw new Error('Parse failed');
          })
        };
        return formatter;
      });
      
      // Mock LocalDate.parse to work with formatter
      mockJavaTime.LocalDate.parse = jest.fn((str, formatter) => {
        if (formatter) {
          return formatter.parse(str);
        }
        // Default ISO format
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(str))) {
          return mockLocalDate;
        }
        throw new Error('Parse failed');
      });
      
      // Mock LocalDateTime.parse to work with formatter
      mockJavaTime.LocalDateTime.parse = jest.fn((str, formatter) => {
        if (formatter) {
          return formatter.parse(str);
        }
        // Default ISO format
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(String(str))) {
          return mockLocalDateTime;
        }
        throw new Error('Parse failed');
      });
    });

    test('should detect ISO date format', () => {
      var result = phantom.dates.format.detect('2024-12-16');
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('date');
      expect(result.format).toBe('yyyy-MM-dd');
      expect(result.name).toBe('ISO_DATE');
    });

    test('should detect ISO datetime format', () => {
      var result = phantom.dates.format.detect("2024-12-16T14:30:00");
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('datetime');
      expect(result.format).toBe("yyyy-MM-dd'T'HH:mm:ss");
      expect(result.name).toBe('ISO_DATETIME');
    });

    test('should detect ISO datetime with milliseconds', () => {
      var result = phantom.dates.format.detect("2024-12-16T14:30:00.123");
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('datetime');
      expect(result.format).toBe("yyyy-MM-dd'T'HH:mm:ss.SSS");
      expect(result.name).toBe('ISO_DATETIME_MS');
    });

    test('should detect US date format', () => {
      var result = phantom.dates.format.detect('12/16/2024');
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('date');
      expect(result.format).toBe('MM/dd/yyyy');
      expect(result.name).toBe('US_DATE');
    });

    test('should detect US datetime format', () => {
      var result = phantom.dates.format.detect('12/16/2024 14:30:00');
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('datetime');
      expect(result.format).toBe('MM/dd/yyyy HH:mm:ss');
      expect(result.name).toBe('US_DATETIME');
    });

    test('should detect EU date format', () => {
      var result = phantom.dates.format.detect('16/12/2024');
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('date');
      expect(result.format).toBe('dd/MM/yyyy');
      expect(result.name).toBe('EU_DATE');
    });

    test('should detect EU datetime format', () => {
      var result = phantom.dates.format.detect('16/12/2024 14:30:00');
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('datetime');
      expect(result.format).toBe('dd/MM/yyyy HH:mm:ss');
      expect(result.name).toBe('EU_DATETIME');
    });

    test('should return invalid for unrecognized format', () => {
      var result = phantom.dates.format.detect('invalid-date-format');
      expect(result).toBeDefined();
      expect(result.valid).toBe(false);
      expect(result.format).toBeNull();
      expect(result.name).toBeNull();
      expect(result.type).toBeNull();
    });

    test('should fail on null/undefined input', () => {
      expect(() => phantom.dates.format.detect(null)).toThrow();
      expect(() => phantom.dates.format.detect(undefined)).toThrow();
    });

    test('should fail on empty string', () => {
      expect(() => phantom.dates.format.detect('')).toThrow();
    });

    test('should fail without Java.time', () => {
      delete global.java.time;
      expect(() => phantom.dates.format.detect('2024-12-16')).toThrow();
      global.java.time = mockJavaTime;
    });

    test('should detect ISO datetime with space separator', () => {
      var result = phantom.dates.format.detect('2024-12-16 14:30:00');
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('datetime');
      expect(result.format).toBe('yyyy-MM-dd HH:mm:ss');
      expect(result.name).toBe('ISO_DATETIME_SPACE');
    });

    test('should detect date with dash separators (US)', () => {
      var result = phantom.dates.format.detect('12-16-2024');
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('date');
      expect(result.format).toBe('MM-dd-yyyy');
      expect(result.name).toBe('US_DATE_DASH');
    });

    test('should detect date with dot separators (EU)', () => {
      var result = phantom.dates.format.detect('16.12.2024');
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.type).toBe('date');
      expect(result.format).toBe('dd.MM.yyyy');
      expect(result.name).toBe('EU_DATE_DOT');
    });
  });

  describe('UNIT constants', () => {
    test('should have unit constants', () => {
      expect(phantom.dates.UNIT.DAYS).toBe('DAYS');
      expect(phantom.dates.UNIT.HOURS).toBe('HOURS');
      expect(phantom.dates.UNIT.MINUTES).toBe('MINUTES');
      expect(phantom.dates.UNIT.SECONDS).toBe('SECONDS');
    });
  });

  describe('now', () => {
    test('should get current datetime', () => {
      var result = phantom.dates.operation.now();
      expect(mockJavaTime.LocalDateTime.now).toHaveBeenCalled();
    });

    test('should fail without Java.time', () => {
      delete global.java.time;
      expect(() => phantom.dates.operation.now()).toThrow();
      global.java.time = mockJavaTime;
    });
  });

  describe('today', () => {
    test('should get current date', () => {
      var result = phantom.dates.operation.today();
      expect(mockJavaTime.LocalDate.now).toHaveBeenCalled();
    });
  });

  describe('parse', () => {
    test('should parse ISO date string', () => {
      var result = phantom.dates.operation.parse('2024-12-16');
      expect(mockJavaTime.LocalDate.parse).toHaveBeenCalled();
    });

    test('should parse with custom format', () => {
      var result = phantom.dates.operation.parse('12/16/2024', 'MM/dd/yyyy');
      expect(mockJavaTime.format.DateTimeFormatter.ofPattern).toHaveBeenCalled();
    });

    test('should fail on null/undefined', () => {
      expect(() => phantom.dates.operation.parse(null)).toThrow();
      expect(() => phantom.dates.operation.parse(undefined)).toThrow();
      expect(() => phantom.dates.operation.parse('')).toThrow();
    });
  });

  describe('parseDateTime', () => {
    test('should parse ISO datetime string', () => {
      var result = phantom.dates.operation.parseDateTime('2024-12-16T10:30:00');
      expect(mockJavaTime.LocalDateTime.parse).toHaveBeenCalled();
    });

    test('should fail on null/undefined', () => {
      expect(() => phantom.dates.operation.parseDateTime(null)).toThrow();
      expect(() => phantom.dates.operation.parseDateTime('')).toThrow();
    });
  });

  describe('format', () => {
    test('should format date', () => {
      var result = phantom.dates.operation.format(mockLocalDate, 'yyyy-MM-dd');
      expect(mockLocalDate.format).toHaveBeenCalled();
    });

    test('should fail on null', () => {
      expect(() => phantom.dates.operation.format(null, 'yyyy-MM-dd')).toThrow();
      expect(() => phantom.dates.operation.format(mockLocalDate, null)).toThrow();
    });
  });

  describe('getYear', () => {
    test('should get year from date', () => {
      var result = phantom.dates.operation.getYear(mockLocalDate);
      expect(result).toBe(2024);
      expect(mockLocalDate.getYear).toHaveBeenCalled();
    });
  });

  describe('getMonth', () => {
    test('should get month from date', () => {
      var result = phantom.dates.operation.getMonth(mockLocalDate);
      expect(result).toBe(12);
      expect(mockLocalDate.getMonthValue).toHaveBeenCalled();
    });
  });

  describe('getDay', () => {
    test('should get day from date', () => {
      var result = phantom.dates.operation.getDay(mockLocalDate);
      expect(result).toBe(16);
      expect(mockLocalDate.getDayOfMonth).toHaveBeenCalled();
    });
  });

  describe('getDayOfWeek', () => {
    test('should get day of week', () => {
      var result = phantom.dates.operation.getDayOfWeek(mockLocalDate);
      expect(result).toBe('MONDAY');
    });
  });

  describe('add', () => {
    test('should add to date', () => {
      var result = phantom.dates.operation.add(mockLocalDate, 5, 'DAYS');
      expect(mockLocalDate.plus).toHaveBeenCalledWith(5, mockChronoUnit);
    });

    test('should fail on null', () => {
      expect(() => phantom.dates.operation.add(null, 5, 'DAYS')).toThrow();
      expect(() => phantom.dates.operation.add(mockLocalDate, null, 'DAYS')).toThrow();
      expect(() => phantom.dates.operation.add(mockLocalDate, 5, null)).toThrow();
    });
  });

  describe('subtract', () => {
    test('should subtract from date', () => {
      var result = phantom.dates.operation.subtract(mockLocalDate, 5, 'DAYS');
      expect(mockLocalDate.minus).toHaveBeenCalledWith(5, mockChronoUnit);
    });
  });

  describe('between', () => {
    test('should calculate difference between dates', () => {
      var result = phantom.dates.operation.between(mockLocalDate, mockLocalDate, 'DAYS');
      expect(mockChronoUnit.between).toHaveBeenCalled();
    });
  });

  describe('isBefore', () => {
    test('should check if date is before', () => {
      var result = phantom.dates.operation.isBefore(mockLocalDate, mockLocalDate);
      expect(mockLocalDate.isBefore).toHaveBeenCalled();
    });
  });

  describe('isAfter', () => {
    test('should check if date is after', () => {
      var result = phantom.dates.operation.isAfter(mockLocalDate, mockLocalDate);
      expect(mockLocalDate.isAfter).toHaveBeenCalled();
    });
  });

  describe('isEqual', () => {
    test('should check if dates are equal', () => {
      var result = phantom.dates.operation.isEqual(mockLocalDate, mockLocalDate);
      expect(mockLocalDate.isEqual).toHaveBeenCalled();
    });
  });

  describe('startOfDay', () => {
    test('should get start of day', () => {
      var result = phantom.dates.operation.startOfDay(mockLocalDate);
      expect(mockLocalDate.atStartOfDay).toHaveBeenCalled();
    });
  });

  describe('endOfDay', () => {
    test('should get end of day', () => {
      var result = phantom.dates.operation.endOfDay(mockLocalDate);
      expect(mockLocalDate.atTime).toHaveBeenCalledWith(23, 59, 59, 999000000);
    });
  });

  describe('Duration Operations', () => {
    describe('between', () => {
      test('should calculate duration between datetimes', () => {
        var result = phantom.dates.duration.between(mockLocalDateTime, mockLocalDateTime);
        expect(mockJavaTime.Duration.between).toHaveBeenCalled();
      });

      test('should fail on null', () => {
        expect(() => phantom.dates.duration.between(null, mockLocalDateTime)).toThrow();
        expect(() => phantom.dates.duration.between(mockLocalDateTime, null)).toThrow();
      });
    });

    describe('of', () => {
      test('should create duration', () => {
        var result = phantom.dates.duration.of(5, 'DAYS');
        expect(mockJavaTime.Duration.of).toHaveBeenCalledWith(5, mockChronoUnit);
      });
    });

    describe('add', () => {
      test('should add duration to datetime', () => {
        var result = phantom.dates.duration.add(mockLocalDateTime, mockDuration);
        expect(mockLocalDateTime.plus).toHaveBeenCalledWith(mockDuration);
      });
    });

    describe('subtract', () => {
      test('should subtract duration from datetime', () => {
        var result = phantom.dates.duration.subtract(mockLocalDateTime, mockDuration);
        expect(mockLocalDateTime.minus).toHaveBeenCalledWith(mockDuration);
      });
    });

    describe('toDays', () => {
      test('should convert duration to days', () => {
        var result = phantom.dates.duration.toDays(mockDuration);
        expect(result).toBe(5);
        expect(mockDuration.toDays).toHaveBeenCalled();
      });
    });

    describe('toHours', () => {
      test('should convert duration to hours', () => {
        var result = phantom.dates.duration.toHours(mockDuration);
        expect(result).toBe(120);
      });
    });

    describe('toMinutes', () => {
      test('should convert duration to minutes', () => {
        var result = phantom.dates.duration.toMinutes(mockDuration);
        expect(result).toBe(7200);
      });
    });

    describe('toSeconds', () => {
      test('should convert duration to seconds', () => {
        var result = phantom.dates.duration.toSeconds(mockDuration);
        expect(result).toBe(432000);
      });
    });

    describe('toMillis', () => {
      test('should convert duration to milliseconds', () => {
        var result = phantom.dates.duration.toMillis(mockDuration);
        expect(result).toBe(432000000);
      });
    });
  });
});
