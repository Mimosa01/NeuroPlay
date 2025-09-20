import type { EdgeId, NeuronId } from "../../features/network/types/types";

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
  id: NeuronId;
  coords: Coords;
  label: string;
  membranePotential: number;
  spikeThreshold: number;
  spikeAmplitude: number;
  inactivityCounter: number;
  inactivityThreshold: number;
  readyToSend: boolean;
  refractoryDuration: number;
  decayFactor: number;
  
  // Для обратной совместимости (временно)
  accumulatedSignal?: number;
  signalThreshold?: number;
  refractoryThreshold?: number;
  fading?: number;
};

export type EdgeSnapshot = {
  id: EdgeId;
  sourceId: NeuronId;
  targetId: NeuronId;
  sourceCoords: Coords;
  targetCoords: Coords;
  conductance: number;
  delay: number;
};

export type NetworkSnapshot = {
  neurons: NeuronSnapshot[];
  edges: EdgeSnapshot[];
};
