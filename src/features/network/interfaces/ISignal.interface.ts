import type NeuronAccessor from "../core/neurons/NeuronAccessor";
import type { NeuroTransmitterType } from "../types/types";


export interface ISignal {
  readonly id: string;
  readonly type: NeuroTransmitterType;
  
  applyTo (target: NeuronAccessor): void;
}