import type { HotkeyCombination } from "../types/hotKey.types";

export function parseKeyboardEvent(event: KeyboardEvent): HotkeyCombination {
  return {
    key: event.key.toLowerCase(),
    ctrl: event.ctrlKey,
    shift: event.shiftKey,
    alt: event.altKey,
    meta: event.metaKey
  };
}

// utils/hotkeyParser.ts
export function normalizeKey(key: string): string {
  const lowerKey = key.toLowerCase();
  
  // Специальные клавиши
  switch (lowerKey) {
    case ' ':
    case 'spacebar':
    case 'space':
      return ' ';
      
    case 'arrowright':
    case 'rightarrow':
      return 'arrowright';
      
    case 'arrowleft':
    case 'leftarrow':
      return 'arrowleft';
      
    case 'arrowup':
    case 'uparrow':
      return 'arrowup';
      
    case 'arrowdown':
    case 'downarrow':
      return 'arrowdown';
      
    case 'delete':
    case 'del':
      return 'delete';
      
    case 'escape':
    case 'esc':
      return 'escape';
      
    case 'f1': case 'f2': case 'f3': case 'f4': case 'f5':
    case 'f6': case 'f7': case 'f8': case 'f9': case 'f10':
    case 'f11': case 'f12':
      return lowerKey; // f1, f2, ...
      
    default:
      return lowerKey;
  }
}

export function hotkeyToString(combination: HotkeyCombination): string {
  const parts: string[] = [];
  
  if (combination.ctrl) parts.push('Ctrl');
  if (combination.shift) parts.push('Shift');
  if (combination.alt) parts.push('Alt');
  if (combination.meta) parts.push('Cmd');
  
  // Красивые названия клавиш
  const keyName = combination.key
    .replace(' ', 'Space')
    .replace('arrowright', '→')
    .replace('arrowleft', '←')
    .replace('arrowup', '↑')
    .replace('arrowdown', '↓')
    .replace('delete', 'backspace')
    .replace('escape', 'esc');
  
  parts.push(keyName.charAt(0).toUpperCase() + keyName.slice(1));
  
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