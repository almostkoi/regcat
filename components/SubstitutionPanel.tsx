/**
 * SubstitutionPanel - regex substitution with replacement string
 */

'use client';

import { FlagSet } from '@/lib/types';
import { performSubstitution } from '@/lib/regex-engine';
import { useState } from 'react';

interface SubstitutionPanelProps {
  pattern: string;
  testString: string;
  flags: FlagSet;
}

/**
 * Component for performing regex substitution with a replacement string
 * Shows the result of applying the replacement and allows copying the result
 */
export function SubstitutionPanel({
  pattern,
  testString,
  flags,
}: SubstitutionPanelProps) {
  const [replacement, setReplacement] = useState('');
  const [copied, setCopied] = useState(false);

  const result = pattern
    ? performSubstitution(testString, pattern, flags, replacement)
    : testString;

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-regcat-text-secondary font-mono text-xs uppercase tracking-widest font-semibold">
        Substitution
      </label>

      <div className="flex flex-col gap-3">
        <div>
          <div className="text-regcat-text-tertiary text-xs font-mono mb-2 font-semibold">
            Replacement:
          </div>
          <input
            type="text"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder="$& or $1, $2, etc."
            className="w-full bg-regcat-surface border border-regcat-border text-regcat-text font-mono text-sm p-2.5 rounded-sm focus:outline-none focus:border-regcat-accent focus:ring-1 focus:ring-regcat-accent/30 transition-all duration-200"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-regcat-text-tertiary text-xs font-mono font-semibold">
              Result:
            </div>
            <button
              onClick={handleCopy}
              className="text-xs text-regcat-text-tertiary hover:text-regcat-accent transition-all duration-150 font-mono hover:scale-110"
            >
              {copied ? '✓ copied' : 'copy'}
            </button>
          </div>
          <div className="w-full bg-regcat-surface border border-regcat-border text-regcat-text font-mono text-sm p-2.5 rounded-sm overflow-x-auto break-all whitespace-pre-wrap max-h-32 overflow-y-auto">
            {result || '(empty)'}
          </div>
        </div>
      </div>
    </div>
  );
}
