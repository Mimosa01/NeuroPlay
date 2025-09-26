import { create } from 'zustand';
import { useNetworkStore } from '../../network/store/useNetworkStore';

type ControlState = {
  isPlaying: boolean;
  timeStep: number;
  speed: number;
  showSpeedSlider: boolean;
  
  setSpeed: (ms: number) => void;
  play: () => void;
  pause: () => void;
  redo: () => void;
  undo: () => void;
  resetControls: () => void;
  setShowSpeedSlider: (show: boolean) => void;
};

export const useControlStore = create<ControlState>((set) => ({
  isPlaying: false,
  timeStep: 0,
  speed: 1000,
  showSpeedSlider: false,

  setSpeed: (speed) => set({ speed }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  redo: () => {
    useNetworkStore.getState().redo();
    set(state => ({ timeStep: state.timeStep + 1 }));
  },

  undo: () => {
    useNetworkStore.getState().undo();
    set(state => ({ timeStep: Math.max(state.timeStep - 1, 0) }));
  },

  resetControls: () => set({ isPlaying: false, timeStep: 0 }),

  setShowSpeedSlider: (show) => set({ showSpeedSlider: show }),
}));