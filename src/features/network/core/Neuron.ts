import { v4 as uuidv4 } from 'uuid';
import type { ActivationFunction, EdgeId } from '../types/types';
import type Edge from './Edge';
import { Activation } from './utils/Activation';
import type { Coords } from '../../../shared/types/types';

export default class Neuron {
  public readonly id: string; 
  private activationFn: ActivationFunction;
  private activationType: keyof typeof Activation.functions;
  private inputEdges: Map<string, Edge> = new Map();
  private outputEdges: Map<string, Edge> = new Map();

  private accumulatedSignal: number = 0;
  private inactivityCounter: number = 0;
  private inactivityThreshold: number = 10;

  private coords: Coords;
  private label: string = '';
  
  constructor (activationType: keyof typeof Activation.functions = 'relu', coords: Coords) {
    this.id = uuidv4();
    this.activationType = activationType;
    this.activationFn = Activation.functions[activationType];
    this.coords = coords;
    console.log(`[Neuron ${this.id}] Создан с функцией активации: ${activationType}`);
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

  public getInputEdges (): Map<string, Edge> {
    return this.inputEdges;
  }

  public getOutputEdges (): Map<string, Edge> {
    return this.outputEdges;
  }

  public receive(value: number): void {
    this.accumulatedSignal += value;
    if (value > 0) this.inactivityCounter = 0;
    console.log(`[Neuron ${this.id}] Получен сигнал: ${value}, накоплено: ${this.accumulatedSignal}`);
  }

  public process (): number {
    const output = this.activationFn(this.accumulatedSignal);
    console.log(`[Neuron ${this.id}] Обработка сигнала. Вход: ${this.accumulatedSignal}, Выход: ${output}`);
    this.accumulatedSignal = 0;
    return output;
  }

  public fire (signal: number): void {
    console.log(`[Neuron ${this.id}] Передача сигнала: ${signal} по ${this.outputEdges.size} ребрам`);
    for (const edge of this.outputEdges.values()) {
      edge.transmit(signal);
    }
  }

  public decay (factor: number): void {
    this.accumulatedSignal *= (1 - factor);
    if (this.accumulatedSignal < 0.001) {
      this.accumulatedSignal = 0;
      this.inactivityCounter++;
      console.log(`[Neuron ${this.id}] Сигнал затух. Счетчик бездействия: ${this.inactivityCounter}`);
    } else {
      this.inactivityCounter = 0;
    }
  }

  public isDead (): boolean {
    const dead = this.inactivityCounter >= this.inactivityThreshold;
    if (dead) {
      console.log(`[Neuron ${this.id}] Помечен как мертвый (бездействие ${this.inactivityCounter} тиков)`);
    }
    return dead;
  }

  public getCoords (): Coords {
    return this.coords;
  }

  public setCoords (coords: Coords): void {
    this.coords = coords;
  }

  public getActivationFn (): string {
    return this.activationType;
  }

  public setActivationFn (activationType: keyof typeof Activation.functions): void {
    this.activationType = activationType;
    this.activationFn = Activation.functions[activationType];
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

  public setInactivityCounter (value: number): void {
    this.inactivityCounter = value;
  }

  public getInactivityThreshold (): number {
    return this.inactivityThreshold;
  }

  public setInactivityThreshold (value: number): void {
    this.inactivityThreshold = value;
  }
}
