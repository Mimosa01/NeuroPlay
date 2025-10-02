import { create } from "zustand";

type SelectionState = {
  selectedNeuronId: string | null;
  selectedSynapsId: string | null;

  setSelectedNeuronId: (id: string | null) => void;
  setSelectedSynapsId: (id: string | null) => void;
  clearSelection: () => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedNeuronId: null,
  selectedSynapsId: null,
 
  setSelectedNeuronId: (id) =>
    set({ selectedNeuronId: id, selectedSynapsId: null }),

  setSelectedSynapsId: (id) =>
    set({ selectedSynapsId: id, selectedNeuronId: null }),

  clearSelection: () =>
    set({ selectedNeuronId: null, selectedSynapsId: null }),
}));
