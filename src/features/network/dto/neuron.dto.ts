// dto/neuron.dto.ts
import type { Coords } from "../../../shared/types/types";
import type { NeuronId } from "../types/types";

export type NeuronDTO = {
  id: NeuronId;
  coords: Coords;
  label: string;
  
  // Биологические параметры
  membranePotential: number;     // милливольты (мВ)
  spikeThreshold: number;        // порог спайка (мВ)
  spikeAmplitude: number;        // амплитуда спайка (мВ)
  
  // Счётчики
  inactivityCounter: number;
  inactivityThreshold: number;
  
  // Рефрактерность
  refractoryDuration: number;
  
  // Затухание
  decayFactor: number;
  
  // Состояние
  readyToSend: boolean;
  
  // Для обратной совместимости
  accumulatedSignal?: number;     // старый параметр
  signalThreshold?: number;      // старый параметр
};