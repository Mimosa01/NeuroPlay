import type { ModulatorEffect } from "../types/modulator.types";
import type { ChemicalSignalType } from "../types/types";
import type { ISynaps } from "./ISynaps.interface";

export interface INeuronLogic {
  receive (signal_mV: number): void;
  fire (): void;
  step(): void;
  isDead (): boolean;

  addInputSynaps (synaps: ISynaps): void;
  addOutputSynaps (synaps: ISynaps): void;
  removeInputSynaps (synapsId: string): void;
  removeOutputSynaps (synapsId: string): void;

  addReceptor (type: ChemicalSignalType): void;
  hasReceptor (transmitter: ChemicalSignalType): boolean;
  removeReceptor (type: ChemicalSignalType): void; 

  applyModulationEffect(effect: ModulatorEffect): void;
  finalizeModulation(): void;
}