import type { NeuronInstance } from '../../types/types';
import type { Coords } from '../../../../shared/types/types';
import BaseNeuron from './BaseNeuron';


export default class PyramidalNeuron extends BaseNeuron implements NeuronInstance {

  constructor (coords: Coords) {
    super(coords);
    console.log(`[Neuron ${this.id}] Создан (0 мВ)`);
  }

  // === Логика ===

  public receive(signal_mV: number): void {
    if (!this.isRefractory()) {
      this.membranePotential += signal_mV;
      if (signal_mV > 0) this.inactivityCounter = 0;
    }
  }

  public process(): void {
    if (!this.isRefractory()) {
      if (this.membranePotential >= this.spikeThreshold) {
        this.readyToSend = true;
        return;
      }
    }
  }

  public fire(): void {
    if (!this.readyToSend) return;

    console.log(`[Neuron ${this.id}] Спайк! ${this.spikeAmplitude} мВ по ${this.outputEdges.size} ребрам`);

    for (const edge of this.outputEdges.values()) {
      edge.transmit(this.spikeAmplitude);
    }

    this.membranePotential = -75;
    this.readyToSend = false;
    this.refractory = true;
  }

  public decay(): void {
    // Обычное затухание
    const difference = this.membranePotential - this.restingPotential;
    if (Math.abs(difference) > 0.1) {
      this.membranePotential = this.restingPotential + (difference * this.decayFactor);
    } else {
      this.membranePotential = this.restingPotential;
    }

    // Счётчик бездействия
    if (Math.abs(difference) < 0.1) {
      this.inactivityCounter++;
    } else {
      this.inactivityCounter = 0;
    }
  }
}