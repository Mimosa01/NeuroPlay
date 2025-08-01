import type Neuron from "../core/Neuron";
import type { NeuronDTO } from "./neuron.dto";

export function neuronToDTO(neuron: Neuron): NeuronDTO {
  return {
    id: neuron.id,
    coords: neuron.getCoords(),
    label: neuron.getLabel(),
    activationType: neuron.getActivationFn(),
    accumulatedSignal: neuron.getAccumulatedSignal(),
    inactivityCounter: neuron.getInactivityCounter(),
    inactivityThreshold: neuron.getInactivityThreshold(),
  };
}
