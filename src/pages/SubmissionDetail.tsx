import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, PanelRightClose, PanelRightOpen, ShieldCheck, Play, Loader2, AlertTriangle, CheckCircle2, XCircle, ChevronRight, FileText } from 'lucide-react';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  getStudies,
  getSummaryDocuments,
  getDocumentLinks,
  getCrossStudyDocuments,
  getQCIssues,
  submissions,
  qcIssueTypeLabels,
  qcIssueSeverityColors,
} from '../data/mockData';
import type { Study, SummaryDocument, CrossStudyDocument, QCIssue } from '../data/mockData';
import { StudyNode } from '../components/StudyNode';
import { SummaryDocNode } from '../components/SummaryDocNode';
import { CrossStudyDocNode } from '../components/CrossStudyDocNode';
import { layoutGraph } from '../utils/layoutGraph';
import type { HighlightState } from '../utils/highlightColors';
import { computeEdgeVisualStyle } from '../utils/edgeStyling';
import { AddDocumentModal, type SupportingDocOption } from '../components/AddDocumentModal';

const nodeTypes = {
  study: StudyNode,
  summaryDoc: SummaryDocNode,
  crossStudyDoc: CrossStudyDocNode,
};

interface GraphState {
  expandedStudies: Set<string>;
  focusedId: string | null;
  highlightedEdge: { sourceId: string; targetId: string } | null;
}

interface GraphLayoutProps {
  studies: Study[];
  summaryDocs: SummaryDocument[];
  crossStudyDocs: CrossStudyDocument[];
  links: ReturnType<typeof getDocumentLinks>;
  recentlyUpdatedDocIds: Set<string>;
  submissionId: string;
  graphState: GraphState;
  setGraphState: React.Dispatch<React.SetStateAction<GraphState>>;
}

function mergeNodesPreservingPositions(prev: Node[], next: Node[]): Node[] {
  const prevById = new Map(prev.map(n => [n.id, n]));
  return next.map(n => {
    const p = prevById.get(n.id);
    if (!p) return n;
    return {
      ...n,
      position: p.position,
      positionAbsolute: (p as any).positionAbsolute,
    };
  });
}

function GraphLayout({ studies, summaryDocs, crossStudyDocs, links, recentlyUpdatedDocIds, submissionId, graphState, setGraphState }: GraphLayoutProps) {
  const navigate = useNavigate();
  const { fitView } = useReactFlow();
  const { expandedStudies, focusedId, highlightedEdge } = graphState;
  const isInitialMount = useRef(true);
  const previousExpandedRef = useRef(expandedStudies);
  const [layoutLocked, setLayoutLocked] = useState(false);

  const toggleExpand = useCallback((studyId: string) => {
    setGraphState(prev => {
      const newExpanded = new Set(prev.expandedStudies);
      if (newExpanded.has(studyId)) {
        newExpanded.delete(studyId);
      } else {
        newExpanded.add(studyId);
      }
      return { ...prev, expandedStudies: newExpanded };
    });
  }, [setGraphState]);

  const setFocused = useCallback((id: string | null) => {
    setGraphState(prev => ({
      ...prev,
      focusedId: prev.focusedId === id ? null : id,
    }));
  }, [setGraphState]);

  const { initialNodes, edges } = useMemo(() => {
    const nodeArray: Node[] = [];
    const edgeArray: Edge[] = [];

    // Compute highlight states for all nodes based on focused node
    const getHighlightState = (nodeId: string): HighlightState => {
      if (!focusedId) return 'default';
      if (nodeId === focusedId) return 'focused';
      
      // Check if this node is upstream (source pointing to focused)
      const isUpstream = links.some(l => l.sourceId === nodeId && l.targetId === focusedId);
      // Check if this node is downstream (focused pointing to this)
      const isDownstream = links.some(l => l.sourceId === focusedId && l.targetId === nodeId);
      
      if (isUpstream) {
        // Check if this upstream node caused pending updates to the focused node
        const focusedStudy = studies.find(s => s.id === focusedId);
        const focusedSummaryDoc = summaryDocs.find(d => d.id === focusedId);
        
        let pendingUpdates: Array<{ sourceDocId: string }> = [];
        if (focusedStudy) {
          pendingUpdates = [
            ...(focusedStudy.documents.protocol?.pendingUpdates || []),
            ...(focusedStudy.documents.sap?.pendingUpdates || []),
            ...(focusedStudy.documents.csr?.pendingUpdates || []),
            ...(focusedStudy.operationalDocs?.flatMap(d => d.pendingUpdates || []) || []),
          ];
        } else if (focusedSummaryDoc) {
          pendingUpdates = focusedSummaryDoc.pendingUpdates || [];
        }
        
        // Check if any pending update came from this upstream node (or its documents)
        const upstreamStudy = studies.find(s => s.id === nodeId);
        const upstreamSummaryDoc = summaryDocs.find(d => d.id === nodeId);
        
        let upstreamDocIds: string[] = [];
        if (upstreamStudy) {
          upstreamDocIds = [
            upstreamStudy.documents.protocol?.id,
            upstreamStudy.documents.sap?.id,
            upstreamStudy.documents.csr?.id,
          ].filter(Boolean) as string[];
        } else if (upstreamSummaryDoc) {
          upstreamDocIds = [upstreamSummaryDoc.id];
        }
        
        const hasAttention = pendingUpdates.some(update => upstreamDocIds.includes(update.sourceDocId));
        return hasAttention ? 'upstream-attention' : 'upstream';
      }
      
      if (isDownstream) return 'downstream';
      
      return 'default';
    };

    studies.forEach((study) => {
      const isExpanded = expandedStudies.has(study.id);
      const highlightState = getHighlightState(study.id);
      const docs = study.documents;
      const hasRecentUpdates =
        (docs.protocol && recentlyUpdatedDocIds.has(docs.protocol.id)) ||
        (docs.sap && recentlyUpdatedDocIds.has(docs.sap.id)) ||
        (docs.csr && recentlyUpdatedDocIds.has(docs.csr.id)) ||
        (study.operationalDocs || []).some(d => recentlyUpdatedDocIds.has(d.id));
      
      nodeArray.push({
        id: study.id,
        type: 'study',
        position: { x: 0, y: 0 },
        data: {
          study,
          isExpanded,
          isFocused: focusedId === study.id,
          highlightState,
          hasRecentUpdates,
          onToggleExpand: () => toggleExpand(study.id),
          onClick: () => setFocused(study.id),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });

    summaryDocs.forEach((doc) => {
      const highlightState = getHighlightState(doc.id);
      const hasRecentUpdates = recentlyUpdatedDocIds.has(doc.id);
      
      nodeArray.push({
        id: doc.id,
        type: 'summaryDoc',
        position: { x: 0, y: 0 },
        data: {
          document: doc,
          isFocused: focusedId === doc.id,
          highlightState,
          hasRecentUpdates,
          onClick: () => setFocused(doc.id),
          // Treat Sanofi CMC as a group doc hub
          isGroup: submissionId === 'sub-5' && doc.id === 'doc-cmc-5',
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });

    crossStudyDocs.forEach((doc) => {
      const highlightState = getHighlightState(doc.id);
      const hasRecentUpdates = recentlyUpdatedDocIds.has(doc.id);
      
      nodeArray.push({
        id: doc.id,
        type: 'crossStudyDoc',
        position: { x: 0, y: 0 },
        data: {
          document: doc,
          isFocused: focusedId === doc.id,
          highlightState,
          hasRecentUpdates,
          onClick: () => setFocused(doc.id),
          isGroup: false,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });

    const visibleNodeIds = new Set(nodeArray.map(n => n.id));

    links.forEach(link => {
      if (!visibleNodeIds.has(link.sourceId) || !visibleNodeIds.has(link.targetId)) return;
      
      const { edgeColor, strokeWidth, animated } = computeEdgeVisualStyle(link, {
        focusedId,
        highlightedEdge,
        getHighlightState,
      });
      
      edgeArray.push({
        id: link.id,
        source: link.sourceId,
        target: link.targetId,
        type: 'smoothstep',
        animated,
        style: { 
          stroke: edgeColor,
          strokeWidth,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 16,
          height: 16,
        },
      });
    });

    const getNodeSize = (node: Node) => {
      if (node.type === 'study') {
        const study = studies.find(s => s.id === node.id);
        const isExpanded = expandedStudies.has(node.id);
        const regDocCount = study ? [study.documents.protocol, study.documents.sap, study.documents.csr].filter(Boolean).length : 0;
        const opDocCount = study?.operationalDocs?.length || 0;
        
        const baseHeight = 90;
        const regDocsHeight = regDocCount * 32 + 24;
        const opDocsHeight = opDocCount > 0 ? opDocCount * 28 + 28 : 0;
        
        return {
          width: isExpanded ? 300 : 240,
          height: isExpanded ? baseHeight + regDocsHeight + opDocsHeight : baseHeight,
        };
      }
      return { width: 200, height: 90 };
    };

    const layoutedNodes = layoutGraph(nodeArray, edgeArray, {
      direction: 'LR',
      nodeWidth: 280,
      nodeHeight: 100,
      rankSep: 180,
      nodeSep: 60,
      getNodeSize,
    });

    // For Sanofi, pin nodes to a hand-tuned layout that matches the design
    const positionedNodes =
      submissionId === 'sub-5'
        ? layoutedNodes.map((node) => {
            switch (node.id) {
              case 'doc-cmc-5':
                return { ...node, position: { x: 0, y: -80 } };
              case 'study-501':
                return { ...node, position: { x: 0, y: 120 } };
              case 'doc-274-5': // Clinical Overview
                return { ...node, position: { x: 320, y: 40 } };
              case 'doc-273-5': // Clinical Summary
                return { ...node, position: { x: 320, y: 200 } };
              case 'doc-labeling-5':
                return { ...node, position: { x: 640, y: -40 } };
              default:
                return node;
            }
          })
        : layoutedNodes;

    return { initialNodes: positionedNodes, edges: edgeArray };
  }, [studies, summaryDocs, crossStudyDocs, links, expandedStudies, focusedId, highlightedEdge, toggleExpand, setFocused, submissionId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    // If the user has manually positioned nodes, preserve those coordinates
    // while still updating node data (focus/highlight/expanded state changes).
    setNodes(prev => (layoutLocked ? mergeNodesPreservingPositions(prev, initialNodes) : initialNodes));
    setEdges(edges);
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 100);
    }
    
    previousExpandedRef.current = expandedStudies;
  }, [initialNodes, edges, setNodes, setEdges, fitView, expandedStudies, layoutLocked]);

  const onNodesChangeWithLock = useCallback(
    (changes: any[]) => {
      // Any manual repositioning locks the layout so clicks/selection don't reset it.
      if (changes.some(c => c?.type === 'position')) {
        setLayoutLocked(true);
      }
      onNodesChange(changes as any);
    },
    [onNodesChange],
  );

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'study') {
      navigate(`/submissions/${submissionId}/study/${node.id}`);
      return;
    }

    if (node.type === 'summaryDoc') {
      const doc = summaryDocs.find(d => d.id === node.id);
      if (doc?.type === 'cmc') {
        navigate(`/submissions/${submissionId}/cmc`);
      }
    }
  }, [navigate, submissionId, summaryDocs]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    const sourceStudy = studies.find(s => s.id === edge.source);
    const sourceSummaryDoc = summaryDocs.find(d => d.id === edge.source);
    const targetSummaryDoc = summaryDocs.find(d => d.id === edge.target);
    
    if (sourceStudy && targetSummaryDoc) {
      const targetType = targetSummaryDoc.type;
      navigate(`/submissions/${submissionId}/sections?source=csr&target=${targetType}`);
    } else if (sourceSummaryDoc && targetSummaryDoc) {
      navigate(`/submissions/${submissionId}/sections?source=${sourceSummaryDoc.type}&target=${targetSummaryDoc.type}`);
    } else if (sourceStudy) {
      navigate(`/submissions/${submissionId}/sections?source=protocol&target=csr`);
    }
  }, [navigate, submissionId, studies, summaryDocs]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edgesState}
      onNodesChange={onNodesChangeWithLock}
      onEdgesChange={onEdgesChange}
      onNodeDoubleClick={onNodeDoubleClick}
      onEdgeClick={onEdgeClick}
      nodeTypes={nodeTypes}
      minZoom={0.3}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#f1f5f9" gap={20} size={1} />
    </ReactFlow>
  );
}

export function SubmissionDetail() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [searchParams] = useSearchParams();
  const focusParam = searchParams.get('focus');
  
  const submission = submissions.find(s => s.id === submissionId);
  const studies = getStudies(submissionId || '');
  const summaryDocs = getSummaryDocuments(submissionId || '');
  const crossStudyDocs = getCrossStudyDocuments(submissionId || '');
  const links = getDocumentLinks(submissionId || '');

  // Docs that are the SOURCE of someone else's pending updates (recently updated upstream)
  const recentlyUpdatedDocIds = useMemo(() => {
    const ids = new Set<string>();

    const collectFromStudy = (study: Study) => {
      const docs = study.documents;
      const allDocs = [
        docs.protocol,
        docs.sap,
        docs.csr,
        ...(study.operationalDocs || []),
      ].filter(Boolean) as { pendingUpdates?: { sourceDocId: string }[] }[];

      allDocs.forEach(doc => {
        doc.pendingUpdates?.forEach(update => {
          if (update.sourceDocId) ids.add(update.sourceDocId);
        });
      });
    };

    studies.forEach(collectFromStudy);
    summaryDocs.forEach(doc => {
      doc.pendingUpdates?.forEach(update => {
        if (update.sourceDocId) ids.add(update.sourceDocId);
      });
    });
    return ids;
  }, [studies, summaryDocs, crossStudyDocs]);
  
  // Map document IDs to their parent study IDs (for documents inside studies)
  const docIdToStudyId = useMemo(() => {
    const mapping: Record<string, string> = {};
    studies.forEach(study => {
      if (study.documents.protocol) mapping[study.documents.protocol.id] = study.id;
      if (study.documents.sap) mapping[study.documents.sap.id] = study.id;
      if (study.documents.csr) mapping[study.documents.csr.id] = study.id;
      study.operationalDocs?.forEach(doc => {
        mapping[doc.id] = study.id;
      });
    });
    return mapping;
  }, [studies]);
  
  // Resolve focus param to actual node ID (handle study document IDs)
  const resolvedFocusId = useMemo(() => {
    if (!focusParam) return null;
    // Check if it's a study document ID that maps to a study
    if (docIdToStudyId[focusParam]) {
      return docIdToStudyId[focusParam];
    }
    // Otherwise use the param directly (for summary docs, cross-study docs, or study IDs)
    return focusParam;
  }, [focusParam, docIdToStudyId]);
  
  // Determine if we should auto-expand a study (when focusing on a study from a doc link)
  const shouldExpandStudy = useMemo(() => {
    if (!focusParam || !docIdToStudyId[focusParam]) return null;
    return docIdToStudyId[focusParam];
  }, [focusParam, docIdToStudyId]);
  
  const [graphState, setGraphState] = useState<GraphState>(() => ({
    expandedStudies: shouldExpandStudy ? new Set([shouldExpandStudy]) : new Set(),
    focusedId: resolvedFocusId,
    highlightedEdge: null,
  }));

  const [showAddDocModal, setShowAddDocModal] = useState(false);
  
  // Update focusedId if URL param changes
  useEffect(() => {
    if (resolvedFocusId && resolvedFocusId !== graphState.focusedId) {
      setGraphState(prev => ({
        ...prev,
        focusedId: resolvedFocusId,
        expandedStudies: shouldExpandStudy 
          ? new Set([...prev.expandedStudies, shouldExpandStudy])
          : prev.expandedStudies,
      }));
    }
  }, [resolvedFocusId, shouldExpandStudy]);

  // QC State
  const [showQCPanel, setShowQCPanel] = useState(false);
  const [qcRunning, setQCRunning] = useState(false);
  const [qcComplete, setQCComplete] = useState(false);
  const [qcIssues, setQCIssues] = useState<QCIssue[]>([]);

  const runQCCheck = useCallback(() => {
    setQCRunning(true);
    setQCComplete(false);
    setQCIssues([]);
    setGraphState(prev => ({ ...prev, highlightedEdge: null }));
    
    // Simulate QC running
    setTimeout(() => {
      const issues = getQCIssues(submissionId || '');
      setQCIssues(issues);
      setQCRunning(false);
      setQCComplete(true);
    }, 2000);
  }, [submissionId]);

  const highlightQCIssue = useCallback((issue: QCIssue) => {
    if (issue.relatedDocumentId) {
      // Map document IDs to node IDs (studies or summary docs)
      let sourceNodeId = issue.documentId;
      let targetNodeId = issue.relatedDocumentId;
      
      // Check if document IDs map to study nodes
      if (docIdToStudyId[sourceNodeId]) sourceNodeId = docIdToStudyId[sourceNodeId];
      if (docIdToStudyId[targetNodeId]) targetNodeId = docIdToStudyId[targetNodeId];
      
      setGraphState(prev => ({
        ...prev,
        highlightedEdge: { sourceId: sourceNodeId, targetId: targetNodeId },
        focusedId: null,
      }));
    }
  }, [docIdToStudyId]);

  const clearQCHighlight = useCallback(() => {
    setGraphState(prev => ({ ...prev, highlightedEdge: null }));
  }, []);

  const criticalCount = qcIssues.filter(i => i.severity === 'critical').length;
  const majorCount = qcIssues.filter(i => i.severity === 'major').length;
  const minorCount = qcIssues.filter(i => i.severity === 'minor').length;

  // Upstream suggestions: protocols / SAPs / CSRs / summary / cross-study docs
  const supportingOptions: SupportingDocOption[] = useMemo(() => {
    const opts: SupportingDocOption[] = [];
    studies.forEach(study => {
      const { protocol, sap, csr } = study.documents;
      if (protocol) opts.push({ id: protocol.id, label: protocol.name, type: 'Protocol' });
      if (sap) opts.push({ id: sap.id, label: sap.name, type: 'SAP' });
      if (csr) opts.push({ id: csr.id, label: csr.name, type: 'CSR' });
    });
    summaryDocs.forEach(d => opts.push({ id: d.id, label: d.name, type: d.shortName }));
    crossStudyDocs.forEach(d => opts.push({ id: d.id, label: d.name, type: d.shortName }));
    return opts;
  }, [studies, summaryDocs, crossStudyDocs]);

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Submission not found</p>
        <Link to="/submissions" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to submissions
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <Link
          to="/submissions"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">{submission.name}</h1>
          <p className="text-sm text-slate-500">Double-click a study to see documents • Click edges for section mapping</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddDocModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Add Document</span>
          </button>
          <button
            onClick={() => setShowQCPanel(!showQCPanel)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              showQCPanel
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {showQCPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            <ShieldCheck className="w-4 h-4" />
            <span>QC</span>
            {qcComplete && qcIssues.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {qcIssues.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <ReactFlowProvider>
            <GraphLayout 
              studies={studies}
              summaryDocs={summaryDocs}
              crossStudyDocs={crossStudyDocs}
              links={links} 
              recentlyUpdatedDocIds={recentlyUpdatedDocIds}
              submissionId={submissionId || ''} 
              graphState={graphState}
              setGraphState={setGraphState}
            />
          </ReactFlowProvider>
        </div>

        {showQCPanel && (
          <div className="w-80 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-800">Quality Check</h3>
                </div>
                {graphState.highlightedEdge && (
                  <button
                    onClick={clearQCHighlight}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Clear highlight
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Check for inconsistencies across documents</p>
            </div>
            
            <div className="p-4 border-b border-slate-100">
              <button
                onClick={runQCCheck}
                disabled={qcRunning}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  qcRunning
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {qcRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running QC Check...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run QC Check</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {!qcComplete && !qcRunning && (
                <div className="p-8 text-center text-slate-400">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Run a QC check to find inconsistencies</p>
                </div>
              )}

              {qcRunning && (
                <div className="p-8 text-center text-slate-500">
                  <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-blue-500" />
                  <p className="text-sm font-medium">Analyzing documents...</p>
                  <p className="text-xs text-slate-400 mt-1">Checking cross-references and data consistency</p>
                </div>
              )}

              {qcComplete && qcIssues.length === 0 && (
                <div className="p-8 text-center text-emerald-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm font-medium">No issues found</p>
                  <p className="text-xs text-slate-400 mt-1">All documents are consistent</p>
                </div>
              )}

              {qcComplete && qcIssues.length > 0 && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3 text-xs">
                    {criticalCount > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        <XCircle className="w-3 h-3" />
                        {criticalCount} Critical
                      </span>
                    )}
                    {majorCount > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        {majorCount} Major
                      </span>
                    )}
                    {minorCount > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {minorCount} Minor
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {qcIssues.map(issue => {
                      const severityColors = qcIssueSeverityColors[issue.severity];
                      const isHighlighted = graphState.highlightedEdge && 
                        issue.relatedDocumentId &&
                        ((graphState.highlightedEdge.sourceId === issue.documentId || 
                          graphState.highlightedEdge.sourceId === docIdToStudyId[issue.documentId]) &&
                         (graphState.highlightedEdge.targetId === issue.relatedDocumentId ||
                          graphState.highlightedEdge.targetId === docIdToStudyId[issue.relatedDocumentId!]));
                      
                      return (
                        <div
                          key={issue.id}
                          onClick={() => highlightQCIssue(issue)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isHighlighted
                              ? 'border-red-300 bg-red-50 ring-2 ring-red-200'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${severityColors.bg} ${severityColors.text}`}>
                              {issue.severity}
                            </span>
                            <span className="text-xs text-slate-400">
                              {qcIssueTypeLabels[issue.type]}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium mb-1">{issue.description}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <span className="font-medium">{issue.documentName}</span>
                            {issue.relatedDocumentId && (
                              <>
                                <ChevronRight className="w-3 h-3" />
                                <span className="font-medium">{issue.relatedDocumentName}</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{issue.section}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <AddDocumentModal
        isOpen={showAddDocModal}
        context="submission"
        studies={studies}
        supportingOptions={supportingOptions}
        onClose={() => setShowAddDocModal(false)}
        onSubmit={() => {
          // For now this is a UX-only mock; we collect input but
          // don’t persist or change the graph yet.
          setShowAddDocModal(false);
        }}
      />
    </div>
  );
}
