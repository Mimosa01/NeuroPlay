import NeuronAccessor from "../core/neurons/NeuronAccessor";
import type { ISynaps } from "../interfaces/ISynaps.interface";
import type { SynapsDTO } from "./synaps.dto";

export function synapsToDTO(synaps: ISynaps): SynapsDTO {
  return {
    id: synaps.id,
    sourceId: synaps.source.id,
    targetId: synaps.target.id,
    sourceCoords: new NeuronAccessor(synaps.source).getCoords(),
    targetCoords: new NeuronAccessor(synaps.target).getCoords(),

    conductance: synaps.getConductance(),
    delay: synaps.getDelay(),
  };
}