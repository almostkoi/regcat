'use client';

import { MatchResult, CaptureGroup } from '@/lib/types';

interface TestStringHighlighterProps {
  testString: string;
  currentMatch: MatchResult | null;
  getGroupColor: (groupIndex: number) => string;
}

export function TestStringHighlighter({
  testString,
  currentMatch,
  getGroupColor,
}: TestStringHighlighterProps) {
  if (!currentMatch) {
    return (
      <div className="p-6 text-center text-gray-500">
        No match to display
      </div>
    );
  }

  const matchStart = currentMatch.index;
  const matchEnd = currentMatch.index + currentMatch.fullMatch.length;

  // Build a map of positions to group indices
  const groupRanges: { start: number; end: number; groupIndex: number; group: CaptureGroup }[] = [];
  currentMatch.groups.forEach((group, idx) => {
    if (group.value !== undefined && group.index !== undefined) {
      groupRanges.push({
        start: group.index,
        end: group.index + group.value.length,
        groupIndex: idx,
        group,
      });
    }
  });

  // Sort by start position
  groupRanges.sort((a, b) => a.start - b.start);

  // Render the string with highlighting
  const segments: { type: 'normal' | 'match' | 'group'; start: number; end: number; groupIndex?: number; group?: CaptureGroup }[] = [];

  let pos = 0;
  for (const range of groupRanges) {
    // Add normal text before this group
    if (pos < range.start) {
      segments.push({ type: 'normal', start: pos, end: range.start });
    }
    // Add the group
    segments.push({ type: 'group', start: range.start, end: range.end, groupIndex: range.groupIndex, group: range.group });
    pos = range.end;
  }
  // Add remaining normal text
  if (pos < testString.length) {
    segments.push({ type: 'normal', start: pos, end: testString.length });
  }

  return (
    <div className="p-6 bg-gray-900/30">
      {/* Show match info */}
      <div className="mb-4 text-sm text-gray-400">
        <div>
          Full match at position <span className="text-regcat-accent font-mono">{matchStart}</span>–<span className="text-regcat-accent font-mono">{matchEnd}</span>
        </div>
        <div className="text-gray-500">
          "{currentMatch.fullMatch}"
        </div>
      </div>

      {/* Test string with highlighting */}
      <div className="font-mono text-sm leading-relaxed break-all p-4 bg-gray-800 rounded border border-gray-700">
        {segments.map((segment, idx) => {
          const text = testString.slice(segment.start, segment.end);

          if (segment.type === 'group' && segment.group) {
            const color = getGroupColor(segment.groupIndex || 0);
            const groupNum = segment.group.name || `\\${(segment.groupIndex || 0) + 1}`;

            return (
              <span
                key={idx}
                className="px-1 rounded"
                style={{
                  backgroundColor: color + '20', // 20% opacity
                  borderBottom: `2px solid ${color}`,
                }}
                title={`Group ${groupNum}: ${segment.group.value}`}
              >
                {text}
              </span>
            );
          }

          return <span key={idx}>{text}</span>;
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        <div className="text-xs text-gray-500 uppercase mb-2">Captured Groups:</div>
        {currentMatch.groups.length === 0 ? (
          <div className="text-gray-500 text-sm">No capture groups in this pattern</div>
        ) : (
          currentMatch.groups.map((group, idx) => {
            if (group.value === undefined) return null; // Skip uncaptured groups in legend

            const color = getGroupColor(idx);
            const groupName = group.name || `\\${idx + 1}`;

            return (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color + '40', border: `1px solid ${color}` }}
                />
                <span className="text-gray-400">
                  {groupName}: <span className="text-gray-200 font-mono">"{group.value}"</span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}