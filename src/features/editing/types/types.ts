import type { ChemicalSignalType, NeuronMode } from "../../network/types/types";

export type NeuronFormFields = {
  label: string;
  inactivityThreshold: string;
  refractoryDuration: string;
  spikeThreshold: string;
  tau: string;
  transmitter: ChemicalSignalType;
  receptors: Set<ChemicalSignalType>
  mode: NeuronMode,
  membranePotential: string;
};