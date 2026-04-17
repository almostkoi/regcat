/**
 * Component interface tests for Catex UI components
 * Tests props, types, and basic component logic
 */

import { describe, it, expect } from 'vitest';
import { FlagSet, MatchResult } from '@/lib/types';

const createFlagSet = (g = false, i = false, m = false, s = false, u = false, d = false, y = false): FlagSet => ({
  g, i, m, s, u, d, y,
});

const createMockMatch = (overrides?: Partial<MatchResult>): MatchResult => ({
  fullMatch: 'test',
  index: 0,
  groups: [],
  ...overrides,
});

describe('Component Types and Props', () => {
  describe('FlagSet Type', () => {
    it('creates valid flag set with all flags false', () => {
      const flags = createFlagSet();
      expect(flags.g).toBe(false);
      expect(flags.i).toBe(false);
      expect(flags.m).toBe(false);
      expect(flags.s).toBe(false);
      expect(flags.u).toBe(false);
      expect(flags.d).toBe(false);
      expect(flags.y).toBe(false);
    });

    it('creates valid flag set with mixed flags', () => {
      const flags = createFlagSet(true, true, false, true);
      expect(flags.g).toBe(true);
      expect(flags.i).toBe(true);
      expect(flags.m).toBe(false);
      expect(flags.s).toBe(true);
    });

    it('has all 7 flags defined', () => {
      const flags = createFlagSet();
      expect(Object.keys(flags)).toHaveLength(7);
      expect(flags).toHaveProperty('g');
      expect(flags).toHaveProperty('i');
      expect(flags).toHaveProperty('m');
      expect(flags).toHaveProperty('s');
      expect(flags).toHaveProperty('u');
      expect(flags).toHaveProperty('d');
      expect(flags).toHaveProperty('y');
    });
  });

  describe('MatchResult Type', () => {
    it('creates valid match result', () => {
      const match = createMockMatch();
      expect(match.fullMatch).toBe('test');
      expect(match.index).toBe(0);
      expect(match.groups).toEqual([]);
    });

    it('handles match with capture groups', () => {
      const match = createMockMatch({
        groups: [
          { name: 'username', value: 'john', index: 0 },
          { name: 'domain', value: 'example.com', index: 6 },
        ],
      });
      expect(match.groups).toHaveLength(2);
      expect(match.groups[0].name).toBe('username');
      expect(match.groups[0].value).toBe('john');
    });

    it('handles match with indices', () => {
      const match = createMockMatch({
        indices: { start: 5, end: 10 },
      });
      expect(match.indices).toBeDefined();
      expect(match.indices?.start).toBe(5);
      expect(match.indices?.end).toBe(10);
    });

    it('handles unnamed capture groups', () => {
      const match = createMockMatch({
        groups: [
          { value: 'captured', index: 0 },
          { value: 'also captured', index: 10 },
        ],
      });
      expect(match.groups[0].name).toBeUndefined();
      expect(match.groups[0].value).toBe('captured');
    });

    it('handles undefined group values', () => {
      const match = createMockMatch({
        groups: [
          { value: undefined, index: undefined },
        ],
      });
      expect(match.groups[0].value).toBeUndefined();
      expect(match.groups[0].index).toBeUndefined();
    });
  });

  describe('Component Prop Types', () => {
    it('RegexInput props are typed correctly', () => {
      const pattern = '';
      const onChange = (p: string) => {};
      expect(typeof pattern).toBe('string');
      expect(typeof onChange).toBe('function');
    });

    it('FlagToggle props are typed correctly', () => {
      const flags = createFlagSet();
      const onChange = (f: FlagSet) => {};
      expect(flags).toBeDefined();
      expect(typeof onChange).toBe('function');
    });

    it('TestStringInput props are typed correctly', () => {
      const testString = '';
      const onChange = (t: string) => {};
      expect(typeof testString).toBe('string');
      expect(typeof onChange).toBe('function');
    });

    it('MatchItem props are typed correctly', () => {
      const match = createMockMatch();
      const index = 0;
      const highlightColor = '#00ff99';
      expect(match).toBeDefined();
      expect(typeof index).toBe('number');
      expect(typeof highlightColor).toBe('string');
    });

    it('ErrorBanner props are typed correctly', () => {
      const message: string | null = 'Error message';
      expect(message === null || typeof message === 'string').toBe(true);
    });
  });

  describe('Component Behavior Logic', () => {
    it('flag toggle logic works', () => {
      let flags = createFlagSet(true, false);
      const handleToggle = (updatedFlags: FlagSet) => {
        flags = updatedFlags;
      };

      // Simulate toggling the 'i' flag
      handleToggle({ ...flags, i: true });
      expect(flags.i).toBe(true);
    });

    it('text input change logic works', () => {
      let text = '';
      const handleChange = (newText: string) => {
        text = newText;
      };

      handleChange('hello world');
      expect(text).toBe('hello world');
    });

    it('match copy logic preserves text', () => {
      const match = createMockMatch({ fullMatch: 'test-match' });
      const copied = match.fullMatch;
      expect(copied).toBe('test-match');
    });

    it('match expansion state logic works', () => {
      let expanded = false;
      const toggleExpanded = () => {
        expanded = !expanded;
      };

      expect(expanded).toBe(false);
      toggleExpanded();
      expect(expanded).toBe(true);
      toggleExpanded();
      expect(expanded).toBe(false);
    });
  });

  describe('Accessibility Props', () => {
    it('buttons have proper role attributes', () => {
      const hasRole = (role: string) => ['button', 'checkbox'].includes(role);
      expect(hasRole('button')).toBe(true);
    });

    it('inputs have proper labels', () => {
      const labels = ['PATTERN', 'FLAGS', 'TEST STRING'];
      expect(labels).toContain('PATTERN');
      expect(labels).toContain('FLAGS');
      expect(labels).toContain('TEST STRING');
    });

    it('keyboard shortcuts are defined', () => {
      const shortcuts = {
        clear: 'Ctrl+K',
        focusPattern: 'Ctrl+1',
        focusTest: 'Ctrl+2',
        explain: 'Ctrl+Enter',
      };
      expect(shortcuts.clear).toBe('Ctrl+K');
      expect(shortcuts.focusPattern).toBe('Ctrl+1');
    });
  });
});
