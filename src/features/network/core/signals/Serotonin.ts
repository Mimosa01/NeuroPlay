import { SEROTONIN } from "../../../../shared/constants/signals.constants";
import type { ModulationEffect, NeuronInstance } from "../../types/types";
import BaseSignal from "./BaseSignal";

export class Serotonine extends BaseSignal {
  public readonly effect: ModulationEffect;

  constructor() {
    super('serotonin', 0);
    this.effect = SEROTONIN;
  }

  public applyTo(target: NeuronInstance): void {
    target.modulation(this.effect);
  }
}