import type { Coords, NeuronInstance, NeuronType } from "../types";
import RelayNeuron from "./neurons/RelayNeuron";

export class NeuronFactory {
  static create(type: NeuronType | undefined = 'relay', coords: Coords): NeuronInstance {
    switch (type) {
      case 'relay':
      default:
        return new RelayNeuron(coords);
    }
  }
}