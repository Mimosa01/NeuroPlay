import type NeuronAccessor from "../neurons/NeuronAccessor";
import BaseSignal from "./BaseSignal";


export class Glutamate extends BaseSignal {
  constructor(signal_mV: number) {
    super('glutamate', signal_mV);
  }

  public applyTo(target: NeuronAccessor): void {
    target.setMembranePotential(
      target.getMembranePotential() + this.signal_mV
    );
    target.setInactivityCounter(0);
    console.log(`[GlutamateSignal] Применён к ${target.getId()}: +${this.signal_mV.toFixed(1)} мВ`);
  }
}