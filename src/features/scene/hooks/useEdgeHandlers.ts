import { useCallback } from 'react';
import { useToolStore } from '../../../shared/hooks/useToolStore';
import { useSelectionStore } from '../../editing/store/useSelectionStore';

interface EdgeHandlers {
  onClick: (e: React.MouseEvent) => void;
}

export function useEdgeHandlers(edgeId: string): EdgeHandlers {
  const setSelectedEdgeId = useSelectionStore(state => state.setSelectedEdgeId);
  const selectedTool = useToolStore(state => state.selectedTool);

  const onClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'none') {
      e.stopPropagation();
      setSelectedEdgeId(edgeId);
    }
  }, [edgeId, selectedTool, setSelectedEdgeId]);

  return {
    onClick
  };
}