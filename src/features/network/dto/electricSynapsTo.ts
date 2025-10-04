import NeuronAccessor from "../core/neurons/base/NeuronAccessor";
import type { IElectricSynaps } from "../interfaces/IElectricSynaps.interface";
import type { ElectricSynapsDTO } from "./electricSynaps.dto";


export function electricSynapsToDTO(synaps: IElectricSynaps): ElectricSynapsDTO {
  return {
    id: synaps.id,
    type: 'electric',
    sourceId: synaps.source.id,
    targetId: synaps.target.id,
    sourceCoords: new NeuronAccessor(synaps.source).getCoords(),
    targetCoords: new NeuronAccessor(synaps.target).getCoords(),

    conductance: synaps.getConductance(),
  };
}