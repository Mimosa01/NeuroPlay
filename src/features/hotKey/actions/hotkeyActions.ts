import { useToolStore } from '../../scene/store/useToolStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';
import { useSelectionStore } from '../../editing/store/useSelectionStore';
import { useControlStore } from '../../control/store/useControlStore';
import { useHotkeyStore } from '../store/useHotkeyStore';

// Тип для действия
type HotkeyActionHandler = () => void;

export const hotkeyActions: Record<string, HotkeyActionHandler> = {
  // === Симуляция ===
  playPause: () => {
    const { isPlaying, play, pause } = useControlStore.getState();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  },
  stepForward: () => useControlStore.getState().redo(),
  stepBackward: () => useControlStore.getState().undo(),
  speedUp: () => {
    const { speed } = useControlStore.getState();
    useControlStore.getState().setSpeed(Math.max(100, speed - 100));
  },
  speedDown: () => {
    const { speed } = useControlStore.getState();
    useControlStore.getState().setSpeed(Math.min(2000, speed + 100));
  },

  // === Редактирование ===
  addNeuron: () => useToolStore.getState().setSelectedTool('add'),
  connectNeurons: () => useToolStore.getState().setSelectedTool('connect'),
  deleteElement: () => useToolStore.getState().setSelectedTool('delete'),
  reconnect: () => useToolStore.getState().setSelectedTool('reconnect'),
  exciteNeuron: () => {
    const { selectedNeuronId } = useSelectionStore.getState();
    if (selectedNeuronId) {
      useNetworkStore.getState().exciteNeuron(selectedNeuronId, 110);
    }
  },

  // === Навигация ===
  undo: () => useNetworkStore.getState().undo(),
  redo: () => useNetworkStore.getState().redo(),

  // === Системные ===
  saveNetwork: () => {
    console.log('Сохранить сеть');
    // TODO: реализовать сохранение
  },
  openNetwork: () => {
    console.log('Открыть сеть');
    // TODO: реализовать открытие
  },
  newNetwork: () => useNetworkStore.getState().resetNetwork(),
  clearNetwork: () => {
    if (confirm('Очистить сеть? Все данные будут потеряны.')) {
      useNetworkStore.getState().resetNetwork();
    }
  },
  cancelMode: () => useToolStore.getState().setSelectedTool('none'),
  help: () => useHotkeyStore.getState().toggleHelp(),
};