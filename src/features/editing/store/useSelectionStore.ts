// store/useSelectionStore.ts
import { create } from "zustand";

type SynapsType = 'chemical' | 'electric' | null;

type SelectionState = {
  selectedNeuronId: string | null;
  selectedSynapsId: string | null;
  selectedSynapsType: SynapsType;

  setSelectedNeuronId: (id: string | null) => void;
  setSelectedSynapsId: (id: string | null, type?: SynapsType) => void;
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

// import { create } from "zustand";

// type SelectionState = {
//   selectedNeuronId: string | null;
//   selectedSynapsId: string | null;

//   setSelectedNeuronId: (id: string | null) => void;
//   setSelectedSynapsId: (id: string | null) => void;
//   clearSelection: () => void;
// };

// export const useSelectionStore = create<SelectionState>((set) => ({
//   selectedNeuronId: null,
//   selectedSynapsId: null,
 
//   setSelectedNeuronId: (id) =>
//     set({ selectedNeuronId: id, selectedSynapsId: null }),

//   setSelectedSynapsId: (id) =>
//     set({ selectedSynapsId: id, selectedNeuronId: null }),

//   clearSelection: () =>
//     set({ selectedNeuronId: null, selectedSynapsId: null }),
// }));
