import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { SectionInfo } from '../data/mockData';

interface SectionNodeProps {
  data: {
    section: SectionInfo;
    side: 'source' | 'target';
    color: string;
  };
}

export const SectionNode = memo(function SectionNode({ data }: SectionNodeProps) {
  const { section, side, color } = data;

  return (
    <>
      {side === 'target' && (
        <Handle type="target" position={Position.Left} className="!bg-slate-400" />
      )}
      <div
        className="bg-white rounded-lg shadow-sm border-l-4 px-3 py-2 min-w-[200px] max-w-[220px] hover:shadow-md transition-shadow cursor-pointer"
        style={{ borderLeftColor: color }}
      >
        <div className="flex items-baseline gap-2">
          <span 
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {section.number}
          </span>
          <span className="text-xs text-slate-700 font-medium truncate">
            {section.title}
          </span>
        </div>
      </div>
      {side === 'source' && (
        <Handle type="source" position={Position.Right} className="!bg-slate-400" />
      )}
    </>
  );
});
