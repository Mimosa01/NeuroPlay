import type NeuronAccessor from "../core/neurons/base/NeuronAccessor";
import type { NeuronDTO } from "./neuron.dto";


export function neuronToDTO(accessor: NeuronAccessor): NeuronDTO {
  return {
  id: accessor.getId(),
  coords: accessor.getCoords(),
  label: accessor.getLabel(),
  membranePotential: accessor.getMembranePotential(),
  spikeThreshold: accessor.getSpikeThreshold(),
  restingPotential: accessor.getRestingPotential(),
  tau: accessor.getTau(),
  neuroTransmitter: accessor.getNeuroTransmitter(),
  receptors: Array.from(accessor.getReceptors()),
  inactivityCounter: accessor.getInactivityCounter(),
  inactivityThreshold: accessor.getInactivityThreshold(),
  refractoryDuration: accessor.getRefractoryDuration()
};
}