import type { Coords } from "../../../shared/types/types";
// import type { INeuron } from "../interfaces/INeuron.interface";
import type { NeuronInstance, NeuronType } from "../types/types";
import PyramidalNeuron from "./neurons/PyramidalNeuron";

export class NeuronFactory {
  static create(type: NeuronType | undefined = 'pyramidal', coords: Coords): NeuronInstance {
    switch (type) {
      case 'pyramidal':
      default:
        return new PyramidalNeuron(coords);
    }
  }
}