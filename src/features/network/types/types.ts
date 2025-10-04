import type { ChemicalSynapsDTO } from "../dto/synaps.dto";
import type { ModulationCloudDTO } from "../dto/modulationCloud.dto";
import type { NeuronDTO } from "../dto/neuron.dto";
import type { INeuron } from "../core/neurons/base/interfaces/INeuron.interface";
import type { INeuronLogic } from "../core/neurons/base/interfaces/INeuronLogic.interface";
import type { ElectricSynapsDTO } from "../dto/electricSynaps.dto";
import type { IElectricSynaps } from "../interfaces/IElectricSynaps.interface";
import type { IChemicalSynaps } from "../interfaces/ISynaps.interface";


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
export type NeuroModulatorType = 'acetylcholine' | 'dopamine' | 'serotonin' | 'norepinephrine';
export type ChemicalSignalType = NeuroTransmitterType | NeuroModulatorType;
export type NeuronType = 'relay';
export type SynapseType = 'chemical' | 'electric';

export type NeuronInstance = INeuron & INeuronLogic;

export type Coords = {
  x: number;
  y: number;
}

export type NetworkSnapshot = {
  neurons: NeuronDTO[];
  synapses: ChemicalSynapsDTO[];
  electricSynapses: ElectricSynapsDTO[];
  clouds: ModulationCloudDTO[];
};

export type AnySynaps = { synaps: IChemicalSynaps; type: 'chemical' } | { synaps: IElectricSynaps; type: 'electric' };