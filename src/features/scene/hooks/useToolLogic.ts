import { useCallback, useEffect, useState } from 'react';
import { useToolStore } from '../store/useToolStore';
import { useSelectionStore } from '../../editing/store/useSelectionStore';
import { useControlStore } from '../../control/store/useControlStore';
import type { NeuronDTO } from '../../network/dto/neuron.dto';
import { useNetworkStore } from '../../network/store/useNetworkStore';

export function useToolLogic() {
  const { selectedTool } = useToolStore();
  const { setSelectedNeuronId } = useSelectionStore();
  const { createNeuron, createEdge, removeNeuron, removeEdge, resetNetwork, findNearestNeuron, findNearestEdge } = useNetworkStore();
  const resetControls = useControlStore(state => state.resetControls);
  const [firstNeuron, setFirstNeuron] = useState<NeuronDTO | null>(null);

  const handleClick = useCallback((x: number, y: number) => {
    switch (selectedTool) {
      case 'add': {
        const neuron = createNeuron({ x, y }, 'pyramidal');
        console.log('[ADD] Neuron created', neuron);
        break;
      }

      case 'delete': {
        const neuron = findNearestNeuron({ x, y });
        if (neuron?.id) {
          removeNeuron(neuron.id);
          console.log('[DELETE] Neuron removed', neuron.id);
        }
        break;
      }

      case 'connect': {
        const clickedNeuron = findNearestNeuron({ x, y });
        if (!clickedNeuron) return;

        if (!firstNeuron) {
          setFirstNeuron(clickedNeuron);
          setSelectedNeuronId(clickedNeuron.id);
          console.log('[CONNECT] First neuron selected:', clickedNeuron);
        } else if (firstNeuron !== clickedNeuron) {
          createEdge(firstNeuron.id, clickedNeuron.id);
          console.log(`[CONNECT] Edge created between ${firstNeuron.id} and ${clickedNeuron.id}`);
          setSelectedNeuronId(null);
          setFirstNeuron(null);
        } else {
          setSelectedNeuronId(null);
          setFirstNeuron(null);
          console.log('[CONNECT] Selection reset');
        }
        break;
      }

      case 'reconnect': {
        const edge = findNearestEdge({ x, y });
        if (edge) {
          removeEdge(edge.id);
          console.log('[RECONNECT] Edge removed:', edge.id);
        }
        break;
      }

      default:
        break;
    }
  }, [selectedTool, createNeuron, findNearestNeuron, removeNeuron, firstNeuron, setSelectedNeuronId, createEdge, findNearestEdge, removeEdge]);

  useEffect(() => {
    if (selectedTool === 'clear') {
      resetNetwork();
      resetControls();
      console.log('[CLEAR] Network reset');
    }
  }, [resetControls, selectedTool, resetNetwork]);

  return {
    handleClick,
  };
}
