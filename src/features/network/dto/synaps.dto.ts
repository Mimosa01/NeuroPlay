import type { Coords } from "../types/types";

export type ChemicalSynapsDTO = {
  readonly id: string;
  readonly type: 'chemical' | 'electric';
  readonly sourceId: string;
  readonly targetId: string;
  readonly sourceCoords: Coords;
  readonly targetCoords: Coords;

  readonly conductance: number;        // микросименсы (μS)
  readonly delay: number;             // шагов задержки
};