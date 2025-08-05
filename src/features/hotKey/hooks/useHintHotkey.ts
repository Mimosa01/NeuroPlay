import { useEffect } from "react";
import { useHotkeyStore } from "../store/useHotKeyStore";
import { DEFAULT_HOTKEYS } from "../types/hotKey.config";

export function useHintHotkey () {
  const { isHelpVisible, toggleHelp, getBinding } = useHotkeyStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isHelpVisible) {
        toggleHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHelpVisible, toggleHelp]);

  // Названия категорий на русском
  const categoryNames: Record<string, string> = {
    'simulation': 'Симуляция',
    'editing': 'Редактирование',
    'navigation': 'Навигация',
    'system': 'Системные'
  };

  // Преобразуем в массив объектов
  const hints = DEFAULT_HOTKEYS.map((elem) => ({
    action: elem.id,
    label: elem.label,
    category: elem.category
  }));

  // Группируем по категориям
  const groupedHints = hints.reduce((acc, hint) => {
    if (!acc[hint.category]) {
      acc[hint.category] = [];
    }
    acc[hint.category].push(hint);
    return acc;
  }, {} as Record<string, typeof hints>);

  return {
    isHelpVisible,
    toggleHelp,
    getBinding,
    groupedHints,
    categoryNames
  };
}