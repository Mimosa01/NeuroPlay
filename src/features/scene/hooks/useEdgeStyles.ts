import { useSelectionStore } from '../../editing/store/useSelectionStore';
import type { EdgeDTO } from '../../network/dto/edge.dto';
import { getWeightColors } from '../utils/edgeUtils';

interface EdgeStyles {
  colors: ReturnType<typeof getWeightColors>;
  isSelected: boolean;
}

export function useEdgeStyles(edge: EdgeDTO): EdgeStyles {
  const selectedEdgeId = useSelectionStore(state => state.selectedEdgeId);
  const isSelected = selectedEdgeId === edge.id;
  const colors = getWeightColors(edge.conductance ?? 0);

  return {
    colors,
    isSelected
  };
}