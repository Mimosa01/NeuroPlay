import type { Coords, NeuronInstance, NeuronType } from "../types";
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