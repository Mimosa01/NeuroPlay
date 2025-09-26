import type { NeuronInstance } from "../types";

export interface IEdge {
  readonly id: string;
  readonly source: NeuronInstance;
  readonly target: NeuronInstance;

  getDelay (): number;
  getConductance (): number;

  setDelay (delay: number): void;
  setConductance (conductance: number): void;

  getPendingSignalsCount (): number;
  getPendingSignals (): Array<{delay: number}>;
  
  transmit (): void;
  deliverSignals (): void;
}