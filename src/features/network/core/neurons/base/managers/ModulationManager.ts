import type { ModulatorEffect } from "../../../../types/modulator.types";
import type { NeuronState } from "../NeuronState";


export class ModulationManager {
  private state: NeuronState;

  constructor(state: NeuronState) {
    this.state = state;
  }

  public applyEffect(effect: ModulatorEffect): void {
    if (effect.thresholdShift !== undefined) {
      this.state.currentThresholdShift += effect.thresholdShift;
    }
    if (effect.tauMultiplier !== undefined) {
      this.state.currentTauMultiplier *= effect.tauMultiplier;
    }
  }

  public finalize(): void {
    this.state.spikeThreshold = this.state.baseSpikeThreshold + this.state.currentThresholdShift + this.state.adaptationThresholdShift;
    this.state.tau = this.state.baseTau * this.state.currentTauMultiplier;

    this.state.currentThresholdShift = 0;
    this.state.currentTauMultiplier = 1;
  }
}