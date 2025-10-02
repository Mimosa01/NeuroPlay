import type { ModulatorEffect, NeuroModulatorType } from "../types/modulator.types";
import type { Coords } from "../types/types";

export type ModulationCloudDTO = {
  readonly id: string;
  readonly type: NeuroModulatorType;
  readonly center: Coords;
  readonly raius: number;
  readonly modulator: ModulatorEffect;
}