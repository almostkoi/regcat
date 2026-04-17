/**
 * CheatSheet - toggleable quick reference for regex syntax
 */

'use client';

import { useState } from 'react';
import { CHEATSHEET_CONTENT } from '@/lib/constants';

/**
 * Component displaying a toggleable regex cheat sheet panel
 * Shows common regex patterns, anchors, quantifiers, groups, etc.
 */
export function CheatSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-cheatsheet-toggle
        className="w-full bg-regcat-surface border border-regcat-border text-regcat-accent hover:border-regcat-accent hover:bg-regcat-hover hover:shadow-lg hover:shadow-regcat-accent/20 py-2.5 px-3 font-mono text-sm transition-all duration-200 rounded-sm hover:scale-[1.02] active:scale-[0.98]"
      >
        {isOpen ? '▼ Hide Cheat Sheet' : '▶ Quick Reference'}
      </button>

      {isOpen && (
        <div className="border border-regcat-border bg-regcat-surface p-3 overflow-y-auto max-h-80 rounded-sm animate-slide-down">
          <pre className="font-mono text-xs text-regcat-text whitespace-pre-wrap overflow-x-hidden break-words">
            {CHEATSHEET_CONTENT}
          </pre>
        </div>
      )}
    </div>
  );
}
