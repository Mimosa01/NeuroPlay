import type { Coords } from "../types";

export type EdgeDTO = {
  id: string;
  sourceId: string;
  targetId: string;
  sourceCoords: Coords;
  targetCoords: Coords;

  conductance: number;        // микросименсы (μS)
  delay: number;             // шагов задержки
};