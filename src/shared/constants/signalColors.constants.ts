export const SIGNAL_STRENGTH_COLORS = {
  NONE: '#94a3b8',      // Slate 400 - Серый (0%)
  LOW: '#60a5fa',       // Blue 400 - Синий (25%)
  MEDIUM: '#fbbf24',    // Amber 400 - Жёлтый (50%)
  HIGH: '#f97316',      // Orange 500 - Оранжевый (75%)
  MAXIMUM: '#ef4444',   // Red 500 - Красный (100%)
} as const;

export const SIGNAL_STRENGTH_LEVELS = [0, 25, 50, 75, 100] as const;