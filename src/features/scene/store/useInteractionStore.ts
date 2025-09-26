import { create } from 'zustand';

interface InteractionState {
  hoveredId: string | null;
  selectedId: string | null;
  draggingId: string | null;
  
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
  setDraggingId: (id: string | null) => void;
}

export const useInteractionStore = create<InteractionState>((set) => ({
  hoveredId: null,
  selectedId: null,
  draggingId: null,
  setHoveredId: (id) => set({ hoveredId: id }),
  setSelectedId: (id) => set({ selectedId: id }),
  setDraggingId: (id) => set({ draggingId: id }),
}));