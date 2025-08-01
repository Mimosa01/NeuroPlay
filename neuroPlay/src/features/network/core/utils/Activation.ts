import type { ActivationFunction } from "../../types/types";

export class Activation {
  static relu(x: number): number {
    return Math.max(0, x);
  }

  static sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  static step(x: number): number {
    return x >= 1 ? 1 : 0;
  }

  static functions: Record<string, ActivationFunction> = {
    relu: Activation.relu,
    sigmoid: Activation.sigmoid,
    step: Activation.step,
  };
}
