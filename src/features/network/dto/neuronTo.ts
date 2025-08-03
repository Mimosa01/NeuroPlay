import type Neuron from "../core/Neuron";
import type { NeuronDTO } from "./neuron.dto";

export function neuronToDTO(neuron: Neuron): NeuronDTO {
  return {
    id: neuron.id,
    coords: neuron.getCoords(),
    label: neuron.getLabel(),
    accumulatedSignal: neuron.getAccumulatedSignal(),
    inactivityCounter: neuron.getInactivityCounter(),
    inactivityThreshold: neuron.getInactivityThreshold(),
    readyToSend: neuron.getReadyToSend(),
    signalThreshold: neuron.getSignalTreshold(),
    refractoryThreshold: neuron.getRefractoryThreshold(),
    fading: neuron.getFading()
  };
}
