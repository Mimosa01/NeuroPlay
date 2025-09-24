import type { NeuronInstance } from "../types/types";

export interface IEdge {
  readonly id: string;
  readonly source: NeuronInstance;
  readonly target: NeuronInstance;

  getDelay (): number;
  getConductance (): number;

  setDelay (delay: number): void;
  setConductance (conductance: number): void;

  getPendingSignalsCount (): number;
  getPendingSignals (): Array<{signal_mV: number, delay: number}>;
  
  transmit (signal_mV: number): void;
  deliverSignals (): void;
}