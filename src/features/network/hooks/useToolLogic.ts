import { useCallback, useEffect, useState } from 'react';
import { useNetworkStore } from '../store/useNetworkStore';
import type Neuron from '../core/PyramidalNeuron';
import { useToolStore } from '../../../shared/hooks/useToolStore';
import { useControlStore } from '../../control/useControlStore';
import { useSelectionStore } from '../../editing/store/useSelectionStore';

export function useToolLogic() {
  const { selectedTool } = useToolStore();
  const { setSelectedNeuronId } = useSelectionStore();
  const { network, createNeuron, removeNeuron, resetNetwork, removeEdge, refreshDTO } = useNetworkStore();
  const resetControls = useControlStore(state => state.resetControls);
  const [firstNeuron, setFirstNeuron] = useState<Neuron | null>(null);

  const handleClick = useCallback((x: number, y: number) => {
    switch (selectedTool) {
      case 'add': {
        const neuron = createNeuron({ x, y });
        refreshDTO();
        console.log('[ADD] Neuron created', neuron);
        break;
      }

      case 'delete': {
        const neuron = network.findNearestNeuron({ x, y });
        if (neuron?.id) {
          removeNeuron(neuron.id);
          refreshDTO();
          console.log('[DELETE] Neuron removed', neuron.id);
        }
        break;
      }

      case 'connect': {
        const clickedNeuron = network.findNearestNeuron({ x, y });
        if (!clickedNeuron) return;

        if (!firstNeuron) {
          setFirstNeuron(clickedNeuron);
          setSelectedNeuronId(clickedNeuron.id);
          console.log('[CONNECT] First neuron selected:', clickedNeuron);
        } else if (firstNeuron !== clickedNeuron) {
          network.addEdge(firstNeuron, clickedNeuron);
          refreshDTO();
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
        const edge = network.findEdgeNear({ x, y });
        if (edge) {
          removeEdge(edge.id);
          refreshDTO();
          console.log('[RECONNECT] Edge removed:', edge.id);
        }
        break;
      }

      default:
        break;
    }
  }, [selectedTool, createNeuron, refreshDTO, network, removeNeuron, firstNeuron, setSelectedNeuronId, removeEdge]);

  useEffect(() => {
    if (selectedTool === 'clear') {
      resetNetwork();
      resetControls();
      refreshDTO();
      console.log('[CLEAR] Network reset');
    }
  }, [refreshDTO, resetControls, resetNetwork, selectedTool]);

  return {
    handleClick,
  };
}
