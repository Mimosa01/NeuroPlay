import type { ChemicalSignalType } from "../../../../types/types";
import type { NeuronState } from "../NeuronState";

export class ReceptorManager {
  private state: NeuronState;

  constructor (state: NeuronState) {
    this.state = state;
  }

  public hasReceptor(receptor: ChemicalSignalType): boolean {
    return this.state.receptors.has(receptor);
  }

  public addReceptor(receptor: ChemicalSignalType): void {
    this.state.receptors.add(receptor);
  }

  public removeReceptor(receptor: ChemicalSignalType): void {
    this.state.receptors.delete(receptor);
  }
}