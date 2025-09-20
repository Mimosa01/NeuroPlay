// dto/edge.dto.ts
import type { Coords } from "../../../shared/types/types";
import type { EdgeId, NeuronId } from "../types/types";

export type EdgeDTO = {
  id: EdgeId;
  sourceId: NeuronId;
  targetId: NeuronId;
  sourceCoords: Coords;
  targetCoords: Coords;
  
  // Биологические параметры
  conductance: number;        // микросименсы (μS)
  delay: number;             // шагов задержки
  
  // Для обратной совместимости (временно)
  weight?: number;           // старый параметр
};