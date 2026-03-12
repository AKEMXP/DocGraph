import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FlaskConical, FileText, CheckCircle, Clock, Edit3, ChevronDown, ChevronRight, Paperclip, Activity, Beaker, Shield, Target, ClipboardCheck, Users, BarChart3, AlertCircle, Cloud, RefreshCw, AlertTriangle, CloudOff } from 'lucide-react';
import type { Study, StudyDocument, StudyType, OperationalDocument, OperationalDocType, VeevaSyncStatus } from '../data/mockData';
import { studyTypeLabels, operationalDocLabels } from '../data/mockData';
import type { HighlightState } from '../utils/highlightColors';
import { highlightColors } from '../utils/highlightColors';

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
    default:
      return <CloudOff className="w-3 h-3 text-slate-300" />;
  }
};

const getStudyTypeIcon = (studyType: StudyType) => {
  switch (studyType) {
    case 'pivotal':
      return <Target className="w-4 h-4" />;
    case 'pk':
    case 'pd':
    case 'pk_pd':
      return <Activity className="w-4 h-4" />;
    case 'safety':
      return <Shield className="w-4 h-4" />;
    case 'dose_finding':
    case 'bioequivalence':
      return <Beaker className="w-4 h-4" />;
    default:
      return <FlaskConical className="w-4 h-4" />;
  }
};

const getStudyTypeBadgeColor = (studyType: StudyType) => {
  switch (studyType) {
    case 'pivotal':
      return { bg: '#dbeafe', text: '#1e40af' };
    case 'pk':
    case 'pd':
    case 'pk_pd':
      return { bg: '#fef3c7', text: '#92400e' };
    case 'safety':
      return { bg: '#fee2e2', text: '#991b1b' };
    case 'dose_finding':
      return { bg: '#f3e8ff', text: '#6b21a8' };
    case 'bioequivalence':
      return { bg: '#ccfbf1', text: '#115e59' };
    default:
      return { bg: '#f1f5f9', text: '#475569' };
  }
};

interface StudyNodeProps {
  data: {
    study: Study;
    isExpanded: boolean;
    isFocused: boolean;
    highlightState: HighlightState;
    onToggleExpand: () => void;
    onClick: () => void;
  };
}

const getStatusIcon = (status: string, size = 'sm') => {
  const className = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  switch (status) {
    case 'approved':
    case 'final':
      return <CheckCircle className={`${className} text-emerald-500`} />;
    case 'in_review':
      return <Clock className={`${className} text-amber-500`} />;
    case 'draft':
      return <Edit3 className={`${className} text-blue-500`} />;
    default:
      return null;
  }
};

const DocumentRow = ({ doc, color }: { doc: StudyDocument; color: string }) => {
  const hasPendingUpdates = doc.pendingUpdates && doc.pendingUpdates.length > 0;
  
  return (
    <div className={`flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/50 ${hasPendingUpdates ? 'bg-amber-50/50' : ''}`}>
      <div 
        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: hasPendingUpdates ? '#fef3c7' : `${color}30` }}
      >
        <FileText className="w-3.5 h-3.5" style={{ color: hasPendingUpdates ? '#d97706' : color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium ${hasPendingUpdates ? 'text-amber-700' : 'text-slate-700'}`}>{doc.shortName}</p>
        {hasPendingUpdates && (
          <p className="text-[10px] text-amber-600">{doc.pendingUpdates!.length} pending update{doc.pendingUpdates!.length > 1 ? 's' : ''}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        {getVeevaSyncIcon(doc.veevaSync)}
        {getStatusIcon(doc.status)}
        <span className="text-[10px] text-slate-400">v{doc.version}</span>
      </div>
    </div>
  );
};

const getOpDocIcon = (type: OperationalDocType) => {
  switch (type) {
    case 'icf':
      return <ClipboardCheck className="w-3 h-3" />;
    case 'pis':
      return <Users className="w-3 h-3" />;
    case 'crf':
      return <BarChart3 className="w-3 h-3" />;
    default:
      return <FileText className="w-3 h-3" />;
  }
};

const OperationalDocRow = ({ doc }: { doc: OperationalDocument }) => (
  <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/50">
    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 bg-slate-200 text-slate-600">
      {getOpDocIcon(doc.type)}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-slate-600">{doc.shortName}</p>
    </div>
    <div className="flex items-center gap-1">
      {getStatusIcon(doc.status)}
      <span className="text-[10px] text-slate-400">v{doc.version}</span>
    </div>
  </div>
);

export const StudyNode = memo(function StudyNode({ data }: StudyNodeProps) {
  const { study, isExpanded, isFocused, highlightState, onToggleExpand, onClick } = data;
  const docs = study.documents;
  const docCount = [docs.protocol, docs.sap, docs.csr].filter(Boolean).length;
  const opDocCount = study.operationalDocs?.length || 0;
  
  const totalPendingUpdates = [
    ...(docs.protocol?.pendingUpdates || []),
    ...(docs.sap?.pendingUpdates || []),
    ...(docs.csr?.pendingUpdates || []),
    ...(study.operationalDocs?.flatMap(d => d.pendingUpdates || []) || []),
  ].length;

  const colors = highlightColors[highlightState];
  const isActive = highlightState !== 'default';
  const accentColor = isActive ? colors.border : '#64748b';

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
          minWidth: isExpanded ? '280px' : '220px',
          ['--tw-ring-color' as string]: colors.ring,
        }}
        onClick={onClick}
      >
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <span className="text-white">{getStudyTypeIcon(study.studyType)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`font-semibold text-sm ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>{study.studyId}</p>
                {isActive && (
                  <span 
                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide"
                    style={{ 
                      backgroundColor: getStudyTypeBadgeColor(study.studyType).bg,
                      color: getStudyTypeBadgeColor(study.studyType).text,
                    }}
                  >
                    {studyTypeLabels[study.studyType]}
                  </span>
                )}
              </div>
              <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{study.phase} • {study.name}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
              className="p-1 hover:bg-white/50 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
          
          {!isExpanded && (
            <div className={`mt-2 flex items-center gap-3 text-xs ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
              <div className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>{docCount} regulatory</span>
              </div>
              {opDocCount > 0 && (
                <div className="flex items-center gap-1">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>{opDocCount} operational</span>
                </div>
              )}
            </div>
          )}
          
          {totalPendingUpdates > 0 && !isExpanded && (
            <div className="mt-2 pt-2 border-t border-amber-200 flex items-center gap-1.5 text-amber-600">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{totalPendingUpdates} pending update{totalPendingUpdates > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="px-3 pb-3" style={{ backgroundColor: `${colors.border}08` }}>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-2 pt-1 mb-1">Regulatory Documents</p>
            <div className="space-y-0.5">
              {docs.protocol && <DocumentRow doc={docs.protocol} color={accentColor} />}
              {docs.sap && <DocumentRow doc={docs.sap} color={accentColor} />}
              {docs.csr && <DocumentRow doc={docs.csr} color={accentColor} />}
            </div>
            
            {study.operationalDocs && study.operationalDocs.length > 0 && (
              <>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-2 pt-3 mb-1">Operational Documents</p>
                <div className="space-y-0.5">
                  {study.operationalDocs.map(opDoc => (
                    <OperationalDocRow key={opDoc.id} doc={opDoc} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
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
