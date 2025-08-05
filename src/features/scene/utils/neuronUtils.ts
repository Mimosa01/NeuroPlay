export function calculateNeuronRadius(accumulatedSignal: number): number {
  const baseRadius = 12;
  const maxGrowth = 6;
  const signalFactor = Math.min(1, accumulatedSignal ?? 0);
  return baseRadius + (signalFactor * maxGrowth);
}

export function getSignalFactor(accumulatedSignal: number): number {
  return Math.min(1, accumulatedSignal ?? 0);
}

export function getBiologicalColor (membranePotential: number, spikeThreshold: number) {
    if (membranePotential >= spikeThreshold) return '#ef4444'; // красный - спайк
    if (membranePotential > -70) return '#f59e0b'; // оранжевый - деполяризация
    if (membranePotential < -70) return '#60a5fa'; // синий - гиперполяризация
    return '#94a3b8'; // серый - покой
  };