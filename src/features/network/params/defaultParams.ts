import type { NeuroTransmitterType } from "../types/types";

export const DEFAULT_BIOLOGICAL_NEURON_PARAMS = {
  restingPotential: -70,      // мВ
  spikeThreshold: -55,        // мВ
  spikeAmplitude: 110,        // мВ

  // Рефрактерность
  refractoryDuration: 4,      // шагов

  // Смерть от бездействия
  inactivityThreshold: 100,   // шагов
  tau: 15,

  // Диапазоны для валидации (если нужно)
  spikeThresholdRange: [5, 50] as const,
  spikeAmplitudeRange: [50, 200] as const,
  decayFactorRange: [0.8, 0.99] as const,
  refractoryDurationRange: [1, 20] as const,

} as const;

export const BASE_POSTSYNAPTIC_EFFECTS: Record<NeuroTransmitterType, number> = {
  glutamate: 5.0,
  gaba: -4.0, 
  glycine: -5.0,
  dopamine: 0,
  serotonin: 0,
  acetylcholine: 0,
  norepinephrine: 0
};


export const DOPAMINE = { thresholdDelta: -2.0, tauDelta: 5, duration: 100 };
export const SEROTONIN = { thresholdDelta: 2.0, tauDelta: -5, duration: 150 };
export const ACETYLHOLINE = { thresholdDelta: -3.0, tauDelta: 8, duration: 80 };
export const NOREPINEPHRINE = { thresholdDelta: -2.5, tauDelta: 5, duration: 120 };