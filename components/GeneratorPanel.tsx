'use client';

import { useState } from 'react';
import { Copy, Zap } from 'lucide-react';
import { useGenerateRegex } from '@/hooks/useGenerateRegex';

export function GeneratorPanel() {
  const [description, setDescription] = useState('');
  const { regexes, loading, error, apiUsed, generate } = useGenerateRegex();

  // Component always renders - API will return error if keys not configured
  // This is simpler than checking environment variables client-side

  const handleGenerate = async () => {
    await generate(description);
  };

  const handleCopy = (pattern: string) => {
    navigator.clipboard.writeText(pattern);
  };

  const charCount = description.length;
  const maxChars = 1000;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-regcat-text-secondary font-mono text-xs uppercase tracking-widest font-semibold">
          Generate Regex
        </label>
        <div className="text-xs px-2.5 py-1 bg-regcat-surface border border-regcat-accent/30 rounded-sm">
          AI Powered
        </div>
      </div>

      {/* Input Section */}
      <div className="flex flex-col gap-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., match email addresses or phone numbers like XXX-XXX-XXXX"
          disabled={loading}
          className="w-full bg-regcat-surface border border-regcat-border text-regcat-text font-mono text-sm p-3 rounded-sm focus:outline-none focus:border-regcat-accent focus:ring-1 focus:ring-regcat-accent/30 resize-none h-20 transition-all duration-200 hover:border-regcat-border/80 disabled:opacity-50 disabled:cursor-not-allowed"
          spellCheck="false"
        />
        <div className="text-xs text-regcat-text-tertiary font-mono flex justify-between">
          <span>{charCount} / {maxChars} chars</span>
          {isOverLimit && <span className="text-regcat-error">Too long</span>}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!description.trim() || loading || isOverLimit}
        className="w-full bg-regcat-surface border border-regcat-border text-regcat-accent hover:border-regcat-accent hover:bg-regcat-hover hover:shadow-lg hover:shadow-regcat-accent/20 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 px-3 font-mono text-sm transition-all duration-200 rounded-sm hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Zap size={14} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Generating...' : 'Generate Regex'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-regcat-error/20 border border-regcat-error text-regcat-error px-3 py-2 rounded-sm text-sm font-mono">
          {error}
        </div>
      )}

      {/* Results Display */}
      {regexes.length > 0 && (
        <div className="space-y-3">
          {regexes.map((regex, idx) => (
            <div key={idx} className="border border-regcat-border bg-regcat-surface/50 p-3 rounded-sm space-y-2">
              {/* Pattern Box with Copy Button */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm bg-regcat-bg p-2 rounded-sm border border-regcat-border/50 break-all text-regcat-text">
                    {regex.pattern}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(regex.pattern)}
                  className="flex-shrink-0 p-2 text-regcat-text-tertiary hover:text-regcat-accent transition-colors rounded-sm hover:bg-regcat-hover"
                  title="Copy pattern"
                >
                  <Copy size={14} />
                </button>
              </div>

              {/* Explanation */}
              <div className="text-xs text-regcat-text-secondary">
                {regex.explanation}
              </div>

              {/* API Attribution */}
              {apiUsed && (
                <div className="text-xs text-regcat-text-tertiary italic">
                  Generated with {apiUsed === 'gemini' ? 'Gemini' : apiUsed === 'grok' ? 'Grok' : 'Pattern Library'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-regcat-text-tertiary text-center pt-2 border-t border-regcat-border/30">
        Generated regexes may not be correct - always test with your input
      </div>
    </div>
  );
}
