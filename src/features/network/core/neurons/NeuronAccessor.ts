import type { Coords } from "../../../../shared/types/types";
import type { IEdge } from "../../interfaces/IEdge.interface";
import type { INeuron } from "../../interfaces/INeuron.interface";
import type { NeuroTransmitterType } from "../../types/types";

export default class NeuronAccessor {
  private neuron: INeuron;

  constructor (neuron: INeuron) {
    this.neuron = neuron;
  }

  public getId (): string {
    return this.neuron.id;
  }
  
  public getInputEdges (): Map<string, IEdge> {
    return this.neuron.inputEdges;
  }

  public getOutputEdges (): Map<string, IEdge> {
    return this.neuron.outputEdges;
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
    this.neuron.spikeThreshold = Math.max(5, Math.min(50, threshold)); // 5-50 мВ
  }

  public getSpikeAmplitude (): number {
    return this.neuron.spikeAmplitude;
  }

  public setSpikeAmplitude (amplitude: number): void {
    this.neuron.spikeAmplitude = Math.max(50, Math.min(200, amplitude)); // 50-200 мВ
  }

  public getDecayFactor (): number {
    return this.neuron.decayFactor;
  }

  public setDecayFactor (factor: number): void {
    this.neuron.decayFactor = Math.max(0.8, Math.min(0.99, factor)); // 0.8-0.99
  }

  public getNeuroTransmitter(): NeuroTransmitterType {
    return this.neuron.neuroTransmitter;
  }

  public setNeuroTransmitter (transmitter: NeuroTransmitterType): void {
    this.neuron.neuroTransmitter = transmitter;
  }
  
  public getRefractoryDuration (): number {
    return this.neuron.refractoryDuration;
  }

  public setRefractoryDuration (duration: number): void {
    this.neuron.refractoryDuration = Math.max(1, Math.min(20, duration)); // 1-20 шагов
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
}