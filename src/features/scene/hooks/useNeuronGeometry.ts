import { calculateNeuronRadius, getSignalFactor } from '../utils/neuronUtils';
import type { NeuronDTO } from '../../network/dto/neuron.dto';
import colorFromSignal from '../../../shared/utils/colorFromSignal';

interface NeuronGeometry {
  radius: number;
  signalFactor: number;
  signalColor: string;
}

export function useNeuronGeometry(neuron: NeuronDTO): NeuronGeometry {
  const radius = calculateNeuronRadius(neuron.accumulatedSignal ?? 0);
  const signalFactor = getSignalFactor(neuron.accumulatedSignal ?? 0);
  const signalColor = colorFromSignal(neuron.accumulatedSignal ?? 0);

  return {
    radius,
    signalFactor,
    signalColor,
  };
}