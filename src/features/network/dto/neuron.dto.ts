import type { ISynaps } from "../interfaces/ISynaps.interface";
import type { Coords, ChemicalSignalType } from "../types/types";

export type NeuronDTO = {
  id: string;
  inputSynapses: Map<string, ISynaps>;
  outputSynapses: Map<string, ISynaps>;
  
  neuroTransmitter: ChemicalSignalType;
  membranePotential: number;
  restingPotential: number; 
  spikeThreshold: number;
  tau: number;
  receptors: Set<ChemicalSignalType>;
  
  refractoryDuration: number;
  inactivityCounter: number;
  inactivityThreshold: number;

  coords: Coords;
  label: string;

  readyToSend: boolean;
};