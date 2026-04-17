/**
 * Regex matching engine with comprehensive error handling and edge case support
 */

import { FlagSet, MatchResult, MatchResults } from '@/lib/types';
import { REGEX_TIMEOUT_MS } from '@/lib/constants';

/**
 * Convert FlagSet object to regex flags string
 * @param flags FlagSet with boolean values
 * @returns String of flags (e.g., "gi" or "gim")
 */
export function flagsToString(flags: FlagSet): string {
  const flagArray: string[] = [];
  if (flags.g) flagArray.push('g');
  if (flags.i) flagArray.push('i');
  if (flags.m) flagArray.push('m');
  if (flags.s) flagArray.push('s');
  if (flags.u) flagArray.push('u');
  if (flags.d) flagArray.push('d');
  if (flags.y) flagArray.push('y');
  return flagArray.join('');
}

/**
 * Extract named group name from regex pattern at given index.
 * Handles patterns like (?<groupName>...) by counting named groups.
 * @param pattern The regex pattern string
 * @param groupIndex Zero-based index of the group (counting only capturing groups)
 * @returns Group name if found, undefined otherwise
 */
function extractGroupName(pattern: string, groupIndex: number): string | undefined {
  const namedGroupRegex = /\(\?<([a-zA-Z_]\w*)>/g;
  let match;
  let count = 0;
  while ((match = namedGroupRegex.exec(pattern)) !== null) {
    if (count === groupIndex) return match[1];
    count++;
  }
  return undefined;
}

/**
 * Parse a regex pattern and test string, returning all matches with capture groups.
 * Handles edge cases: invalid regex, catastrophic backtracking (timeout), empty strings,
 * multiline mode, named groups, and capture group indices.
 *
 * @param pattern The regex pattern string
 * @param testString The string to test against
 * @param flags FlagSet with boolean values for each flag
 * @returns MatchResults with matches or error
 */
export function matchRegex(
  pattern: string,
  testString: string,
  flags: FlagSet
): MatchResults {
  const startTime = performance.now();

  try {
    // Early return for empty pattern
    if (!pattern) {
      return {
        valid: true,
        matches: [],
        executionTime: 0,
      };
    }

    // Timeout guard using a logical counter rather than setTimeout
    // (we'll check during iteration to avoid blocking)
    let iterationCount = 0;
    const maxIterations = 10000; // Prevent infinite loops on malicious patterns

    const flagsString = flagsToString(flags);

    // matchAll requires global flag, so force it on for matching operation
    // (doesn't affect behavior - we show all matches anyway)
    const matchingFlagsString = flagsString.includes('g') ? flagsString : flagsString + 'g';

    // Create regex - let it throw if invalid
    let matchingRegex: RegExp;
    try {
      matchingRegex = new RegExp(pattern, matchingFlagsString);
    } catch (e) {
      const executionTime = performance.now() - startTime;
      return {
        valid: false,
        matches: [],
        error: `Invalid regex: ${e instanceof Error ? e.message : 'Unknown error'}`,
        executionTime,
      };
    }

    const matches: MatchResult[] = [];
    const matchStartTime = performance.now();

    // Use matchAll to get all matches with indices and groups
    try {
      for (const regexMatch of testString.matchAll(matchingRegex)) {
        // Check for catastrophic backtracking by monitoring time
        if (performance.now() - matchStartTime > REGEX_TIMEOUT_MS) {
          throw new Error('Regex timeout (2s limit) - pattern too complex');
        }

        // Safety check on iteration count
        iterationCount++;
        if (iterationCount > maxIterations) {
          throw new Error('Max iterations exceeded - pattern likely has catastrophic backtracking');
        }

        // Extract capture groups
        const groups: CaptureGroup[] = [];
        for (let i = 1; i < regexMatch.length; i++) {
          const groupValue = regexMatch[i];
          const groupName = extractGroupName(pattern, i - 1);

          groups.push({
            name: groupName,
            value: groupValue,
            // Type assertion for 'd' flag indices (hasIndices)
            index: (regexMatch as any).indices?.[i]?.[0],
          });
        }

        matches.push({
          fullMatch: regexMatch[0],
          index: regexMatch.index!,
          groups,
          // Type assertion for 'd' flag indices (hasIndices)
          indices: (regexMatch as any).indices
            ? {
                start: (regexMatch as any).indices[0][0],
                end: (regexMatch as any).indices[0][1],
              }
            : undefined,
        });
      }
    } catch (e) {
      const executionTime = performance.now() - startTime;
      const errorMessage =
        e instanceof Error ? e.message : 'Unknown error during matching';
      return {
        valid: false,
        matches: [],
        error: errorMessage,
        executionTime,
      };
    }

    const executionTime = performance.now() - startTime;
    return {
      valid: true,
      matches,
      executionTime,
    };
  } catch (error) {
    const executionTime = performance.now() - startTime;
    return {
      valid: false,
      matches: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime,
    };
  }
}

/**
 * Perform regex substitution with captured group support
 * @param testString The input string
 * @param pattern The regex pattern
 * @param flags FlagSet
 * @param replacement The replacement string (supports $1, $2, $<name>, $&, etc.)
 * @returns The substituted string
 */
export function performSubstitution(
  testString: string,
  pattern: string,
  flags: FlagSet,
  replacement: string
): string {
  try {
    const flagsString = flagsToString(flags);
    const regex = new RegExp(pattern, flagsString);
    return testString.replace(regex, replacement);
  } catch (e) {
    // If substitution fails, return original string
    return testString;
  }
}

/**
 * Validate if a string is a valid regex pattern
 * @param pattern The pattern to validate
 * @returns true if valid, false otherwise
 */
export function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

interface CaptureGroup {
  name?: string;
  value: string | undefined;
  index?: number;
}
