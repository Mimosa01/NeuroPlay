export type HotkeyAction = 
  | 'playPause'
  | 'stepForward'
  | 'stepBackward'
  | 'addNeuron'
  | 'connectNeurons'
  | 'reconnect'
  | 'deleteElement'
  | 'exciteNeuron'
  | 'undo'
  | 'redo'
  | 'saveNetwork'
  | 'openNetwork'
  | 'newNetwork'
  | 'help'
  | 'speedUp'
  | 'speedDown'
  | 'cancelMode'
  | 'clearNetwork'

export type HotkeyCombination = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Cmd на Mac
};

export type HotkeyConfig = {
  id: HotkeyAction;
  default: HotkeyCombination;
  label: string;
  category: 'simulation' | 'editing' | 'navigation' | 'system';
};

export type HotkeyBinding = {
  action: HotkeyAction;
  combination: HotkeyCombination;
};