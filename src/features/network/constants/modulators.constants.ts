import type { ModulatorEffect, NeuroModulatorType } from "../types/modulator.types";

export const MODULATOR_EFFECTS: Record<NeuroModulatorType, ModulatorEffect> = {
  dopamine: {
    thresholdShift: -4,        // снижает порог на 4 мВ
    conductanceMultiplier: 1.1, // слегка усиливает входы
    decayRate: 0.96,
    radius: 120
  },
  
  serotonin: {
    thresholdShift: +2,        // немного повышает порог (успокаивает)
    tauMultiplier: 0.85,       // уменьшает утечку → дольше интегрирует
    decayRate: 0.97,
    radius: 100
  },
  
  norepinephrine: {
    thresholdShift: -3,
    conductanceMultiplier: 1.3, // сильно усиливает входы
    decayRate: 0.94,           // быстрее действует и спадает (стресс!)
    radius: 150
  },
  
  acetylcholine: {
    thresholdShift: -2,
    conductanceMultiplier: 1.2,
    tauMultiplier: 0.9,
    decayRate: 0.95,
    radius: 110
  }
};

export const MODULATOR_NAMES = new Set(Object.keys(MODULATOR_EFFECTS)) as Set<keyof typeof MODULATOR_EFFECTS>;
export type ModulatorType = keyof typeof MODULATOR_EFFECTS;