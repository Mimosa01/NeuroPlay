import type { IEdge } from "../interfaces/IEdge.interface";
import type { EdgeDTO } from "./edge.dto";

export function edgeToDTO(edge: IEdge): EdgeDTO {
  return {
    id: edge.id,
    sourceId: edge.source.id,
    targetId: edge.target.id,
    sourceCoords: edge.source.getCoords(),
    targetCoords: edge.target.getCoords(),
    
    conductance: edge.getConductance(),
    delay: edge.getDelay(),
  };
}