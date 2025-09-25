import type { NeuronInstance } from "../../types/types";
import BaseSignal from "./BaseSignal";

export class Glycine extends BaseSignal {
  constructor(signal_mV: number) {
    super('glycine', signal_mV);
  }
  
  public applyTo(target: NeuronInstance): void {
    target.applySignal(this.signal_mV);
  }
}