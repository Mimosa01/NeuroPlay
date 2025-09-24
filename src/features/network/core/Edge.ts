import { v4 as uuidv4 } from 'uuid';
import type { NeuronInstance, NeuroTransmitterType } from '../types/types';
import { SignalFactory } from './SignalFactory';
import type { IEdge } from '../interfaces/IEdge.interface';
import NeuronAccessor from './neurons/NeuronAccessor';

export default class Edge implements IEdge {
  public readonly id: string;
  public readonly source: NeuronInstance;
  public readonly target: NeuronInstance;
  
  // Биологические параметры
  private conductance: number = 1.0;        // микросименсы (μS)
  private transmitter: NeuroTransmitterType;

  // Состояние
  private signalQueue: Array<{signal_mV: number, delay: number}> = [];
  private delay: number = 1;                // шагов задержки

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
    this.conductance = Math.max(0, Math.min(2.0, conductance)); // 0.0 - 2.0 μS
    this.delay = Math.max(1, Math.min(delay, 10)); // 1-10 шагов
    this.transmitter = transmitter;
  }

  // === Геттеры и сеттеры ===
  
  public setConductance(newConductance: number): void {
    const old = this.conductance;
    this.conductance = Math.max(0.1, Math.min(10.0, newConductance));
    console.log(`[Edge ${this.id}] Проводимость изменена: ${old.toFixed(1)} → ${this.conductance.toFixed(1)} μS`);
  }

  public getConductance(): number {
    return this.conductance;
  }

  public setDelay(newDelay: number): void {
    const old = this.delay;
    this.delay = Math.max(0, Math.min(10, newDelay));
    console.log(`[Edge ${this.id}] Задержка изменена: ${old} → ${this.delay} шагов`);
  }

  public getDelay(): number {
    return this.delay;
  }

  // === Для отладки и визуализации ===
  
  public getPendingSignalsCount(): number {
    return this.signalQueue.length;
  }

  public getPendingSignals(): Array<{signal_mV: number, delay: number}> {
    return [...this.signalQueue]; // копия
  }

  // === Передача сигнала с задержкой ===
  
  public transmit(signal_mV: number): void {
    console.log(`[Edge ${this.id}] Сигнал ${signal_mV.toFixed(1)} мВ × ${this.conductance.toFixed(1)} μS = ${(signal_mV * this.conductance).toFixed(1)} мВ (задержка: ${this.delay})`);
    
    // Добавляем в очередь с задержкой
    this.signalQueue.push({
      signal_mV: signal_mV * this.conductance,
      delay: this.delay,
    });
  }

  // === Доставка сигналов по истечении задержки ===
  
  public deliverSignals(): void {
    const signalsToDeliver: number[] = [];
    
    // Обновляем задержки и собираем готовые сигналы
    this.signalQueue = this.signalQueue.filter(signalObj => {
      signalObj.delay--;
      
      if (signalObj.delay <= 0) {
        signalsToDeliver.push(signalObj.signal_mV);
        return false; // удаляем из очереди
      }
      return true; // остаётся в очереди
    });

    // Доставляем готовые сигналы
    signalsToDeliver.forEach(signal_mV => {
      const transmitter = SignalFactory.create(this.transmitter, signal_mV * this.conductance);
      transmitter.applyTo(new NeuronAccessor(this.target))
      console.log(`[Edge ${this.id}] Доставлен сигнал: ${signal_mV.toFixed(1)} мВ`);
    });
  }
}