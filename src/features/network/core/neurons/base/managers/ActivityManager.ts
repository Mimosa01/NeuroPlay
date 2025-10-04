import type { NeuronState } from "../NeuronState";


export class ActivityManager {
  private state: NeuronState;

  constructor(state: NeuronState) {
    this.state = state;
  }

  public update(): void {
    const diff = this.state.membranePotential - this.state.restingPotential;
    if (Math.abs(diff) < 0.1) {
      this.state.inactivityCounter++;
    } else {
      this.state.inactivityCounter = 0;
    }
  }

  public onSignalReceived(): void {
    this.state.inactivityCounter = 0;
  }

  public isDead(): boolean {
    return this.state.inactivityCounter >= this.state.inactivityThreshold;
  }
}