import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { SectionInfo } from '../data/mockData';

interface SectionNodeProps {
  data: {
    section: SectionInfo;
    side: 'source' | 'target';
    color: string;
    isUpdated?: boolean;
    needsUpdate?: boolean;
  };
}

export const SectionNode = memo(function SectionNode({ data }: SectionNodeProps) {
  const { section, side, color, isUpdated, needsUpdate } = data;

  return (
    <>
      {side === 'target' && (
        <Handle type="target" position={Position.Left} className="!bg-slate-400" />
      )}
      <div
        className={`bg-white rounded-lg shadow-sm border-l-4 px-3 py-2 min-w-[200px] max-w-[240px] hover:shadow-md transition-shadow cursor-pointer ${
          needsUpdate ? 'border-amber-400 bg-amber-50/60' : ''
        }`}
        style={{ borderLeftColor: needsUpdate ? '#f59e0b' : color }}
      >
        <div className="flex items-start gap-2 relative">
          {isUpdated && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
          <span 
            className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {section.number}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-xs text-slate-700 font-medium truncate block">
              {section.title}
            </span>
            {needsUpdate && (
              <span className="mt-0.5 inline-block text-[10px] font-medium text-amber-700">
                Needs update
              </span>
            )}
          </div>
        </div>
      </div>
      {side === 'source' && (
        <Handle type="source" position={Position.Right} className="!bg-slate-400" />
      )}
    </>
  );
});
