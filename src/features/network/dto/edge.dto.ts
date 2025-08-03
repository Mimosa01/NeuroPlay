import type { Coords } from "../../../shared/types/types";
import type { EdgeId, NeuronId } from "../types/types";

export type EdgeDTO = {
  id: EdgeId;
  sourceId: NeuronId;
  targetId: NeuronId;
  sourceCoords: Coords;
  targetCoords: Coords;
  weight: number;
};