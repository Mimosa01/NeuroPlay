import { useEffect, useMemo } from "react";
import { useHotkeyStore } from "../store/useHotkeyStore";
import { CATEGORY_NAMES, DEFAULT_HOTKEYS } from "../types/hotKey.config";

export function useHintHotkey() {
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

  // Группируем подсказки по категориям
  const groupedHints = useMemo(() => {
    return DEFAULT_HOTKEYS.reduce((acc, elem) => {
      const category = elem.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        action: elem.id,
        label: elem.label,
      });
      return acc;
    }, {} as Record<string, Array<{ action: string; label: string }>>);
  }, []);

  return {
    isHelpVisible,
    toggleHelp,
    getBinding,
    groupedHints,
    categoryNames: CATEGORY_NAMES
  };
}