'use client';

import { useState, useCallback } from 'react';
import { GeneratedRegex, GenerateRegexResponse } from '@/lib/types';

interface UseGenerateRegexResult {
  regexes: GeneratedRegex[];
  loading: boolean;
  error: string | null;
  apiUsed: 'gemini' | 'grok' | null;
  generate: (description: string) => Promise<void>;
}

// Module-level cache (1 hour TTL)
const generatorCache = new Map<string, { data: GenerateRegexResponse; timestamp: number }>();
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

export function useGenerateRegex(): UseGenerateRegexResult {
  const [regexes, setRegexes] = useState<GeneratedRegex[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUsed, setApiUsed] = useState<'gemini' | 'grok' | null>(null);

  const generate = useCallback(async (description: string) => {
    if (!description.trim()) {
      setError('Description cannot be empty');
      return;
    }

    // Check cache
    const cacheKey = description.toLowerCase();
    const cached = generatorCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      setRegexes(cached.data.regexes);
      setApiUsed(cached.data.apiUsed);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setRegexes([]);

    try {
      const response = await fetch('/api/generate-regex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          count: 3,
        }),
      });

      const data: GenerateRegexResponse = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || 'Failed to generate regex');
        setRegexes([]);
      } else {
        setRegexes(data.regexes);
        setApiUsed(data.apiUsed);
        setError(null);

        // Cache successful result
        generatorCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setRegexes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { regexes, loading, error, apiUsed, generate };
}
