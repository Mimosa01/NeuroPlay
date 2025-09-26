import type { EdgeDTO } from "../dto/edge.dto";
import type { NeuronDTO } from "../dto/neuron.dto";
import type { INeuron } from "../interfaces/INeuron.interface";
import type { INeuronLogic } from "../interfaces/INeuronLogic.interface";

export type SignalValue = number;
export type Timestamp = number;

export interface IEdgeState {
  id: string;
  from: string;
  to: string;
  weight: number;
}

export interface INeuronState {
  id: string;
}

export interface INeuronActions {
  addInputEdge: (edge: IEdgeState) => void;
  addOutputEdge: (edge: IEdgeState) => void;
  removeInputEdge: (edgeId: string) => void;
  removeOutputEdge: (edgeId: string) => void;
  receive: (signal: number) => void;
  tick: () => void;
  decay: (factor: number) => void;
  isDead: () => boolean;
}

export type NeuroTransmitterType = 'glutamate' | 'gaba' | 'acetylcholine' | 'dopamine' | 'serotonin' | 'glycine' | 'norepinephrine';
export type NeuronType = 'pyramidal' | 'inhibitory' | 'rs' | 'fs' | 'ds';

export type NeuronInstance = INeuron & INeuronLogic;

export interface ModulationEffect {
  thresholdDelta?: number;
  tauDelta?: number;
  duration: number;
}

export type Coords = {
  x: number;
  y: number;
}

export type NetworkSnapshot = {
  neurons: NeuronDTO[];
  edges: EdgeDTO[];
};