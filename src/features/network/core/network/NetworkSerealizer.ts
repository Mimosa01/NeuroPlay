import { modulationCloudToDTO } from "../../dto/modulationCloudTo";
import { neuronToDTO } from "../../dto/neuronTo";
import { synapsToDTO } from "../../dto/synapsTo";
import type { NetworkSnapshot } from "../../types/types";
import NeuronAccessor from "../neurons/NeuronAccessor";
import type Network from "./Network";

export class NetworkSerializer {
  public static createSnapshot(network: Network): NetworkSnapshot {
    return {
      neurons: Array.from(network.neurons.values()).map(n => neuronToDTO(new NeuronAccessor(n))),
      synapses: Array.from(network.synapses.values()).map(e => synapsToDTO(e)),
      clouds: Array.from(network.modulationClouds.values()).map(e => modulationCloudToDTO(e))
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

    snapshot.synapses.forEach(({ id, conductance, delay }) => {
      const synaps = network.synapses.get(id);
      if (synaps) {
        if (conductance !== undefined) synaps.setConductance(conductance);
        if (delay !== undefined) synaps.setDelay(delay);
      }
    });
  }
}