import type { Coords } from '../../types';
import BaseNeuron from './BaseNeuron';

export default class PyramidalNeuron extends BaseNeuron {
  private static readonly ADAPTATION_DELTA = 3.0;
  private static readonly ADAPTATION_DURATION = 50;

  private adaptationCounter: number = 0;

  constructor(coords: Coords) {
    super(coords);
    this.membranePotential = -70;
    this.spikeThreshold = -55;
  }

  public checkForSpike(): void {
    if (this.adaptationCounter > 0) {
      this.adaptationCounter--;
      if (this.adaptationCounter === 0) {
        this.spikeThreshold = -55;
      }
    }

    const effectiveThreshold = this.adaptationCounter > 0 
      ? this.spikeThreshold 
      : -55;

    if (!this.isRefractory() && this.membranePotential >= effectiveThreshold) {
      console.log(`${this.id} - ${this.membranePotential}`)
      this.fire();
    }
  }

  public fire(): void {
    for (const edge of this.outputEdges.values()) {
      edge.transmit();
    }

    this.refractorySteps = this.refractoryDuration;
    this.membranePotential = -75;

    this.spikeThreshold = -55 + PyramidalNeuron.ADAPTATION_DELTA;
    this.adaptationCounter = PyramidalNeuron.ADAPTATION_DURATION;
  }
}