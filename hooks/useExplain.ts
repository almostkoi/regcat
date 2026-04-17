/**
 * Custom hook for fetching regex explanations (LOCAL - NO API)
 * Uses local parsing for completely FREE unlimited explanations
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { flagsToString } from '@/lib/regex-engine';
import { RegexState } from '@/lib/types';

interface CacheEntry {
  explanation: string;
  timestamp: number;
}

/**
 * Response type from useExplain hook
 */
export interface UseExplainResult {
  explanation: string | null;
  loading: boolean;
  error: string | null;
  isRateLimited: boolean;
}

// Module-level cache (24 hour TTL)
const explanationCache = new Map<string, CacheEntry>();
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hook for fetching regex explanations locally (NO API CALLS)
 * Uses local parsing for unlimited free explanations
 * @param regexState Current regex state
 * @param shouldFetch Whether to actually fetch
 * @returns UseExplainResult
 */
export function useExplain(
  regexState: RegexState,
  shouldFetch: boolean = false
): UseExplainResult {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheKeyRef = useRef('');

  useEffect(() => {
    if (!shouldFetch || !regexState.pattern) {
      return;
    }

    // Generate cache key
    const flags = flagsToString(regexState.flags);
    const cacheKey = `${regexState.pattern}:${flags}`;
    cacheKeyRef.current = cacheKey;

    // Check cache first
    const cached = explanationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      setExplanation(cached.explanation);
      setError(null);
      setLoading(false);
      return;
    }

    // Fetch explanation from local API (uses local regex-explainer library)
    setLoading(true);
    setError(null);

    fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pattern: regexState.pattern,
        flagsString: flags,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setExplanation(null);
        } else {
          // Decode HTML entities
          const decoded = decodeHtmlEntities(data.explanation);
          setExplanation(decoded);
          setError(null);

          // Cache the result
          explanationCache.set(cacheKey, {
            explanation: decoded,
            timestamp: Date.now(),
          });
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setExplanation(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [shouldFetch, regexState.pattern, regexState.flags]);

  return {
    explanation,
    loading,
    error,
    isRateLimited: false, // NO rate limiting - unlimited local parsing!
  };
}

function decodeHtmlEntities(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
  };
  return text.replace(/&(?:amp|lt|gt|quot|#x27);/g, (entity) => map[entity] || entity);
}

/**
 * Get current request count for UI display
 * Always returns 0 since local parsing has no API limits
 */
export function getRequestCount(): number {
  return 0; // Unlimited - no API requests!
}
