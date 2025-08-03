import { useSelectionStore } from '../../editing/store/useSelectionStore';
import type { EdgeDTO } from '../../network/dto/edge.dto';
import { getWeightColors, getLineWidth } from '../utils/edgeUtils';

interface EdgeStyles {
  colors: ReturnType<typeof getWeightColors>;
  lineWidth: number;
  isSelected: boolean;
}

export function useEdgeStyles(edge: EdgeDTO): EdgeStyles {
  const selectedEdgeId = useSelectionStore(state => state.selectedEdgeId);
  const isSelected = selectedEdgeId === edge.id;
  const colors = getWeightColors(edge.weight ?? 0);
  const lineWidth = getLineWidth(edge.weight ?? 0);

  return {
    colors,
    lineWidth,
    isSelected
  };
}