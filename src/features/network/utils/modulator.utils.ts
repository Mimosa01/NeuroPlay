import { MODULATOR_NAMES } from "../constants/modulators.constants";
import type { ChemicalSignalType, NeuroModulatorType } from "../types/types";


export function isModulator(
  signal: ChemicalSignalType
): signal is NeuroModulatorType {
  return MODULATOR_NAMES.has(signal as any);
}