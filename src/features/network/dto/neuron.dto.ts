import type { Coords } from "../../../shared/types/types";
import type { IEdge } from "../interfaces/IEdge.interface";
import type { NeuroTransmitterType } from "../types/types";

export type NeuronDTO = {
  id: string;
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
};