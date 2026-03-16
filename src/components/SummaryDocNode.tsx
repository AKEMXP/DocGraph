import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, CheckCircle, Clock, Edit3, Paperclip, Cloud, CloudOff, RefreshCw, AlertTriangle, AlertCircle, ExternalLink } from 'lucide-react';
import type { SummaryDocument, VeevaSyncStatus } from '../data/mockData';
import type { HighlightState } from '../utils/highlightColors';
import { highlightColors } from '../utils/highlightColors';
import { getStatusColors } from '../utils/statusColors';

interface SummaryDocNodeProps {
  data: {
    document: SummaryDocument;
    isFocused: boolean;
    highlightState: HighlightState;
    hasRecentUpdates?: boolean;
    onClick: () => void;
    isGroup?: boolean;
  };
}

const getVeevaSyncIcon = (status?: VeevaSyncStatus) => {
  switch (status) {
    case 'synced':
      return <Cloud className="w-3 h-3 text-emerald-500" />;
    case 'syncing':
      return <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />;
    case 'pending_upload':
      return <Cloud className="w-3 h-3 text-amber-500" />;
    case 'conflict':
      return <AlertTriangle className="w-3 h-3 text-red-500" />;
    case 'not_synced':
      return <CloudOff className="w-3 h-3 text-slate-400" />;
    default:
      return <CloudOff className="w-3 h-3 text-slate-300" />;
  }
};

export const SummaryDocNode = memo(function SummaryDocNode({ data }: SummaryDocNodeProps) {
  const { document, isFocused, highlightState, hasRecentUpdates, onClick, isGroup } = data;
  const hasPendingUpdates = document.pendingUpdates && document.pendingUpdates.length > 0;
  const isCmcGroup = !!isGroup || (document.type === 'cmc' && document.supportingDocs.length > 0);

  const isHighlighted = highlightState !== 'default';
  const statusColors = getStatusColors(document.status);
  const baseColors = {
    border: statusColors.border,
    bg: statusColors.bg,
    ring: 'transparent',
  };
  const colors = isHighlighted ? highlightColors[highlightState] : baseColors;
  const isActive = isHighlighted;
  const accentColor = isHighlighted ? colors.border : statusColors.accent;

  const getStatusIcon = () => {
    switch (document.status) {
      case 'approved':
      case 'final':
        return <CheckCircle className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />;
      case 'in_review':
        return <Clock className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />;
      case 'draft':
        return <Edit3 className={`w-3.5 h-3.5 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2.5 !h-2.5 !border-2 !border-white" 
        style={{ backgroundColor: colors.border }}
      />
      <div
        className={`
          rounded-xl shadow-lg border-2 transition-all duration-200 cursor-pointer
          ${isFocused ? 'ring-4 ring-offset-2 shadow-xl' : 'hover:shadow-xl'}
        `}
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.bg,
          minWidth: '200px',
          ['--tw-ring-color' as string]: colors.ring,
        }}
        onClick={onClick}
      >
        <div className={`relative ${isCmcGroup ? 'm-[3px] rounded-[10px] border border-slate-200/80 bg-white/70 p-3' : 'p-3'}`}>
          {hasRecentUpdates && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
          {(document.type === 'clinical_summary' || document.type === 'clinical_overview') && (
            <div className="absolute top-1 right-1 text-slate-400">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>{document.shortName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                {getStatusIcon()}
                <span className={`text-xs capitalize ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{document.status.replace('_', ' ')}</span>
                <span className="text-xs text-slate-400">v{document.version}</span>
              </div>
            </div>
          </div>
          
          {hasPendingUpdates && !hasRecentUpdates && (
            <div className="mt-2 pt-2 border-t border-amber-200 flex items-center gap-1.5 text-amber-600">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{document.pendingUpdates!.length} needs update{document.pendingUpdates!.length > 1 ? 's' : ''}</span>
            </div>
          )}
          
          {isActive && !hasPendingUpdates && !isCmcGroup && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
              {getVeevaSyncIcon(document.veevaSync)}
              <span className="text-[10px] text-slate-400 capitalize">
                {document.veevaSync?.replace('_', ' ') || 'not synced'}
              </span>
            </div>
          )}
          
          {(isActive || isCmcGroup) && document.supportingDocs.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Paperclip className="w-3.5 h-3.5" />
                <span>
                  {isCmcGroup ? 'CMC components' : `${document.supportingDocs.length} supporting documents`}
                </span>
              </div>
              {(isFocused || isCmcGroup) && (
                <div className="mt-1.5 space-y-0.5">
                  {document.supportingDocs.map(doc => (
                    <div key={doc.id} className="text-xs text-slate-500 truncate pl-1">
                      • {doc.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isFocused && hasPendingUpdates && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <p className="text-[10px] font-medium text-amber-700 mb-1">Pending Updates:</p>
              {document.pendingUpdates!.slice(0, 2).map((update, idx) => (
                <div key={idx} className="text-[10px] text-slate-500 truncate">
                  • {update.sourceDocName}: {update.sourceSection}
                </div>
              ))}
              {document.pendingUpdates!.length > 2 && (
                <div className="text-[10px] text-slate-400">
                  +{document.pendingUpdates!.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2.5 !h-2.5 !border-2 !border-white"
        style={{ backgroundColor: colors.border }}
      />
    </>
  );
});
