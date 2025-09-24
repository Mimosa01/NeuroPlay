import type { Coords } from "../../../shared/types/types";
import type { NeuronId } from "../types/types";

export type NeuronDTO = {
  id: NeuronId;
  coords: Coords;
  label: string;
  
  membranePotential: number;
  spikeThreshold: number;
  spikeAmplitude: number;
  
  inactivityCounter: number;
  inactivityThreshold: number;
  
  refractoryDuration: number;

  decayFactor: number;
  readyToSend: boolean;
};