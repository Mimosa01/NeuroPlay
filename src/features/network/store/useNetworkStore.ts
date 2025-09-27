import { create } from 'zustand';
import type { EdgeDTO } from '../dto/edge.dto';
import type { NeuronDTO } from '../dto/neuron.dto';
import { neuronToDTO } from '../dto/neuronTo';
import { NetworkSerializer } from '../core/network/NetworkSerealizer';
import { NetworkFacade } from '../core/network/NetworkFacade';
import { toast } from 'sonner';
import { edgeToDTO } from '../dto/edgeTo';
import NeuronAccessor from '../core/neurons/NeuronAccessor';
import type { Coords, NeuronType } from '../types';


const facade = new NetworkFacade();

type NetworkState = {
  neuronsDTO: NeuronDTO[];
  edgesDTO: EdgeDTO[];

  // Методы сети
  createNeuron: (coords: Coords, type: NeuronType) => NeuronDTO;
  createEdge: (sourceId: string, targetId: string) => EdgeDTO | null;
  findNearestNeuron: (coords: Coords, maxDistance?: number) => NeuronDTO | null;
  findNearestEdge: (coords: Coords, maxDistance?: number) => EdgeDTO | null;
  removeNeuron: (id: string) => void;
  removeEdge: (id: string) => void;
  resetNetwork: () => void;

  // Методы нейронов и ребер
  exciteNeuron: (id: string, signal: number) => void;
  updateNeuron: (id: string, data: Partial<NeuronDTO>) => void;
  updateEdge: (id: string, data: Partial<EdgeDTO>) => void;

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
      edgesDTO: snapshot.edges,
    });
  });

  return {
    neuronsDTO: initialSnapshot.neurons,
    edgesDTO: initialSnapshot.edges,

    refresh: () => {
      const snapshot = NetworkSerializer.createSnapshot(facade.network);

      set({
        neuronsDTO: snapshot.neurons,
        edgesDTO: snapshot.edges,
      });
    },

    updateNeuron: (id, data) => {
      facade.updateNeuron(id, data);
    },

    updateEdge: (id, data) => {
      facade.updateEdge(id, data);
    },

    createNeuron: (coords, type = 'relay') => {
      const neuron = facade.createNeuron(coords, type);
      return neuronToDTO(new NeuronAccessor(neuron));
    },

    createEdge: (sourceId, targetId) => {
      const edge = facade.createEdge(sourceId, targetId);
      return edge ? edgeToDTO(edge) : null;
    },

    removeEdge: (id) => {
      facade.removeEdge(id);
    },

    removeNeuron: (id) => {
      facade.removeNeuron(id);
    },

    findNearestNeuron: (coords, maxDistance = 30) => {
      const neuron = facade.findNearestNeuron(coords, maxDistance);
      return neuron ? facade.getSnapshot().neurons.find((n: { id: string; }) => n.id === neuron.id)! : null;
    },

    findNearestEdge: (coords, maxDistance = 30) => {
      const edge = facade.findNearestEdge(coords, maxDistance);
      return edge ? facade.getSnapshot().edges.find((e: { id: string; }) => e.id === edge.id)! : null;
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