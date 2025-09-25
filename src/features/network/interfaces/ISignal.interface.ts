import type { ModulationEffect, NeuronInstance, NeuroTransmitterType } from "../types/types";


export interface ISignal {
  readonly id: string;
  readonly type: NeuroTransmitterType;
  readonly effect: ModulationEffect;
  
  applyTo (target: NeuronInstance): void;
}