import { SIGNAL_STRENGTH_COLORS } from "../../../shared/constants/signalColors.constants.ts";

export function getSignalStrengthColor(value: number): string {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  if (clampedValue === 0) return SIGNAL_STRENGTH_COLORS.NONE;
  if (clampedValue <= 25) return SIGNAL_STRENGTH_COLORS.LOW;
  if (clampedValue <= 50) return SIGNAL_STRENGTH_COLORS.MEDIUM;
  if (clampedValue <= 75) return SIGNAL_STRENGTH_COLORS.HIGH;
  return SIGNAL_STRENGTH_COLORS.MAXIMUM;
}