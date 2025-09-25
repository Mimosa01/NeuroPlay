import type { Coords } from '../../../../shared/types/types';
import BaseNeuron from './BaseNeuron';


export default class PyramidalNeuron extends BaseNeuron {
  constructor (coords: Coords) {
    super(coords);
    this.membranePotential = -70;
    this.spikeThreshold = -55;
  }

  // === Логика ===

  public checkForSpike(): void {
    if (!this.isRefractory() && this.membranePotential >= this.spikeThreshold) {
      this.fire();
    }
  }
}