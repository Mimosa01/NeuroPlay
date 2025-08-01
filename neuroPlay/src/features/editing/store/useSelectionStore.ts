import { create } from "zustand";
import type { NeuronId, EdgeId } from "../../network/types/types";

type SelectionState = {
  selectedNeuronId: NeuronId | null;
  selectedEdgeId: EdgeId | null;

  setSelectedNeuronId: (id: NeuronId | null) => void;
  setSelectedEdgeId: (id: EdgeId | null) => void;
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
