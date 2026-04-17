/**
 * Comprehensive test suite for regex engine
 * Tests core matching logic, edge cases, flags, and error handling
 */

import { describe, it, expect } from 'vitest';
import {
  matchRegex,
  performSubstitution,
  isValidRegex,
  flagsToString,
} from '@/lib/regex-engine';
import { FlagSet } from '@/lib/types';

// Helper to create flag sets
const flags = (g = false, i = false, m = false, s = false, u = false, d = false, y = false): FlagSet => ({
  g, i, m, s, u, d, y,
});

describe('regex-engine', () => {
  describe('flagsToString', () => {
    it('converts empty flags to empty string', () => {
      expect(flagsToString(flags())).toBe('');
    });

    it('converts single flag to string', () => {
      expect(flagsToString(flags(true))).toBe('g');
      expect(flagsToString(flags(false, true))).toBe('i');
    });

    it('converts multiple flags to string', () => {
      expect(flagsToString(flags(true, true, true))).toBe('gim');
    });

    it('converts all flags in correct order', () => {
      expect(flagsToString(flags(true, true, true, true, true, true, true))).toBe('gimsudy');
    });
  });

  describe('isValidRegex', () => {
    it('validates simple patterns', () => {
      expect(isValidRegex('\\d+')).toBe(true);
      expect(isValidRegex('[a-z]')).toBe(true);
      expect(isValidRegex('.*')).toBe(true);
    });

    it('rejects invalid patterns', () => {
      expect(isValidRegex('[invalid')).toBe(false);
      expect(isValidRegex('(?<>')).toBe(false);
      expect(isValidRegex('*invalid')).toBe(false);
    });

    it('validates named groups', () => {
      expect(isValidRegex('(?<name>\\w+)')).toBe(true);
    });
  });

  describe('matchRegex - Basic Matching', () => {
    it('returns empty matches for empty pattern', () => {
      const result = matchRegex('', 'test', flags());
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(0);
    });

    it('matches single occurrence', () => {
      const result = matchRegex('\\d+', 'abc123def', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].fullMatch).toBe('123');
    });

    it('needs global flag to match all occurrences', () => {
      const result = matchRegex('\\d+', 'abc123def456', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
      expect(result.matches[0].fullMatch).toBe('123');
      expect(result.matches[1].fullMatch).toBe('456');
    });

    it('works without global flag (auto-adds it)', () => {
      const result = matchRegex('\\d+', 'abc123def456', flags(false));
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
    });
  });

  describe('matchRegex - Flags', () => {
    it('ignores case with i flag', () => {
      const result = matchRegex('hello', 'HELLO', flags(true, true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].fullMatch).toBe('HELLO');
    });

    it('respects case sensitivity without i flag', () => {
      const result = matchRegex('hello', 'HELLO', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(0);
    });

    it('multiline mode: ^ and $ match line boundaries', () => {
      const testString = 'hello\nworld\nhello';
      const result = matchRegex('^hello', testString, flags(true, false, true));
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
    });

    it('dot-all mode: . matches newlines', () => {
      const result = matchRegex('a.b', 'a\nb', flags(true, false, false, true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
    });

    it('without dot-all: . does not match newlines', () => {
      const result = matchRegex('a.b', 'a\nb', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(0);
    });
  });

  describe('matchRegex - Capture Groups', () => {
    it('captures unnamed groups', () => {
      const result = matchRegex('(\\w+)@(\\w+)', 'user@domain', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches[0].groups).toHaveLength(2);
      expect(result.matches[0].groups[0].value).toBe('user');
      expect(result.matches[0].groups[1].value).toBe('domain');
    });

    it('captures named groups', () => {
      const result = matchRegex('(?<username>\\w+)@(?<domain>\\w+)', 'user@domain', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches[0].groups[0].name).toBe('username');
      expect(result.matches[0].groups[0].value).toBe('user');
      expect(result.matches[0].groups[1].name).toBe('domain');
      expect(result.matches[0].groups[1].value).toBe('domain');
    });

    it('handles uncaptured groups', () => {
      const result = matchRegex('(?:\\w+)@(\\w+)', 'user@domain', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches[0].groups).toHaveLength(1);
      expect(result.matches[0].groups[0].value).toBe('domain');
    });

    it('handles undefined capture groups', () => {
      const result = matchRegex('(\\w+)?(\\w+)', 'hello', flags(true));
      expect(result.valid).toBe(true);
      // First group is optional, so it captures "hello"
      // Pattern matches the entire string
      expect(result.matches.length).toBeGreaterThan(0);
    });
  });

  describe('matchRegex - Match Index', () => {
    it('includes match index position', () => {
      const result = matchRegex('\\d+', 'abc123def456', flags(true));
      expect(result.matches[0].index).toBe(3);
      expect(result.matches[1].index).toBe(9);
    });

    it('calculates match end index correctly', () => {
      const result = matchRegex('hello', 'hello world', flags(true));
      expect(result.matches[0].index).toBe(0);
      expect(result.matches[0].fullMatch.length).toBe(5);
    });
  });

  describe('matchRegex - Edge Cases', () => {
    it('handles empty test string', () => {
      const result = matchRegex('\\d+', '', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(0);
    });

    it('handles empty matches (e.g., ^ or $)', () => {
      const result = matchRegex('^', 'hello', flags(true));
      expect(result.valid).toBe(true);
    });

    it('matches unicode characters with u flag', () => {
      const result = matchRegex('.', '😀', flags(true, false, false, false, true));
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
    });

    it('returns match count in results', () => {
      const result = matchRegex('a', 'banana', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(3);
    });
  });

  describe('matchRegex - Invalid Patterns', () => {
    it('catches invalid regex and returns error', () => {
      const result = matchRegex('[invalid', 'test', flags());
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.matches).toHaveLength(0);
    });

    it('catches syntax errors in groups', () => {
      const result = matchRegex('(?<>test)', 'test', flags());
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('error message is user-friendly', () => {
      const result = matchRegex('[invalid', 'test', flags());
      expect(result.error).toContain('Invalid regex');
    });
  });

  describe('matchRegex - Real-World Patterns', () => {
    it('matches email addresses', () => {
      const pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
      const result = matchRegex(pattern, 'user@example.com admin@test.org', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
    });

    it('matches URLs', () => {
      const pattern = 'https?://[^\\s]+';
      const result = matchRegex(pattern, 'Visit https://example.com or http://test.org', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('matches phone numbers', () => {
      const pattern = '\\d{3}-\\d{3}-\\d{4}';
      const result = matchRegex(pattern, 'Call 555-123-4567 or 555-987-6543', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('matches Discord bot tokens (simplified)', () => {
      const pattern = 'token[\\s:=]+([a-zA-Z0-9_.-]{20,})';
      const result = matchRegex(
        pattern,
        'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
        flags(true)
      );
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
    });

    it('matches ISO date format', () => {
      const pattern = '\\d{4}-\\d{2}-\\d{2}';
      const result = matchRegex(pattern, '2024-01-15 and 2024-12-31', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('matches hex colors', () => {
      const pattern = '#[0-9a-fA-F]{6}';
      const result = matchRegex(pattern, 'Colors: #FF0000 #00FF00 #0000FF', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(3);
    });
  });

  describe('performSubstitution', () => {
    it('performs simple substitution', () => {
      const result = performSubstitution('hello world', 'hello', flags(true), 'goodbye');
      expect(result).toBe('goodbye world');
    });

    it('replaces all with global flag', () => {
      const result = performSubstitution('hello hello hello', 'hello', flags(true), 'goodbye');
      expect(result).toBe('goodbye goodbye goodbye');
    });

    it('supports backreference $1', () => {
      const result = performSubstitution('user@domain', '(\\w+)@(\\w+)', flags(true), '$1 at $2');
      expect(result).toBe('user at domain');
    });

    it('supports full match $&', () => {
      const result = performSubstitution(
        'hello world',
        'hello',
        flags(true),
        'The word was: $&'
      );
      expect(result).toBe('The word was: hello world');
    });

    it('handles invalid pattern gracefully', () => {
      const result = performSubstitution('test', '[invalid', flags(true), 'replacement');
      expect(result).toBe('test');
    });
  });

  describe('matchRegex - Performance', () => {
    it('returns execution time', () => {
      const result = matchRegex('\\w+', 'test string', flags(true));
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('completes simple patterns quickly', () => {
      const result = matchRegex('\\d+', 'abc123def456ghi789', flags(true));
      expect(result.executionTime).toBeLessThan(100);
    });
  });

  describe('matchRegex - Complex Patterns', () => {
    it('handles alternation', () => {
      const result = matchRegex('cat|dog|bird', 'I have a cat and a dog', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('handles quantifiers', () => {
      const result = matchRegex('a{2,4}', 'aa aaa aaaa aaaaa', flags(true));
      expect(result.valid).toBe(true);
      // Matches: aa (from first), aaa, aaaa, aaaa (from aaaaa)
      expect(result.matches.length).toBeGreaterThanOrEqual(3);
    });

    it('handles word boundaries', () => {
      const result = matchRegex('\\btest\\b', 'test testing tested', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
    });

    it('handles lookahead assertions', () => {
      const result = matchRegex('\\d+(?=px)', '10px 20em 30px', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('handles lookbehind assertions', () => {
      const result = matchRegex('(?<=\\$)\\d+', '$100 €50 £75', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
    });
  });
});
