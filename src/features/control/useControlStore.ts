import { create } from 'zustand';
import { useNetworkStore } from '../network/store/useNetworkStore';

type ControlState = {
  isPlaying: boolean;
  timeStep: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetControls: () => void;
};

export const useControlStore = create<ControlState>((set, get) => ({
  isPlaying: false,
  timeStep: 0,

  play: () => {
    console.log('ControlStore: play');
    set({ isPlaying: true });
  },

  pause: () => {
    console.log('ControlStore: pause');
    set({ isPlaying: false });
  },

  stepForward: () => {
    const { timeStep } = get();
    const { tick } = useNetworkStore.getState();
    tick();
    set({ timeStep: timeStep + 1 });
    console.log(`ControlStore: stepForward to ${timeStep + 1}`);
  },

  stepBackward: () => {
    const { timeStep } = get();
    const { history, undoTick } = useNetworkStore.getState();

    if (history.length === 0) {
      console.log('ControlStore: no history to undo');
      return;
    }

    undoTick();
    set({ timeStep: Math.max(timeStep - 1, 0) });
    console.log(`ControlStore: stepBackward to ${Math.max(timeStep - 1, 0)}`);
  },

  resetControls: () => {
    set({ isPlaying: false, timeStep: 0 });
  },

}));
