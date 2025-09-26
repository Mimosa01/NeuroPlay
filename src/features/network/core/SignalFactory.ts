import type { ISignal } from "../interfaces/ISignal.interface";
import type { NeuroTransmitterType } from "../types";
import { Acetylholine } from "./signals/Acetylholine";
import { Dopamine } from "./signals/Dopamine";
import { GABA } from "./signals/GABA";
import { Glutamate } from "./signals/Glutamate";
import { Glycine } from "./signals/Glycine";
import { Norepinephrine } from "./signals/Norepinephrine";
import { Serotonine } from "./signals/Serotonin";

export class SignalFactory {
  static create (type: NeuroTransmitterType, signal_mV: number): ISignal {
    switch (type) {
      case 'glutamate': return new Glutamate(signal_mV);
      case 'gaba': return new GABA(signal_mV);
      case 'glycine': return new Glycine(signal_mV);
      case 'dopamine': return new Dopamine();
      case 'serotonin': return new Serotonine();
      case 'acetylcholine': return new Acetylholine();
      case 'norepinephrine': return new Norepinephrine();
      default: throw new Error(`Неизвестный медиатор: ${type}`);
    }
  }
}