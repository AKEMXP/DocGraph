import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Position,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getSummaryDocuments } from '../data/mockData';

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

  const summaryDocs = useMemo(() => getSummaryDocuments(submissionId || ''), [submissionId]);

  const cmcSummary = summaryDocs.find(d => d.type === 'cmc');

  const cmcChildren: CmcChildDoc[] = useMemo(() => {
    if (!cmcSummary) return [];
    return (cmcSummary.supportingDocs || []).map(d => ({
      id: d.id,
      name: d.name,
      type: d.type,
    }));
  }, [cmcSummary]);

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

    return nodes;
  }, [cmcSummary, cmcChildren]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    if (cmcSummary) {
      cmcChildren.forEach(child => {
        edges.push({
          id: `edge-${child.id}-${cmcSummary.id}`,
          source: child.id,
          target: cmcSummary.id,
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: '#64748b',
            strokeWidth: 2,
          },
        });
      });
    }

    return edges;
  }, [cmcSummary, cmcChildren]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="px-6 pt-4 pb-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <Link
            to={`/submissions/${submissionId}`}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">
                {cmcSummary?.shortName || 'CMC (2.3)'}
              </h1>
              {cmcSummary && (
                <span
                  className="px-2 py-1 rounded text-xs font-semibold uppercase bg-sky-100 text-sky-700"
                >
                  CMC
                </span>
              )}
            </div>
            {cmcSummary && (
              <p className="text-slate-500 text-sm mt-0.5">
                {cmcSummary.name} • Module 2.3 & Module 3
              </p>
            )}
          </div>
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

