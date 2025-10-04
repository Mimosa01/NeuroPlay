import { create } from "zustand";
import type { SynapseType } from "../../network/types/types";

type SelectionState = {
  selectedNeuronId: string | null;
  selectedSynapsId: string | null;
  selectedSynapsType: SynapseType | null;

  setSelectedNeuronId: (id: string | null) => void;
  setSelectedSynapsId: (id: string | null, type?: SynapseType | null) => void;
  clearSelection: () => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedNeuronId: null,
  selectedSynapsId: null,
  selectedSynapsType: null,
 
  setSelectedNeuronId: (id) =>
    set({ selectedNeuronId: id, selectedSynapsId: null, selectedSynapsType: null }),

  setSelectedSynapsId: (id, type = null) =>
    set({ selectedSynapsId: id, selectedNeuronId: null, selectedSynapsType: type }),

  clearSelection: () =>
    set({ selectedNeuronId: null, selectedSynapsId: null, selectedSynapsType: null }),
}));

