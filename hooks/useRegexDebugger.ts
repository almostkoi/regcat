import { useMemo } from 'react';
import { MatchResults, MatchResult } from '@/lib/types';

/**
 * Hook for managing regex debugger state and navigation
 * Provides utilities to step through matches one by one
 */
export function useRegexDebugger(
  matchResults: MatchResults,
  currentMatchIndex: number
) {
  // Validate and clamp currentMatchIndex to valid range
  const validIndex = useMemo(() => {
    if (!matchResults.valid || matchResults.matches.length === 0) {
      return -1;
    }
    return Math.max(0, Math.min(currentMatchIndex, matchResults.matches.length - 1));
  }, [matchResults, currentMatchIndex]);

  // Get current match or null if no matches
  const currentMatch: MatchResult | null = useMemo(() => {
    if (validIndex === -1) return null;
    return matchResults.matches[validIndex] || null;
  }, [validIndex, matchResults.matches]);

  // Total match count
  const totalMatches = useMemo(
    () => matchResults.matches.length,
    [matchResults.matches]
  );

  // Human-readable match number (1-indexed for display)
  const displayIndex = useMemo(
    () => (validIndex === -1 ? 0 : validIndex + 1),
    [validIndex]
  );

  // Helper: get group color based on group index
  const getGroupColor = (groupIndex: number): string => {
    const colors = ['#00ff99', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#c7ceea'];
    return colors[groupIndex % colors.length];
  };

  // Helper: get match character range for highlighting
  const getMatchRange = () => {
    if (!currentMatch) return null;
    return {
      start: currentMatch.index,
      end: currentMatch.index + currentMatch.fullMatch.length,
    };
  };

  // Helper: get group character range (if available)
  const getGroupRange = (groupIndex: number) => {
    if (!currentMatch || !currentMatch.groups[groupIndex]) return null;
    const group = currentMatch.groups[groupIndex];
    if (group.value === undefined || group.index === undefined) return null;
    return {
      start: group.index,
      end: group.index + group.value.length,
    };
  };

  return {
    // State
    currentMatch,
    currentMatchIndex: validIndex,
    displayIndex,
    totalMatches,
    isValid: matchResults.valid,
    error: matchResults.error,

    // Navigation helpers
    canGoPrevious: validIndex > 0,
    canGoNext: validIndex < totalMatches - 1,

    // Utilities
    getGroupColor,
    getMatchRange,
    getGroupRange,
  };
}