import { ACETYLHOLINE } from "../../params/defaultParams";
import type { ModulationEffect, NeuronInstance } from "../../types/types";
import BaseSignal from "./BaseSignal";

export class Acetylholine extends BaseSignal {
  public readonly effect: ModulationEffect;

  constructor() {
    super('acetylcholine', 0);
    this.effect = ACETYLHOLINE;
  }

  public applyTo(target: NeuronInstance): void {
    target.modulation(this.effect);
  }
}