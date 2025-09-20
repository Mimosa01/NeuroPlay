export const DEFAULT_BIOLOGICAL_NEURON_PARAMS = {
  // Мембранный потенциал
  restingPotential: -70,      // мВ
  spikeThreshold: -55,        // мВ
  spikeAmplitude: 110,        // мВ

  // Рефрактерность
  refractoryDuration: 4,      // шагов

  // Затухание
  decayFactor: 0.95,

  // Смерть от бездействия
  inactivityThreshold: 100,   // шагов

  // Диапазоны для валидации (если нужно)
  spikeThresholdRange: [5, 50] as const,
  spikeAmplitudeRange: [50, 200] as const,
  decayFactorRange: [0.8, 0.99] as const,
  refractoryDurationRange: [1, 20] as const,
} as const;