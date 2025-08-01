import type { EdgeDTO } from "../../network/dto/edge.dto";

export function useEdgeLayout(edge: EdgeDTO) {
  const { x: x1, y: y1 } = edge.sourceCoords;
  const { x: x2, y: y2 } = edge.targetCoords;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  const t = 0.75;
  const baseX = x1 + dx * t;
  const baseY = y1 + dy * t;

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
    x1, y1, x2, y2,
    labelX, labelY,
    weight,
    weightColor,
  };
}
