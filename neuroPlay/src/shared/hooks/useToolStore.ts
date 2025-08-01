import { create } from 'zustand';
import type { ToolType } from '../types/types';

type UIState = {
  selectedTool: ToolType;
  setSelectedTool: (tool: UIState['selectedTool']) => void;
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
}));

