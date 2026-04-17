/**
 * FlagToggle - toggles for all 7 JavaScript regex flags
 */

'use client';

import { FLAG_INFO } from '@/lib/constants';
import { FlagSet, RegexFlag } from '@/lib/types';

interface FlagToggleProps {
  flags: FlagSet;
  onChange: (flags: FlagSet) => void;
}

/**
 * Component displaying 7 toggleable regex flags with tooltips
 */
export function FlagToggle({ flags, onChange }: FlagToggleProps) {
  const flagOrder: RegexFlag[] = ['g', 'i', 'm', 's', 'u', 'd', 'y'];

  const handleToggle = (flag: RegexFlag) => {
    onChange({
      ...flags,
      [flag]: !flags[flag],
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-regcat-text-secondary font-mono text-xs uppercase tracking-widest font-semibold">
        Flags
      </label>
      <div className="flex flex-wrap gap-2">
        {flagOrder.map((flag) => (
          <button
            key={flag}
            onClick={() => handleToggle(flag)}
            title={FLAG_INFO[flag].description}
            className={`w-10 h-10 border font-mono font-bold text-sm transition-all duration-200 rounded-sm ${
              flags[flag]
                ? 'bg-regcat-accent text-regcat-bg border-regcat-accent shadow-lg shadow-regcat-accent/40 scale-105'
                : 'bg-regcat-surface border-regcat-border text-regcat-text-secondary hover:border-regcat-accent hover:text-regcat-accent hover:shadow-md hover:shadow-regcat-accent/20'
            }`}
          >
            {flag}
          </button>
        ))}
      </div>
      <div className="text-xs text-regcat-text-tertiary font-mono mt-1">
        {Object.values(flags).filter(Boolean).length}/7 active
      </div>
    </div>
  );
}
