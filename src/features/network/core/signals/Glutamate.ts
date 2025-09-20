import type { INeuron } from "../../interfaces/INeuron.interface";
import BaseSignal from "./BaseSignal";


export class Glutamate extends BaseSignal {
  private baseEffect: number = 5.0;

  constructor(signal_mV: number) {
    super('glutamate', signal_mV);
  }

  public applyTo(target: INeuron): void {
    target.setMembranePotential(target.getMembranePotential() + this.signal_mV + this.baseEffect);
    target.setInactivityCounter(0);

    console.log(`[GlutamateSignal] Применён к ${target.id}: +${this.signal_mV} мВ`);
  }
}