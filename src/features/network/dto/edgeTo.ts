import type Edge from "../core/Edge";
import type { EdgeDTO } from "./edge.dto";

export function edgeToDTO(edge: Edge): EdgeDTO {
  return {
    id: edge.id,
    sourceId: edge.source.id,
    targetId: edge.target.id,
    sourceCoords: edge.source.getCoords(),
    targetCoords: edge.target.getCoords(),
    weight: edge.getWeight(),
  };
}