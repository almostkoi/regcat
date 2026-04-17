/**
 * Hook for generating test strings from a regex pattern
 * Uses the /api/generate-test-strings endpoint (powered by randexp)
 */

import { useState } from 'react';
import { FlagSet } from '@/lib/types';

export interface GenerateTestStringsResult {
  testStrings: string[];
  loading: boolean;
  error: string | null;
  generate: () => Promise<void>;
}

export function useGenerateTestStrings(
  pattern: string,
  flags: FlagSet
): GenerateTestStringsResult {
  const [testStrings, setTestStrings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!pattern) {
      setError('Please enter a regex pattern first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const flagsString = Object.entries(flags)
        .filter(([, isActive]) => isActive)
        .map(([flag]) => flag)
        .join('');

      const response = await fetch('/api/generate-test-strings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pattern,
          flagsString,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.testStrings && Array.isArray(data.testStrings)) {
        setTestStrings(data.testStrings);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate test strings';
      setError(message);
      setTestStrings([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    testStrings,
    loading,
    error,
    generate,
  };
}
