import React from 'react';
import { useDragNeuron } from './hooks/useDragNeuron';
import { useToolStore } from '../../shared/hooks/useToolStore';
import { useSelectionStore } from '../editing/store/useSelectionStore';
import type { NeuronDTO } from '../network/dto/neuron.dto';
import { useNetworkStore } from '../network/store/useNetworkStore';

type Props = {
  neuron: NeuronDTO;
  isSelected?: boolean;
};

export const NeuronView: React.FC<Props> = ({ neuron, isSelected }) => {
  const { x, y } = neuron.coords;
  const setSelectedNeuronId = useSelectionStore(state => state.setSelectedNeuronId);
  const selectedTool = useToolStore(state => state.selectedTool);
  const updateNeuronCoords = useNetworkStore(state => state.updateNeuronCoords);

  const onDrag = (id: string, x: number, y: number) => {
    updateNeuronCoords(id, x, y);
  };

  const circleRef = useDragNeuron({ id: neuron.id, selectedTool, onDrag });

  const onNeuronClick = (e: React.MouseEvent) => {
    if (selectedTool === 'none') {
      e.stopPropagation();
      setSelectedNeuronId(neuron.id);
    }
  };

  const onNeuronRightClick = (e: React.MouseEvent) => {
    if (e.button === 2) {
      e.preventDefault();
      useNetworkStore.getState().exciteNeuron(neuron.id, 1);
      return;
    }
  };

  return (
    <>
      <circle
        ref={circleRef}
        cx={x}
        cy={y}
        r={10}
        className={`
          ${isSelected ? 'stroke-3 stroke-blue-500' : ''} 
          ${selectedTool === 'none' ? 'grab' : 'pointer'}
          ${neuron.accumulatedSignal > 0 ? 'fill-green-500' : 'fill-slate-800'}
        `}
        onClick={onNeuronClick}
        onContextMenu={onNeuronRightClick}
      />
      {neuron.label && (
        <text
          x={x}
          y={y - 15}
          className="text-xs fill-slate-600 text-center select-none"
          textAnchor="middle"
          pointerEvents="none"
        >
          {neuron.label}
        </text>
      )}
    </>
  );
};
