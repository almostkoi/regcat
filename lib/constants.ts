/**
 * Application constants, color palette, and configuration
 */

/**
 * Color palette matching CyberChef dark utility theme
 */
export const COLORS = {
  bg: '#0a0a0a',
  surface: '#1a1a1a',
  hover: '#2a2a2a',
  border: '#3a3a3a',
  text: '#e0e0e0',
  textSecondary: '#b0b0b0',
  textTertiary: '#808080',
  accent: '#00ff99',
  accentHover: '#00dd88',
  error: '#ff4444',
  warning: '#ffaa00',
  calloutTip: '#00ff99',
  calloutWarning: '#ffb700',
  calloutNote: '#66b3ff',
  calloutInfo: '#b0b0b0',
} as const;

/**
 * Note: Regcat (formerly Catex) - AI-powered regex tester
 */

/**
 * Flag metadata with descriptions
 */
export const FLAG_INFO: Record<string, { name: string; description: string }> = {
  g: { name: 'Global', description: 'Find all matches, not just the first' },
  i: { name: 'Ignore Case', description: 'Case-insensitive matching' },
  m: { name: 'Multiline', description: '^/$ match line boundaries' },
  s: { name: 'Dot All', description: '. matches newlines' },
  u: { name: 'Unicode', description: 'UTF-16 surrogate pair support' },
  d: { name: 'Has Indices', description: 'Capture group positions (indices)' },
  y: { name: 'Sticky', description: 'Match only from lastIndex' },
} as const;

/**
 * Regex cheat sheet content
 */
export const CHEATSHEET_CONTENT = `ANCHORS
  ^     Start of string (or line in multiline mode)
  $     End of string (or line in multiline mode)
  \\b    Word boundary
  \\B    Non-word boundary

CHARACTER CLASSES
  .     Any character (except newline, unless s flag)
  \\d    Digit [0-9]
  \\D    Non-digit [^0-9]
  \\w    Word char [a-zA-Z0-9_]
  \\W    Non-word char
  \\s    Whitespace
  \\S    Non-whitespace
  [abc]    Any of a, b, c
  [^abc]   Anything except a, b, c
  [a-z]    Range from a to z

QUANTIFIERS
  *     0 or more
  +     1 or more
  ?     0 or 1
  {n}   Exactly n times
  {n,}  n or more times
  {n,m} Between n and m times

GROUPS & REFERENCES
  (...)         Capturing group
  (?<name>...)  Named capturing group
  (?:...)       Non-capturing group
  \\1, \\2, etc   Backreference to group

ALTERNATION & ESCAPING
  a|b   a or b
  \\     Escape special char
  \\n    Newline
  \\t    Tab
`;

/**
 * Timeout for regex execution (milliseconds)
 */
export const REGEX_TIMEOUT_MS = 2000;

/**
 * Maximum number of matches to display before pagination
 */
export const MATCHES_PER_PAGE = 50;

/**
 * API endpoint for regex explanation
 */
export const API_EXPLAIN_ENDPOINT = '/api/explain';
