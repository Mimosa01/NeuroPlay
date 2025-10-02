import type { SynapsDTO } from "../dto/synaps.dto";
import type { ModulationCloudDTO } from "../dto/modulationCloud.dto";
import type { NeuronDTO } from "../dto/neuron.dto";
import type { INeuron } from "../interfaces/INeuron.interface";
import type { INeuronLogic } from "../interfaces/INeuronLogic.interface";
import type { NeuroModulatorType } from "./modulator.types";


export type SignalValue = number;
export type Timestamp = number;

export interface ISynapsState {
  id: string;
  from: string;
  to: string;
  weight: number;
}

export interface INeuronState {
  id: string;
}

export interface INeuronActions {
  addInputSynaps: (synaps: ISynapsState) => void;
  addOutputSynaps: (synaps: ISynapsState) => void;
  removeInputSynaps: (synapsId: string) => void;
  removeOutputSynaps: (synapsId: string) => void;
  receive: (signal: number) => void;
  tick: () => void;
  decay: (factor: number) => void;
  isDead: () => boolean;
}

export type NeuroTransmitterType = 'glutamate' | 'gaba' | 'glycine' ;
export type ChemicalSignalType = NeuroTransmitterType | NeuroModulatorType;
export type NeuronType = 'relay' | 'inhibitory' | 'rs' | 'fs' | 'ds';

export type NeuronInstance = INeuron & INeuronLogic;

export type Coords = {
  x: number;
  y: number;
}

export type NetworkSnapshot = {
  neurons: NeuronDTO[];
  synapses: SynapsDTO[];
  clouds: ModulationCloudDTO[];
};
