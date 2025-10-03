import { v4 as uuidv4 } from 'uuid';
import type { IChemicalSynaps } from '../interfaces/ISynaps.interface';
import { BASE_POSTSYNAPTIC_EFFECTS as BPE } from '../constants/signals.constants';
import type { NeuronInstance } from '../types/types';
import { eventBus } from '../core/EventBus';
import NeuronAccessor from '../core/neurons/NeuronAccessor';

export default class ChemicalSynaps implements IChemicalSynaps {
  public readonly id: string;
  public readonly source: NeuronInstance;
  public readonly target: NeuronInstance;
  
  // private conductance: number;        // условные единицы (0.1–2.0)
  private sourceAccessor: NeuronAccessor;
  private delay: number;              // шагов задержки

  private signalQueue: Array<{ effect_mV: number; delay: number }> = [];
  // private signalQueue: Array<{ baseEffect: number; delay: number }> = [];

  private baseConductance: number; // ← неизменная "настройка"
  private currentConductance: number; // ← текущая, с модуляцией

  constructor(
    source: NeuronInstance, 
    target: NeuronInstance, 
    conductance: number = 1.0,
    delay: number = 1,
  ) {
    this.id = uuidv4();
    this.source = source;
    this.target = target;
    this.baseConductance = Math.max(0.1, Math.min(2.0, conductance));
    this.currentConductance = this.baseConductance; // изначально = базе
    this.delay = Math.max(1, Math.min(10, delay)); // 1–10 шагов
    this.sourceAccessor = new NeuronAccessor(this.source);
  }

  // === Геттеры и сеттеры ===

  public setConductance(newConductance: number): void {
    const old = this.baseConductance;
    this.baseConductance = Math.max(0.1, Math.min(2.0, newConductance));
    // Важно: обновляем и current, если нет активной модуляции
    this.currentConductance = this.baseConductance;
    console.log(`[ChemicalSynaps ${this.id}] Базовая проводимость изменена: ${old.toFixed(1)} → ${this.baseConductance.toFixed(1)}`);
  }

  public getConductance(): number {
    console.log(this.currentConductance)
    return this.currentConductance;
  }

  public setDelay(newDelay: number): void {
    const old = this.delay;
    this.delay = Math.max(1, Math.min(10, newDelay));
    console.log(`[ChemicalSynaps ${this.id}] Задержка изменена: ${old} → ${this.delay} шагов`);
  }

  public getDelay(): number {
    return this.delay;
  }

  // === Передача сигнала (вызывается при спайке источника) ===

  public transmit(): void {
    const baseEffect = BPE[this.sourceAccessor.getNeuroTransmitter()] || 0;
    const totalEffect_mV = baseEffect * this.currentConductance; // ← используем текущую!
    this.signalQueue.push({
      effect_mV: totalEffect_mV,
      delay: this.delay,
    });
  }

  // === Доставка сигналов (вызывается симулятором каждый шаг) ===

  public deliverSignals(): void {
    const signalsToDeliver: number[] = [];
    this.signalQueue = this.signalQueue.filter(signalObj => {
      signalObj.delay--;
      if (signalObj.delay <= 0) {
        signalsToDeliver.push(signalObj.effect_mV);
        return false;
      }
      return true;
    });

    signalsToDeliver.forEach(effect_mV => {
      if (!this.target.hasReceptor(this.sourceAccessor.getNeuroTransmitter())) {
        return;
      }
      eventBus.publish('chemicalSynaps.signal.delivered', {
        synapsId: this.id,
        targetId: this.target.id,
        effect_mV,
      });
    });
  }

  public applyConductanceMultiplier(multiplier: number): void {
    this.currentConductance = this.baseConductance * multiplier;
    // Ограничиваем диапазон
    this.currentConductance = Math.max(0.1, Math.min(2.0, this.currentConductance));
  }

  public resetConductance(): void {
    this.currentConductance = this.baseConductance;
  }

  // === Для отладки ===
  public getPendingSignalsCount(): number {
    return this.signalQueue.length;
  }

  public getPendingSignals(): Array<{ effect_mV: number; delay: number }> {
    return [...this.signalQueue];
  }
}