import type { NeuronState } from "../NeuronState";


export class ElectricSignalManager {
  private state: NeuronState;

  constructor(state: NeuronState) {
    this.state = state;
  }

  public update(): void {
    // можно добавить логику, если нужно
  }

  public receive(current: number): void {
    this.state.membranePotential += current;
  }
}