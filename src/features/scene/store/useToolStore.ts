import { create } from 'zustand';
import type { ToolType } from '../types';

type SynapsType = 'chemical' | 'electric';

type UIState = {
  selectedTool: ToolType;
  setSelectedTool: (tool: UIState['selectedTool']) => void;

  synapsType: SynapsType;
  setSynapsType: (type: SynapsType) => void;
};

export const useToolStore = create<UIState>((set, get) => ({
  selectedTool: 'none',
  setSelectedTool: (tool) => {
    const currentTool = get().selectedTool;
    console.log('setSelectedTool called with:', tool);

    set({
      selectedTool: currentTool === tool ? 'none' : tool,
    });
  },

  synapsType: 'chemical',
  setSynapsType: (type) => set({ synapsType: type }),
}));