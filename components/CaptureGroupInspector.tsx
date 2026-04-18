'use client';

import { MatchResult } from '@/lib/types';

interface CaptureGroupInspectorProps {
  currentMatch: MatchResult | null;
  getGroupColor: (groupIndex: number) => string;
}

export function CaptureGroupInspector({
  currentMatch,
  getGroupColor,
}: CaptureGroupInspectorProps) {
  if (!currentMatch) {
    return null;
  }

  const hasGroups = currentMatch.groups.length > 0;

  return (
    <div className="p-6 border-t border-gray-700 bg-gray-900/30">
      <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">Capture Groups</h3>

      {!hasGroups ? (
        <div className="text-gray-500 text-sm">No capture groups in this pattern</div>
      ) : (
        <div className="space-y-3">
          {currentMatch.groups.map((group, idx) => {
            if (group.value === undefined) return null; // Skip uncaptured groups

            const color = getGroupColor(idx);
            const groupLabel = group.name ? `${group.name}` : `\\${idx + 1}`;

            return (
              <div key={idx} className="rounded border border-gray-700 p-3 bg-gray-800/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-sm text-gray-300">{groupLabel}</span>
                  </div>
                  {group.index !== undefined && (
                    <span className="text-xs text-gray-500">
                      @ {group.index}–{group.index + (group.value?.length || 0)}
                    </span>
                  )}
                </div>

                <div className="font-mono text-sm break-all">
                  {group.value !== undefined ? (
                    <span className="text-gray-200">"{group.value}"</span>
                  ) : (
                    <span className="text-gray-600 italic">undefined (not captured)</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Show indices info if 'd' flag is active */}
      {currentMatch.indices && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Match Indices (d flag)</h4>
          <div className="font-mono text-xs text-gray-400">
            Start: {currentMatch.indices.start} | End: {currentMatch.indices.end}
          </div>
        </div>
      )}
    </div>
  );
}