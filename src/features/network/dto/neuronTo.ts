import type NeuronAccessor from "../core/neurons/NeuronAccessor";
import type { NeuronDTO } from "./neuron.dto";


export function neuronToDTO(accessor: NeuronAccessor): NeuronDTO {
  return {
    id: accessor.getId(),
    coords: accessor.getCoords(),
    label: accessor.getLabel(),
    readyToSend: accessor.getReadyToSend(),

    inputEdges: accessor.getInputEdges(),
    outputEdges: accessor.getOutputEdges(),
    
    neuroTransmitter: accessor.getNeuroTransmitter(),
    membranePotential: accessor.getMembranePotential(),
    restingPotential: accessor.getRestingPotential(), 
    spikeThreshold: accessor.getSpikeThreshold(),
    tau: accessor.getTau(),
    
    refractoryDuration: accessor.getRefractoryDuration(),
    inactivityCounter: accessor.getInactivityCounter(),
    inactivityThreshold: accessor.getInactivityThreshold(),
  };
}