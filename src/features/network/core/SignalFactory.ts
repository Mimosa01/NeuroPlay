import type { ISignal } from "../interfaces/ISignal.interface";
import type { NeuroTransmitterType } from "../types/types";
import { Glutamate } from "./signals/Glutamate";

export class SignalFactory {
  static create (type: NeuroTransmitterType, signal_mV: number): ISignal {
    switch (type) {
      case 'glutamate':
        default:
          return new Glutamate(signal_mV);
    }
  }
}