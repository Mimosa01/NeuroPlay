import type { ModulatorEffect } from "../types/modulator.types";
import type { NeuroTransmitterType, NeuronInstance } from "../types/types";

export interface ISignal {
  readonly id: string;
  readonly type: NeuroTransmitterType;
  readonly effect: ModulatorEffect
  
  applyTo (target: NeuronInstance): void;
}