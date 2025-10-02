import { MODULATOR_EFFECTS } from "../constants/modulators.constants";
import type { IModulationCloud } from "../interfaces/IModulationCloud.interface";
import type { ModulatorEffect, NeuroModulatorType } from "../types/modulator.types";
import type { Coords } from "../types/types";

export class ModulationCloud implements IModulationCloud {
  public readonly id: string;
  public readonly type: NeuroModulatorType;        // 'dopamine', 'serotonin' и т.д.
  public readonly modulator: ModulatorEffect;      // ← ВСЯ ЛОГИКА ЭФФЕКТА ЗДЕСЬ

  private center: Coords;
  private radius: number;                           // берётся из modulator.radius или дефолт
  private strength: number = 1.0;                   // текущая концентрация (0..1+)
  private decayRate: number;                        // берётся из modulator.decayRate или дефолт

  private readonly baseTtl: number = 30;           // базовое время жизни (шаги)
  private ttl: number = this.baseTtl;

  constructor(
    type: NeuroModulatorType,
    center: Coords,
  ) {
    this.id = `cloud-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this.type = type;
    this.center = { ...center };

    this.modulator = MODULATOR_EFFECTS[this.type];

    this.radius = this.modulator.radius ?? 100;
    this.decayRate = this.modulator.decayRate ?? 0.05;
  }

  public getCenter (): Coords {
    return this.center;
  }

  public setCenter (center: Coords): void {
    this.center = center;
  }

  public getRadius (): number {
    return this.radius;
  }

  public setStrength (strength: number): void {
    this.strength += strength;
  }

  public setTtl (ttl: number): void {
    this.ttl += ttl;
  }

  public boost(strengthDelta: number = 0.5, ttlBonus: number = 5): void {
    this.strength = Math.min(this.strength + strengthDelta, 2.0);
    this.ttl = Math.min(this.ttl + ttlBonus, this.baseTtl + 10);
  }

  public update(): void {
    this.strength *= this.decayRate;
    this.ttl--;
  }

  public isAlive(): boolean {
    return this.ttl > 0 && this.strength > 0.01;
  }

  public affects(neuronCoords: Coords): boolean {
    const dx = neuronCoords.x - this.center.x;
    const dy = neuronCoords.y - this.center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= this.radius;
  }

  public isNear(coords: Coords, maxDistance: number): boolean {
    const dx = coords.x - this.center.x;
    const dy = coords.y - this.center.y;
    return Math.hypot(dx, dy) <= maxDistance;
  }

  public getScaledEffect(): ModulatorEffect {
    const scale = this.strength; // 0..1+

    return {
      thresholdShift: this.modulator.thresholdShift 
        ? Math.round(this.modulator.thresholdShift * scale * 100) / 100 
        : undefined,

      tauMultiplier: this.modulator.tauMultiplier !== undefined
        ? Math.round((1 + (this.modulator.tauMultiplier - 1) * scale) * 100) / 100
        : undefined,

      conductanceMultiplier: this.modulator.conductanceMultiplier !== undefined
        ? Math.round((1 + (this.modulator.conductanceMultiplier - 1) * scale) * 100) / 100
        : undefined,
    };
  }
}