/**
 * Custom hook for real-time regex matching with all edge cases handled
 * Updates whenever pattern, testString, or flags change
 */

'use client';

import { useEffect, useState } from 'react';
import { matchRegex } from '@/lib/regex-engine';
import { MatchResults, RegexState } from '@/lib/types';

/**
 * Hook that triggers regex matching and returns results
 * @param regexState Current regex state (pattern, testString, flags)
 * @returns MatchResults with matches or error
 */
export function useRegexMatcher(regexState: RegexState): MatchResults {
  const [results, setResults] = useState<MatchResults>({
    valid: true,
    matches: [],
    executionTime: 0,
  });

  useEffect(() => {
    // Perform regex matching synchronously (no debounce needed)
    const matchResults = matchRegex(
      regexState.pattern,
      regexState.testString,
      regexState.flags
    );
    setResults(matchResults);
  }, [regexState.pattern, regexState.testString, regexState.flags]);

  return results;
}
