export function normalizeMembranePotential(potential: number): number {
  const MIN_POTENTIAL = -75;  // минимальный (гиперполяризация)
  const MAX_POTENTIAL = 40;  // максимальный (пик спайка)
  
  // Нормализуем от 0 до 100
  const normalized = ((potential - MIN_POTENTIAL) / (MAX_POTENTIAL - MIN_POTENTIAL)) * 100;
  
  // Ограничиваем диапазон
  return Math.max(0, Math.min(100, normalized));
}