import type { NeuroTransmitterType } from "../types/types";
import type { INeuron } from "./INeuron.interface";

export interface ISignal {
  readonly id: string;
  readonly type: NeuroTransmitterType;
  
  applyTo (target: INeuron): void;
}