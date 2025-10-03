import type { Coords } from "../types/types";

export type ElectricSynapsDTO = {
  id: string;
  sourceId: string;
  targetId: string;
  sourceCoords: Coords;
  targetCoords: Coords;

  conductance: number;
};