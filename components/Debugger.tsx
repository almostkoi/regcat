'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MatchResult } from '@/lib/types';

interface DebuggerProps {
  matches: MatchResult[];
  testString: string;
  onClose: () => void;
}

interface ColorGroup {
  color: string;
  label: string;
}

const COLORS: ColorGroup[] = [
  { color: 'bg-blue-500/30 border-blue-500', label: 'Group 1' },
  { color: 'bg-purple-500/30 border-purple-500', label: 'Group 2' },
  { color: 'bg-pink-500/30 border-pink-500', label: 'Group 3' },
  { color: 'bg-cyan-500/30 border-cyan-500', label: 'Group 4' },
  { color: 'bg-yellow-500/30 border-yellow-500', label: 'Group 5' },
  { color: 'bg-green-500/30 border-green-500', label: 'Group 6' },
];

export function Debugger({ matches, testString, onClose }: DebuggerProps) {
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);
  const [jumpInput, setJumpInput] = useState('1');

  if (!matches || matches.length === 0) {
    return (
      <div className="rounded-sm p-4 bg-regcat-surface border border-regcat-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-regcat-text-secondary uppercase">
            Debugger
          </h3>
          <button
            onClick={onClose}
            className="text-regcat-text-tertiary hover:text-regcat-accent transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-regcat-text-tertiary">No matches to debug</p>
      </div>
    );
  }

  const currentMatch = matches[currentMatchIdx];
  const fullMatch = currentMatch.fullMatch;
  const startIdx = currentMatch.index;
  const endIdx = startIdx + fullMatch.length;

  const handleJump = () => {
    const num = parseInt(jumpInput) - 1;
    if (num >= 0 && num < matches.length) {
      setCurrentMatchIdx(num);
    }
  };

  return (
    <div className="rounded-sm p-4 bg-regcat-surface border border-regcat-border space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-regcat-text-secondary uppercase">
          Pattern Debugger
        </h3>
        <button
          onClick={onClose}
          className="text-regcat-text-tertiary hover:text-regcat-accent transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Full Match Display */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-regcat-text-secondary uppercase tracking-wider">
          Full Match (Position {startIdx}-{endIdx})
        </label>
        <div className="font-mono text-sm bg-regcat-bg p-3 rounded-sm border-2 border-regcat-accent/50 text-regcat-accent break-all">
          {fullMatch}
        </div>
      </div>

      {/* Test String with Highlighting */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-regcat-text-secondary uppercase tracking-wider">
          Test String Context
        </label>
        <div className="font-mono text-sm bg-regcat-bg p-3 rounded-sm border border-regcat-border break-all">
          {testString.split('').map((char, idx) => {
            const isInMatch = idx >= startIdx && idx < endIdx;
            return (
              <span
                key={idx}
                className={
                  isInMatch
                    ? 'bg-regcat-accent/30 border-b-2 border-regcat-accent text-regcat-accent font-semibold'
                    : 'text-regcat-text-secondary'
                }
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Capture Groups */}
      {currentMatch.groups && currentMatch.groups.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-regcat-text-secondary uppercase tracking-wider">
            Capture Groups
          </label>
          <div className="space-y-2">
            {currentMatch.groups.map((group, idx) => {
              const groupColor = COLORS[idx % COLORS.length];
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-sm border ${groupColor.color} bg-black/20`}
                >
                  <div className="text-xs font-semibold text-regcat-text-secondary mb-1">
                    {group.name ? `${group.name}` : `Group ${idx + 1}`}
                  </div>
                  <div className="font-mono text-sm text-regcat-text break-all">
                    {group.value !== undefined ? group.value : '(not captured)'}
                  </div>
                  {group.index !== undefined && (
                    <div className="text-xs text-regcat-text-tertiary mt-1">
                      Position: {group.index}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-regcat-border">
        <div className="flex gap-2">
          <button
            onClick={() =>
              setCurrentMatchIdx(Math.max(0, currentMatchIdx - 1))
            }
            disabled={currentMatchIdx === 0}
            className="px-3 py-1 bg-regcat-hover border border-regcat-border text-regcat-text-secondary hover:text-regcat-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-sm text-xs flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <button
            onClick={() =>
              setCurrentMatchIdx(Math.min(matches.length - 1, currentMatchIdx + 1))
            }
            disabled={currentMatchIdx === matches.length - 1}
            className="px-3 py-1 bg-regcat-hover border border-regcat-border text-regcat-text-secondary hover:text-regcat-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-sm text-xs flex items-center gap-1"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-regcat-text-tertiary">
            Match {currentMatchIdx + 1} of {matches.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max={matches.length}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJump()}
            className="w-12 px-2 py-1 bg-regcat-bg border border-regcat-border text-regcat-text font-mono text-xs rounded-sm focus:outline-none focus:border-regcat-accent"
            placeholder="Jump"
          />
          <button
            onClick={handleJump}
            className="px-2 py-1 bg-regcat-accent/20 border border-regcat-accent text-regcat-accent hover:bg-regcat-accent/30 transition-colors rounded-sm text-xs"
          >
            Jump
          </button>
        </div>
      </div>
    </div>
  );
}
