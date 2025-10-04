import type { Coords, ChemicalSignalType } from "../types/types";

export type NeuronDTO = {
  readonly id: string;
  readonly coords: Coords;
  readonly label: string;
  
  readonly neuroTransmitter: ChemicalSignalType;
  readonly membranePotential: number;
  readonly restingPotential: number; 
  readonly spikeThreshold: number;
  readonly tau: number;
  readonly receptors: ChemicalSignalType[];
  
  readonly refractoryDuration: number;
  readonly inactivityCounter: number;
  readonly inactivityThreshold: number;

  // readonly readyToSend: boolean;
};