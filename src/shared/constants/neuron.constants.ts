export const MEMBRANE_POTENTIAL_COLORS = {
  spike: '#ef4444',        // красный
  depolarization: '#f59e0b', // оранжевый
  hyperpolarization: '#60a5fa', // синий
  resting: '#94a3b8',       // серый
} as const;

export const RESTING_POTENTIAL = -70;

export const EXCITE_SIGNAL: number = 20;


export const DEFAULT_BIOLOGICAL_NEURON_PARAMS = {
  restingPotential: RESTING_POTENTIAL,      // мВ
  spikeThreshold: -55,                      // мВ
  spikeAmplitude: 110,                      // мВ

  // Рефрактерность
  refractoryDuration: 4,                    // шагов

  // Смерть от бездействия
  inactivityThreshold: 100,                 // шагов
  tau: 15,

  // Диапазоны для валидации (если нужно)
  spikeThresholdRange: [5, 50] as const,
  spikeAmplitudeRange: [50, 200] as const,
  decayFactorRange: [0.8, 0.99] as const,
  refractoryDurationRange: [1, 20] as const,

} as const;