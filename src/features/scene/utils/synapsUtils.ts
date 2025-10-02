import { WEIGHT_COLORS, LINE_WIDTH_MAX, LINE_WIDTH_MIN, LINE_WIDTH_FACTOR } from "../../../shared/constants/synaps.constants";

type Weight = number;

interface WeightColors {
  line: string;
  text: string;
  arrow: string;
}

export function getWeightColors(weight: Weight): WeightColors {
  if (weight > 1) return WEIGHT_COLORS.positive;
  if (weight < 1) return WEIGHT_COLORS.negative;
  return WEIGHT_COLORS.neutral;
}

export function getLineWidth(weight: Weight): number {
  const value = Math.abs(weight);
  return Math.min(LINE_WIDTH_MAX, LINE_WIDTH_MIN + value * LINE_WIDTH_FACTOR);
}