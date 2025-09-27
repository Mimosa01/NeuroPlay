import type { IEdge } from "../interfaces/IEdge.interface";
import type { NeuroTransmitterType, Coords } from "../types";

export type NeuronDTO = {
  id: string;
  inputEdges: Map<string, IEdge>;
  outputEdges: Map<string, IEdge>;
  
  neuroTransmitter: NeuroTransmitterType;
  membranePotential: number;
  restingPotential: number; 
  spikeThreshold: number;
  tau: number;
  receptors: Set<NeuroTransmitterType>;
  
  refractoryDuration: number;
  inactivityCounter: number;
  inactivityThreshold: number;

  coords: Coords;
  label: string;

  readyToSend: boolean;
};