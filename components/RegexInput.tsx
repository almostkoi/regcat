/**
 * RegexInput - textarea for regex pattern input with copy button and generate test strings
 */

'use client';

import { useState } from 'react';
import { Copy, Zap } from 'lucide-react';
import { FlagSet } from '@/lib/types';

interface RegexInputProps {
  pattern: string;
  onChange: (pattern: string) => void;
  flags?: FlagSet;
  onGenerateTestStrings?: () => void;
  isGeneratingTests?: boolean;
}

/**
 * Component for entering a regex pattern with copy and generate test strings buttons
 */
export function RegexInput({ pattern, onChange, onGenerateTestStrings, isGeneratingTests }: RegexInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pattern).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-regcat-text-secondary font-mono text-xs uppercase tracking-widest font-semibold">
          Pattern
        </label>
        <div className="flex gap-2 items-center">
          <button
            onClick={onGenerateTestStrings}
            disabled={!pattern || isGeneratingTests}
            title="Generate example strings matching this pattern"
            className="text-xs text-regcat-text-tertiary hover:text-regcat-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-mono hover:scale-105 flex items-center gap-1"
          >
            <Zap size={14} className={isGeneratingTests ? 'animate-spin' : ''} />
            {isGeneratingTests ? 'generating...' : 'generate'}
          </button>
          <button
            onClick={handleCopy}
            disabled={!pattern}
            className="text-xs text-regcat-text-tertiary hover:text-regcat-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-mono hover:scale-105"
          >
            {copied ? '✓ copied' : <Copy size={14} className="inline" />}
          </button>
        </div>
      </div>
      <textarea
        value={pattern}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., \\d{3}-\\d{2}-\\d{4}"
        className="w-full bg-regcat-surface border border-regcat-border text-regcat-text font-mono text-sm p-3 rounded-sm focus:outline-none focus:border-regcat-accent focus:ring-1 focus:ring-regcat-accent/30 resize-none h-20 transition-all duration-200 hover:border-regcat-border/80"
        autoFocus
        spellCheck="false"
      />
      <div className="text-xs text-regcat-text-tertiary font-mono flex justify-between">
        <span>{pattern.length} chars</span>
        {pattern && <span className="text-regcat-accent/70">active</span>}
      </div>
    </div>
  );
}
