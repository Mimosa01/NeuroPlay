import { useEffect } from 'react';
import { useHotkeyStore } from '../store/useHotkeyStore';
import { parseKeyboardEvent, hotkeysMatch } from '../utils/hotkeyParser';
import { hotkeyActions } from '../actions/hotkeyActions';

export function useHotkey() {
  const { bindings } = useHotkeyStore();

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
      const action = hotkeyActions[matchedBinding.action];
      if (action) {
        action();
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
  }, [bindings]);
}