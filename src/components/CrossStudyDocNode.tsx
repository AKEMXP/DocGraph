import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, CheckCircle, Clock, Edit3, AlertTriangle, Shield, FileSearch } from 'lucide-react';
import type { CrossStudyDocument, CrossStudyDocType } from '../data/mockData';
import type { HighlightState } from '../utils/highlightColors';
import { highlightColors } from '../utils/highlightColors';

interface CrossStudyDocNodeProps {
  data: {
    document: CrossStudyDocument;
    isFocused: boolean;
    highlightState: HighlightState;
    onClick: () => void;
  };
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'approved':
    case 'final':
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    case 'in_review':
      return <Clock className="w-3 h-3 text-yellow-500" />;
    default:
      return <Edit3 className="w-3 h-3 text-slate-400" />;
  }
}

function getDocTypeIcon(type: CrossStudyDocType) {
  switch (type) {
    case 'sae_form':
      return <AlertTriangle className="w-4 h-4" />;
    case 'monitoring_plan':
      return <FileSearch className="w-4 h-4" />;
    case 'dsmb_charter':
      return <Shield className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

export const CrossStudyDocNode = memo(function CrossStudyDocNode({ data }: CrossStudyDocNodeProps) {
  const { document, isFocused, highlightState, onClick } = data;
  
  const colors = highlightColors[highlightState];
  const isActive = highlightState !== 'default';
  const accentColor = isActive ? colors.border : '#64748b';
  
  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg border-2 px-4 py-3 cursor-pointer
        transition-all duration-200 min-w-[180px]
        ${isFocused ? 'shadow-lg ring-4 ring-offset-2' : 'shadow-sm hover:shadow-md'}
      `}
      style={{
        borderColor: colors.border,
        backgroundColor: colors.bg,
        ['--tw-ring-color' as string]: colors.ring,
      }}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: colors.border }} 
      />
      
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="w-6 h-6 rounded flex items-center justify-center text-white"
          style={{ backgroundColor: accentColor }}
        >
          {getDocTypeIcon(document.type)}
        </div>
        <span className="text-[10px] font-medium text-slate-400 uppercase">
          Cross-Study
        </span>
      </div>
      
      <h3 className={`font-semibold text-sm truncate max-w-[200px] ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>
        {document.shortName}
      </h3>
      
      <div className={`flex items-center gap-2 mt-2 text-xs ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
        {getStatusIcon(document.status)}
        <span className="capitalize">{document.status.replace('_', ' ')}</span>
        <span className="text-slate-300">•</span>
        <span>v{document.version}</span>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: colors.border }} 
      />
    </div>
  );
});
