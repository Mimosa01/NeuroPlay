import type { NeuronState } from "../NeuronState";


export class AdaptationManager {
  private state: NeuronState;

  constructor(state: NeuronState) {
    this.state = state;
  }

  public update(): void {
    if (this.state.adaptationCounter > 0) {
      this.state.adaptationCounter--;
      if (this.state.adaptationCounter === 0) {
        this.state.adaptationThresholdShift = 0;
      }
    }
  }

  public start(): void {
    this.state.adaptationThresholdShift = this.state.adaptationDelta;
    this.state.adaptationCounter = this.state.adaptationDuration;
  }
}