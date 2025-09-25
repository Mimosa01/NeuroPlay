import { v4 as uuidv4 } from 'uuid';
import type { ISignal } from '../../interfaces/ISignal.interface';
import { DOPAMINE } from '../../params/defaultParams';
import type { NeuroTransmitterType, ModulationEffect, NeuronInstance } from '../../types/types';

export default abstract class BaseSignal implements ISignal {
  public readonly id: string;
  public readonly signal_mV: number;
  public readonly type: NeuroTransmitterType;
  public readonly effect: ModulationEffect = DOPAMINE;

  constructor(type: NeuroTransmitterType, signal_mV: number) {
    this.id = uuidv4();
    this.type = type;
    this.signal_mV = signal_mV
  }

  public abstract applyTo(target: NeuronInstance): void;
}
