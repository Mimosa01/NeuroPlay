import type { NeuronState } from "../NeuronState";


export class RefractoryManager {
  private state: NeuronState;

  constructor(state: NeuronState) {
    this.state = state;
  }

  public update(): void {
    if (this.state.refractorySteps > 0) {
      this.state.refractorySteps--;
    }
  }

  public isRefractory(): boolean {
    return this.state.refractorySteps > 0;
  }

  public start(): void {
    this.state.refractorySteps = this.state.refractoryDuration;
  }
}