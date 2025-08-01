import type { Coords } from "../../../shared/types/types";

export type NeuronDTO = {
  id: string;
  coords: Coords;
  label: string;
  activationType: string;
  accumulatedSignal: number;
  inactivityCounter: number;
  readonly inactivityThreshold: number;
};
