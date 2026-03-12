export type HighlightState = 'default' | 'focused' | 'upstream-attention' | 'upstream' | 'downstream';

export const highlightColors: Record<HighlightState, { border: string; bg: string; ring: string }> = {
  default: { border: '#cbd5e1', bg: '#f8fafc', ring: 'transparent' },
  focused: { border: '#3b82f6', bg: '#eff6ff', ring: '#3b82f6' },
  'upstream-attention': { border: '#f59e0b', bg: '#fffbeb', ring: '#f59e0b' },
  upstream: { border: '#60a5fa', bg: '#f0f9ff', ring: '#60a5fa' },
  downstream: { border: '#10b981', bg: '#ecfdf5', ring: '#10b981' },
};
