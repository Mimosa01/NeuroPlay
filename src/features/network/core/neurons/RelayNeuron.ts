import type { Coords } from "../../types/types";
import { isModulator } from "../../utils/modulator.utils";
import { eventBus } from "../EventBus";
import BaseNeuron from "./base/BaseNeuron";

export default class RelayNeuron extends BaseNeuron {
  
  constructor(coords: Coords) {
    super(coords);
    this.state.membranePotential = -70;
    this.state.spikeThreshold = -55;
  }

  public checkForSpike(): void {
    if (!this.isRefractory() && this.state.membranePotential >= this.state.spikeThreshold) {
      this.fire();
    }
  }

  public fire(): void {
    eventBus.publish('neuron.spike', { neuronId: this.id });

    if (isModulator(this.state.neuroTransmitter)) {
      eventBus.publish('modulation.cloud.spawn', {
        neuronId: this.id,
        modulator: this.state.neuroTransmitter,
        coords: this.coords,
      });
    }

    // === Используем менеджеры ===
    this.refractory.start();
    this.state.membranePotential = -75;
    this.adaptation.start();
  }
}