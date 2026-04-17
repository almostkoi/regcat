/**
 * Beginner-friendly regex pattern explainer
 * Uses simple language, examples, and visual formatting
 */

export function explainRegex(pattern: string, flags: string = ''): string {
  if (!pattern) {
    return 'No pattern entered. Try entering a regex pattern like `\\d+` or `[a-z]+`.';
  }

  try {
    new RegExp(pattern, flags);
  } catch (e) {
    return `Invalid regex: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }

  const parts: string[] = [];
  parts.push('# Regex Explanation\n');

  // Parse flags
  const flagExplanations = parseFlags(flags);
  if (flagExplanations.length > 0) {
    parts.push('## Flags (Modifiers)\n');
    parts.push('These change how the pattern behaves:\n');
    flagExplanations.forEach((f) => {
      parts.push(`• **${f.flag}** - ${f.explanation}\n`);
    });
    parts.push('');
  }

  // Parse pattern with beginner-friendly breakdown
  parts.push('## Pattern Breakdown\n');
  parts.push('Here\'s what each part does:\n');

  let i = 0;
  let depth = 0;

  while (i < pattern.length) {
    const char = pattern[i];
    const next = pattern[i + 1];
    const next2 = pattern.substring(i, i + 2);
    const next3 = pattern.substring(i, i + 3);
    const next4 = pattern.substring(i, i + 4);

    // Character class
    if (char === '[') {
      let classEnd = pattern.indexOf(']', i + 1);
      if (classEnd === -1) classEnd = pattern.length;
      const classContent = pattern.substring(i, classEnd + 1);

      if (classContent.startsWith('[^')) {
        parts.push(`\n### \`${classContent}\` - Negated Character Class`);
        parts.push('Match **ANY character EXCEPT** these:\n');
        parts.push(explainCharacterClass(classContent.slice(2, -1)));
      } else {
        parts.push(`\n### \`${classContent}\` - Character Class`);
        parts.push('Match **ANY ONE character** from this set:\n');
        parts.push(explainCharacterClass(classContent.slice(1, -1)));
      }
      i = classEnd + 1;
      continue;
    }

    // Lookahead/lookbehind
    if (char === '(' && next === '?') {
      if (next3 === '(?=') {
        parts.push(`\n### \`(?=...\` - Positive Lookahead`);
        parts.push('Look ahead without consuming. "Assert that this WILL match".\n');
        i += 3;
        continue;
      } else if (next3 === '(?!') {
        parts.push(`\n### \`(?!...\` - Negative Lookahead`);
        parts.push('Look ahead without consuming. "Assert that this will NOT match".\n');
        i += 3;
        continue;
      } else if (next4 === '(?<=') {
        parts.push(`\n### \`(?<=...\` - Positive Lookbehind`);
        parts.push('Look behind without consuming. "Assert that this came before".\n');
        i += 4;
        continue;
      } else if (next4 === '(?<!') {
        parts.push(`\n### \`(?<!...\` - Negative Lookbehind`);
        parts.push('Look behind without consuming. "Assert that this did NOT come before".\n');
        i += 4;
        continue;
      } else if (next3 === '(?:') {
        parts.push(`\n### \`(?:...\` - Non-Capturing Group`);
        parts.push('Group things together but don\'t "capture" them. Used to apply quantifiers to multiple characters.\n');
        i += 3;
        depth++;
        continue;
      }
    }

    // Capturing group
    if (char === '(') {
      parts.push(`\n### \`(...)\` - Capturing Group`);
      parts.push('**Captures** the matched text so you can use it later. Creates a numbered reference (group 1, 2, 3, etc).\n');
      i++;
      depth++;
      continue;
    }

    // Closing bracket/paren
    if (char === ')' || char === '}') {
      depth = Math.max(0, depth - 1);
      i++;
      continue;
    }

    // Escape sequences
    if (char === '\\') {
      const escaped = explainEscapeSequence(next2);
      if (escaped) {
        parts.push(`\n### \`${next2}\` - ${escaped.title}`);
        parts.push(`${escaped.explanation}\n`);
        parts.push(`**Example matches**: ${escaped.examples}\n`);
        i += 2;
        continue;
      }
    }

    // Quantifiers
    if (char === '*' && i > 0) {
      parts.push(`\n### \`*\` - Zero or More`);
      parts.push('The **previous element** can appear **0 to unlimited times**.\n');
      parts.push('**Example**: \`a*\` matches "", "a", "aa", "aaa", etc.\n');
      i++;
      continue;
    }

    if (char === '+' && i > 0) {
      parts.push(`\n### \`+\` - One or More`);
      parts.push('The **previous element** must appear **at least once**.\n');
      parts.push('**Example**: \`a+\` matches "a", "aa", "aaa" (but NOT "").\n');
      i++;
      continue;
    }

    if (char === '?' && i > 0) {
      parts.push(`\n### \`?\` - Zero or One (Optional)`);
      parts.push('The **previous element** is **optional** - appears 0 or 1 time.\n');
      parts.push('**Example**: \`a?\` matches "" and "a" (but not "aa").\n');
      i++;
      continue;
    }

    // Quantifier range
    if (char === '{' && i > 0) {
      let braceEnd = pattern.indexOf('}', i);
      if (braceEnd !== -1) {
        const range = pattern.substring(i, braceEnd + 1);
        parts.push(`\n### \`${range}\` - Repeat`);
        parts.push(explainQuantifierRange(range));
        i = braceEnd + 1;
        continue;
      }
    }

    // Alternation
    if (char === '|') {
      parts.push(`\n### \`|\` - OR`);
      parts.push('**Match EITHER** the pattern on the left **OR** the pattern on the right.\n');
      parts.push('**Example**: \`cat|dog\` matches either "cat" or "dog".\n');
      i++;
      continue;
    }

    // Anchors
    if (char === '^' && i === 0) {
      parts.push(`\n### \`^\` - Start of String`);
      parts.push('The match **must start** at the beginning of the string (or line with multiline flag).\n');
      parts.push('**Example**: \`^hello\` matches "hello world" but not "say hello".\n');
      i++;
      continue;
    }

    if (char === '$' && i === pattern.length - 1) {
      parts.push(`\n### \`$\` - End of String`);
      parts.push('The match **must end** at the end of the string (or line with multiline flag).\n');
      parts.push('**Example**: \`world$\` matches "hello world" but not "world hello".\n');
      i++;
      continue;
    }

    // Dot (any character)
    if (char === '.') {
      parts.push(`\n### \`.\` - Any Character`);
      parts.push('Matches **ANY single character** except newline (unless dotAll flag is used).\n');
      parts.push('**Example**: \`a.c\` matches "abc", "adc", "aXc", etc.\n');
      i++;
      continue;
    }

    // Regular literal characters
    if (/[a-zA-Z0-9]/.test(char)) {
      let literal = char;
      let j = i + 1;
      while (
        j < pattern.length &&
        /[a-zA-Z0-9]/.test(pattern[j]) &&
        pattern[j] !== '*' &&
        pattern[j] !== '+' &&
        pattern[j] !== '?'
      ) {
        literal += pattern[j];
        j++;
      }
      if (literal.length > 0) {
        parts.push(`\n### \`${literal}\` - Literal Text`);
        parts.push(`Match the **exact text** "${literal}".\n`);
        i = j;
        continue;
      }
    }

    i++;
  }

  // Summary
  parts.push('\n## What Does This Match?\n');
  parts.push(getPatternSummary(pattern, flags));

  // Common mistakes
  parts.push('\n## Common Beginner Mistakes\n');
  parts.push(
    '• Forgetting to escape special characters like `.` or `?`\n'
  );
  parts.push(
    '• Using `*` when you meant `+` (remember: * = 0 or more, + = 1 or more)\n'
  );
  parts.push('• Forgetting the `g` flag when you want to find ALL matches\n');
  parts.push(
    '• Not using `^` and `$` anchors when you need exact matches\n'
  );

  return parts.join('\n').trim();
}

function parseFlags(flags: string) {
  const flagInfo = [
    {
      flag: 'g',
      name: 'global',
      explanation:
        'Find **all matches** instead of just the first one',
    },
    {
      flag: 'i',
      name: 'case-insensitive',
      explanation:
        'Ignore uppercase/lowercase differences. "abc" matches "ABC", "AbC", etc.',
    },
    {
      flag: 'm',
      name: 'multiline',
      explanation:
        '^/$ match line boundaries, not just string boundaries',
    },
    {
      flag: 's',
      name: 'dotAll',
      explanation: 'The . character also matches newlines',
    },
    {
      flag: 'u',
      name: 'unicode',
      explanation: 'Treat pattern as Unicode string',
    },
    {
      flag: 'd',
      name: 'hasIndices',
      explanation: 'Capture group indices',
    },
    {
      flag: 'y',
      name: 'sticky',
      explanation: 'Match at current position only',
    },
  ];

  return flagInfo
    .filter((f) => flags.includes(f.flag))
    .map((f) => ({ flag: f.flag, explanation: f.explanation }));
}

function explainCharacterClass(content: string): string {
  // Handle ranges like a-z, 0-9
  if (content === 'a-z') return '`a-z` = lowercase letters (a through z)';
  if (content === 'A-Z') return '`A-Z` = uppercase letters (A through Z)';
  if (content === '0-9') return '`0-9` = digits (0 through 9)';
  if (content === 'a-zA-Z0-9')
    return '`a-z`, `A-Z`, `0-9` = letters and numbers';

  return `The characters: **${content.split('').join(', ')}**`;
}

function explainEscapeSequence(
  seq: string
): { title: string; explanation: string; examples: string } | null {
  const escapes: Record<
    string,
    { title: string; explanation: string; examples: string }
  > = {
    '\\d': {
      title: 'Digit',
      explanation:
        'Matches **any single number** from 0 to 9.',
      examples: '"0", "5", "9"',
    },
    '\\D': {
      title: 'Non-Digit',
      explanation:
        'Matches **any character that is NOT a number**.',
      examples: '"a", "!", " "',
    },
    '\\w': {
      title: 'Word Character',
      explanation:
        'Matches **letters (a-z, A-Z), numbers (0-9), and underscore (_)**. Useful for usernames, IDs, etc.',
      examples: '"a", "Z", "5", "_"',
    },
    '\\W': {
      title: 'Non-Word Character',
      explanation:
        'Matches **anything that is NOT a letter, number, or underscore**.',
      examples: '"!", " ", "@"',
    },
    '\\s': {
      title: 'Whitespace',
      explanation:
        'Matches **spaces, tabs, new lines** - any invisible spacing character.',
      examples: '" " (space), tab, newline',
    },
    '\\S': {
      title: 'Non-Whitespace',
      explanation:
        'Matches **anything that is NOT a space, tab, or newline**.',
      examples: '"a", "5", "!"',
    },
    '\\b': {
      title: 'Word Boundary',
      explanation:
        'Matches the **edge between a word character and non-word character**. Perfect for finding whole words only.',
      examples: 'Before/after word characters',
    },
    '\\B': {
      title: 'Non-Word Boundary',
      explanation:
        'Matches **inside a word**, not at the edges.',
      examples: 'Middle of words',
    },
  };

  return escapes[seq] || null;
}

function explainQuantifierRange(range: string): string {
  if (range.includes(',')) {
    return `**Between repetitions**. ${range} means repeat between the specified number of times.\n**Example**: \`a${range}\` matches "a" repeated that many times`;
  }
  return `**Exact repetitions**. ${range} means repeat exactly that many times.\n**Example**: \`a${range}\` matches "a" repeated exactly that many times`;
}

function getPatternSummary(pattern: string, flags: string): string {
  // Quick summaries for common patterns
  const summaries: Record<string, string> = {
    '.*': 'Matches **any text** (including empty text)',
    '.+': 'Matches **any text**, at least 1 character',
    '\\d+': 'Matches **numbers** like 123, 4567, 0, etc.',
    '\\d{3}-\\d{2}-\\d{4}':
      'Matches **SSN format** like 123-45-6789',
    '^https?://':
      'Matches **http:// or https://** at the start of a URL',
    '[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z]{2,}':
      'Matches **email addresses** like user@example.com',
    '\\w+':
      'Matches **word** (letters, numbers, underscore) like hello, test123, _var',
    '\\s+':
      'Matches **spaces or tabs** used to separate text',
  };

  if (summaries[pattern]) {
    return summaries[pattern];
  }

  return `This pattern matches text that follows the structure described above.${
    flags ? ` **With flags**: ${flags}` : ''
  }`;
}
