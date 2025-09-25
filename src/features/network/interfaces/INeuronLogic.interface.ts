import type { ModulationEffect } from "../types/types";
import type { IEdge } from "./IEdge.interface";

export interface INeuronLogic {
  receive (signal_mV: number): void;
  fire (): void;
  step(): void;
  isDead (): boolean;
  modulation (effect: ModulationEffect): void;
  applySignal (signal: number): void;

  addInputEdge (edge: IEdge): void;
  addOutputEdge (edge: IEdge): void;
  removeInputEdge (edgeId: string): void;
  removeOutputEdge (edgeId: string): void;
}