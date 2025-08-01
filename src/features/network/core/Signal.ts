import { v4 as uuidv4 } from 'uuid';

export default class Signal {
  public readonly id: string;
  public readonly value: number;
  public readonly sourceNeuronId: string;
  public readonly targetNeuronId: string;
  public readonly timestamp: number;

  constructor(value: number, source: string, target: string) {
    this.id = uuidv4();
    this.value = value;
    this.sourceNeuronId = source;
    this.targetNeuronId = target;
    this.timestamp = Date.now();
  }
}
