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
    edgesep: Math.max(10, Math.floor(nodeSep / 2)),
    marginx: 50,
    marginy: 50,
    // Produces fewer crossings than tight-tree for dense graphs
    ranker: 'network-simplex',
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

  const layouted = nodes.map((node) => {
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

  // Basic de-overlap pass for any nodes that still land too close.
  // Dagre typically prevents overlap, but variable measured sizes + dynamic node heights can still collide.
  const minGap = 16;
  const occupied: Array<{ x: number; y: number; w: number; h: number }> = [];
  const bumped = layouted.map((node) => {
    const size = nodeSizes.get(node.id) || { width: nodeWidth, height: nodeHeight };
    let x = node.position.x;
    let y = node.position.y;

    const collides = (ax: number, ay: number, aw: number, ah: number) =>
      occupied.some(o =>
        ax < o.x + o.w + minGap &&
        ax + aw + minGap > o.x &&
        ay < o.y + o.h + minGap &&
        ay + ah + minGap > o.y
      );

    let attempts = 0;
    while (collides(x, y, size.width, size.height) && attempts < 50) {
      // Push down progressively; keep X stable to preserve left->right structure.
      y += Math.max(minGap, Math.floor(size.height / 6));
      attempts += 1;
    }

    occupied.push({ x, y, w: size.width, h: size.height });
    return { ...node, position: { x, y } };
  });

  return bumped;
}
