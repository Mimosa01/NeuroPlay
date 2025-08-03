import type { EdgeDTO } from "../../network/dto/edge.dto";

export function useEdgeLayout(edge: EdgeDTO) {
  const { x: x1, y: y1 } = edge.sourceCoords;
  const { x: x2, y: y2 } = edge.targetCoords;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Если точки совпадают, возвращаем как есть
  if (length === 0) {
    return {
      x1, y1, x2, y2,
      labelX: x1, labelY: y1 - 20,
      weight: edge.weight ?? 0,
      weightColor: 'text-slate-500',
    };
  }

  // Нормализованный вектор
  const nx = dx / length;
  const ny = dy / length;

  // Укорачиваем линию на 12px с каждой стороны
  const shorten = 12;
  const startX = x1 + nx * shorten;
  const startY = y1 + ny * shorten;
  const endX = x2 - nx * shorten;
  const endY = y2 - ny * shorten;

  // Позиция метки (как было)
  const t = 0.75;
  const baseX = startX + (endX - startX) * t;
  const baseY = startY + (endY - startY) * t;

  const offset = 10;
  const normX = -dy / length;
  const normY = dx / length;

  const labelX = baseX + normX * offset;
  const labelY = baseY + normY * offset;

  const weight = edge.weight ?? 0;
  const weightColor =
    weight > 0 ? 'text-emerald-600' :
    weight < 0 ? 'text-rose-600' :
    'text-slate-500';

  return {
    x1: startX, 
    y1: startY, 
    x2: endX, 
    y2: endY,
    labelX, 
    labelY,
    weight,
    weightColor,
  };
}