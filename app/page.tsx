/**
 * Main page component - orchestrates all state and components
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { RegexInput } from '@/components/RegexInput';
import { FlagToggle } from '@/components/FlagToggle';
import { TestStringInput } from '@/components/TestStringInput';
import { MatchList } from '@/components/MatchList';
import { DebuggerPanel } from '@/components/DebuggerPanel';
import { ExplanationPanel } from '@/components/ExplanationPanel';
import { SubstitutionPanel } from '@/components/SubstitutionPanel';
import { CheatSheet } from '@/components/CheatSheet';
import { useRegexMatcher } from '@/hooks/useRegexMatcher';
import { useGenerateTestStrings } from '@/hooks/useGenerateTestStrings';
import { RegexState, FlagSet } from '@/lib/types';

/**
 * Main application page
 * Manages regex state and coordinates all sub-components
 * Handles keyboard shortcuts and application-level state
 */
export default function Home() {
  const initialFlagState: FlagSet = {
    g: false,
    i: false,
    m: false,
    s: false,
    u: false,
    d: false,
    y: false,
  };

  const [regexState, setRegexState] = useState<RegexState>({
    pattern: '',
    testString: '',
    flags: initialFlagState,
    substitution: '',
    debugMode: false,
    debugCurrentMatchIndex: 0,
  });

  const matchResults = useRegexMatcher(regexState);
  const generateResult = useGenerateTestStrings(regexState.pattern, regexState.flags);

  const handleGenerateTestStrings = async () => {
    await generateResult.generate();
  };

  // When test strings are generated, append them to the test string textarea
  useEffect(() => {
    if (generateResult.testStrings.length > 0) {
      const newTestString = generateResult.testStrings.join('\n');
      setRegexState((prev) => ({
        ...prev,
        testString: newTestString,
      }));
    }
  }, [generateResult.testStrings]);

  const handleSidebarNavigate = (sectionId: string) => {
    setTimeout(() => {
      if (sectionId === 'debug') {
        // Toggle debug mode, start at first match
        setRegexState({
          ...regexState,
          debugMode: !regexState.debugMode,
          debugCurrentMatchIndex: 0,
        });
        // Scroll to results
        const resultsSection = document.querySelector('[data-section="results"]');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (sectionId === 'explain') {
        // Trigger explain modal/panel
        const explainButton = document.querySelector('[data-explain-trigger]') as HTMLButtonElement;
        if (explainButton) {
          explainButton.click();
        }
        const explainSection = document.querySelector('[data-section="explain"]');
        if (explainSection) {
          explainSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (sectionId === 'reference') {
        // Toggle cheatsheet
        const cheatsheetToggle = document.querySelector('[data-cheatsheet-toggle]') as HTMLButtonElement;
        if (cheatsheetToggle) {
          cheatsheetToggle.click();
        }
        const referenceSection = document.querySelector('[data-section="reference"]');
        if (referenceSection) {
          referenceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (sectionId === 'results') {
        // Highlight results section with glow
        const resultsSection = document.querySelector('[data-section="results"]');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Add glow animation
          resultsSection.classList.add('animate-glow-highlight');
          setTimeout(() => {
            resultsSection.classList.remove('animate-glow-highlight');
          }, 2000);
        }
      } else {
        // For pattern and test sections, just scroll
        const element = document.querySelector(`[data-section="${sectionId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 0);
  };

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter for explanation
      const isExplainShortcut =
        (e.ctrlKey || e.metaKey) && e.key === 'Enter';
      if (isExplainShortcut) {
        e.preventDefault();
        // The ExplanationPanel handles fetch trigger separately
        // This is here for reference; actual implementation uses button click
      }

      // Ctrl+K or Cmd+K to clear
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setRegexState({
          pattern: '',
          testString: '',
          flags: initialFlagState,
          substitution: '',
          debugMode: false,
          debugCurrentMatchIndex: 0,
        });
      }

      // Ctrl+1 to focus pattern, Ctrl+2 to focus test string
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        (document.querySelector('[data-focus="pattern"]') as HTMLTextAreaElement)?.focus();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        (document.querySelector('[data-focus="teststring"]') as HTMLTextAreaElement)?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initialFlagState]);

  return (
    <div className="flex min-h-screen bg-regcat-bg text-regcat-text">
      {/* Sidebar Navigation */}
      <Sidebar activeSection="pattern" onNavigate={handleSidebarNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-regcat-border bg-regcat-surface px-6 py-4 md:sticky md:top-0 z-10">
          <h1 className="font-bold text-xl tracking-wide text-regcat-accent">Regcat</h1>
          <p className="text-xs text-regcat-text-tertiary mt-1">AI-Powered Regex Tester & Explainer</p>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl">
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Pattern, Flags, Substitution, Reference */}
              <div className="space-y-4">
                <section data-section="pattern">
                  <h2 className="text-sm font-semibold text-regcat-text-secondary uppercase tracking-wider mb-3">
                    Pattern
                  </h2>
                  <div className="space-y-3">
                    <RegexInput
                      pattern={regexState.pattern}
                      onChange={(p) => setRegexState({ ...regexState, pattern: p })}
                      flags={regexState.flags}
                      onGenerateTestStrings={handleGenerateTestStrings}
                      isGeneratingTests={generateResult.loading}
                    />

                    <FlagToggle
                      flags={regexState.flags}
                      onChange={(f) => setRegexState({ ...regexState, flags: f })}
                    />

                    {generateResult.error && (
                      <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-900/50">
                        {generateResult.error}
                      </div>
                    )}
                  </div>
                </section>

                {regexState.pattern && (
                  <section>
                    <h2 className="text-sm font-semibold text-regcat-text-secondary uppercase tracking-wider mb-3">
                      Substitution
                    </h2>
                    <SubstitutionPanel
                      pattern={regexState.pattern}
                      testString={regexState.testString}
                      flags={regexState.flags}
                    />
                  </section>
                )}

                <section data-section="reference">
                  <CheatSheet />
                </section>
              </div>

              {/* Right Column: Test String, Matches, Explanation */}
              <div className="space-y-4">
                <section data-section="test">
                  <h2 className="text-sm font-semibold text-regcat-text-secondary uppercase tracking-wider mb-3">
                    Test String
                  </h2>
                  <TestStringInput
                    testString={regexState.testString}
                    onChange={(t) => setRegexState({ ...regexState, testString: t })}
                  />
                </section>

                <section data-section="results" className="rounded-sm p-4 bg-regcat-surface/30">
                  <h2 className="text-sm font-semibold text-regcat-text-secondary uppercase tracking-wider mb-3">
                    Results
                  </h2>
                  {regexState.debugMode ? (
                    <DebuggerPanel
                      matchResults={matchResults}
                      testString={regexState.testString}
                      currentMatchIndex={regexState.debugCurrentMatchIndex}
                      onNavigate={(newIndex) =>
                        setRegexState({ ...regexState, debugCurrentMatchIndex: newIndex })
                      }
                      onClose={() =>
                        setRegexState({ ...regexState, debugMode: false })
                      }
                    />
                  ) : (
                    <MatchList
                      results={matchResults}
                      onDebugMatch={(matchIndex) =>
                        setRegexState({
                          ...regexState,
                          debugMode: true,
                          debugCurrentMatchIndex: matchIndex,
                        })
                      }
                    />
                  )}
                </section>

                {regexState.pattern && (
                  <section data-section="explain">
                    <h2 className="text-sm font-semibold text-regcat-text-secondary uppercase tracking-wider mb-3">
                      AI Explanation
                    </h2>
                    <ExplanationPanel regexState={regexState} />
                  </section>
                )}

              </div>
            </div>

            {/* Footer with Shortcuts */}
            <footer className="mt-8 pt-6 border-t border-regcat-border text-xs text-regcat-text-tertiary">
              <div className="space-y-2">
                <div className="font-semibold text-regcat-text-secondary">Keyboard Shortcuts:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-regcat-accent">Ctrl+K</span> Clear all fields
                  </div>
                  <div>
                    <span className="text-regcat-accent">Ctrl+1</span> Focus pattern
                  </div>
                  <div>
                    <span className="text-regcat-accent">Ctrl+2</span> Focus test string
                  </div>
                  <div>
                    <span className="text-regcat-accent">Ctrl+Enter</span> Get explanation
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-regcat-border flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-regcat-accent">Copyright © 2026 almostkoi</div>
                <div className="flex gap-4">
                  <a href="https://github.com/almostkoi/regcat" target="_blank" rel="noopener noreferrer" className="text-regcat-accent hover:underline">
                    GitHub
                  </a>
                  <a href="https://discord.gg/VvTynsHrG8" target="_blank" rel="noopener noreferrer" className="text-regcat-accent hover:underline">
                    Discord
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}