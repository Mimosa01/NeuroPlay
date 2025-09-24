import type { Coords } from "../../../shared/types/types";
import type { NeuroTransmitterType } from "../types/types";
import type { IEdge } from "./IEdge.interface";

export interface INeuron {
  readonly id: string;
  inputEdges: Map<string, IEdge>;
  outputEdges: Map<string, IEdge>;
  
  neuroTransmitter: NeuroTransmitterType;
  membranePotential: number;
  restingPotential: number; 
  spikeThreshold: number;
  spikeAmplitude: number;
  
  refractory: boolean;
  refractoryCounter: number;
  refractoryDuration: number;
  decayFactor: number;
  inactivityCounter: number;
  inactivityThreshold: number;

  coords: Coords;
  label: string;

  readyToSend: boolean;
}

// export interface INeuron {
//   readonly id: string;
//   getCoords (): Coords;
//   setCoords (coords: Coords): void;
//   getLabel (): string;
//   setLabel (label: string): void;
//   getReadyToSend (): boolean;

//   // Связи
//   addInputEdge (edge: Edge): void;
//   addOutputEdge (edge: Edge): void;
//   removeInputEdge (edgeId: string): void;
//   removeOutputEdge (edgeId: string): void;
//   getInputEdges (): Map<string, Edge>;
//   getOutputEdges (): Map<string, Edge>;

//   // Логика жизненного цикла
//   receive (signal_mV: number): void;
//   process (): void;     // проверка условий для fire
//   fire (): void;        // испускание сигнала
//   decay (): void;       // затухание / восстановление
//   isDead (): boolean;   // критерий удаления

//   // Для сериализации / DTO
//   getMembranePotential (): number; 
//   getInactivityCounter (): number;
//   getSpikeThreshold (): number;
//   getSpikeAmplitude (): number;
//   getInactivityThreshold (): number;
//   getRefractoryDuration (): number;
//   getDecayFactor (): number;
//   getNeuroTransmitter (): NeuroTransmitterType;

//   setInactivityCounter (count: number): void;
//   setInactivityThreshold (threshold: number): void;
//   setRefractoryDuration (duration: number): void;
//   setSpikeThreshold (threshold: number): void;
//   setSpikeAmplitude (amplitude: number): void;
//   setDecayFactor (factor: number): void;
//   setMembranePotential (potential: number): void;
//   setNeuroTransmitter (transmitter: NeuroTransmitterType): void;
// }
