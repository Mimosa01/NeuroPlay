import type { ChemicalSignalType } from "../types/types";

export const BASE_POSTSYNAPTIC_EFFECTS: Record<ChemicalSignalType, number> = {
  glutamate: 5.0,
  gaba: -4.0, 
  glycine: -5.0,
  dopamine: 0,
  serotonin: 0,
  acetylcholine: 0,
  norepinephrine: 0
};
