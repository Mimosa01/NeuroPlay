import { edgeToDTO } from "../../dto/edgeTo";
import { neuronToDTO } from "../../dto/neuronTo";
import type Network from "./Network";
import type { NetworkSnapshot } from "./types/types";

export class NetworkSerializer {
  public static createSnapshot(network: Network): NetworkSnapshot {
    return {
      neurons: Array.from(network.neurons.values()).map(n => neuronToDTO(n)),
      edges: Array.from(network.edges.values()).map(e => edgeToDTO(e))
    };
  }
    
  public static restoreFromSnapshot(network: Network, snapshot: NetworkSnapshot) {
    snapshot.neurons.forEach(({ id, coords, membranePotential, inactivityCounter }) => {
      const neuron = network.neurons.get(id);
      if (neuron) {
        neuron.setCoords(coords);
        if (membranePotential !== undefined) neuron.setMembranePotential(membranePotential);
        if (inactivityCounter !== undefined) neuron.setInactivityCounter(inactivityCounter);
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