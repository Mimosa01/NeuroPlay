import { edgeToDTO } from "../../dto/edgeTo";
import { neuronToDTO } from "../../dto/neuronTo";
import type { NetworkSnapshot } from "../../types";
import NeuronAccessor from "../neurons/NeuronAccessor";
import type Network from "./Network";

export class NetworkSerializer {
  public static createSnapshot(network: Network): NetworkSnapshot {
    return {
      neurons: Array.from(network.neurons.values()).map(n => neuronToDTO(new NeuronAccessor(n))),
      edges: Array.from(network.edges.values()).map(e => edgeToDTO(e))
    };
  }
    
  public static restoreFromSnapshot(network: Network, snapshot: NetworkSnapshot) {
    snapshot.neurons.forEach(({ id, coords, membranePotential, inactivityCounter }) => {
      const neuron = network.neurons.get(id);
      if (neuron) {
        const accessor = new NeuronAccessor(neuron);
        if (coords !== undefined) accessor.setCoords(coords);
        if (membranePotential !== undefined) accessor.setMembranePotential(membranePotential);
        if (inactivityCounter !== undefined) accessor.setInactivityCounter(inactivityCounter);
      }
    });

    snapshot.edges.forEach(({ id, conductance, delay }) => {
      const edge = network.edges.get(id);
      if (edge) {
        if (conductance !== undefined) edge.setConductance(conductance);
        if (delay !== undefined) edge.setDelay(delay);
      }
    });
  }
}