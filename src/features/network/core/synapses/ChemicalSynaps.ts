import { v4 as uuidv4 } from 'uuid';
import { BASE_POSTSYNAPTIC_EFFECTS as BPE } from '../../constants/signals.constants';
import type { IChemicalSynaps } from '../../interfaces/ISynaps.interface';
import { eventBus } from '../EventBus';
import type { INeuron } from '../neurons/base/interfaces/INeuron.interface';

export default class ChemicalSynaps implements IChemicalSynaps {
  public readonly id: string;
  public readonly source: INeuron;
  public readonly target: INeuron;

  private delay: number;              // шагов задержки

  private signalQueue: Array<{ effect_mV: number; delay: number }> = [];

  private baseConductance: number; // ← неизменная "настройка"
  private currentConductance: number; // ← текущая, с модуляцией

  constructor(
    source: INeuron, 
    target: INeuron, 
    conductance: number = 1.0,
    delay: number = 1,
  ) {
    this.id = uuidv4();
    this.source = source;
    this.target = target;
    this.baseConductance = Math.max(0.1, Math.min(2.0, conductance));
    this.currentConductance = this.baseConductance; // изначально = базе
    this.delay = Math.max(1, Math.min(10, delay)); // 1–10 шагов
  }

  // === Геттеры и сеттеры ===

  public setConductance(newConductance: number): void {
    this.baseConductance = Math.max(0.1, Math.min(2.0, newConductance));
    this.currentConductance = this.baseConductance;
    
  }

  public getConductance(): number {
    
    return this.currentConductance;
  }

  public setDelay(newDelay: number): void {
    this.delay = Math.max(1, Math.min(10, newDelay));
    
  }

  public getDelay(): number {
    return this.delay;
  }

  // === Передача сигнала (вызывается при спайке источника) ===

  public transmit(): void {
    const baseEffect = BPE[this.source.state.neuroTransmitter] || 0;
    const totalEffect_mV = baseEffect * this.currentConductance;
    this.signalQueue.push({
      effect_mV: totalEffect_mV,
      delay: this.delay,
    });
  }

  public transmitGraded(inputSignal: number): void {
    const totalEffect_mV = inputSignal * this.currentConductance;
    this.signalQueue.push({
      effect_mV: totalEffect_mV,
      delay: this.delay,
    });
    // eventBus.publish('chemicalSynaps.signal.delivered', {
    //   synapsId: this.id,
    //   targetId: this.target.id,
    //   effect_mV: totalEffect_mV,
    // });
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
      if (!this.target.receptors.hasReceptor(this.source.state.neuroTransmitter)) {
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