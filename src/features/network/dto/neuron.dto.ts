import type { Coords, ChemicalSignalType, NeuronMode } from "../types/types";

export type NeuronDTO = {
  id: string;
  coords: Coords;
  label: string;
  mode: NeuronMode;
  
  neuroTransmitter: ChemicalSignalType;
  membranePotential: number;
  restingPotential: number; 
  spikeThreshold: number;
  tau: number;
  receptors: ChemicalSignalType[];
  
  refractoryDuration: number;
  inactivityCounter: number;
  inactivityThreshold: number;

  // readonly readyToSend: boolean;
};