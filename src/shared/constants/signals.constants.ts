import type { NeuroTransmitterType } from "../../features/network/types/types";

export const DOPAMINE = { thresholdDelta: -2.0, tauDelta: 5, duration: 100 };
export const SEROTONIN = { thresholdDelta: 2.0, tauDelta: -5, duration: 150 };
export const ACETYLHOLINE = { thresholdDelta: -3.0, tauDelta: 8, duration: 80 };
export const NOREPINEPHRINE = { thresholdDelta: -2.5, tauDelta: 5, duration: 120 };

export const BASE_MODULATOR = DOPAMINE;

export const BASE_POSTSYNAPTIC_EFFECTS: Record<NeuroTransmitterType, number> = {
  glutamate: 5.0,
  gaba: -4.0, 
  glycine: -5.0,
  dopamine: 0,
  serotonin: 0,
  acetylcholine: 0,
  norepinephrine: 0
};