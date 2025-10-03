import { useCallback, useEffect, useState } from 'react';
import { useToolStore } from '../store/useToolStore';
import { useSelectionStore } from '../../editing/store/useSelectionStore';
import { useControlStore } from '../../control/store/useControlStore';
import type { NeuronDTO } from '../../network/dto/neuron.dto';
import { useNetworkStore } from '../../network/store/useNetworkStore';

export function useToolLogic() {
  const { selectedTool, synapsType } = useToolStore();
  const { setSelectedNeuronId } = useSelectionStore();
  const { createNeuron, createSynaps, createElectricSynaps, removeNeuron, removeSynaps, resetNetwork, findNearestNeuron, findNearestSynaps } = useNetworkStore();
  const resetControls = useControlStore(state => state.resetControls);
  const [firstNeuron, setFirstNeuron] = useState<NeuronDTO | null>(null);

  const handleClick = useCallback((x: number, y: number) => {
    switch (selectedTool) {
      case 'add': {
        const neuron = createNeuron({ x, y }, 'relay');
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
          if (synapsType === 'chemical') {
            createSynaps(firstNeuron.id, clickedNeuron.id);
            console.log(`[CONNECT] Chemical synaps created between ${firstNeuron.id} and ${clickedNeuron.id}`);
          } else if (synapsType === 'electric') {
            createElectricSynaps(firstNeuron.id, clickedNeuron.id);
            console.log(`[CONNECT] Electric synaps created between ${firstNeuron.id} and ${clickedNeuron.id}`);
          }
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
        const synaps = findNearestSynaps({ x, y });
        if (synaps) {
          removeSynaps(synaps.id);
          console.log('[RECONNECT] Chemical synaps removed:', synaps.id);
        }
        break;
      }

      default:
        break;
    }
  }, [selectedTool, synapsType, createNeuron, findNearestNeuron, removeNeuron, firstNeuron, setSelectedNeuronId, createSynaps, createElectricSynaps, findNearestSynaps, removeSynaps]);

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