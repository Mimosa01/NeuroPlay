import type { NeuroTransmitterType, ModulationEffect, NeuronInstance } from "../types";

export interface ISignal {
  readonly id: string;
  readonly type: NeuroTransmitterType;
  readonly effect: ModulationEffect;
  
  applyTo (target: NeuronInstance): void;
}