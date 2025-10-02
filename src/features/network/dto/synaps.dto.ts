import type { Coords } from "../types/types";

export type SynapsDTO = {
  id: string;
  sourceId: string;
  targetId: string;
  sourceCoords: Coords;
  targetCoords: Coords;

  conductance: number;        // микросименсы (μS)
  delay: number;             // шагов задержки
};