import { v4 as uuidv4 } from 'uuid';
import type Neuron from './Neuron';
import type { EdgeId, NeuroTransmitterType } from '../types/types';

export default class Edge {
  public readonly id: EdgeId;
  public readonly source: Neuron;
  public readonly target: Neuron;
  
  // Биологические параметры
  private conductance: number = 1.0;        // микросименсы (μS)
  private delay: number = 1;                // шагов задержки
  private neurotransmitter: NeuroTransmitterType = 'glutamate';
  
  // Состояние
  private signalQueue: Array<{signal_mV: number, delay: number}> = [];

  constructor(
    source: Neuron, 
    target: Neuron, 
    conductance: number = 1.0,
    delay: number = 1,
    neurotransmitter: NeuroTransmitterType = 'glutamate'
  ) {
    this.id = uuidv4();
    this.source = source;
    this.target = target;
    this.conductance = Math.max(0.1, Math.min(10.0, conductance)); // 0.1-10.0 μS
    this.delay = Math.max(0, Math.min(10, delay)); // 1-10 шагов
    this.neurotransmitter = neurotransmitter;

    this.source.addOutputEdge(this);
    this.target.addInputEdge(this);

    console.log(`[Edge ${this.id}] Создано между ${source.id} → ${target.id} | ${this.conductance.toFixed(1)} μS, ${this.delay} шагов`);
  }

  // === Передача сигнала с задержкой ===
  
  public transmit(signal_mV: number): void {
    const transmissionEfficiency = 0.1 + (this.conductance / 10.0) * 0.9;
    const weightedSignal_mV = signal_mV * transmissionEfficiency;
    
    console.log(`[Edge ${this.id}] Сигнал ${signal_mV.toFixed(1)} мВ × ${this.conductance.toFixed(1)} μS = ${weightedSignal_mV.toFixed(1)} мВ (задержка: ${this.delay})`);
    
    // Добавляем в очередь с задержкой
    this.signalQueue.push({
      signal_mV: weightedSignal_mV,
      delay: this.delay
    });

    this.deliverSignals();
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
      console.log(`[Edge ${this.id}] Доставлен сигнал: ${signal_mV.toFixed(1)} мВ`);
      this.target.receive(signal_mV);
    });
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

  public setNeurotransmitter(nt: 'glutamate' | 'gaba' | 'acetylcholine' | 'dopamine'): void {
    this.neurotransmitter = nt;
    console.log(`[Edge ${this.id}] Нейромедиатор: ${nt}`);
  }

  public getNeurotransmitter(): NeuroTransmitterType {
    return this.neurotransmitter;
  }

  // === Для отладки и визуализации ===
  
  public getPendingSignalsCount(): number {
    return this.signalQueue.length;
  }

  public getPendingSignals(): Array<{signal_mV: number, delay: number}> {
    return [...this.signalQueue]; // копия
  }
}