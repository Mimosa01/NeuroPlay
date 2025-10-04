import type { Coords } from "../types/types";

export type ElectricSynapsDTO = {
  readonly id: string;
  readonly type: 'chemical' | 'electric';
  readonly sourceId: string;
  readonly targetId: string;
  readonly sourceCoords: Coords;
  readonly targetCoords: Coords;

  readonly conductance: number;
};