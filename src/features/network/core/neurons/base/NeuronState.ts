import { DEFAULT_BIOLOGICAL_NEURON_PARAMS as DBNP } from '../../../../../shared/constants/neuron.constants';
import type { ChemicalSignalType } from "../../../types/types";

export class NeuronState {
  membranePotential: number;
  restingPotential: number;
  spikeThreshold: number;
  tau: number;

  refractorySteps: number;
  refractoryDuration: number;

  inactivityCounter: number;
  inactivityThreshold: number;

  adaptationThresholdShift: number;
  adaptationCounter: number;
  adaptationDelta: number;
  adaptationDuration: number;

  currentThresholdShift: number;
  currentTauMultiplier: number;

  readyToSend: boolean;
  neuroTransmitter: ChemicalSignalType;
  receptors: Set<ChemicalSignalType>;

  readonly baseSpikeThreshold: number = DBNP.spikeThreshold;
  readonly baseTau: number = DBNP.tau || 15;
  readonly baseConductanceMultiplier: number = 1;

  constructor() {
    this.membranePotential = DBNP.restingPotential;
    this.restingPotential = DBNP.restingPotential;
    this.spikeThreshold = DBNP.spikeThreshold;
    this.tau = DBNP.tau || 15;

    this.refractorySteps = 0;
    this.refractoryDuration = DBNP.refractoryDuration;

    this.inactivityCounter = 0;
    this.inactivityThreshold = DBNP.inactivityThreshold;

    this.adaptationThresholdShift = 0;
    this.adaptationCounter = 0;
    this.adaptationDelta = 3.0;
    this.adaptationDuration = 50;

    this.currentThresholdShift = 0;
    this.currentTauMultiplier = 1;

    this.readyToSend = false;
    this.neuroTransmitter = 'glutamate';
    this.receptors = new Set();
  }
}