export const WEIGHT_COLORS = {
  positive: { line: '#10b981', text: '#059669', arrow: '#10b981' }, // green-500
  negative: { line: '#ef4444', text: '#dc2626', arrow: '#ef4444' }, // red-500
  neutral: { line: '#94a3b8', text: '#64748b', arrow: '#94a3b8' },  // slate-400
} as const;

export const LINE_WIDTH_MIN = 1;
export const LINE_WIDTH_MAX = 3;
export const LINE_WIDTH_FACTOR = 1.5;