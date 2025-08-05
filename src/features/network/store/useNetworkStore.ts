import { create } from 'zustand';
import type { NetworkSnapshot, Coords } from '../../../shared/types/types';
import Network from '../core/Network';
import type { EdgeDTO } from '../dto/edge.dto';
import type { NeuronDTO } from '../dto/neuron.dto';
import { neuronToDTO } from '../dto/neuronTo';
import type { NeuronId, EdgeId } from '../types/types';
import { toast } from 'sonner';

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
  exciteNeuron: (id: NeuronId, signal?: number) => void;

  updateNeuron: (id: NeuronId, data: Partial<NeuronDTO>) => void;
  updateEdge: (id: EdgeId, data: Partial<EdgeDTO>) => void;

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

    // Новые параметры
    if (data.label !== undefined) {
      neuron.setLabel(data.label);
    }
    if (data.inactivityThreshold !== undefined) {
      neuron.setInactivityThreshold(data.inactivityThreshold);
    }
    if (data.refractoryDuration !== undefined) {
      neuron.setRefractoryDuration(data.refractoryDuration);
    }
    if (data.spikeThreshold !== undefined) {
      neuron.setSpikeThreshold(data.spikeThreshold);
    }
    if (data.spikeAmplitude !== undefined) {
      neuron.setSpikeAmplitude(data.spikeAmplitude);
    }
    if (data.decayFactor !== undefined) {
      neuron.setDecayFactor(data.decayFactor);
    }
    if (data.coords !== undefined) {
      neuron.setCoords(data.coords);
    }

    refreshDTO();
  },

  updateEdge: (id, data) => {
    const edge = get().network.getEdge(id);
    if (!edge) return;

    if (data.conductance) edge.setConductance(data.conductance);
    if (data.delay) edge.setDelay(data.delay);
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
    const {network, refreshDTO} = get();
    network.reset();
    set({
      history: [],
      future: [],
    });

    toast.success('Сеть очищена', {
      duration: 1000,
      position: 'top-right'
    });
    
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

  exciteNeuron: (id, signal = 100) => {
    const { network, refreshDTO } = get();
    const neuron = network.getNeuron(id);
    if (!neuron) return;
    neuron.receive(signal);
    refreshDTO();
    
    toast.success('Нейрон возбуждён', {
      duration: 1500,
      position: 'top-right'
    });
  },
}));