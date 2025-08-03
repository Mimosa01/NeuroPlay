import { v4 as uuidv4 } from 'uuid';
import type Neuron from './Neuron';
import type { EdgeId } from '../types/types';

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

  public transmit(signal: number): void {
    const weightedSignal = signal * this.weight;

    console.log(`[Signal передан] | value: ${weightedSignal}`);
    
    this.target.receive(weightedSignal);
  }

  public setWeight(newWeight: number): void {
    console.log(`[Edge ${this.id}] Вес изменён: ${this.weight} → ${newWeight}`);
    this.weight = newWeight;
  }

  public getWeight(): number {
    return this.weight;
  }
}
