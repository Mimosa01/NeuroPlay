export type ToolType = 'none' | 'add' | 'delete' | 'connect' | 'reconnect' | 'play' | 'pause' | 'clear' | 'back' | 'next';

export type Tool = {
  id: ToolType;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

export type Coords = {
  x: number;
  y: number;
}

export type NeuronSnapshot = {
  id: string;
  coords: Coords;
  label: string;
  activationType: string;
  accumulatedSignal: number;
  inactivityCounter: number;
  readonly inactivityThreshold: number;
};

export type EdgeSnapshot = {
  id: string;
  sourceCoords: Coords;
  targetCoords: Coords;
  weight: number;
};

export type NetworkSnapshot = {
  neurons: NeuronSnapshot[];
  edges: EdgeSnapshot[];
};
