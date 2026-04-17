/**
 * MatchItem - a single regex match with expandable capture groups
 */

'use client';

import { useState } from 'react';
import { MatchResult } from '@/lib/types';

interface MatchItemProps {
  match: MatchResult;
  index: number;
  highlightColor: string;
}

/**
 * Component for displaying a single match with expandable capture group details
 * Shows full match text, index position, and expandable group information
 */
export function MatchItem({ match, index, highlightColor }: MatchItemProps) {
  const [expanded, setExpanded] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncate = (text: string, max: number = 50) => {
    return text.length > max ? text.slice(0, max) + '...' : text;
  };

  return (
    <div
      className={`border rounded-sm p-3 bg-regcat-surface transition-all duration-250 cursor-pointer group/item ${
        expanded
          ? 'border-regcat-accent bg-opacity-80 shadow-md shadow-regcat-accent/20'
          : 'border-regcat-border hover:border-regcat-accent/50 hover:bg-opacity-60'
      }`}
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setExpanded(!expanded);
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div
            className={`font-mono text-sm font-bold truncate transition-all duration-200`}
            style={{ color: highlightColor }}
          >
            [{index}] "{truncate(match.fullMatch)}"
          </div>
          <div className="text-xs text-regcat-text-tertiary mt-1.5 font-mono">
            Index: {match.index}–{match.index + match.fullMatch.length}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(match.fullMatch);
          }}
          className="text-xs text-regcat-text-tertiary hover:text-regcat-accent transition-all duration-150 flex-shrink-0 font-mono opacity-0 group-item-hover:opacity-100 hover:scale-110"
        >
          copy
        </button>
      </div>

      {expanded && match.groups.length > 0 && (
        <div className="mt-3 pt-3 border-t border-regcat-border/50">
          <div className="text-xs text-regcat-text font-mono space-y-1.5">
            {match.groups.map((group, gIdx) => (
              <div key={gIdx} className="text-regcat-text-secondary hover:text-regcat-accent transition-colors duration-150">
                <span className="text-regcat-accent font-semibold">
                  {group.name ? `${group.name}:` : `\\${gIdx + 1}:`}
                </span>{' '}
                <span className="text-regcat-text">
                  {group.value === undefined ? 'undefined' : `"${group.value}"`}
                </span>
                {group.index !== undefined && (
                  <span className="text-regcat-text-tertiary"> @{group.index}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
