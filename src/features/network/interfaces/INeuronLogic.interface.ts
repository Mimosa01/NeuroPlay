import type { ModulatorEffect } from "../types/modulator.types";
import type { ChemicalSignalType } from "../types/types";
import type { IElectricSynaps } from "./IElectricSynaps.interface";
import type { IChemicalSynaps } from "./ISynaps.interface";

export interface INeuronLogic {
  receive (signal_mV: number): void;
  fire (): void;
  step(): void;
  isDead (): boolean;

  addInputSynaps (synaps: IChemicalSynaps): void;
  addOutputSynaps (synaps: IChemicalSynaps): void;
  addInputElectricSynaps (synaps: IElectricSynaps): void;
  addOutputElectricSynaps (synaps: IElectricSynaps): void;
  removeInputSynaps (synapsId: string): void;
  removeOutputSynaps (synapsId: string): void;

  addReceptor (type: ChemicalSignalType): void;
  hasReceptor (transmitter: ChemicalSignalType): boolean;
  removeReceptor (type: ChemicalSignalType): void; 

  applyModulationEffect(effect: ModulatorEffect): void;
  finalizeModulation(): void;

  receiveElectricSignal(current: number): void;
}