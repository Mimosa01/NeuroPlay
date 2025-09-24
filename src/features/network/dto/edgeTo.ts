import NeuronAccessor from "../core/neurons/NeuronAccessor";
import type { IEdge } from "../interfaces/IEdge.interface";
import type { EdgeDTO } from "./edge.dto";

export function edgeToDTO(edge: IEdge): EdgeDTO {
  return {
    id: edge.id,
    sourceId: edge.source.id,
    targetId: edge.target.id,
    sourceCoords: new NeuronAccessor(edge.source).getCoords(),
    targetCoords: new NeuronAccessor(edge.target).getCoords(),
    
    conductance: edge.getConductance(),
    delay: edge.getDelay(),
  };
}