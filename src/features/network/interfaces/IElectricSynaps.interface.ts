import type { NeuronInstance } from "../types/types";


export interface IElectricSynaps {
  readonly id: string;
  readonly source: NeuronInstance;
  readonly target: NeuronInstance;

  getConductance(): number;
  setConductance(conductance: number): void;

  deliver(): void; // вызывается каждый шаг

  applyConductanceMultiplier(multiplier: number): void;
  resetConductance(): void;
}