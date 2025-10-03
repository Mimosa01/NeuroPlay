import type { Coords, ChemicalSignalType } from "../types/types";
import type { IElectricSynaps } from "./IElectricSynaps.interface";
import type { IChemicalSynaps } from "./ISynaps.interface";

export interface INeuron {
  readonly id: string;
  inputSynapses: Map<string, IChemicalSynaps>;
  outputSynapses: Map<string, IChemicalSynaps>;
  inputElectricSynapses: Map<string, IElectricSynaps>;
  outputElectricSynapses: Map<string, IElectricSynaps>;
  
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
}
