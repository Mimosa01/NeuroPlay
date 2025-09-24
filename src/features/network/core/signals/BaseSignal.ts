import { v4 as uuidv4 } from 'uuid';
import type { NeuroTransmitterType } from '../../types/types';
import type { ISignal } from '../../interfaces/ISignal.interface';
import type NeuronAccessor from '../neurons/NeuronAccessor';

export default abstract class BaseSignal implements ISignal {
  public readonly id: string;
  public readonly signal_mV: number;
  public readonly type: NeuroTransmitterType;


  constructor(type: NeuroTransmitterType, signal_mV: number) {
    this.id = uuidv4();
    this.type = type;
    this.signal_mV = signal_mV
  }

  public abstract applyTo(target: NeuronAccessor): void;
}
