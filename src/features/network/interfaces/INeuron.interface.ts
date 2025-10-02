import type { Coords, ChemicalSignalType } from "../types/types";
import type { ISynaps } from "./ISynaps.interface";

export interface INeuron {
  readonly id: string;
  inputSynapses: Map<string, ISynaps>;
  outputSynapses: Map<string, ISynaps>;
  
  neuroTransmitter: ChemicalSignalType;
  membranePotential: number;
  restingPotential: number; 
  spikeThreshold: number;
  tau: number;
  
  refractoryDuration: number;
  inactivityCounter: number;
  inactivityThreshold: number;
  receptors: Set<ChemicalSignalType>;

  coords: Coords;
  label: string;

  readyToSend: boolean;

  currentThresholdShift: number;
  currentTauMultiplier: number;
  // currentConductanceMultiplier: number;
}
