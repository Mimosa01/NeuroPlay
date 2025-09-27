import { v4 as uuidv4 } from 'uuid';
import type { IEdge } from "../../interfaces/IEdge.interface";
import { DEFAULT_BIOLOGICAL_NEURON_PARAMS as DBNP } from '../../../../shared/constants/neuron.constants';
import type { NeuronInstance, Coords, NeuroTransmitterType, ModulationEffect } from '../../types';


export default abstract class BaseNeuron implements NeuronInstance {
  public readonly id: string;
  public inputEdges: Map<string, IEdge> = new Map();
  public outputEdges: Map<string, IEdge> = new Map();
  public label: string = '';
  public coords: Coords;

  public refractoryDuration: number = DBNP.refractoryDuration; 
  public refractorySteps: number = 0;
  public restingPotential: number = DBNP.restingPotential;         // мВ (базовый уровень) 
  public membranePotential: number = DBNP.restingPotential;        // мВ (покойный потенциал)
  public inactivityCounter: number = 0;
  public inactivityThreshold: number = DBNP.inactivityThreshold;   // шагов до "смерти"
  public neuroTransmitter: NeuroTransmitterType = 'glutamate';     // тип нейромедиатора
  public tau: number = DBNP.tau || 15;                          // мембранная постоянная (в шагах)
  public receptors: Set<NeuroTransmitterType> = new Set();

  public spikeThreshold: number = DBNP.spikeThreshold;             // мВ (порог спайка)

  public readyToSend: boolean = false;

  protected adaptationDelta: number = 3.0;
  protected adaptationDuration: number = 50;
  protected adaptationCounter: number = 0;

  // Сохраняем исходные значения для отката
  private originalThreshold: number | null = null;
  private originalTau: number | null = null;
  private modulationSteps: number = 0;

  constructor (coords: Coords) {
    this.id = uuidv4();
    this.coords = coords;
  }
  
  public addInputEdge (edge: IEdge): void {
    this.inputEdges.set(edge.id, edge);
  }

  public addOutputEdge (edge: IEdge): void {
    this.outputEdges.set(edge.id, edge);
  }

  public removeInputEdge (edgeId: string): void {
    this.inputEdges.delete(edgeId);
  }

  public removeOutputEdge (edgeId: string): void {
    this.outputEdges.delete(edgeId);
  }

  public hasReceptor(transmitter: NeuroTransmitterType): boolean {
    return this.receptors.has(transmitter);
  }

  public addReceptor(type: NeuroTransmitterType): void {
    this.receptors.add(type);
  }

  public removeReceptor(type: NeuroTransmitterType): void {
    this.receptors.delete(type);
  }

  public step(): void {
    // 1. Обновляем рефрактер
    if (this.refractorySteps > 0) {
      this.refractorySteps--;
    }

    // 2. Применяем утечку (возвращаем к restingPotential)
    const diff = this.membranePotential - this.restingPotential;
    this.membranePotential -= diff / this.tau;

    // 3. Обновляем счётчик бездействия
    if (Math.abs(diff) < 0.1) {
      this.inactivityCounter++;
    } else {
      this.inactivityCounter = 0;
    }

    if (this.modulationSteps > 0) {
      this.modulationSteps--;
      if (this.modulationSteps === 0) {
        this.restoreOriginalParameters();
      }
    }

    // 4. Проверяем, нужно ли генерировать спайк
    this.checkForSpike();
  }

  public receive(signal_mV: number): void {
    this.membranePotential += signal_mV;
    if (signal_mV > 0) this.inactivityCounter = 0;
  }

  public isRefractory(): boolean {
    return this.refractorySteps > 0;
  }

  public isDead(): boolean {
    return this.inactivityCounter >= this.inactivityThreshold;
  }

  public modulation(effect: ModulationEffect): void {
    if (this.modulationSteps > 0) return;

    // Сохраняем оригинальные значения
    this.originalThreshold = this.spikeThreshold;
    this.originalTau = this.tau;

    // Применяем эффекты
    if (effect.thresholdDelta !== undefined) {
      this.spikeThreshold += effect.thresholdDelta;
    }
    if (effect.tauDelta !== undefined) {
      this.tau += effect.tauDelta;
    }

    this.modulationSteps = effect.duration;
    console.log(`[Neuron ${this.id}] Применена модуляция: порог ${this.spikeThreshold} мВ`);
  }

  private restoreOriginalParameters(): void {
    if (this.originalThreshold !== null) {
      this.spikeThreshold = this.originalThreshold;
      this.originalThreshold = null;
    }
    if (this.originalTau !== null) {
      this.tau = this.originalTau;
      this.originalTau = null;
    }
    console.log(`[Neuron ${this.id}] Модуляция завершена`);
  }

  public abstract checkForSpike (): void;
  
  public abstract fire (): void;
}