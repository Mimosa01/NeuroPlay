import { create } from 'zustand';
import type { NetworkSnapshot, Coords } from '../../../shared/types/types';
import Network from '../core/Network';
import type { EdgeDTO } from '../dto/edge.dto';
import type { NeuronDTO } from '../dto/neuron.dto';
import { neuronToDTO } from '../dto/neuronTo';
import type { NeuronId, EdgeId } from '../types/types';

type NetworkState = {
  network: Network;
  neuronsDTO: NeuronDTO[];
  edgesDTO: EdgeDTO[];
  history: NetworkSnapshot[];
  future: NetworkSnapshot[];

  createNeuron: (coords: Coords) => NeuronDTO;
  findNearestNeuron: (coords: Coords, maxDistance?: number) => NeuronDTO | null;
  removeNeuron: (id: NeuronId) => void;
  removeEdge: (id: EdgeId) => void;
  resetNetwork: () => void;
  updateNeuronCoords: (id: NeuronId, x: number, y: number) => void;
  exciteNeuron: (id: NeuronId, signal?: number) => void;

  updateNeuron: (id: string, data: Partial<NeuronDTO>) => void;
  updateEdgeWeight: (id: string, newWeight: number) => void;

  tick: () => void;
  undoTick: () => void;
  refreshDTO: () => void;
};

export const useNetworkStore = create<NetworkState>((set, get) => ({
  network: new Network(),
  history: [],
  future: [],
  neuronsDTO: [],
  edgesDTO: [],

  refreshDTO: () => {
    const network = get().network;
    const snapshot = network.createSnapshot();

    set({
      neuronsDTO: snapshot.neurons,
      edgesDTO: snapshot.edges,
    });
  },

  updateNeuron: (id, data) => {
    const { network, refreshDTO } = get();
    const neuron = network.getNeuron(id);
    if (!neuron) return;

    if (data.label !== undefined) {
      neuron.setLabel(data.label);
    }

    if (data.activationType !== undefined) {
      neuron.setActivationFn(data.activationType);
    }

    if (data.inactivityThreshold !== undefined && typeof neuron.setInactivityThreshold === 'function') {
      neuron.setInactivityThreshold(data.inactivityThreshold);
    }

    refreshDTO();
  },


  updateEdgeWeight: (id, newWeight) => {
    const edge = get().network.getEdge(id);
    if (!edge) return;

    edge.setWeight(newWeight);
    get().refreshDTO();
  },

  createNeuron: (coords) => {
    const { network, refreshDTO } = get();
    const neuron = network.addNeuron(coords);
    refreshDTO();
    return neuronToDTO(neuron);
  },

  removeEdge: (id) => {
    const { network, refreshDTO } = get();
    network.removeEdge(id);
    refreshDTO();
  },

  removeNeuron: (id) => {
    const { network, refreshDTO } = get();
    network.removeNeuron(id);
    refreshDTO();
  },

  findNearestNeuron: (coords, maxDistance = 30) => {
    const { network } = get();
    const neuron = network.findNearestNeuron(coords, maxDistance);
    return neuron ? neuronToDTO(neuron) : null;
  },

  resetNetwork: () => {
    const network = get().network;
    network.reset();
    set({
      history: [],
      future: [],
    });
  },

  updateNeuronCoords: (id, x, y) => {
    const { network, refreshDTO } = get();
    const neuron = network.getNeuron(id);
    if (!neuron) return;
    neuron.setCoords({ x, y });
    refreshDTO();
  },

  tick: () => {
    const { network, history, refreshDTO } = get();
    const snapshot = network.createSnapshot();
    set({
      history: [...history, snapshot],
      future: [],
    });
    network.tick();
    refreshDTO();
    console.log(history)
  },

  undoTick: () => {
    const { network, history, future, refreshDTO } = get();
    if (history.length === 0) return;

    const lastSnapshot = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    const currentSnapshot = network.createSnapshot();

    network.restoreFromSnapshot(lastSnapshot);
    set({
      history: newHistory,
      future: [...future, currentSnapshot],
    });
    refreshDTO();
  },


  exciteNeuron: (id, signal = 1) => {
    const { network, refreshDTO } = get();
    const neuron = network.getNeuron(id);
    if (!neuron) return;
    neuron.receive(signal);
    refreshDTO();
  },
}));
