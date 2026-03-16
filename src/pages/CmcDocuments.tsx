import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Position,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getSummaryDocuments, getCrossStudyDocuments, submissions } from '../data/mockData';

interface CmcChildDoc {
  id: string;
  name: string;
  type: string;
}

type CmcNodeData = {
  label: string;
  subtitle?: string;
};

function CmcNode({ data }: { data: CmcNodeData }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-3 min-w-[220px]">
      <div className="text-sm font-semibold text-slate-800 truncate">{data.label}</div>
      {data.subtitle && (
        <div className="mt-0.5 text-xs text-slate-500 truncate">{data.subtitle}</div>
      )}
    </div>
  );
}

const nodeTypes = {
  cmcDoc: CmcNode,
};

export function CmcDocuments() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const submission = submissions.find(s => s.id === submissionId);

  const summaryDocs = useMemo(() => getSummaryDocuments(submissionId || ''), [submissionId]);
  const crossStudyDocs = useMemo(() => getCrossStudyDocuments(submissionId || ''), [submissionId]);

  const cmcSummary = summaryDocs.find(d => d.type === 'cmc');

  const cmcChildren: CmcChildDoc[] = useMemo(() => {
    if (!cmcSummary) return [];
    return (cmcSummary.supportingDocs || []).map(d => ({
      id: d.id,
      name: d.name,
      type: d.type,
    }));
  }, [cmcSummary]);

  const labelingDocs = useMemo(
    () => crossStudyDocs.filter(d => d.type === 'labeling'),
    [crossStudyDocs],
  );

  const initialNodes: Node<CmcNodeData>[] = useMemo(() => {
    const nodes: Node<CmcNodeData>[] = [];

    if (cmcSummary) {
      nodes.push({
        id: cmcSummary.id,
        type: 'cmcDoc',
        position: { x: 0, y: 0 },
        data: {
          label: cmcSummary.name,
          subtitle: 'CMC hub (2.3 + Module 3)',
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    }

    cmcChildren.forEach((child, index) => {
      nodes.push({
        id: child.id,
        type: 'cmcDoc',
        position: { x: 320, y: index * 140 - 60 },
        data: {
          label: child.name,
          subtitle: child.type,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });

    labelingDocs.forEach((doc, index) => {
      nodes.push({
        id: doc.id,
        type: 'cmcDoc',
        position: { x: 680, y: index * 140 - 40 },
        data: {
          label: doc.name,
          subtitle: 'Labeling',
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });

    return nodes;
  }, [cmcSummary, cmcChildren, labelingDocs]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    if (cmcSummary) {
      cmcChildren.forEach(child => {
        edges.push({
          id: `edge-${cmcSummary.id}-${child.id}`,
          source: cmcSummary.id,
          target: child.id,
          type: 'smoothstep',
        });
      });

      labelingDocs.forEach(doc => {
        edges.push({
          id: `edge-${cmcSummary.id}-${doc.id}`,
          source: cmcSummary.id,
          target: doc.id,
          type: 'smoothstep',
        });
      });
    }

    return edges;
  }, [cmcSummary, cmcChildren, labelingDocs]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="px-6 pt-4 pb-3 border-b border-slate-200 flex items-center justify-between bg-white">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link
              to="/submissions"
              className="hover:text-slate-700 transition-colors"
            >
              Submissions
            </Link>
            <span>/</span>
            {submission && (
              <Link
                to={`/submissions/${submission.id}`}
                className="hover:text-slate-700 transition-colors"
              >
                {submission.name}
              </Link>
            )}
            <span>/</span>
            <span>CMC Graph</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">
            CMC Documents
          </h1>
          {cmcSummary && (
            <p className="text-xs text-slate-500 mt-0.5">
              Hub: {cmcSummary.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#f1f5f9" gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

