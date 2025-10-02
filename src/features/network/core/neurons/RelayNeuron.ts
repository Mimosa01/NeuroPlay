import type { Coords } from '../../types/types';
import { isModulator } from '../../utils/modulator.utils';
import { eventBus } from '../EventBus';
import BaseNeuron from './BaseNeuron';

export default class RelayNeuron extends BaseNeuron {
  
  constructor(coords: Coords) {
    super(coords);
    this.membranePotential = -70;
    this.spikeThreshold = -55;
  }

  public checkForSpike(): void {
    if (!this.isRefractory() && this.membranePotential >= this.spikeThreshold) {
      console.log(`${this.id} - ${this.membranePotential}`);
      this.fire();
    }
  }

  public fire(): void {
    eventBus.publish('neuron.spike', { neuronId: this.id });

    if (isModulator(this.neuroTransmitter)) {
      eventBus.publish('modulation.cloud.spawn', {
        neuronId: this.id,
        modulator: this.neuroTransmitter,
        coords: this.coords,
      });
    }

    this.refractorySteps = this.refractoryDuration;
    this.membranePotential = -75;

    this.adaptationThresholdShift = this.adaptationDelta;
    this.adaptationCounter = this.adaptationDuration;
  }
}