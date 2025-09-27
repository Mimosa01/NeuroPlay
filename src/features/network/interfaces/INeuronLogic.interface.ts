import type { ModulationEffect, NeuroTransmitterType } from "../types";
import type { IEdge } from "./IEdge.interface";

export interface INeuronLogic {
  receive (signal_mV: number): void;
  fire (): void;
  step(): void;
  isDead (): boolean;
  modulation (effect: ModulationEffect): void;

  addInputEdge (edge: IEdge): void;
  addOutputEdge (edge: IEdge): void;
  removeInputEdge (edgeId: string): void;
  removeOutputEdge (edgeId: string): void;

  addReceptor (type: NeuroTransmitterType): void;
  hasReceptor (transmitter: NeuroTransmitterType): boolean;
  removeReceptor (type: NeuroTransmitterType): void; 
}