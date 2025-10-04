import type { IElectricSynaps } from "../../interfaces/IElectricSynaps.interface";
import type { IChemicalSynaps } from "../../interfaces/ISynaps.interface";

export class SynapseRegistry {
  private chemicalSynapses: Map<string, IChemicalSynaps> = new Map();
  private electricSynapses: Map<string, IElectricSynaps> = new Map();

  public addChemical(synaps: IChemicalSynaps): void {
    this.chemicalSynapses.set(synaps.id, synaps);
  }

  public addElectric(synaps: IElectricSynaps): void {
    this.electricSynapses.set(synaps.id, synaps);
  }

  public remove(id: string): void {
    this.chemicalSynapses.delete(id);
    this.electricSynapses.delete(id);
  }

  public getChemical(id: string): IChemicalSynaps | undefined {
    return this.chemicalSynapses.get(id);
  }

  public getElectric(id: string): IElectricSynaps | undefined {
    return this.electricSynapses.get(id);
  }

  public getAllChemical(): Map<string, IChemicalSynaps> {
    return this.chemicalSynapses;
  }

  public getAllElectric(): Map<string, IElectricSynaps> {
    return this.electricSynapses;
  }

  public clear(): void {
    this.chemicalSynapses.clear();
    this.electricSynapses.clear();
  }
}