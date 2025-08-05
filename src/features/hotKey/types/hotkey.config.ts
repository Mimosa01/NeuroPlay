import type { HotkeyConfig } from "./hotKey.types";

export const DEFAULT_HOTKEYS: HotkeyConfig[] = [
  // Симуляция
  {
    id: 'playPause',
    default: { key: ' ', ctrl: false },
    label: 'Пауза/Воспроизведение',
    category: 'simulation'
  },
  {
    id: 'stepForward',
    default: { key: 'arrowright', ctrl: false },
    label: 'Шаг вперёд',
    category: 'simulation'
  },
  {
    id: 'stepBackward',
    default: { key: 'arrowleft', ctrl: false },
    label: 'Шаг назад',
    category: 'simulation'
  },
  {
    id: 'speedUp',
    default: { key: 'arrowup', ctrl: false },
    label: 'Увеличить скорость',
    category: 'simulation'
  },
  {
    id: 'speedDown',
    default: { key: 'arrowdown', ctrl: false },
    label: 'Уменьшить скорость',
    category: 'simulation'
  },

  // Редактирование
  {
    id: 'addNeuron',
    default: { key: 'a', ctrl: false },
    label: 'Добавить нейрон',
    category: 'editing'
  },
  {
    id: 'connectNeurons',
    default: { key: 'c', ctrl: false },
    label: 'Соединить нейроны',
    category: 'editing'
  },
  {
    id: 'deleteElement',
    default: { key: 'backspace', ctrl: false },
    label: 'Удалить элемент',
    category: 'editing'
  },
  {
    id: 'reconnect',
    default: { key: 'r', ctrl: false },
    label: 'Удалить ребро',
    category: 'editing'
  },
  {
    id: 'exciteNeuron',
    default: { key: 'e', ctrl: false },
    label: 'Возбудить нейрон',
    category: 'editing'
  },

  // Навигация
  {
    id: 'undo',
    default: { key: 'z', meta: true },
    label: 'Отменить',
    category: 'navigation'
  },
  {
    id: 'redo',
    default: { key: 'z', meta: true, shift: true },
    label: 'Повторить',
    category: 'navigation'
  },

  // Системные
  {
    id: 'saveNetwork',
    default: { key: 's', meta: true },
    label: 'Сохранить сеть',
    category: 'system'
  },
  {
    id: 'openNetwork',
    default: { key: 'o', meta: true },
    label: 'Открыть сеть',
    category: 'system'
  },
  {
    id: 'newNetwork',
    default: { key: 'n', meta: true },
    label: 'Новая сеть',
    category: 'system'
  },
  {
    id: 'clearNetwork',
    default: { key: 'backspace', meta: true },
    label: 'Очистить сеть',
    category: 'system'
  },
  {
    id: 'help',
    default: { key: 'f1', meta: false },
    label: 'Помощь',
    category: 'system'
  },
];