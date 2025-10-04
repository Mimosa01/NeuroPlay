import { create } from 'zustand';
import type { ChemicalSynapsDTO } from '../dto/synaps.dto';
import type { NeuronDTO } from '../dto/neuron.dto';
import { neuronToDTO } from '../dto/mappers';
import { NetworkFacade } from '../core/network/NetworkFacade';
// UI-нотификации должны жить в UI-слое, не в сторе
import type { Coords, NeuronType } from '../types/types';
import type { ModulationCloudDTO } from '../dto/modulationCloud.dto';
import { chemicalSynapsToDTO, electricSynapsToDTO } from '../dto/mappers';
import type { ElectricSynapsDTO } from '../dto/electricSynaps.dto';
import { NetworkSerializer } from '../core/network/NetworkSerializer';
import NeuronAccessor from '../core/neurons/base/NeuronAccessor';
import type { IChemicalSynaps } from '../interfaces/ISynaps.interface';
import type { IElectricSynaps } from '../interfaces/IElectricSynaps.interface';


const facade = new NetworkFacade();
facade.init();

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
  findNearestSynaps: (coords: Coords, maxDistance?: number) => ChemicalSynapsDTO | ElectricSynapsDTO | null;
  removeNeuron: (id: string) => void;
  removeSynaps: (id: string) => void;
  resetNetwork: () => void;

  // Методы нейронов и ребер
  exciteNeuron: (id: string, signal: number) => void;
  updateNeuron: (id: string, data: Partial<NeuronDTO>) => void;
  updateSynaps: (id: string, data: Partial<ChemicalSynapsDTO>) => void;
  updateElectricSynaps: (id: string, data: Partial<ElectricSynapsDTO>) => void;

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
    const synaps = facade.createSynapse('chemical', sourceId, targetId) as IChemicalSynaps;
    return synaps ? chemicalSynapsToDTO(synaps) : null;
    },

    createElectricSynaps(sourceId: string, targetId: string) {
      const synaps = facade.createSynapse('electric', sourceId, targetId) as IElectricSynaps;
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
      const result = facade.findNearestSynaps(coords, maxDistance);
      if (!result) return null;

      // Возвращаем DTO нужного типа
      if (result.type === 'chemical') {
        return facade.getSnapshot().synapses.find((s) => s.id === result.synaps.id)!;
      } else {
        return facade.getSnapshot().electricSynapses.find((s) => s.id === result.synaps.id)!;
      }
    },

    resetNetwork: () => {
      facade.resetNetwork();
    },

    exciteNeuron: (id, signal) => {
      facade.exciteNeuron(id, signal);
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