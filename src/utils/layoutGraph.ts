import Dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

interface LayoutOptions {
  direction?: 'LR' | 'TB' | 'RL' | 'BT';
  nodeWidth?: number;
  nodeHeight?: number;
  rankSep?: number;
  nodeSep?: number;
  getNodeSize?: (node: Node) => { width: number; height: number };
}

export function layoutGraph(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): Node[] {
  if (nodes.length === 0) {
    return nodes;
  }

  const {
    direction = 'LR',
    nodeWidth = 250,
    nodeHeight = 120,
    rankSep = 100,
    nodeSep = 50,
    getNodeSize,
  } = options;

  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  
  g.setGraph({ 
    rankdir: direction,
    ranksep: rankSep,
    nodesep: nodeSep,
    marginx: 50,
    marginy: 50,
    ranker: 'tight-tree',
    acyclicer: 'greedy',
  });

  const nodeSizes = new Map<string, { width: number; height: number }>();

  nodes.forEach((node) => {
    let width = nodeWidth;
    let height = nodeHeight;
    
    if (getNodeSize) {
      const size = getNodeSize(node);
      width = size.width;
      height = size.height;
    } else if (node.measured?.width && node.measured?.height) {
      width = node.measured.width;
      height = node.measured.height;
    }
    
    nodeSizes.set(node.id, { width, height });
    g.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  Dagre.layout(g);

  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    const size = nodeSizes.get(node.id) || { width: nodeWidth, height: nodeHeight };
    
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - size.width / 2,
        y: nodeWithPosition.y - size.height / 2,
      },
    };
  });
}
