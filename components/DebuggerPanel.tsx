'use client';

import { MatchResults } from '@/lib/types';
import { useRegexDebugger } from '@/hooks/useRegexDebugger';
import { DebuggerControls } from './DebuggerControls';
import { TestStringHighlighter } from './TestStringHighlighter';
import { CaptureGroupInspector } from './CaptureGroupInspector';

interface DebuggerPanelProps {
  matchResults: MatchResults;
  testString: string;
  currentMatchIndex: number;
  onNavigate: (newIndex: number) => void;
  onClose: () => void;
}

export function DebuggerPanel({
  matchResults,
  testString,
  currentMatchIndex,
  onNavigate,
  onClose,
}: DebuggerPanelProps) {
  const debug = useRegexDebugger(matchResults, currentMatchIndex);

  if (!debug.isValid) {
    return (
      <div className="p-6 text-center text-gray-500">
        {debug.error ? `Error: ${debug.error}` : 'No valid regex to debug'}
      </div>
    );
  }

  if (debug.totalMatches === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No matches to debug
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-screen bg-gray-900 border border-gray-700 rounded">
      {/* Controls */}
      <DebuggerControls
        displayIndex={debug.displayIndex}
        totalMatches={debug.totalMatches}
        canGoPrevious={debug.canGoPrevious}
        canGoNext={debug.canGoNext}
        onPrevious={() => onNavigate(debug.currentMatchIndex - 1)}
        onNext={() => onNavigate(debug.currentMatchIndex + 1)}
        onJump={(index) => onNavigate(index)}
        onClose={onClose}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Test String Highlighter */}
        <TestStringHighlighter
          testString={testString}
          currentMatch={debug.currentMatch}
          getGroupColor={debug.getGroupColor}
        />

        {/* Capture Group Inspector */}
        <CaptureGroupInspector
          currentMatch={debug.currentMatch}
          getGroupColor={debug.getGroupColor}
        />
      </div>
    </div>
  );
}
