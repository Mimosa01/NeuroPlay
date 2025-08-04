import { v4 as uuidv4 } from 'uuid';
import type { EdgeId } from '../types/types';
import type Edge from './Edge';
import type { Coords } from '../../../shared/types/types';

export default class Neuron {
  public readonly id: string; 
  private inputEdges: Map<string, Edge> = new Map();
  private outputEdges: Map<string, Edge> = new Map();

  private refractory: boolean = false;
  private refractoryCounter: number = 0;
  private refractoryThreshold: number = 4;

  private signalThreshold: number = 0.9;
  private fading: number = 0.95;
  private accumulatedSignal: number = 0;

  private inactivityCounter: number = 0;
  private inactivityThreshold: number = 100;

  private coords: Coords;
  private label: string = '';

  private readyToSend: boolean = false;
  
  constructor (coords: Coords) {
    this.id = uuidv4();
    this.coords = coords;
    console.log(`[Neuron ${this.id}] Создан`);
  }

  public getInputEdges (): Map<string, Edge> {
    return this.inputEdges;
  }

  public getOutputEdges (): Map<string, Edge> {
    return this.outputEdges;
  }

  public getCoords (): Coords {
    return this.coords;
  }

  public setCoords (coords: Coords): void {
    this.coords = coords;
  }

  public getLabel (): string {
    return this.label;
  }

  public setLabel (label: string): void {
    this.label = label;
  }

  public getAccumulatedSignal (): number {
    return this.accumulatedSignal;
  }

  public setAccumulatedSignal (signal: number): void {
    this.accumulatedSignal = signal;
  }

  public getInactivityCounter (): number {
    return this.inactivityCounter;
  }

  public setInactivityCounter (count: number): void {
    this.inactivityCounter = count;
  }

  public getInactivityThreshold (): number {
    return this.inactivityThreshold;
  }

  public setInactivityThreshold (threshold: number): void {
    this.inactivityThreshold = threshold;
  }

  public getRefractoryThreshold (): number {
    return this.refractoryThreshold;
  }

  public setRefractoryThreshold (count: number): void {
    this.refractoryThreshold = count;
  }

  public getSignalTreshold (): number {
    return this.signalThreshold;
  }

  public setSignalThreshold (threshold: number): void {
    this.signalThreshold = threshold < 0 || threshold > 1 ? this.signalThreshold : threshold;
  }

  public getFading (): number {
    return this.fading;
  }

  public setFading (fading: number): void {
    this.fading = fading < 0 || fading > 1 ? this.fading : fading;
  }

  public getReadyToSend (): boolean {
    return this.readyToSend;
  }

  public addInputEdge (edge: Edge): void {
    this.inputEdges.set(edge.id, edge);
    console.log(`[Neuron ${this.id}] Добавлено входящее ребро: ${edge.id}`);
  }

  public addOutputEdge (edge: Edge): void {
    this.outputEdges.set(edge.id, edge);
    console.log(`[Neuron ${this.id}] Добавлено исходящее ребро: ${edge.id}`);
  }

  public removeInputEdge (edgeId: EdgeId): void {
    this.inputEdges.delete(edgeId);
    console.log(`[Neuron ${this.id}] Удалено входящее ребро: ${edgeId}`);
  }

  public removeOutputEdge (edgeId: EdgeId): void {
    this.outputEdges.delete(edgeId);
    console.log(`[Neuron ${this.id}] Удалено исходящее ребро: ${edgeId}`);
  }

  private isRefractory (): boolean {
    if (this.refractory) {
      this.refractoryCounter++;
      if (this.refractoryCounter >= this.refractoryThreshold) {
        this.refractory = false;
        this.refractoryCounter = 0;
        return false;
      }
    }
    return true;
  }

  public receive(value: number): void {
    if (this.isRefractory()) {
      this.accumulatedSignal += value;
      if (value > 0) this.inactivityCounter = 0;
    }
    console.log(`[Neuron ${this.id}] - Получен сигнал: ${value} - накопленно: ${this.accumulatedSignal}`)
  }

  public process(): void {
    if (this.isRefractory()) {
      if (this.accumulatedSignal >= this.signalThreshold) {
        console.log(`Neuron ${this.id} - готов`)
        this.readyToSend = true;
        return;
      } 
    }
  }

  public fire (): void {
    if (!this.readyToSend) {
      return
    };
    console.log(`[Neuron ${this.id}] Передача сигнала: ${this.accumulatedSignal} по ${this.outputEdges.size} ребрам`);
  
    for (const edge of this.outputEdges.values()) {
      edge.transmit(1);
    }
    
    this.accumulatedSignal = 0;
    this.readyToSend = false;
    this.refractory = true;
  }

  public decay(): void {
    if (!this.refractory) {
      this.accumulatedSignal *= this.fading;
      if (this.accumulatedSignal < 0.001) {
        this.accumulatedSignal = 0;
        this.inactivityCounter++;
      } else {
        this.inactivityCounter = 0;
      }
    }
  }

  public isDead(): boolean {
    return this.inactivityCounter >= this.inactivityThreshold;
  }
}
