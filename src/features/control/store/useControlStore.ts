import { create } from 'zustand';
import { useNetworkStore } from '../../network/store/useNetworkStore';

type ControlState = {
  isPlaying: boolean;
  timeStep: number;
  speed: number;
  setSpeed: (ms: number) => void;
  play: () => void;
  pause: () => void;
  redo: () => void;
  undo: () => void;
  resetControls: () => void;
};

export const useControlStore = create<ControlState>((set, get) => {
  const networkStore = useNetworkStore.getState();

  return {
    isPlaying: false,
    timeStep: 0,
    speed: 1000,
    
    setSpeed: (speed) => set({ speed }),

    play: () => {
      set({ isPlaying: true });
    },

    pause: () => {
      set({ isPlaying: false });
    },

    redo: () => {
      networkStore.redo();
      set({ timeStep: get().timeStep + 1 });
    },

    undo: () => {
      networkStore.undo();
      set({ timeStep: Math.max(get().timeStep - 1, 0) });
    },

    resetControls: () => {
      set({ isPlaying: false, timeStep: 0 });
    },
  }
});
