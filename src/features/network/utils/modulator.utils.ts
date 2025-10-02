import { MODULATOR_NAMES } from "../constants/modulators.constants";
import type { NeuroModulatorType } from "../types/modulator.types";
import type { ChemicalSignalType } from "../types/types";


export function isModulator(
  signal: ChemicalSignalType
): signal is NeuroModulatorType {
  return MODULATOR_NAMES.has(signal as any);
}