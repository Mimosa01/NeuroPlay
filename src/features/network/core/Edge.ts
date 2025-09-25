import { v4 as uuidv4 } from 'uuid';
import type { NeuronInstance, NeuroTransmitterType } from '../types/types';
import { SignalFactory } from './SignalFactory';
import type { IEdge } from '../interfaces/IEdge.interface';
import NeuronAccessor from './neurons/NeuronAccessor';
import { BASE_POSTSYNAPTIC_EFFECTS as BPE} from '../params/defaultNeuronParams';

export default class Edge implements IEdge {
  public readonly id: string;
  public readonly source: NeuronInstance;
  public readonly target: NeuronInstance;
  
  private conductance: number;        // условные единицы (0.1–2.0)
  private transmitter: NeuroTransmitterType;
  private delay: number;              // шагов задержки

  // Состояние
  private signalQueue: Array<{ effect_mV: number; delay: number }> = [];

  constructor(
    source: NeuronInstance, 
    target: NeuronInstance, 
    conductance: number = 1.0,
    delay: number = 1,
    transmitter: NeuroTransmitterType
  ) {
    this.id = uuidv4();
    this.source = source;
    this.target = target;
    this.conductance = Math.max(0.1, Math.min(2.0, conductance)); // 0.1–2.0
    this.delay = Math.max(1, Math.min(10, delay)); // 1–10 шагов
    this.transmitter = transmitter;
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
    // Определяем базовый постсинаптический эффект для этого медиатора
    const baseEffect = BPE[this.transmitter] ?? 0;
    
    // Итоговое влияние = базовый эффект × проводимость синапса
    const totalEffect_mV = baseEffect * this.conductance;

    console.log(`[Edge ${this.id}] ${this.transmitter} → ${totalEffect_mV.toFixed(1)} мВ (задержка: ${this.delay})`);
    
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
      // Для модуляторов (DA, 5-HT) effect_mV = 0 → можно пропустить
      if (effect_mV === 0 && this.isModulator(this.transmitter)) {
        // Позже: вызывать модуляцию, а не изменение Vm
        console.log(`[Edge ${this.id}] Модулятор ${this.transmitter} — влияет на параметры, не на Vm`);
        return;
      }

      const signal = SignalFactory.create(this.transmitter, effect_mV);
      signal.applyTo(new NeuronAccessor(this.target));
      console.log(`[Edge ${this.id}] Доставлено: ${effect_mV.toFixed(1)} мВ`);
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
