import { create } from 'zustand';
import { DEFAULT_HOTKEYS } from '../types/hotKey.config';
import type { HotkeyBinding, HotkeyConfig, HotkeyCombination } from '../types/hotKey.types';

type HotkeyState = {
  bindings: HotkeyBinding[];
  configs: HotkeyConfig[];
  isHelpVisible: boolean;
  
  // Методы
  getBinding: (action: string) => HotkeyBinding | undefined;
  setBinding: (action: string, combination: HotkeyCombination) => void;
  resetToDefaults: () => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  toggleHelp: () => void;

};

export const useHotkeyStore = create<HotkeyState>((set, get) => ({
  bindings: DEFAULT_HOTKEYS.map(config => ({
    action: config.id,
    combination: config.default
  })),

  isHelpVisible: false,
  configs: DEFAULT_HOTKEYS,
  
  getBinding: (action) => {
    return get().bindings.find(b => b.action === action);
  },
  
  setBinding: (action, combination) => {
    set(state => ({
      bindings: state.bindings.map(binding => 
        binding.action === action 
          ? { ...binding, combination } 
          : binding
      )
    }));
  },
  
  resetToDefaults: () => {
    set({
      bindings: DEFAULT_HOTKEYS.map(config => ({
        action: config.id,
        combination: config.default
      }))
    });
  },
  
  isRecording: false,
  
  startRecording: () => set({ isRecording: true }),
  
  stopRecording: () => set({ isRecording: false }),

  toggleHelp: () => set(state => ({ isHelpVisible: !state.isHelpVisible })),
}));