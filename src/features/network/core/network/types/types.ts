import type { Coords } from "../../../../../shared/types/types";

export type NeuronSnapshot = {
  id: string;
  coords: Coords;
  label: string;
  membranePotential: number;
  spikeThreshold: number;
  spikeAmplitude: number;
  inactivityCounter: number;
  inactivityThreshold: number;
  readyToSend: boolean;
  refractoryDuration: number;
  decayFactor: number;
};

export type EdgeSnapshot = {
  id: string;
  sourceId: string;
  targetId: string;
  sourceCoords: Coords;
  targetCoords: Coords;
  conductance: number;
  delay: number;
};

export type NetworkSnapshot = {
  neurons: NeuronSnapshot[];
  edges: EdgeSnapshot[];
};