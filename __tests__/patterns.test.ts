/**
 * Real-world regex pattern tests
 * Tests common patterns users would test in Catex
 */

import { describe, it, expect } from 'vitest';
import { matchRegex } from '@/lib/regex-engine';
import { FlagSet } from '@/lib/types';

const flags = (g = false, i = false, m = false, s = false, u = false, d = false, y = false): FlagSet => ({
  g, i, m, s, u, d, y,
});

describe('Real-World Regex Patterns', () => {
  describe('Email Validation', () => {
    const emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';

    it('matches valid emails', () => {
      const result = matchRegex(emailPattern, 'user@example.com', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
    });

    it('matches multiple emails', () => {
      const result = matchRegex(
        emailPattern,
        'Contact: alice@test.com or bob@example.org',
        flags(true)
      );
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('handles emails with subdomains', () => {
      const result = matchRegex(emailPattern, 'admin@mail.company.co.uk', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
    });
  });

  describe('URL Matching', () => {
    const urlPattern = 'https?://[^\\s]+';

    it('matches HTTP and HTTPS URLs', () => {
      const result = matchRegex(urlPattern, 'http://example.com https://test.org', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('captures URL components with groups', () => {
      const patternWithGroups = '(https?)://([^/]+)(/.*)?';
      const result = matchRegex(patternWithGroups, 'https://example.com/path', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches[0].groups[0].value).toBe('https');
      expect(result.matches[0].groups[1].value).toBe('example.com');
    });
  });

  describe('Phone Numbers', () => {
    const usPhonePattern = '\\d{3}[-.]?\\d{3}[-.]?\\d{4}';

    it('matches US phone in various formats', () => {
      const testCases = [
        '555-123-4567',
        '555.123.4567',
        '5551234567',
      ];
      testCases.forEach((phone) => {
        const result = matchRegex(usPhonePattern, phone, flags(true));
        expect(result.valid).toBe(true);
        expect(result.matches.length).toBeGreaterThan(0);
      });
    });

    it('extracts phone numbers from text', () => {
      const result = matchRegex(
        usPhonePattern,
        'Call 555-123-4567 or 987-654-3210 for help',
        flags(true)
      );
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });
  });

  describe('Date Formats', () => {
    const isoDatePattern = '\\d{4}-\\d{2}-\\d{2}';
    const usDatePattern = '\\d{1,2}/\\d{1,2}/\\d{4}';

    it('matches ISO format dates (YYYY-MM-DD)', () => {
      const result = matchRegex(isoDatePattern, '2024-01-15', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].fullMatch).toBe('2024-01-15');
    });

    it('matches US format dates (M/D/YYYY)', () => {
      const result = matchRegex(usDatePattern, '1/15/2024', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
    });

    it('extracts multiple dates', () => {
      const result = matchRegex(
        isoDatePattern,
        'From 2024-01-01 to 2024-12-31',
        flags(true)
      );
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });
  });

  describe('Credit Card Numbers', () => {
    const ccPattern = '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b';

    it('matches various CC formats', () => {
      const testCases = [
        '4532-1234-5678-9010',
        '4532 1234 5678 9010',
        '4532123456789010',
      ];
      testCases.forEach((cc) => {
        const result = matchRegex(ccPattern, cc, flags(true));
        expect(result.valid).toBe(true);
        expect(result.matches).toHaveLength(1);
      });
    });
  });

  describe('Hex Colors', () => {
    const hexColorPattern = '#[0-9a-fA-F]{6}';

    it('matches hex color codes', () => {
      const result = matchRegex(hexColorPattern, '#FF0000 #00FF00 #0000FF', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(3);
    });

    it('matches both uppercase and lowercase', () => {
      const result = matchRegex(hexColorPattern, '#ff0000 #FF0000', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });
  });

  describe('IPv4 Addresses', () => {
    const ipv4Pattern = '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b';

    it('matches valid IP addresses', () => {
      const result = matchRegex(ipv4Pattern, '192.168.1.1', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
    });

    it('extracts IPs from logs', () => {
      const result = matchRegex(
        ipv4Pattern,
        'Connection from 192.168.1.100 and 10.0.0.1',
        flags(true)
      );
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });
  });

  describe('HTML Tags', () => {
    const htmlTagPattern = '<([a-z]+)([^>]*)>|</\\1>';

    it('matches opening HTML tags', () => {
      const result = matchRegex(
        '<[a-z]+[^>]*>',
        '<div class="container"> <span>',
        flags(true)
      );
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('extracts tag names', () => {
      const result = matchRegex('<([a-z]+)', '<div><span><p>', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(3);
      expect(result.matches[0].groups[0].value).toBe('div');
    });
  });

  describe('JSON Properties', () => {
    const jsonKeyPattern = '"([^"]+)"\\s*:';

    it('extracts JSON keys', () => {
      const jsonString = '{"name":"John","age":30,"email":"john@example.com"}';
      const result = matchRegex(jsonKeyPattern, jsonString, flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(3);
      expect(result.matches[0].groups[0].value).toBe('name');
    });
  });

  describe('Hashtags', () => {
    const hashtagPattern = '#\\w+';

    it('extracts hashtags from text', () => {
      const result = matchRegex(
        hashtagPattern,
        'Check out #typescript #javascript #webdev',
        flags(true)
      );
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(3);
    });

    it('case insensitive hashtags', () => {
      const result = matchRegex(hashtagPattern, '#TypeScript #JavaScript', flags(true, true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });
  });

  describe('Markdown Links', () => {
    const markdownLinkPattern = '\\[([^\\]]+)\\]\\(([^)]+)\\)';

    it('extracts markdown links', () => {
      const result = matchRegex(
        markdownLinkPattern,
        '[Google](https://google.com) [GitHub](https://github.com)',
        flags(true)
      );
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
      expect(result.matches[0].groups[0].value).toBe('Google');
      expect(result.matches[0].groups[1].value).toBe('https://google.com');
    });
  });

  describe('Camel Case to Snake Case', () => {
    const camelCasePattern = '([a-z])([A-Z])';

    it('finds camelCase boundaries', () => {
      const result = matchRegex(camelCasePattern, 'camelCaseVariable', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple Whitespace', () => {
    const multiWhitespacePattern = '\\s{2,}';

    it('finds multiple spaces', () => {
      const result = matchRegex(multiWhitespacePattern, 'hello  world   test', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });
  });

  describe('Multiline Patterns', () => {
    const lineStartPattern = '^[A-Z]';

    it('multiline mode matches start of each line', () => {
      const text = 'Hello\nWorld\nTest';
      const result = matchRegex(lineStartPattern, text, flags(true, false, true));
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Unicode Patterns', () => {
    const emojiPattern = '\\p{Emoji}';

    it('handles unicode patterns with u flag', () => {
      const result = matchRegex('.', '😀', flags(true, false, false, false, true));
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
    });

    it('matches common unicode ranges', () => {
      const result = matchRegex('[\\u0600-\\u06FF]', 'مرحبا', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
    });
  });

  describe('Word Boundaries', () => {
    const wordPattern = '\\btest\\b';

    it('matches whole words only', () => {
      const result = matchRegex(wordPattern, 'test testing tested', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].fullMatch).toBe('test');
    });
  });

  describe('Lookahead and Lookbehind', () => {
    it('lookahead: match number followed by px', () => {
      const result = matchRegex('\\d+(?=px)', '10px 20em 30px', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('negative lookahead: match number not followed by px', () => {
      const result = matchRegex('\\d+(?!px)', '10px 20em 30px', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
    });

    it('lookbehind: match $ amounts', () => {
      const result = matchRegex('(?<=\\$)\\d+\\.\\d{2}', '$100.00 €50.00 £75.50', flags(true));
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(1);
    });
  });
});
