import type { NeuroTransmitterType, Coords } from "../types";
import type { IEdge } from "./IEdge.interface";

export interface INeuron {
  readonly id: string;
  inputEdges: Map<string, IEdge>;
  outputEdges: Map<string, IEdge>;
  
  neuroTransmitter: NeuroTransmitterType;
  membranePotential: number;
  restingPotential: number; 
  spikeThreshold: number;
  tau: number;
  
  refractoryDuration: number;
  inactivityCounter: number;
  inactivityThreshold: number;

  coords: Coords;
  label: string;

  readyToSend: boolean;
}
