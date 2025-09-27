import type { NeuroTransmitterType } from "../types";

export const BASE_POSTSYNAPTIC_EFFECTS: Record<NeuroTransmitterType, number> = {
  glutamate: 5.0,
  gaba: -4.0, 
  glycine: -5.0,
  dopamine: 0,
  serotonin: 0,
  acetylcholine: 0,
  norepinephrine: 0
};

// Только модуляторы
export const MODULATORS = {
  dopamine: { thresholdDelta: -2.0, tauDelta: 5, duration: 100 },
  serotonin: { thresholdDelta: 2.0, tauDelta: -5, duration: 150 },
  acetylcholine: { thresholdDelta: -3.0, tauDelta: 8, duration: 80 },
  norepinephrine: { thresholdDelta: -2.5, tauDelta: 5, duration: 120 },
} as const;

// Список имён модуляторов (для проверки)
export const MODULATOR_NAMES = new Set(Object.keys(MODULATORS)) as Set<keyof typeof MODULATORS>;

// Тип только для модуляторов
export type ModulatorType = keyof typeof MODULATORS;