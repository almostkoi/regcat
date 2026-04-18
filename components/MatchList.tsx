/**
 * MatchList - displays all regex matches with different colors
 */

'use client';

import { MatchItem } from '@/components/MatchItem';
import { MatchResults } from '@/lib/types';
import { ErrorBanner } from '@/components/ErrorBanner';
import { MATCHES_PER_PAGE } from '@/lib/constants';
import { useState } from 'react';

interface MatchListProps {
  results: MatchResults;
  onDebugMatch?: (matchIndex: number) => void;
}

// Palette of distinct colors for highlighting different matches
const COLORS = ['#00ff99', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#c7ceea'];

/**
 * Get a color for a match index (cycles through palette)
 */
function getColorForMatch(index: number): string {
  return COLORS[index % COLORS.length];
}

/**
 * Component displaying all matches in a scrollable list with pagination
 * Shows match text, index position, and expandable capture groups
 * Uses a palette of colors for visual differentiation
 */
export function MatchList({ results, onDebugMatch }: MatchListProps) {
  const [showMore, setShowMore] = useState(false);

  if (!results.valid) {
    return <ErrorBanner message={results.error || 'Invalid regex'} />;
  }

  if (results.matches.length === 0) {
    return (
      <div className="text-sm text-regcat-text-tertiary font-mono">
        {results.error ? <ErrorBanner message={results.error} /> : 'No matches'}
      </div>
    );
  }

  const displayCount = showMore ? results.matches.length : MATCHES_PER_PAGE;
  const hasMore = results.matches.length > MATCHES_PER_PAGE;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-regcat-text-secondary font-mono text-xs uppercase tracking-widest font-semibold">
          Matches ({results.matches.length})
        </label>
        <div className="text-xs text-regcat-text-tertiary font-mono bg-regcat-surface px-2 py-1 rounded-sm border border-regcat-border/50">
          {results.executionTime.toFixed(2)}ms
        </div>
      </div>

      <div className="border border-regcat-border bg-regcat-bg space-y-2 p-2 overflow-y-auto max-h-80 rounded-sm">
        {results.matches.slice(0, displayCount).map((match, idx) => (
          <MatchItem
            key={idx}
            match={match}
            index={idx}
            highlightColor={getColorForMatch(idx)}
            onDebugClick={onDebugMatch ? () => onDebugMatch(idx) : undefined}
          />
        ))}

        {hasMore && !showMore && (
          <button
            onClick={() => setShowMore(true)}
            className="w-full text-center py-2.5 text-xs text-regcat-accent hover:text-regcat-accent-hover transition-all duration-200 font-mono border border-regcat-border hover:border-regcat-accent hover:bg-regcat-hover/30 rounded-sm"
          >
            ↓ Show {results.matches.length - MATCHES_PER_PAGE} more
          </button>
        )}
      </div>
    </div>
  );
}