import { NOREPINEPHRINE } from "../../params/defaultParams";
import type { ModulationEffect, NeuronInstance } from "../../types/types";
import BaseSignal from "./BaseSignal";

export class Norepinephrine extends BaseSignal {
  public readonly effect: ModulationEffect;

  constructor() {
    super('norepinephrine', 0);
    this.effect = NOREPINEPHRINE;
  }

  public applyTo(target: NeuronInstance): void {
    target.modulation(this.effect);
  }
}