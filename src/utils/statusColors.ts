export interface StatusColors {
  border: string;
  bg: string;
  accent: string;
}

/**
 * Map free-form status strings into three buckets:
 * - draft
 * - in review
 * - approved/final
 * and return a soft color palette for default (non-highlighted) state.
 */
export function getStatusColors(status?: string): StatusColors {
  const normalized = (status || '').toLowerCase();

  const draftLike =
    normalized.includes('draft') ||
    normalized.includes('ind') ||
    normalized.includes('planning');
  const reviewLike =
    normalized.includes('review') ||
    normalized.includes('qc') ||
    normalized.includes('under_review');
  const approvedLike =
    normalized.includes('final') ||
    normalized.includes('approved') ||
    normalized.includes('completed') ||
    normalized.includes('submitted');

  if (draftLike) {
    // Soft blue
    return {
      border: '#bfdbfe',
      bg: '#eff6ff',
      accent: '#3b82f6',
    };
  }

  if (reviewLike) {
    // Soft amber
    return {
      border: '#fed7aa',
      bg: '#fffbeb',
      accent: '#f59e0b',
    };
  }

  if (approvedLike) {
    return {
      // Neutral card with green accent used only on icons,
      // so downstream highlight green remains visually distinct.
      border: '#e2e8f0',
      bg: '#f8fafc',
      accent: '#16a34a',
    };
  }

  // Neutral fallback
  return {
    border: '#cbd5e1',
    bg: '#f8fafc',
    accent: '#64748b',
  };
}

