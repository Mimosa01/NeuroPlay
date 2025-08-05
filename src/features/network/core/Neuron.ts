import { v4 as uuidv4 } from 'uuid';
import type { EdgeId } from '../types/types';
import type Edge from './Edge';
import type { Coords } from '../../../shared/types/types';

export default class Neuron {
  public readonly id: string; 
  private inputEdges: Map<string, Edge> = new Map();
  private outputEdges: Map<string, Edge> = new Map();

  // Биологические параметры в мВ
  private membranePotential: number = -70;      // мВ (покойный потенциал)
  private restingPotential: number = -70;       // мВ (базовый уровень) 
  private spikeThreshold: number = -55;        // мВ (порог спайка)
  private spikeAmplitude: number = 110;         // мВ (размер спайка)
  
  // Рефрактерность
  private refractory: boolean = false;
  private refractoryCounter: number = 0;
  private refractoryDuration: number = 4;       // шагов

  // Затухание и бездействие
  private decayFactor: number = 0.95;           // фактор затухания
  private inactivityCounter: number = 0;
  private inactivityThreshold: number = 100;    // шагов до "смерти"

  // Координаты и метка
  private coords: Coords;
  private label: string = '';

  // Состояние готовности
  private readyToSend: boolean = false;
  
  constructor (coords: Coords) {
    this.id = uuidv4();
    this.coords = coords;
    console.log(`[Neuron ${this.id}] Создан (0 мВ)`);
  }

  // === Геттеры и сеттеры ===
  
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

  public getReadyToSend (): boolean {
    return this.readyToSend;
  }

  // === Биологические параметры ===
  
  public getMembranePotential (): number {
    return this.membranePotential;
  }

  public setMembranePotential (potential: number): void {
    this.membranePotential = potential;
  }

  public getSpikeThreshold (): number {
    return this.spikeThreshold;
  }

  public setSpikeThreshold (threshold: number): void {
    this.spikeThreshold = Math.max(5, Math.min(50, threshold)); // 5-50 мВ
  }

  public getSpikeAmplitude (): number {
    return this.spikeAmplitude;
  }

  public setSpikeAmplitude (amplitude: number): void {
    this.spikeAmplitude = Math.max(50, Math.min(200, amplitude)); // 50-200 мВ
  }

  public getDecayFactor (): number {
    return this.decayFactor;
  }

  public setDecayFactor (factor: number): void {
    this.decayFactor = Math.max(0.8, Math.min(0.99, factor)); // 0.8-0.99
  }

  // === Рефрактерность ===
  
  public getRefractoryDuration (): number {
    return this.refractoryDuration;
  }

  public setRefractoryDuration (duration: number): void {
    this.refractoryDuration = Math.max(1, Math.min(20, duration)); // 1-20 шагов
  }

  // === Счётчики ===
  
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

  // === Связи ===
  
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

  // === Логика ===
  
  private isRefractory (): boolean {
    if (this.refractory) {
      this.refractoryCounter++;
      if (this.refractoryCounter >= this.refractoryDuration) {
        this.refractory = false;
        this.refractoryCounter = 0;
        this.membranePotential = this.restingPotential;
      }
      return true;
    }
    return false;
  }

  public receive(signal_mV: number): void {
    if (!this.isRefractory()) {
      this.membranePotential += signal_mV;
      if (signal_mV > 0) this.inactivityCounter = 0;
      console.log(`[Neuron ${this.id}] Получен сигнал: ${signal_mV.toFixed(1)} мВ, потенциал: ${this.membranePotential.toFixed(1)} мВ`);
    }
  }

  public process(): void {
    if (!this.isRefractory()) {
      if (this.membranePotential >= this.spikeThreshold) {
        console.log(`[Neuron ${this.id}] Достигнут порог ${this.spikeThreshold} мВ`);
        this.readyToSend = true;
        return;
      }
    }
  }

  public fire(): void {
    if (!this.readyToSend) return;

    console.log(`[Neuron ${this.id}] Спайк! ${this.spikeAmplitude} мВ по ${this.outputEdges.size} ребрам`);

    for (const edge of this.outputEdges.values()) {
      edge.transmit(this.spikeAmplitude);
    }

    this.membranePotential = -75;
    this.readyToSend = false;
    this.refractory = true;
  }

  public decay(): void {
    // Обычное затухание
    const difference = this.membranePotential - this.restingPotential;
    if (Math.abs(difference) > 0.1) {
      this.membranePotential = this.restingPotential + (difference * this.decayFactor);
    } else {
      this.membranePotential = this.restingPotential;
    }

    // Счётчик бездействия
    if (Math.abs(difference) < 0.1) {
      this.inactivityCounter++;
    } else {
      this.inactivityCounter = 0;
    }
  }

  public isDead(): boolean {
    return this.inactivityCounter >= this.inactivityThreshold;
  }
}