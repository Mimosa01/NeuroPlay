import type { ModulatorEffect } from "../types/modulator.types";
import type { Coords, NeuroModulatorType } from "../types/types";

export type ModulationCloudDTO = {
  readonly id: string;
  readonly type: NeuroModulatorType;
  readonly center: Coords;
  readonly radius: number;
  readonly modulator: ModulatorEffect;
}