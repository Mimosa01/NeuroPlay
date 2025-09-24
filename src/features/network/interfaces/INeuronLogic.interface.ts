import type { IEdge } from "./IEdge.interface";

export interface INeuronLogic {
  receive (signal_mV: number): void;
  process (): void;
  fire (): void;
  decay (): void;
  isDead (): boolean;

  addInputEdge (edge: IEdge): void;
  addOutputEdge (edge: IEdge): void;
  removeInputEdge (edgeId: string): void;
  removeOutputEdge (edgeId: string): void;
}