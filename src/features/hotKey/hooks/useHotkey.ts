import { useEffect } from 'react';
import { useToolStore } from '../../../shared/hooks/useToolStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';
import { useSelectionStore } from '../../editing/store/useSelectionStore';
import { useHotkeyStore } from '../store/useHotKeyStore';
import { parseKeyboardEvent, hotkeysMatch } from '../utils/hotKeyParser';
import { useControlStore } from '../../control/store/useControlStore';

export function useHotkey() {
  const { bindings } = useHotkeyStore();
  const { isPlaying, play, pause, redo, undo, setSpeed } = useControlStore();
  const { setSelectedTool } = useToolStore();
  const { exciteNeuron } = useNetworkStore();
  const { selectedNeuronId } = useSelectionStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Игнорируем если в input/textarea
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) return;

      const pressedCombo = parseKeyboardEvent(e);
      
      // Ищем совпадение
      const matchedBinding = bindings.find(binding => 
        hotkeysMatch(binding.combination, pressedCombo)
      );

      if (!matchedBinding) return;

      // Предотвращаем стандартное поведение
      e.preventDefault();
      e.stopPropagation();

      // Выполняем действие
      switch (matchedBinding.action) {
        // === Симуляция ===
        case 'playPause':
          if (isPlaying) {
            pause();
          } else {
            play();
          }
          break;
          
        case 'stepForward':
          redo();
          break;
          
        case 'stepBackward':
          undo();
          break;
          
        case 'speedUp':
          {
            const { speed } = useControlStore.getState();
            setSpeed(Math.max(100, speed - 100));
          }
          break;
          
        case 'speedDown':
          {
            const { speed: currentSpeed } = useControlStore.getState();
            setSpeed(Math.min(2000, currentSpeed + 100));
          }
          break;

        // === Редактирование ===
        case 'addNeuron':
          setSelectedTool('add');
          break;
          
        case 'connectNeurons':
          setSelectedTool('connect');
          break;
          
        case 'deleteElement':
          setSelectedTool('delete');
          break;

        case 'reconnect':
          setSelectedTool('reconnect');
          break;
          
        case 'exciteNeuron':
          if (selectedNeuronId) {
            exciteNeuron(selectedNeuronId, 110); // спайк 110 мВ
          }
          break;

        // === Навигация ===
        case 'undo':
          useNetworkStore.getState().undo();
          break;
          
        case 'redo':
          useNetworkStore.getState().tick();
          break;

        // === Системные ===
        case 'saveNetwork':
          console.log('Сохранить сеть');
          // TODO: реализовать сохранение
          break;
          
        case 'openNetwork':
          console.log('Открыть сеть');
          // TODO: реализовать открытие
          break;
          
        case 'newNetwork':
          useNetworkStore.getState().resetNetwork();
          break;

        case 'clearNetwork':
          console.log('lol')
          if (confirm('Очистить сеть? Все данные будут потеряны.')) {
            useNetworkStore.getState().resetNetwork();
          }
          break;
          
        // === Дополнительные (если есть) ===
        case 'cancelMode':
          setSelectedTool('none');
          break;

        case 'help': // F1
          // Отправляем CustomEvent
          useHotkeyStore.getState().toggleHelp();
          break;
      }
    };

    // Также предотвращаем прокрутку страницы при Space
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) return;
          
      if (e.key === ' ') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [bindings, isPlaying, play, pause, setSelectedTool, selectedNeuronId, setSpeed, exciteNeuron, redo, undo]);
}