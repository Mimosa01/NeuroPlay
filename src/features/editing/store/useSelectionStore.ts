import { create } from "zustand";

type SelectionState = {
  selectedNeuronId: string | null;
  selectedEdgeId: string | null;

  setSelectedNeuronId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  clearSelection: () => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedNeuronId: null,
  selectedEdgeId: null,
 
  setSelectedNeuronId: (id) =>
    set({ selectedNeuronId: id, selectedEdgeId: null }),

  setSelectedEdgeId: (id) =>
    set({ selectedEdgeId: id, selectedNeuronId: null }),

  clearSelection: () =>
    set({ selectedNeuronId: null, selectedEdgeId: null }),
}));
