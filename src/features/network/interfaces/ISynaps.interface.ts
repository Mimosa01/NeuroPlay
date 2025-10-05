import type { INeuron } from "../core/neurons/base/interfaces/INeuron.interface";

export interface IChemicalSynaps {
  readonly id: string;
  readonly source: INeuron;
  readonly target: INeuron;

  getDelay (): number;
  getConductance (): number;

  setDelay (delay: number): void;
  setConductance (conductance: number): void;

  getPendingSignalsCount (): number;
  getPendingSignals (): Array<{delay: number}>;
  
  transmit (): void;
  transmitGraded(inputSignal: number): void;
  deliverSignals (): void;

  resetConductance(): void;
  applyConductanceMultiplier(multiplier: number): void;
}