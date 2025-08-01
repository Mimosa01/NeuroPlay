import { v4 as uuidv4 } from 'uuid';
import type Neuron from './Neuron';
import type { EdgeId } from '../types/types';
import Signal from './Signal';

export default class Edge {
  public readonly id: EdgeId;
  public readonly source: Neuron;
  public readonly target: Neuron;
  private weight: number;

  constructor(source: Neuron, target: Neuron, weight: number = 1) {
    this.id = uuidv4();
    this.source = source;
    this.target = target;
    this.weight = weight;

    this.source.addOutputEdge(this);
    this.target.addInputEdge(this);

    console.log(`[Edge ${this.id}] Создано между ${source.id} → ${target.id} с весом ${weight}`);
  }

  public transmit(rawSignal: number): void {
    const weightedSignal = rawSignal * this.weight;
    const signal = new Signal(weightedSignal, this.source.id, this.target.id);

    console.log(`[Signal ${signal.id}] ${signal.sourceNeuronId} → ${signal.targetNeuronId} | value: ${signal.value}`);
    
    this.target.receive(signal.value);
  }


  public setWeight(newWeight: number): void {
    console.log(`[Edge ${this.id}] Вес изменён: ${this.weight} → ${newWeight}`);
    this.weight = newWeight;
  }

  public getWeight(): number {
    return this.weight;
  }
}
