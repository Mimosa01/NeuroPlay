import { v4 as uuidv4 } from 'uuid';
import type { IElectricSynaps } from '../interfaces/IElectricSynaps.interface';
import type { NeuronInstance } from '../types/types';
import NeuronAccessor from '../core/neurons/NeuronAccessor';


export default class ElectricSynaps implements IElectricSynaps {
  public readonly id: string;
  public readonly source: NeuronInstance;
  public readonly target: NeuronInstance;

  private _conductance: number;
  private _baseConductance: number;

  constructor(
    source: NeuronInstance,
    target: NeuronInstance,
    conductance: number = 0.1
  ) {
    this.id = uuidv4();
    this.source = source;
    this.target = target;
    this._baseConductance = Math.max(0.01, Math.min(2.0, conductance));
    this._conductance = this._baseConductance;
  }

  getConductance() { return this._conductance; }
  setConductance(value: number) {
    this._baseConductance = Math.max(0.01, Math.min(2.0, value));
    this._conductance = this._baseConductance;
  }

  deliver() {

    const sourceV = new NeuronAccessor(this.source).getMembranePotential();
    const targetV = new NeuronAccessor(this.target).getMembranePotential();
    const deltaV = sourceV - targetV;
    const current = deltaV * this._conductance;

    if (current !== 0) {
      this.source.receiveElectricSignal(-current);
      this.target.receiveElectricSignal(current);
    }
  }

  applyConductanceMultiplier(multiplier: number) {
    this._conductance = this._baseConductance * multiplier;
  }

  resetConductance() {
    this._conductance = this._baseConductance;
  }
}