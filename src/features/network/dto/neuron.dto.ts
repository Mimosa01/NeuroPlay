import type { Coords } from "../../../shared/types/types";
import type { NeuronId } from "../types/types";

export type NeuronDTO = {
  id: NeuronId;
  coords: Coords;
  label: string;
  accumulatedSignal: number;
  inactivityCounter: number;
  inactivityThreshold: number;
  readyToSend: boolean;
  signalThreshold: number;
  refractoryThreshold: number;
  fading: number;
};
