import NeuronAccessor from "../core/neurons/base/NeuronAccessor";
import type { IChemicalSynaps } from "../interfaces/ISynaps.interface";
import type { ChemicalSynapsDTO } from "./synaps.dto";

export function chemicalSynapsToDTO(synaps: IChemicalSynaps): ChemicalSynapsDTO {
  return {
    id: synaps.id,
    type: 'chemical',
    sourceId: synaps.source.id,
    targetId: synaps.target.id,
    sourceCoords: new NeuronAccessor(synaps.source).getCoords(),
    targetCoords: new NeuronAccessor(synaps.target).getCoords(),

    conductance: synaps.getConductance(),
    delay: synaps.getDelay(),
  };
}