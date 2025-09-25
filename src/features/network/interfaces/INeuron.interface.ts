import type { Coords } from "../../../shared/types/types";
import type { NeuroTransmitterType } from "../types/types";
import type { IEdge } from "./IEdge.interface";

export interface INeuron {
  readonly id: string;
  inputEdges: Map<string, IEdge>;
  outputEdges: Map<string, IEdge>;
  
  neuroTransmitter: NeuroTransmitterType;
  membranePotential: number;
  restingPotential: number; 
  spikeThreshold: number;
  spikeAmplitude: number;
  
  refractoryDuration: number;
  inactivityCounter: number;
  inactivityThreshold: number;

  coords: Coords;
  label: string;

  readyToSend: boolean;
}
