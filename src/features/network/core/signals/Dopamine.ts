import { DOPAMINE } from "../../../../shared/constants/signals.constants";
import type { ModulationEffect, NeuronInstance } from "../../types/types";
import BaseSignal from "./BaseSignal";

export class Dopamine extends BaseSignal {
  public readonly effect: ModulationEffect;

  constructor() {
    super('dopamine', 0);
    this.effect = DOPAMINE;
  }

  public applyTo(target: NeuronInstance): void {
    target.modulation(this.effect);
  }
}