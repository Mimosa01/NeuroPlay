import { create } from 'zustand';
import type { ChemicalSynapsDTO } from '../dto/synaps.dto';
import type { NeuronDTO } from '../dto/neuron.dto';
import { neuronToDTO } from '../dto/neuronTo';
import { NetworkSerializer } from '../core/network/NetworkSerealizer';
import { NetworkFacade } from '../core/network/NetworkFacade';
import { toast } from 'sonner';
import NeuronAccessor from '../core/neurons/NeuronAccessor';
import type { Coords, NeuronType } from '../types/types';
import type { ModulationCloudDTO } from '../dto/modulationCloud.dto';
import { chemicalSynapsToDTO } from '../dto/synapsTo';
import { electricSynapsToDTO } from '../dto/electricSynapsTo';
import type { ElectricSynapsDTO } from '../dto/electricSynaps.dto';


const facade = new NetworkFacade();

type NetworkState = {
  neuronsDTO: NeuronDTO[];
  synapsesDTO: ChemicalSynapsDTO[];
  cloudsDTO: ModulationCloudDTO[];
  electricSynapsesDTO: ElectricSynapsDTO[];

  // Методы сети
  createNeuron: (coords: Coords, type: NeuronType) => NeuronDTO;
  createSynaps: (sourceId: string, targetId: string) => ChemicalSynapsDTO | null;
  createElectricSynaps: (sourceId: string, targetId: string) => ElectricSynapsDTO | null;
  findNearestNeuron: (coords: Coords, maxDistance?: number) => NeuronDTO | null;
  findNearestSynaps: (coords: Coords, maxDistance?: number) => ChemicalSynapsDTO | null;
  removeNeuron: (id: string) => void;
  removeSynaps: (id: string) => void;
  resetNetwork: () => void;

  // Методы нейронов и ребер
  exciteNeuron: (id: string, signal: number) => void;
  updateNeuron: (id: string, data: Partial<NeuronDTO>) => void;
  updateSynaps: (id: string, data: Partial<ChemicalSynapsDTO>) => void;
  updateElectricSynaps: (id: string, data: Partial<ChemicalSynapsDTO>) => void;

  // Методы симуляции
  tick: () => void;
  undo: () => void;
  redo: () => void;
};

export const useNetworkStore = create<NetworkState>(( set ) => {
  const initialSnapshot = facade.getSnapshot();

  facade.subscribe(() => {
    const snapshot = facade.getSnapshot();
    set({
      neuronsDTO: snapshot.neurons,
      synapsesDTO: snapshot.synapses,
      cloudsDTO: snapshot.clouds,
      electricSynapsesDTO: snapshot.electricSynapses
    });
  });

  return {
    neuronsDTO: initialSnapshot.neurons,
    synapsesDTO: initialSnapshot.synapses,
    cloudsDTO: initialSnapshot.clouds,
    electricSynapsesDTO: initialSnapshot.electricSynapses,

    refresh: () => {
      const snapshot = NetworkSerializer.createSnapshot(facade.network);

      set({
        neuronsDTO: snapshot.neurons,
        synapsesDTO: snapshot.synapses,
      });
    },

    updateNeuron: (id, data) => {
      facade.updateNeuron(id, data);
    },

    updateSynaps: (id, data) => {
      facade.updateSynaps(id, data);
    },

    updateElectricSynaps: (id, data) => {
      facade.updateElectricSynaps(id, data);
    },

    createNeuron: (coords, type = 'relay') => {
      const neuron = facade.createNeuron(coords, type);
      return neuronToDTO(new NeuronAccessor(neuron));
    },

    createSynaps: (sourceId, targetId) => {
    const synaps = facade.createSynaps(sourceId, targetId);
    return synaps ? chemicalSynapsToDTO(synaps) : null;
    },

    createElectricSynaps(sourceId: string, targetId: string) {
      const synaps = facade.createElectricSynaps(sourceId, targetId);
      return synaps ? electricSynapsToDTO(synaps) : null;
    },

    removeSynaps: (id) => {
      facade.removeSynaps(id);
    },

    removeNeuron: (id) => {
      facade.removeNeuron(id);
    },

    findNearestNeuron: (coords, maxDistance = 30) => {
      const neuron = facade.findNearestNeuron(coords, maxDistance);
      return neuron ? facade.getSnapshot().neurons.find((n: { id: string; }) => n.id === neuron.id)! : null;
    },

    findNearestSynaps: (coords, maxDistance = 30) => {
    const synaps = facade.findNearestSynaps(coords, maxDistance);
    return synaps ? facade.getSnapshot().synapses.find((e: { id: string; }) => e.id === synaps.id)! : null;
    },

    resetNetwork: () => {
      facade.resetNetwork();

      toast.success('Сеть очищена', { duration: 1000 });
    },

    exciteNeuron: (id, signal) => {
      facade.exciteNeuron(id, signal);
      
      toast.success('Нейрон возбуждён', { duration: 1500 });
    }, 

    tick: () => {
      facade.tick();
    },

    undo: () => {
      facade.undoTick();
    },

    redo: () => {
      facade.redoTick();
    }
  }
});