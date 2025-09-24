import type NeuronAccessor from "../core/neurons/NeuronAccessor";
import type { NeuronDTO } from "./neuron.dto";


export function neuronToDTO(accessor: NeuronAccessor): NeuronDTO {
  return {
    id: accessor.getId(),
    coords: accessor.getCoords(),
    label: accessor.getLabel(),
    
    membranePotential: accessor.getMembranePotential(),
    spikeThreshold: accessor.getSpikeThreshold(),
    spikeAmplitude: accessor.getSpikeAmplitude(),
    
    inactivityCounter: accessor.getInactivityCounter(),
    inactivityThreshold: accessor.getInactivityThreshold(),
    
    refractoryDuration: accessor.getRefractoryDuration(),
    
    decayFactor: accessor.getDecayFactor(),
    readyToSend: accessor.getReadyToSend(),
  };
}