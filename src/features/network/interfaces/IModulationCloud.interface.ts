import type { ModulatorEffect } from "../types/modulator.types";
import type { Coords, NeuroModulatorType } from "../types/types";


export interface IModulationCloud {
  readonly id: string;
  readonly type: NeuroModulatorType;
  readonly modulator: ModulatorEffect;

  getCenter (): Coords;
  getRadius (): number;

  setCenter (center: Coords): void;
  setStrength (strength: number): void;
  setTtl (ttl: number): void;

  boost (strengthDelta: number, ttlBonus: number): void;
  update (): void;
  isAlive (): boolean;
  isNear (coords: Coords, maxDistance: number): boolean;
  affects (neuronCoords: Coords): boolean;
  getScaledEffect (): ModulatorEffect;
}