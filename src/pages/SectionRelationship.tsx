import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  getSections,
  getSectionMappings,
  submissions,
  mappingTypeLabels,
  mappingTypeColors,
  documentTypeLabels,
  getStudies,
  getSummaryDocuments,
} from '../data/mockData';
import type { MappingType, DocumentType, PendingUpdate, StudyDocument, SummaryDocument } from '../data/mockData';
import { SectionNode } from '../components/SectionNode';

const nodeTypes = {
  section: SectionNode,
};

const docTypeToColor: Record<string, string> = {
  protocol: '#3b82f6',
  csr: '#10b981',
  icf: '#0891b2',
  clinical_overview: '#06b6d4',
  clinical_summary: '#14b8a6',
  ib: '#f97316',
  nonclinical: '#8b5cf6',
  cmc: '#ec4899',
};

export function SectionRelationship() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [searchParams] = useSearchParams();
  
  const sourceTypeParam = searchParams.get('source') || 'protocol';
  const targetTypeParam = searchParams.get('target') || 'csr';
  const sourceDocIdParam = searchParams.get('sourceId') || undefined;
  const targetDocIdParam = searchParams.get('targetId') || undefined;
  
  const [sourceType, setSourceType] = useState<DocumentType>(sourceTypeParam as DocumentType);
  const [targetType, setTargetType] = useState<DocumentType>(targetTypeParam as DocumentType);
  
  useEffect(() => {
    setSourceType(sourceTypeParam as DocumentType);
    setTargetType(targetTypeParam as DocumentType);
  }, [sourceTypeParam, targetTypeParam]);
  
  const submission = submissions.find(s => s.id === submissionId);

  const sourceSections = getSections(sourceType);
  const targetSections = getSections(targetType);
  const sectionMappings = getSectionMappings(sourceType, targetType);

  // Resolve concrete documents for this submission and type pair
  const studiesForSubmission = useMemo(() => getStudies(submissionId || ''), [submissionId]);
  const summaryDocsForSubmission = useMemo(() => getSummaryDocuments(submissionId || ''), [submissionId]);

  const sourceDoc = useMemo(() => {
    // Helper to find study-level docs
    const studyDocs: StudyDocument[] = [];
    studiesForSubmission.forEach(study => {
      const { protocol, sap, csr } = study.documents;
      if (protocol) studyDocs.push(protocol);
      if (sap) studyDocs.push(sap);
      if (csr) studyDocs.push(csr);
    });

    if (sourceDocIdParam) {
      const fromStudy = studyDocs.find(d => d.id === sourceDocIdParam);
      if (fromStudy) return fromStudy;
      const fromSummary = summaryDocsForSubmission.find(d => d.id === sourceDocIdParam);
      if (fromSummary) return fromSummary;
    }

    if (sourceType === 'protocol' || sourceType === 'csr') {
      return studyDocs.find(d => d.type === sourceType);
    }

    return summaryDocsForSubmission.find(d => d.type === sourceType);
  }, [studiesForSubmission, summaryDocsForSubmission, sourceType, sourceDocIdParam]);

  const targetDoc = useMemo(() => {
    if (targetDocIdParam) {
      const fromSummary = summaryDocsForSubmission.find(d => d.id === targetDocIdParam);
      if (fromSummary) return fromSummary;
    }
    return summaryDocsForSubmission.find(d => d.type === targetType);
  }, [summaryDocsForSubmission, targetType, targetDocIdParam]);

  // Collect pending updates that specifically connect sourceDoc -> targetDoc
  const relevantUpdates: PendingUpdate[] = useMemo(() => {
    if (!sourceDoc || !targetDoc) return [];
    const updates: PendingUpdate[] = [];

    const maybePending = (doc: StudyDocument | SummaryDocument | undefined) =>
      (doc as any)?.pendingUpdates as PendingUpdate[] | undefined;

    const pendingOnTarget = maybePending(targetDoc) || [];
    pendingOnTarget.forEach(u => {
      if (u.sourceDocId === sourceDoc.id) {
        updates.push(u);
      }
    });

    return updates;
  }, [sourceDoc, targetDoc]);

  // Derive which sections are "updated" vs "needs update"
  const updatedSourceSectionIds = useMemo(() => {
    const ids = new Set<string>();
    if (!relevantUpdates.length) return ids;

    const parseNumber = (label: string) => {
      const first = label.split(' ')[0] || '';
      return first.endsWith('.') ? first.slice(0, -1) : first;
    };

    relevantUpdates.forEach(u => {
      const num = parseNumber(u.sourceSection);
      const match = sourceSections.find(s => s.number === num);
      if (match) ids.add(match.id);
    });

    return ids;
  }, [relevantUpdates, sourceSections]);

  const needsUpdateTargetSectionIds = useMemo(() => {
    const ids = new Set<string>();
    if (!relevantUpdates.length) return ids;

    const parseNumber = (label: string) => {
      const first = label.split(' ')[0] || '';
      return first.endsWith('.') ? first.slice(0, -1) : first;
    };

    relevantUpdates.forEach(u => {
      const num = parseNumber(u.targetSection);
      const match = targetSections.find(s => s.number === num);
      if (match) ids.add(match.id);
    });

    return ids;
  }, [relevantUpdates, targetSections]);

  const sourceColor = docTypeToColor[sourceType] || '#3b82f6';
  const targetColor = docTypeToColor[targetType] || '#10b981';

  // Section mapping is now driven entirely by where the user clicked from
  // (source/target + optional doc IDs in the URL). We no longer expose
  // generic pair-switching buttons in this view.

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const nodeHeight = 50;
    const leftX = 50;
    const rightX = 550;

    sourceSections.forEach((section, index) => {
      nodes.push({
        id: section.id,
        type: 'section',
        position: { x: leftX, y: 80 + index * nodeHeight },
        data: { 
          section, 
          side: 'source',
          color: sourceColor,
          isUpdated: updatedSourceSectionIds.has(section.id),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });

    targetSections.forEach((section, index) => {
      nodes.push({
        id: section.id,
        type: 'section',
        position: { x: rightX, y: 80 + index * nodeHeight },
        data: { 
          section, 
          side: 'target',
          color: targetColor,
          needsUpdate: needsUpdateTargetSectionIds.has(section.id),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });

    sectionMappings.forEach((mapping, index) => {
      const color = mappingTypeColors[mapping.type];
      
      edges.push({
        id: `mapping-${index}`,
        source: mapping.source.id,
        target: mapping.target.id,
        type: 'default',
        label: mappingTypeLabels[mapping.type],
        labelStyle: { fontSize: 9, fill: color, fontWeight: 500 },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
        labelBgPadding: [4, 2] as [number, number],
        style: { 
          stroke: color,
          strokeWidth: 2,
          strokeDasharray: mapping.type === 'retrospective' ? '5,5' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color,
          width: 15,
          height: 15,
        },
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [sourceSections, targetSections, sectionMappings, sourceColor, targetColor]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    // This triggers a re-render when source/target changes
  }, [initialNodes, initialEdges]);

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Submission not found</p>
        <Link to={`/submissions`} className="text-blue-600 hover:underline mt-2 inline-block">
          Back to submissions
        </Link>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-slate-800">Section Mapping</h1>
          <p className="text-slate-500">
            {documentTypeLabels[sourceType]} → {documentTypeLabels[targetType]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div 
          className="rounded-xl p-4 border-2"
          style={{ 
            borderColor: sourceColor,
            backgroundColor: `${sourceColor}10`,
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: sourceColor }}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{documentTypeLabels[sourceType]}</p>
              <p className="text-sm text-slate-500">{sourceSections.length} sections</p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl p-4 border-2"
          style={{ 
            borderColor: targetColor,
            backgroundColor: `${targetColor}10`,
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: targetColor }}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{documentTypeLabels[targetType]}</p>
              <p className="text-sm text-slate-500">{targetSections.length} sections</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: '550px' }}>
        <ReactFlow
          key={`${sourceType}-${targetType}`}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e2e8f0" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Mapping Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {(Object.keys(mappingTypeLabels) as MappingType[]).map(type => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className={`w-8 h-0.5 ${type === 'retrospective' ? 'border-t-2 border-dashed' : ''}`}
                style={{ 
                  backgroundColor: type !== 'retrospective' ? mappingTypeColors[type] : undefined,
                  borderColor: type === 'retrospective' ? mappingTypeColors[type] : undefined,
                }}
              />
              <span className="text-slate-600">{mappingTypeLabels[type]}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-slate-400 space-y-1">
          <p><strong>Copy-Paste:</strong> Content transferred verbatim or with minimal edits</p>
          <p><strong>Summary → Elaborate:</strong> Condensed source expanded with more detail in target</p>
          <p><strong>Rewrite (Tone):</strong> Same content rewritten for different audience (e.g., scientific → lay language)</p>
          <p><strong>Retrospective Rewrite:</strong> Prospective language converted to past tense with results</p>
        </div>
      </div>

      {sectionMappings.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
          <p className="font-medium">No mappings defined</p>
          <p className="text-sm mt-1">Section mappings between {documentTypeLabels[sourceType]} and {documentTypeLabels[targetType]} have not been configured yet.</p>
        </div>
      )}
    </div>
  );
}
