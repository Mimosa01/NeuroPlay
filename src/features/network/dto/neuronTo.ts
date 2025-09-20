import type { INeuron } from "../interfaces/INeuron.interface";
import type { NeuronDTO } from "./neuron.dto";

export function neuronToDTO(neuron: INeuron): NeuronDTO {
  return {
    id: neuron.id,
    coords: neuron.getCoords(),
    label: neuron.getLabel(),
    
    // Новые параметры
    membranePotential: neuron.getMembranePotential(),
    spikeThreshold: neuron.getSpikeThreshold(),
    spikeAmplitude: neuron.getSpikeAmplitude(),
    
    // Счётчики
    inactivityCounter: neuron.getInactivityCounter(),
    inactivityThreshold: neuron.getInactivityThreshold(),
    
    // Рефрактерность
    refractoryDuration: neuron.getRefractoryDuration(),
    
    // Затухание
    decayFactor: neuron.getDecayFactor(),
    
    // Состояние
    readyToSend: neuron.getReadyToSend(),
    
    // Для обратной совместимости
    accumulatedSignal: neuron.getMembranePotential(), // временно
    signalThreshold: neuron.getSpikeThreshold(),     // временно
  };
}