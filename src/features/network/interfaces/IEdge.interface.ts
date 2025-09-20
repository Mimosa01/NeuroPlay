import type { INeuron } from "./INeuron.interface";

export interface IEdge {
  readonly id: string;
  readonly source: INeuron;
  readonly target: INeuron;

  getDelay (): number;
  getConductance (): number;

  setDelay (delay: number): void;
  setConductance (conductance: number): void;

  transmit (signal_mV: number): void;
  deliverSignals (): void;

  getPendingSignalsCount (): number;
  getPendingSignals (): Array<{signal_mV: number, delay: number}>;
}