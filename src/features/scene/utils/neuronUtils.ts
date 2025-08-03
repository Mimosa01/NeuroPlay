export function calculateNeuronRadius(accumulatedSignal: number): number {
  const baseRadius = 12;
  const maxGrowth = 6;
  const signalFactor = Math.min(1, accumulatedSignal ?? 0);
  return baseRadius + (signalFactor * maxGrowth);
}

export function getSignalFactor(accumulatedSignal: number): number {
  return Math.min(1, accumulatedSignal ?? 0);
}