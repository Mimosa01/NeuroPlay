import type { Coords, ChemicalSignalType, NeuronMode } from "../../../types/types";
import type { INeuron } from "./interfaces/INeuron.interface";


export default class NeuronAccessor {
  private neuron: INeuron;

  constructor (neuron: INeuron) {
    this.neuron = neuron;
  }

  public getId (): string {
    return this.neuron.id;
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
    return this.neuron.state.readyToSend;
  }
  
  public getMembranePotential (): number {
    return this.neuron.state.membranePotential;
  }

  public setMembranePotential (potential: number): void {
    this.neuron.state.membranePotential = potential;
  }

  public getRestingPotential (): number {
    return this.neuron.state.restingPotential;
  }

  public getInactivityCounter (): number {
    return this.neuron.state.inactivityCounter;
  }

  public setInactivityCounter (counter: number): void {
    this.neuron.state.inactivityCounter = counter;
  }

  public getInactivityThreshold (): number {
    return this.neuron.state.inactivityThreshold;
  }

  public setInactivityThreshold (treshold: number): void {
    this.neuron.state.inactivityThreshold = treshold;
  }

  public getSpikeThreshold (): number {
    return this.neuron.state.spikeThreshold;
  }

  public setSpikeThreshold (threshold: number): void {
    this.neuron.state.spikeThreshold = Math.max(-60, Math.min(-40, threshold))
  }

  public getNeuroTransmitter(): ChemicalSignalType {
    return this.neuron.state.neuroTransmitter;
  }

  public setNeuroTransmitter (transmitter: ChemicalSignalType): void {
    this.neuron.state.neuroTransmitter = transmitter;
  }
  
  public getRefractoryDuration (): number {
    return this.neuron.state.refractoryDuration;
  }

  public setRefractoryDuration (duration: number): void {
    this.neuron.state.refractoryDuration = Math.max(1, Math.min(20, duration));
  }

  public getTau (): number {
    return this.neuron.state.tau;
  }

  public setTau (tau: number): void {
    this.neuron.state.tau = tau;
  }

  public getReceptors (): Set<ChemicalSignalType> {
    return this.neuron.state.receptors;
  }

  public setReceptors (receptors: Set<ChemicalSignalType>): void {
    this.neuron.state.receptors = receptors
  }

  public getMode (): NeuronMode {
    return this.neuron.state.mode;
  }

  public setMode (value: NeuronMode): void {
    this.neuron.state.mode = value;
  }
}