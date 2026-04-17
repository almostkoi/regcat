/**
 * ExplanationPanel - displays local regex explanations
 */

'use client';

import { useState } from 'react';
import { useExplain } from '@/hooks/useExplain';
import { RegexState } from '@/lib/types';

interface ExplanationPanelProps {
  regexState: RegexState;
}

/**
 * Component for displaying local regex explanations
 * Shows explanation text, loading state, and error messages
 */
export function ExplanationPanel({ regexState }: ExplanationPanelProps) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { explanation, loading, error } = useExplain(
    regexState,
    shouldFetch
  );

  const handleExplain = () => {
    if (regexState.pattern) {
      setShouldFetch(true);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-regcat-text-secondary font-mono text-xs uppercase tracking-widest font-semibold">
          Explanation
        </label>
        <div className="text-xs font-mono px-2.5 py-1 bg-regcat-surface border border-regcat-accent/30 text-regcat-accent rounded-sm">
          ∞ Unlimited
        </div>
      </div>

      <button
        onClick={handleExplain}
        disabled={!regexState.pattern || loading}
        data-explain-trigger
        className="w-full bg-regcat-surface border border-regcat-border text-regcat-accent hover:border-regcat-accent hover:bg-regcat-hover hover:shadow-lg hover:shadow-regcat-accent/20 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 px-3 font-mono text-sm transition-all duration-200 rounded-sm hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? '⏳ Analyzing...' : '→ Explain'}
      </button>

      <div className="border border-regcat-border bg-regcat-surface p-3 font-mono text-sm text-regcat-text h-64 flex flex-col overflow-hidden rounded-sm">
        {error && (
          <div className="text-regcat-error text-xs mb-2 flex-shrink-0 bg-regcat-error/10 border border-regcat-error/30 rounded-sm p-2">{error}</div>
        )}

        {explanation ? (
          <div className="text-regcat-text leading-relaxed whitespace-pre-wrap overflow-y-auto flex-1">
            {explanation}
          </div>
        ) : (
          <div className="text-regcat-text-tertiary text-xs flex items-center justify-center h-full">
            {regexState.pattern
              ? 'Click "Explain" to get an AI explanation of this regex'
              : 'Enter a regex pattern to see an explanation'}
          </div>
        )}
      </div>
    </div>
  );
}
