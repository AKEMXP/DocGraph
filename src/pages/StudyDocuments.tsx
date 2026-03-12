import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, Clock, Edit3, Paperclip, ArrowRight, ClipboardCheck, Users, BarChart3, Cloud, CloudOff, RefreshCw, AlertTriangle, ExternalLink, AlertCircle } from 'lucide-react';
import { useMemo, memo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Handle,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getStudies, submissions, studyTypeLabels, operationalDocLabels, veevaSyncLabels } from '../data/mockData';
import type { StudyDocument, OperationalDocument, OperationalDocType, VeevaSyncStatus, PendingUpdate } from '../data/mockData';
import { highlightColors } from '../utils/highlightColors';
import type { HighlightState } from '../utils/highlightColors';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
    case 'final':
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'in_review':
      return <Clock className="w-4 h-4 text-amber-500" />;
    case 'draft':
      return <Edit3 className="w-4 h-4 text-blue-500" />;
    default:
      return null;
  }
};

const getVeevaSyncIcon = (status?: VeevaSyncStatus) => {
  switch (status) {
    case 'synced':
      return <Cloud className="w-3.5 h-3.5 text-emerald-500" />;
    case 'syncing':
      return <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />;
    case 'pending_upload':
      return <Cloud className="w-3.5 h-3.5 text-amber-500" />;
    case 'conflict':
      return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
    case 'not_synced':
      return <CloudOff className="w-3.5 h-3.5 text-slate-400" />;
    default:
      return <CloudOff className="w-3.5 h-3.5 text-slate-300" />;
  }
};

const getOpDocIcon = (type: OperationalDocType) => {
  switch (type) {
    case 'icf':
      return <ClipboardCheck className="w-5 h-5" />;
    case 'pis':
      return <Users className="w-5 h-5" />;
    case 'crf':
      return <BarChart3 className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const openInEditor = (localPath?: string) => {
  if (localPath) {
    alert(`Opening document in local editor:\n${localPath}\n\n(In a real app, this would launch your default document editor)`);
  }
};

interface DocNodeProps {
  data: { 
    doc: StudyDocument; 
    highlightState: HighlightState;
    isFocused: boolean;
    onClick?: () => void;
    onOpenEditor?: () => void;
    onShowUpdates?: () => void;
  };
}

const DocNode = memo(function DocNode({ data }: DocNodeProps) {
  const { doc, highlightState, isFocused, onClick, onOpenEditor, onShowUpdates } = data;
  const hasPendingUpdates = doc.pendingUpdates && doc.pendingUpdates.length > 0;
  
  const colors = highlightColors[highlightState];
  const isActive = highlightState !== 'default';
  const accentColor = isActive ? colors.border : '#64748b';
  
  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !border-2 !border-white" 
        style={{ backgroundColor: colors.border }}
      />
      <div
        className={`rounded-xl shadow-lg border-2 p-4 min-w-[260px] cursor-pointer transition-all duration-200 ${isFocused ? 'ring-4 ring-offset-2 shadow-xl' : 'hover:shadow-xl'}`}
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.bg,
          ['--tw-ring-color' as string]: colors.ring,
        }}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className={`font-semibold ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>{doc.shortName}</p>
            <p className={`text-xs mt-0.5 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{doc.name}</p>
            <div className="flex items-center gap-2 mt-2">
              {getStatusIcon(doc.status)}
              <span className={`text-xs capitalize ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{doc.status.replace('_', ' ')}</span>
              <span className="text-xs text-slate-400">v{doc.version}</span>
            </div>
          </div>
        </div>
        
        {hasPendingUpdates && (
          <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-600">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{doc.pendingUpdates!.length} pending update{doc.pendingUpdates!.length > 1 ? 's' : ''}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onShowUpdates?.(); }}
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
              title="View pending updates"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {isActive && !hasPendingUpdates && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getVeevaSyncIcon(doc.veevaSync)}
              <span className="text-xs text-slate-500">{veevaSyncLabels[doc.veevaSync || 'not_synced']}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onOpenEditor?.(); }}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors"
              title="Open in local editor"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {isActive && doc.supportingDocs.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
              <Paperclip className="w-3.5 h-3.5" />
              <span>{doc.supportingDocs.length} supporting documents</span>
            </div>
            {isFocused && (
              <div className="space-y-1">
                {doc.supportingDocs.slice(0, 2).map(sd => (
                  <div key={sd.id} className="text-xs bg-slate-50 rounded px-2 py-1.5 flex items-center justify-between">
                    <span className="text-slate-600 truncate">{sd.name}</span>
                    <span className="text-slate-400 text-[10px] ml-2">{sd.type}</span>
                  </div>
                ))}
                {doc.supportingDocs.length > 2 && (
                  <div className="text-xs text-slate-400 px-2">
                    +{doc.supportingDocs.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !border-2 !border-white"
        style={{ backgroundColor: colors.border }}
      />
    </>
  );
});

interface OpDocNodeProps {
  data: { 
    doc: OperationalDocument; 
    highlightState: HighlightState;
    isFocused: boolean;
    onOpenEditor?: () => void;
    onShowUpdates?: () => void;
  };
}

const OpDocNode = memo(function OpDocNode({ data }: OpDocNodeProps) {
  const { doc, highlightState, isFocused, onOpenEditor, onShowUpdates } = data;
  const hasPendingUpdates = doc.pendingUpdates && doc.pendingUpdates.length > 0;
  
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
        className={`rounded-lg shadow-md border-2 p-3 min-w-[200px] cursor-pointer transition-all duration-200 ${isFocused ? 'ring-4 ring-offset-2 shadow-lg' : 'hover:shadow-lg'}`}
        style={{ 
          borderColor: colors.border, 
          borderStyle: 'dashed',
          backgroundColor: colors.bg,
          ['--tw-ring-color' as string]: colors.ring,
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {getOpDocIcon(doc.type)}
          </div>
          <div className="flex-1">
            <p className={`font-medium text-sm ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>{doc.shortName}</p>
            <p className={`text-xs ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>{operationalDocLabels[doc.type]}</p>
            <div className="flex items-center gap-2 mt-1.5">
              {getStatusIcon(doc.status)}
              <span className="text-[10px] text-slate-400">v{doc.version}</span>
            </div>
          </div>
        </div>
        
        {hasPendingUpdates && (
          <div className="mt-2 pt-2 border-t border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="w-3 h-3" />
              <span className="text-[10px] font-medium">{doc.pendingUpdates!.length} pending</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onShowUpdates?.(); }}
              className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors"
              title="View pending updates"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        
        {isActive && !hasPendingUpdates && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {getVeevaSyncIcon(doc.veevaSync)}
              <span className="text-[10px] text-slate-400">{veevaSyncLabels[doc.veevaSync || 'not_synced']}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onOpenEditor?.(); }}
              className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
              title="Open in local editor"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
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

const nodeTypes = {
  document: DocNode,
  opDocument: OpDocNode,
};

interface PendingUpdatesModalProps {
  docName: string;
  updates: PendingUpdate[];
  onClose: () => void;
}

function PendingUpdatesModal({ docName, updates, onClose }: PendingUpdatesModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">Pending Updates</h3>
            <p className="text-sm text-slate-500">{docName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <p className="text-sm text-slate-600 mb-4">
            The following upstream sections have been modified and may require updates to this document:
          </p>
          <div className="space-y-3">
            {updates.map((update, idx) => (
              <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    update.changeType === 'modified' ? 'bg-blue-100 text-blue-700' :
                    update.changeType === 'added' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {update.changeType}
                  </span>
                  <span className="text-xs text-slate-500">{update.changedAt}</span>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-medium">{update.sourceDocName}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-500">{update.sourceSection}</span>
                  </div>
                  <div className="mt-1 text-slate-500 text-xs">
                    Impacts: <span className="font-medium text-slate-700">{update.targetSection}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            Acknowledge Updates
          </button>
        </div>
      </div>
    </div>
  );
}

export function StudyDocuments() {
  const { submissionId, studyId } = useParams<{ submissionId: string; studyId: string }>();
  const navigate = useNavigate();
  const [selectedUpdates, setSelectedUpdates] = useState<{ docName: string; updates: PendingUpdate[] } | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  
  const submission = submissions.find(s => s.id === submissionId);
  
  // Memoize study data to prevent infinite re-renders (getStudies creates new objects each call)
  const study = useMemo(() => {
    const studies = getStudies(submissionId || '');
    return studies.find(s => s.id === studyId);
  }, [submissionId, studyId]);

  const toggleFocus = useCallback((nodeId: string) => {
    setFocusedId(prev => prev === nodeId ? null : nodeId);
  }, []);

  // Define edges structure for highlight computation
  const edgeDefinitions = useMemo(() => {
    if (!study) return [];
    const docs = study.documents;
    const opDocs = study.operationalDocs || [];
    const edges: Array<{ source: string; target: string }> = [];
    
    if (docs.protocol && docs.sap) edges.push({ source: 'protocol', target: 'sap' });
    if (docs.protocol && docs.csr && !docs.sap) edges.push({ source: 'protocol', target: 'csr' });
    if (docs.sap && docs.csr) edges.push({ source: 'sap', target: 'csr' });
    opDocs.forEach(opDoc => {
      if (docs.protocol) edges.push({ source: 'protocol', target: `op-${opDoc.id}` });
    });
    
    return edges;
  }, [study]);

  // Compute highlight state for a node
  const getHighlightState = useCallback((nodeId: string): HighlightState => {
    if (!focusedId) return 'default';
    if (nodeId === focusedId) return 'focused';
    
    const isUpstream = edgeDefinitions.some(e => e.source === nodeId && e.target === focusedId);
    const isDownstream = edgeDefinitions.some(e => e.source === focusedId && e.target === nodeId);
    
    if (isUpstream) {
      // Check if this upstream node caused pending updates to the focused node
      if (!study) return 'upstream';
      
      const docs = study.documents;
      const opDocs = study.operationalDocs || [];
      
      // Get pending updates of the focused node
      let focusedPendingUpdates: PendingUpdate[] = [];
      if (focusedId === 'protocol') focusedPendingUpdates = docs.protocol?.pendingUpdates || [];
      else if (focusedId === 'sap') focusedPendingUpdates = docs.sap?.pendingUpdates || [];
      else if (focusedId === 'csr') focusedPendingUpdates = docs.csr?.pendingUpdates || [];
      else {
        const opDoc = opDocs.find(d => `op-${d.id}` === focusedId);
        focusedPendingUpdates = opDoc?.pendingUpdates || [];
      }
      
      // Get the doc IDs of the upstream node
      let upstreamDocId: string | undefined;
      if (nodeId === 'protocol') upstreamDocId = docs.protocol?.id;
      else if (nodeId === 'sap') upstreamDocId = docs.sap?.id;
      else if (nodeId === 'csr') upstreamDocId = docs.csr?.id;
      
      const hasAttention = upstreamDocId && focusedPendingUpdates.some(u => u.sourceDocId === upstreamDocId);
      return hasAttention ? 'upstream-attention' : 'upstream';
    }
    
    if (isDownstream) return 'downstream';
    
    return 'default';
  }, [focusedId, edgeDefinitions, study]);

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!study) return { initialNodes: [], initialEdges: [] };
    
    const nodeArray: Node[] = [];
    const edgeArray: Edge[] = [];
    const docs = study.documents;
    const opDocs = study.operationalDocs || [];
    
    const regYCenter = 120;
    const opYStart = 340;
    const xGap = 320;
    let regXPos = 100;

    if (docs.protocol) {
      const highlightState = getHighlightState('protocol');
      nodeArray.push({
        id: 'protocol',
        type: 'document',
        position: { x: regXPos, y: regYCenter },
        data: { 
          doc: docs.protocol, 
          highlightState,
          isFocused: focusedId === 'protocol',
          onClick: () => toggleFocus('protocol'),
          onOpenEditor: () => openInEditor(docs.protocol?.localPath),
          onShowUpdates: docs.protocol.pendingUpdates?.length 
            ? () => setSelectedUpdates({ docName: docs.protocol!.name, updates: docs.protocol!.pendingUpdates! })
            : undefined,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
      regXPos += xGap;
    }

    if (docs.sap) {
      const highlightState = getHighlightState('sap');
      nodeArray.push({
        id: 'sap',
        type: 'document',
        position: { x: regXPos, y: regYCenter },
        data: { 
          doc: docs.sap, 
          highlightState,
          isFocused: focusedId === 'sap',
          onClick: () => toggleFocus('sap'),
          onOpenEditor: () => openInEditor(docs.sap?.localPath),
          onShowUpdates: docs.sap.pendingUpdates?.length 
            ? () => setSelectedUpdates({ docName: docs.sap!.name, updates: docs.sap!.pendingUpdates! })
            : undefined,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
      regXPos += xGap;
    }

    if (docs.csr) {
      const highlightState = getHighlightState('csr');
      nodeArray.push({
        id: 'csr',
        type: 'document',
        position: { x: regXPos, y: regYCenter },
        data: { 
          doc: docs.csr, 
          highlightState,
          isFocused: focusedId === 'csr',
          onClick: () => toggleFocus('csr'),
          onOpenEditor: () => openInEditor(docs.csr?.localPath),
          onShowUpdates: docs.csr.pendingUpdates?.length 
            ? () => setSelectedUpdates({ docName: docs.csr!.name, updates: docs.csr!.pendingUpdates! })
            : undefined,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    }

    const opXStart = 100;
    const opXGap = 240;
    opDocs.forEach((opDoc, index) => {
      const nodeId = `op-${opDoc.id}`;
      const highlightState = getHighlightState(nodeId);
      nodeArray.push({
        id: nodeId,
        type: 'opDocument',
        position: { x: opXStart + index * opXGap, y: opYStart },
        data: { 
          doc: opDoc, 
          highlightState,
          isFocused: focusedId === nodeId,
          onOpenEditor: () => openInEditor(opDoc.localPath),
          onShowUpdates: opDoc.pendingUpdates?.length 
            ? () => setSelectedUpdates({ docName: opDoc.name, updates: opDoc.pendingUpdates! })
            : undefined,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });

    // Create edges with highlight-aware colors
    const getEdgeStyle = (sourceId: string, targetId: string) => {
      let edgeColor = '#e2e8f0'; // Default muted
      let strokeWidth = 1.5;
      let animated = false;
      
      if (focusedId) {
        const sourceHighlight = getHighlightState(sourceId);
        
        if (sourceId === focusedId || targetId === focusedId) {
          animated = true;
          strokeWidth = 2.5;
          
          if (sourceId === focusedId) {
            edgeColor = highlightColors.downstream.border;
          } else {
            edgeColor = sourceHighlight === 'upstream-attention' 
              ? highlightColors['upstream-attention'].border 
              : highlightColors.upstream.border;
          }
        }
      }
      
      return { edgeColor, strokeWidth, animated };
    };

    if (docs.protocol && docs.sap) {
      const { edgeColor, strokeWidth, animated } = getEdgeStyle('protocol', 'sap');
      edgeArray.push({
        id: 'protocol-sap',
        source: 'protocol',
        target: 'sap',
        type: 'smoothstep',
        animated,
        style: { stroke: edgeColor, strokeWidth },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor, width: 16, height: 16 },
      });
    }

    if (docs.protocol && docs.csr && !docs.sap) {
      const { edgeColor, strokeWidth, animated } = getEdgeStyle('protocol', 'csr');
      edgeArray.push({
        id: 'protocol-csr',
        source: 'protocol',
        target: 'csr',
        type: 'smoothstep',
        animated,
        style: { stroke: edgeColor, strokeWidth },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor, width: 16, height: 16 },
      });
    }

    if (docs.sap && docs.csr) {
      const { edgeColor, strokeWidth, animated } = getEdgeStyle('sap', 'csr');
      edgeArray.push({
        id: 'sap-csr',
        source: 'sap',
        target: 'csr',
        type: 'smoothstep',
        animated,
        style: { stroke: edgeColor, strokeWidth },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor, width: 16, height: 16 },
      });
    }

    opDocs.forEach((opDoc) => {
      if (docs.protocol) {
        const targetId = `op-${opDoc.id}`;
        const { edgeColor, strokeWidth, animated } = getEdgeStyle('protocol', targetId);
        
        edgeArray.push({
          id: `protocol-${opDoc.id}`,
          source: 'protocol',
          target: targetId,
          type: 'smoothstep',
          animated,
          style: { stroke: focusedId ? edgeColor : '#cbd5e1', strokeWidth, strokeDasharray: '5,5' },
          markerEnd: { type: MarkerType.ArrowClosed, color: focusedId ? edgeColor : '#cbd5e1', width: 12, height: 12 },
        });
      }
    });

    return { initialNodes: nodeArray, initialEdges: edgeArray };
  }, [study, focusedId, getHighlightState, toggleFocus]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update nodes and edges when focusedId changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNodes, initialEdges]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    if (edge.id === 'protocol-sap' || edge.id === 'sap-csr') {
      navigate(`/submissions/${submissionId}/sections?source=protocol&target=csr`);
    } else if (edge.id === 'protocol-csr') {
      navigate(`/submissions/${submissionId}/sections?source=protocol&target=csr`);
    } else if (edge.id.includes('icf')) {
      navigate(`/submissions/${submissionId}/sections?source=protocol&target=icf`);
    }
  }, [navigate, submissionId]);

  if (!submission || !study) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Study not found</p>
        <Link to={`/submissions/${submissionId}`} className="text-blue-600 hover:underline mt-2 inline-block">
          Back to document graph
        </Link>
      </div>
    );
  }

  const totalPendingUpdates = [
    ...(study.documents.protocol?.pendingUpdates || []),
    ...(study.documents.sap?.pendingUpdates || []),
    ...(study.documents.csr?.pendingUpdates || []),
    ...(study.operationalDocs?.flatMap(d => d.pendingUpdates || []) || []),
  ].length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={`/submissions/${submissionId}`}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">{study.studyId}</h1>
            <span 
              className="px-2 py-1 rounded text-xs font-semibold uppercase"
              style={{ backgroundColor: `${study.color}20`, color: study.color }}
            >
              {studyTypeLabels[study.studyType]}
            </span>
            {totalPendingUpdates > 0 && (
              <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700">
                {totalPendingUpdates} pending update{totalPendingUpdates > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-slate-500">{study.name} • {study.phase}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: '560px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.4}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#f1f5f9" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3">Document Flow</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Protocol</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span>SAP</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span>CSR</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Click edges to view section mappings
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3">Color Legend</h3>
          <p className="text-xs text-slate-400 mb-2">Click a node to highlight</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border-2" style={{ borderColor: highlightColors.focused.border, backgroundColor: highlightColors.focused.bg }} />
              <span className="text-slate-600">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border-2" style={{ borderColor: highlightColors['upstream-attention'].border, backgroundColor: highlightColors['upstream-attention'].bg }} />
              <span className="text-slate-600">Needs attention</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border-2" style={{ borderColor: highlightColors.downstream.border, backgroundColor: highlightColors.downstream.bg }} />
              <span className="text-slate-600">Downstream</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3">Veeva Sync</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <Cloud className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-600">Synced</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-slate-600">Syncing</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-slate-600">Conflict</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3">Actions</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in editor</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>View updates</span>
            </div>
          </div>
        </div>
      </div>

      {selectedUpdates && (
        <PendingUpdatesModal
          docName={selectedUpdates.docName}
          updates={selectedUpdates.updates}
          onClose={() => setSelectedUpdates(null)}
        />
      )}
    </div>
  );
}
