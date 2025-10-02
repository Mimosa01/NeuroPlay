import { v4 as uuidv4 } from 'uuid';
import type { ISynaps } from "../../interfaces/ISynaps.interface";
import { DEFAULT_BIOLOGICAL_NEURON_PARAMS as DBNP } from '../../../../shared/constants/neuron.constants';
import type { NeuronInstance, Coords, NeuroTransmitterType, ChemicalSignalType } from '../../types/types';
import type { ModulatorEffect } from '../../types/modulator.types';


export default abstract class BaseNeuron implements NeuronInstance {
  public readonly id: string;
  public inputSynapses: Map<string, ISynaps> = new Map();
  public outputSynapses: Map<string, ISynaps> = new Map();
  public label: string = '';
  public coords: Coords;

  public refractoryDuration: number = DBNP.refractoryDuration; 
  public refractorySteps: number = 0;
  public restingPotential: number = DBNP.restingPotential;         // мВ (базовый уровень) 
  public membranePotential: number = DBNP.restingPotential;        // мВ (покойный потенциал)
  public inactivityCounter: number = 0;
  public inactivityThreshold: number = DBNP.inactivityThreshold;   // шагов до "смерти"
  public neuroTransmitter: ChemicalSignalType = 'glutamate';     // тип нейромедиатора
  public tau: number = DBNP.tau || 15;                          // мембранная постоянная (в шагах)
  public receptors: Set<ChemicalSignalType> = new Set();

  public spikeThreshold: number = DBNP.spikeThreshold;             // мВ (порог спайка)

  public readyToSend: boolean = false;

  protected adaptationDelta: number = 3.0;
  protected adaptationDuration: number = 50;
  protected adaptationCounter: number = 0;
  public adaptationThresholdShift: number = 0;

  // В BaseNeuron, рядом с другими полями:
  public readonly baseSpikeThreshold: number = DBNP.spikeThreshold;
  public readonly baseTau: number = DBNP.tau || 15;

  public readonly baseConductanceMultiplier: number = 1;
  
  public currentThresholdShift: number = 0;
  public currentTauMultiplier: number = 1;
  // public currentConductanceMultiplier: number = 1;

  constructor (coords: Coords) {
    this.id = uuidv4();
    this.coords = coords;
  }
  
  public addInputSynaps (synaps: ISynaps): void {
    this.inputSynapses.set(synaps.id, synaps);
  }

  public addOutputSynaps (synaps: ISynaps): void {
    this.outputSynapses.set(synaps.id, synaps);
  }

  public removeInputSynaps (synapsId: string): void {
    this.inputSynapses.delete(synapsId);
  }

  public removeOutputSynaps (synapsId: string): void {
    this.outputSynapses.delete(synapsId);
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

    if (this.adaptationCounter > 0) {
      this.adaptationCounter--;
      if (this.adaptationCounter === 0) {
        this.adaptationThresholdShift = 0;
      }
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

  // public applyModulationEffect(effect: ModulatorEffect): void {
  //   if (effect.thresholdShift !== undefined) {
  //     this.currentThresholdShift += effect.thresholdShift;
  //   }
  //   if (effect.tauMultiplier !== undefined) {
  //     this.currentTauMultiplier *= effect.tauMultiplier;
  //   }
  //   if (effect.conductanceMultiplier !== undefined) {
  //     this.currentConductanceMultiplier *= effect.conductanceMultiplier;
  //   }
  // }

  // public finalizeModulation(): void {
  //   this.spikeThreshold = this.baseSpikeThreshold + this.currentThresholdShift + this.adaptationThresholdShift;
  //   this.tau = this.baseTau * this.currentTauMultiplier;
    
  //   // Сбрасываем аккумуляторы
  //   this.currentThresholdShift = 0;
  //   this.currentTauMultiplier = 1;
  //   this.currentConductanceMultiplier = 1; // ← сбрасываем после применения
  // }

  public applyModulationEffect(effect: ModulatorEffect): void {
    console.log(`EFFECT% ${effect} --- NEURON: ${this.id}`);  
    if (effect.thresholdShift !== undefined) {
      this.currentThresholdShift += effect.thresholdShift;
    }
    if (effect.tauMultiplier !== undefined) {
      this.currentTauMultiplier *= effect.tauMultiplier;
    }
  }

  public finalizeModulation(): void {
    // Суммируем все эффекты: базовый + модуляция + адаптация
    this.spikeThreshold = this.baseSpikeThreshold 
      + this.currentThresholdShift 
      + this.adaptationThresholdShift;

    this.tau = this.baseTau * this.currentTauMultiplier;

    // Сбрасываем только модуляционные аккумуляторы
    this.currentThresholdShift = 0;
    this.currentTauMultiplier = 1;

    // Адаптация уменьшается со временем — это делаем в step()
  }

  public abstract checkForSpike (): void;
  
  public abstract fire (): void;
}