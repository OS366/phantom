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

describe('Phantom.js Library', () => {
  let phantom;
  let mockChannelMap, mockGlobalMap, mockConnectorMap, mockResponseMap, mockConfigurationMap;
  let mockLogger;
  let mockJava;

  // Setup mocks before each test
  beforeEach(() => {
    // Mock Java environment
    mockJava = {
      lang: {
        String: {
          valueOf: jest.fn((x) => String(x))
        }
      }
    };
    global.java = mockJava;

    // Mock logger
    mockLogger = {
      error: jest.fn()
    };
    global.logger = mockLogger;

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

    mockChannelMap = createMockMap();
    mockGlobalMap = createMockMap();
    mockConnectorMap = createMockMap();
    mockResponseMap = createMockMap();
    mockConfigurationMap = createMockMap();

    global.channelMap = mockChannelMap;
    global.globalMap = mockGlobalMap;
    global.connectorMap = mockConnectorMap;
    global.responseMap = mockResponseMap;
    global.configurationMap = mockConfigurationMap;

    // Clear any existing phantom
    delete global.phantom;

    // Load the phantom.js library using vm to ensure 'this' refers to global
    phantom = loadPhantom();
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
  });

  describe('Initialization', () => {
    test('should initialize phantom object', () => {
      expect(phantom).toBeDefined();
      expect(phantom.version).toBe('0.1.1');
    });

    test('should have default silent config', () => {
      expect(phantom.config.silent).toBe(true);
    });

    test('init should update config', () => {
      phantom.init({ silent: false });
      expect(phantom.config.silent).toBe(false);
    });

    test('init should return phantom for chaining', () => {
      const result = phantom.init({ silent: false });
      expect(result).toBe(phantom);
    });
  });

  describe('Map Operations - Channel Map', () => {
    test('should save value to channel map', () => {
      phantom.maps.channel.save('key1', 'value1');
      expect(mockChannelMap.put).toHaveBeenCalledWith('key1', 'value1');
      expect(mockChannelMap._internal.get('key1')).toBe('value1');
    });

    test('should get value from channel map', () => {
      mockChannelMap._internal.set('key1', 'value1');
      const result = phantom.maps.channel.get('key1');
      expect(result).toBe('value1');
      expect(mockChannelMap.get).toHaveBeenCalledWith('key1');
    });

    test('should check if key exists in channel map', () => {
      mockChannelMap._internal.set('key1', 'value1');
      expect(phantom.maps.channel.exists('key1')).toBe(true);
      expect(phantom.maps.channel.exists('nonexistent')).toBe(false);
    });

    test('should delete value from channel map', () => {
      mockChannelMap._internal.set('key1', 'value1');
      phantom.maps.channel.delete('key1');
      expect(mockChannelMap.remove).toHaveBeenCalledWith('key1');
      expect(mockChannelMap._internal.has('key1')).toBe(false);
    });

    test('should fail on null key', () => {
      expect(() => phantom.maps.channel.save(null, 'value')).toThrow();
      expect(() => phantom.maps.channel.get(null)).toThrow();
      expect(() => phantom.maps.channel.delete(null)).toThrow();
    });

    test('should fail on null map', () => {
      delete global.channelMap;
      expect(() => phantom.maps.channel.save('key', 'value')).toThrow();
    });
  });

  describe('Map Operations - Global Map', () => {
    test('should save and get from global map', () => {
      phantom.maps.global.save('globalKey', 'globalValue');
      expect(mockGlobalMap.put).toHaveBeenCalledWith('globalKey', 'globalValue');
      
      mockGlobalMap._internal.set('globalKey', 'globalValue');
      const result = phantom.maps.global.get('globalKey');
      expect(result).toBe('globalValue');
    });
  });

  describe('Map Operations - Connector Map', () => {
    test('should save and get from connector map', () => {
      phantom.maps.connector.save('connKey', 'connValue');
      expect(mockConnectorMap.put).toHaveBeenCalledWith('connKey', 'connValue');
      
      mockConnectorMap._internal.set('connKey', 'connValue');
      const result = phantom.maps.connector.get('connKey');
      expect(result).toBe('connValue');
    });
  });

  describe('Map Operations - Response Map', () => {
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

  describe('Map Operations - Configuration Map', () => {
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

  describe('String Operations', () => {
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
  });

  describe('Number Operations', () => {
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
  });

  describe('Error Handling', () => {
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
      phantom = loadPhantom();

      mockChannelMap._internal.set('123', 'value');
      const result = phantom.maps.channel.get('123');
      expect(result).toBe('value');
    });
  });

  describe('Map with set method', () => {
    test('should use set method if put is not available', () => {
      const mapWithSet = {
        get: jest.fn((key) => 'value'),
        set: jest.fn((key, value) => value),
        _internal: new Map()
      };
      global.channelMap = mapWithSet;

      delete global.phantom;
      phantom = loadPhantom();

      phantom.maps.channel.save('key', 'value');
      expect(mapWithSet.set).toHaveBeenCalledWith('key', 'value');
    });
  });

  describe('JSON Operations', () => {
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

  describe('Base64 Operations', () => {
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
});

