import { create } from 'zustand';
import type { SynapsDTO } from '../dto/synaps.dto';
import type { NeuronDTO } from '../dto/neuron.dto';
import { neuronToDTO } from '../dto/neuronTo';
import { NetworkSerializer } from '../core/network/NetworkSerealizer';
import { NetworkFacade } from '../core/network/NetworkFacade';
import { toast } from 'sonner';
import NeuronAccessor from '../core/neurons/NeuronAccessor';
import type { Coords, NeuronType } from '../types/types';
import type { ModulationCloudDTO } from '../dto/modulationCloud.dto';
import { synapsToDTO } from '../dto/synapsTo';


const facade = new NetworkFacade();

type NetworkState = {
  neuronsDTO: NeuronDTO[];
  synapsesDTO: SynapsDTO[];
  cloudsDTO: ModulationCloudDTO[];

  // Методы сети
  createNeuron: (coords: Coords, type: NeuronType) => NeuronDTO;
  createSynaps: (sourceId: string, targetId: string) => SynapsDTO | null;
  findNearestNeuron: (coords: Coords, maxDistance?: number) => NeuronDTO | null;
  findNearestSynaps: (coords: Coords, maxDistance?: number) => SynapsDTO | null;
  removeNeuron: (id: string) => void;
  removeSynaps: (id: string) => void;
  resetNetwork: () => void;

  // Методы нейронов и ребер
  exciteNeuron: (id: string, signal: number) => void;
  updateNeuron: (id: string, data: Partial<NeuronDTO>) => void;
  updateSynaps: (id: string, data: Partial<SynapsDTO>) => void;

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
      cloudsDTO: snapshot.clouds
    });
  });

  return {
    neuronsDTO: initialSnapshot.neurons,
    synapsesDTO: initialSnapshot.synapses,
    cloudsDTO: initialSnapshot.clouds,

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

    createNeuron: (coords, type = 'relay') => {
      const neuron = facade.createNeuron(coords, type);
      return neuronToDTO(new NeuronAccessor(neuron));
    },

    createSynaps: (sourceId, targetId) => {
    const synaps = facade.createSynaps(sourceId, targetId);
    return synaps ? synapsToDTO(synaps) : null;
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