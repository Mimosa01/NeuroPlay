import { neuronToDTO, chemicalSynapsToDTO, electricSynapsToDTO, modulationCloudToDTO } from "../../dto/mappers";
import type { NetworkSnapshot } from "../../types/types";
import { ModulationCloud } from "../ModulationCloud";
import NeuronAccessor from "../neurons/base/NeuronAccessor";
import type Network from "./Network";

export class NetworkSerializer {
  public static createSnapshot(network: Network): NetworkSnapshot {
    return {
      neurons: Array.from(network.neurons.values()).map(n => neuronToDTO(new NeuronAccessor(n))),
      clouds: Array.from(network.modulationClouds.values()).map(e => modulationCloudToDTO(e)),
      synapses: Array.from(network.synapseRegistry.getAllChemical().values()).map(e => chemicalSynapsToDTO(e)),
      electricSynapses: Array.from(network.synapseRegistry.getAllElectric().values()).map(e => electricSynapsToDTO(e))
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
      const synaps = network.synapseRegistry.getChemical(id);
      if (synaps) {
        if (conductance !== undefined) synaps.setConductance(conductance);
        if (delay !== undefined) synaps.setDelay(delay);
      }
    });

    snapshot.electricSynapses.forEach(({ id, conductance }) => {
      const synaps = network.synapseRegistry.getElectric(id);
      if (synaps) {
        if (conductance !== undefined) synaps.setConductance(conductance);
      }
    });

    network.modulationClouds.clear();
    snapshot.clouds.forEach(cloudData => {
      const cloud = new ModulationCloud(
        cloudData.type,
        cloudData.center,
      );
      network.modulationClouds.set(cloud.id, cloud);
    });
  }
}

