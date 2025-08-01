import type { Coords } from "../../../shared/types/types";

export type EdgeDTO = {
  id: string;
  sourceCoords: Coords;
  targetCoords: Coords;
  weight: number;
};