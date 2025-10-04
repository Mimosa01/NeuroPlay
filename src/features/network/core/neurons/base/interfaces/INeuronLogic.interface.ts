import type { ModulatorEffect } from "../../../../types/modulator.types";


export interface INeuronLogic {
  receive (signal_mV: number): void;
  fire (): void;
  step(): void;
  isDead (): boolean;

  applyModulationEffect(effect: ModulatorEffect): void;
  finalizeModulation(): void;
}