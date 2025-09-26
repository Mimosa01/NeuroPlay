import { v4 as uuidv4 } from 'uuid';
import { SignalFactory } from './SignalFactory';
import type { IEdge } from '../interfaces/IEdge.interface';
import { BASE_POSTSYNAPTIC_EFFECTS as BPE } from '../../../shared/constants/signals.constants';
import NeuronAccessor from './neurons/NeuronAccessor';
import type { NeuronInstance, NeuroTransmitterType } from '../types';

export default class Edge implements IEdge {
  public readonly id: string;
  public readonly source: NeuronInstance;
  public readonly target: NeuronInstance;
  
  private conductance: number;        // условные единицы (0.1–2.0)
  private sourceAccessor: NeuronAccessor;
  private delay: number;              // шагов задержки

  private signalQueue: Array<{ effect_mV: number; delay: number }> = [];

  constructor(
    source: NeuronInstance, 
    target: NeuronInstance, 
    conductance: number = 1.0,
    delay: number = 1,
  ) {
    this.id = uuidv4();
    this.source = source;
    this.target = target;
    this.conductance = Math.max(0.1, Math.min(2.0, conductance)); // 0.1–2.0
    this.delay = Math.max(1, Math.min(10, delay)); // 1–10 шагов
    this.sourceAccessor = new NeuronAccessor(this.source);
  }

  // === Геттеры и сеттеры ===
  
  public setConductance(newConductance: number): void {
    const old = this.conductance;
    this.conductance = Math.max(0.1, Math.min(2.0, newConductance));
    console.log(`[Edge ${this.id}] Проводимость изменена: ${old.toFixed(1)} → ${this.conductance.toFixed(1)}`);
  }

  public getConductance(): number {
    return this.conductance;
  }

  public setDelay(newDelay: number): void {
    const old = this.delay;
    this.delay = Math.max(1, Math.min(10, newDelay));
    console.log(`[Edge ${this.id}] Задержка изменена: ${old} → ${this.delay} шагов`);
  }

  public getDelay(): number {
    return this.delay;
  }

  // === Передача сигнала (вызывается при спайке источника) ===
  
  public transmit(): void {
    const baseEffect = BPE[this.sourceAccessor.getNeuroTransmitter()];
    
    const totalEffect_mV = baseEffect * this.conductance;
    
    // Ставим в очередь
    this.signalQueue.push({
      effect_mV: totalEffect_mV,
      delay: this.delay,
    });
  }

  // === Доставка сигналов (вызывается симулятором каждый шаг) ===
  
  public deliverSignals(): void {
    const signalsToDeliver: number[] = [];
    
    // Обновляем задержки
    this.signalQueue = this.signalQueue.filter(signalObj => {
      signalObj.delay--;
      if (signalObj.delay <= 0) {
        signalsToDeliver.push(signalObj.effect_mV);
        return false;
      }
      return true;
    });

    // Применяем сигналы к целевому нейрону
    signalsToDeliver.forEach(effect_mV => {
      if (this.isModulator(this.sourceAccessor.getNeuroTransmitter())) {
        const signal = SignalFactory.create(this.sourceAccessor.getNeuroTransmitter(), 0);
        signal.applyTo(this.target);
      } else {
        const signal = SignalFactory.create(this.sourceAccessor.getNeuroTransmitter(), effect_mV);
        signal.applyTo(this.target);
      }
    });
  }

  // Вспомогательный метод (можно вынести в утилиты)
  private isModulator(nt: NeuroTransmitterType): boolean {
    return ['dopamine', 'serotonin', 'acetylcholine'].includes(nt);
  }

  // === Для отладки ===
  public getPendingSignalsCount(): number {
    return this.signalQueue.length;
  }

  public getPendingSignals(): Array<{ effect_mV: number; delay: number }> {
    return [...this.signalQueue];
  }
}
