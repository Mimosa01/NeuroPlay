import { create } from 'zustand';
import { DEFAULT_HOTKEYS } from '../types/hotkey.config';
import type { HotkeyBinding, HotkeyConfig, HotkeyCombination } from '../types/hotkey.types';

type HotkeyState = {
  bindings: HotkeyBinding[];
  configs: HotkeyConfig[];
  isHelpVisible: boolean;
  isRecording: boolean;

  // Методы
  getBinding: (action: string) => HotkeyBinding | undefined;
  setBinding: (action: string, combination: HotkeyCombination) => void;
  resetToDefaults: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  toggleHelp: () => void;
};

export const useHotkeyStore = create<HotkeyState>((set, get) => ({
  bindings: DEFAULT_HOTKEYS.map(config => ({
    action: config.id,
    combination: config.default
  })),

  configs: DEFAULT_HOTKEYS,
  isHelpVisible: false,
  isRecording: false,

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

  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),
  toggleHelp: () => set(state => ({ isHelpVisible: !state.isHelpVisible })),
}));