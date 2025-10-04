import type { INeuron } from "../core/neurons/base/interfaces/INeuron.interface";


export interface IElectricSynaps {
  readonly id: string;
  readonly source: INeuron;
  readonly target: INeuron;

  getConductance(): number;
  setConductance(conductance: number): void;

  deliver(): void;

  applyConductanceMultiplier(multiplier: number): void;
  resetConductance(): void;
}