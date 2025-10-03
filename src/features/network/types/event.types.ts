import type { ModulatorEffect, NeuroModulatorType } from "./modulator.types";
import type { Coords } from "./types";


export interface EventMap {
  'neuron.spike': { neuronId: string };
  'chemicalSynaps.signal.delivered': { synapsId: string; targetId: string; effect_mV: number };
  'neuron.modulation.request': { targetId: string; effect: ModulatorEffect };
  'modulation.cloud.spawn': { neuronId: string; modulator: NeuroModulatorType; coords: Coords };
}

export type EventType = keyof EventMap;

export type Event<T extends EventType> = {
  type: T;
  payload: EventMap[T];
};