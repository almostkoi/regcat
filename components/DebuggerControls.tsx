'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DebuggerControlsProps {
  displayIndex: number;
  totalMatches: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
  onClose: () => void;
}

export function DebuggerControls({
  displayIndex,
  totalMatches,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onJump,
  onClose,
}: DebuggerControlsProps) {
  const handleJumpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= totalMatches) {
      onJump(value - 1); // Convert to 0-indexed
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-700 bg-gray-900/50">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="p-2 rounded text-gray-400 hover:text-regcat-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous match (Left arrow)"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-sm text-gray-300 font-mono">
          Match <span className="text-regcat-accent font-bold">{displayIndex}</span> /{' '}
          <span className="text-gray-500">{totalMatches}</span>
        </div>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="p-2 rounded text-gray-400 hover:text-regcat-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next match (Right arrow)"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Jump to Match Input */}
      <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-700">
        <label htmlFor="jump-to" className="text-xs text-gray-500 uppercase">
          Jump to:
        </label>
        <input
          id="jump-to"
          type="number"
          min="1"
          max={totalMatches}
          value={displayIndex}
          onChange={handleJumpInput}
          className="w-16 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-200 text-sm font-mono focus:border-regcat-accent focus:outline-none"
        />
      </div>

      {/* Close Debugger Button */}
      <button
        onClick={onClose}
        className="ml-auto px-3 py-1 text-sm rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-gray-100 transition-colors"
      >
        Close Debugger
      </button>
    </div>
  );
}
