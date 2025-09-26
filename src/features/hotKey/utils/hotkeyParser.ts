import type { HotkeyCombination } from "../types/hotkey.types";

export function parseKeyboardEvent(event: KeyboardEvent): HotkeyCombination {
  return {
    key: event.key.toLowerCase(),
    ctrl: event.ctrlKey,
    shift: event.shiftKey,
    alt: event.altKey,
    meta: event.metaKey
  };
}

// Словарь для локализации
const KEY_LABELS: Record<string, string> = {
  ' ': 'Space',
  'arrowright': '→',
  'arrowleft': '←',
  'arrowup': '↑',
  'arrowdown': '↓',
  'delete': 'Backspace',
  'backspace': 'Backspace',
  'escape': 'Esc',
  'tab': 'Tab',
  'enter': 'Enter',
  'capslock': 'Caps Lock',
  'shift': 'Shift',
  'ctrl': 'Ctrl',
  'alt': 'Alt',
  'meta': 'Cmd',
};

// Модификаторы для красивого отображения
const MODIFIER_LABELS: Record<string, string> = {
  ctrl: 'Ctrl',
  shift: 'Shift',
  alt: 'Alt',
  meta: 'Cmd',
};

export function hotkeyToString(combination: HotkeyCombination): string {
  const parts: string[] = [];

  // Добавляем модификаторы
  if (combination.ctrl) parts.push(MODIFIER_LABELS.ctrl);
  if (combination.shift) parts.push(MODIFIER_LABELS.shift);
  if (combination.alt) parts.push(MODIFIER_LABELS.alt);
  if (combination.meta) parts.push(MODIFIER_LABELS.meta);

  // Получаем имя клавиши
  const keyLabel = KEY_LABELS[combination.key] || combination.key;
  parts.push(keyLabel.charAt(0).toUpperCase() + keyLabel.slice(1));

  return parts.join('+');
}

export function hotkeysMatch(a: HotkeyCombination, b: HotkeyCombination): boolean {
  return (
    a.key === b.key &&
    Boolean(a.ctrl) === Boolean(b.ctrl) &&
    Boolean(a.shift) === Boolean(b.shift) &&
    Boolean(a.alt) === Boolean(b.alt) &&
    Boolean(a.meta) === Boolean(b.meta)
  );
}