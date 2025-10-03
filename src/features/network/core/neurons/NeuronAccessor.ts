import type { IChemicalSynaps } from "../../interfaces/ISynaps.interface";
import type { INeuron } from "../../interfaces/INeuron.interface";
import type { ChemicalSignalType, Coords } from "../../types/types";
import type { IElectricSynaps } from "../../interfaces/IElectricSynaps.interface";

export default class NeuronAccessor {
  private neuron: INeuron;

  constructor (neuron: INeuron) {
    this.neuron = neuron;
  }

  public getId (): string {
    return this.neuron.id;
  }
  
  public getInputSynapses (): Map<string, IChemicalSynaps> {
    return this.neuron.inputSynapses;
  }

  public getOutputSynapses (): Map<string, IChemicalSynaps> {
    return this.neuron.outputSynapses;
  }

  public getInputElectricSynapses (): Map<string, IElectricSynaps> {
    return this.neuron.inputElectricSynapses;
  }

  public getOutputElectricSynapses (): Map<string, IElectricSynaps> {
    return this.neuron.outputElectricSynapses;
  }

  public getCoords (): Coords {
    return this.neuron.coords;
  }

  public setCoords (coords: Coords): void {
    this.neuron.coords = coords;
  }

  public getLabel (): string {
    return this.neuron.label;
  }

  public setLabel (label: string): void {
    this.neuron.label = label;
  }

  public getReadyToSend (): boolean {
    return this.neuron.readyToSend;
  }
  
  public getMembranePotential (): number {
    return this.neuron.membranePotential;
  }

  public setMembranePotential (potential: number): void {
    this.neuron.membranePotential = potential;
  }

  public getSpikeThreshold (): number {
    return this.neuron.spikeThreshold;
  }

  public setSpikeThreshold (threshold: number): void {
    this.neuron.spikeThreshold = Math.max(-60, Math.min(-40, threshold))
  }

  public getNeuroTransmitter(): ChemicalSignalType {
    return this.neuron.neuroTransmitter;
  }

  public setNeuroTransmitter (transmitter: ChemicalSignalType): void {
    this.neuron.neuroTransmitter = transmitter;
  }
  
  public getRefractoryDuration (): number {
    return this.neuron.refractoryDuration;
  }

  public setRefractoryDuration (duration: number): void {
    this.neuron.refractoryDuration = Math.max(1, Math.min(20, duration));
  }
  
  public getInactivityCounter (): number {
    return this.neuron.inactivityCounter;
  }

  public setInactivityCounter (count: number): void {
    this.neuron.inactivityCounter = count;
  }

  public getInactivityThreshold (): number {
    return this.neuron.inactivityThreshold;
  }

  public setInactivityThreshold (threshold: number): void {
    this.neuron.inactivityThreshold = threshold;
  }

  public getTau (): number {
    return this.neuron.tau;
  }

  public setTau (tau: number): void {
    this.neuron.tau = tau;
  }

  public getRestingPotential (): number {
    return this.neuron.restingPotential;
  }

  public setRestingPotential (potential: number): void {
    this.neuron.restingPotential = potential;
  }

  public getReceptors (): Set<ChemicalSignalType> {
    return this.neuron.receptors;
  }

  // Пока в нем не уверен
  public setReceptors (receptors: Set<ChemicalSignalType>): void {
    this.neuron.receptors = receptors
  }

  public setCurrentThresholdShift (value: number): void {
    this.neuron.currentThresholdShift = value;
  }

  public setCurrentTauMultiplier (value: number): void {
    this.neuron.currentTauMultiplier = value;
  }
}