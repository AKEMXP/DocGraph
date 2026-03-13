import { highlightColors } from './highlightColors';
import type { HighlightState } from './highlightColors';

export interface HighlightedEdge {
  sourceId: string;
  targetId: string;
}

export interface EdgeLink {
  sourceId: string;
  targetId: string;
  relationshipType?: 'informs' | 'summarizes' | string;
}

export interface EdgeHighlightContext {
  focusedId: string | null;
  highlightedEdge?: HighlightedEdge | null;
  getHighlightState: (nodeId: string) => HighlightState;
}

export interface EdgeVisualStyle {
  edgeColor: string;
  strokeWidth: number;
  animated: boolean;
}

/**
 * Compute visual style for a relationship edge given focus and QC highlighting.
 * Shared between submission-level and study-level graphs.
 */
export function computeEdgeVisualStyle(
  link: EdgeLink,
  context: EdgeHighlightContext,
): EdgeVisualStyle {
  const { focusedId, highlightedEdge, getHighlightState } = context;

  let edgeColor = '#e2e8f0'; // default muted slate-200
  let strokeWidth = 1.5;
  let animated = false;

  const isQCHighlighted =
    highlightedEdge &&
    ((link.sourceId === highlightedEdge.sourceId && link.targetId === highlightedEdge.targetId) ||
      (link.sourceId === highlightedEdge.targetId && link.targetId === highlightedEdge.sourceId));

  if (isQCHighlighted) {
    edgeColor = '#ef4444'; // red for QC issues
    strokeWidth = 3;
    animated = true;
    return { edgeColor, strokeWidth, animated };
  }

  if (focusedId) {
    const sourceHighlight = getHighlightState(link.sourceId);

    if (link.sourceId === focusedId || link.targetId === focusedId) {
      animated = true;
      strokeWidth = 2.5;

      if (link.sourceId === focusedId) {
        // Focused -> downstream
        edgeColor = highlightColors.downstream.border;
      } else {
        // Upstream -> focused
        edgeColor =
          sourceHighlight === 'upstream-attention'
            ? highlightColors['upstream-attention'].border
            : highlightColors.upstream.border;
      }
    }
  }

  return { edgeColor, strokeWidth, animated };
}

