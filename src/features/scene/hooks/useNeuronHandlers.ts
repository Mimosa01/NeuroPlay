import { useSelectionStore } from '../../editing/store/useSelectionStore';
import { useToolStore } from '../../../shared/hooks/useToolStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';

interface NeuronHandlers {
  onDrag: (id: string, x: number, y: number) => void;
  onClick: (e: React.MouseEvent, neuronId: string) => void;
  onContextMenu: (e: React.MouseEvent, neuronId: string) => void;
}

export function useNeuronHandlers(): NeuronHandlers {
  const setSelectedNeuronId = useSelectionStore(state => state.setSelectedNeuronId);
  const selectedTool = useToolStore(state => state.selectedTool);
  const updateNeuron = useNetworkStore(state => state.updateNeuron);

  const onDrag = (id: string, x: number, y: number) => {
    updateNeuron(id, {coords: {x: x, y: y}});
  };

  const onClick = (e: React.MouseEvent, neuronId: string) => {
    if (selectedTool === 'none') {
      e.stopPropagation();
      setSelectedNeuronId(neuronId);
    }
  };

  const onContextMenu = (e: React.MouseEvent, neuronId: string) => {
    if (e.button === 2) {
      e.preventDefault();
      useNetworkStore.getState().exciteNeuron(neuronId, 1);
    }
  };

  return {
    onDrag,
    onClick,
    onContextMenu,
  };
}