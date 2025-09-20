export type NeuronId = string;
export type EdgeId = string;
export type SignalValue = number;
export type Timestamp = number;

export interface IEdgeState {
  id: EdgeId;
  from: NeuronId;
  to: NeuronId;
  weight: number;
}

export interface INeuronState {
  id: NeuronId;
}

export interface INeuronActions {
  addInputEdge: (edge: IEdgeState) => void;
  addOutputEdge: (edge: IEdgeState) => void;
  removeInputEdge: (edgeId: EdgeId) => void;
  removeOutputEdge: (edgeId: EdgeId) => void;
  receive: (signal: number) => void;
  tick: () => void;
  decay: (factor: number) => void;
  isDead: () => boolean;
}

export type NeuroTransmitterType = 'glutamate' | 'gaba' | 'acetylcholine' | 'dopamine' | 'serotonin' | 'glycine';
export type NeuronType = 'pyramidal' | 'inhibitory' | 'rs' | 'fs' | 'ds';