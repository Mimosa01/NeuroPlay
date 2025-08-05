import React from 'react';
import { useToolStore } from '../../../shared/hooks/useToolStore';
import type { NeuronDTO } from '../../network/dto/neuron.dto';
import { useDragNeuron } from '../hooks/useDragNeuron';
import { useNeuronHandlers } from '../hooks/useNeuronHandlers';
import { getBiologicalColor } from '../utils/neuronUtils';

type Props = {
  neuron: NeuronDTO;
  isSelected?: boolean;
};

export const NeuronView: React.FC<Props> = ({ neuron, isSelected }) => {
  const { x, y } = neuron.coords;
  const { onDrag, onClick, onContextMenu } = useNeuronHandlers();
  const selectedTool = useToolStore(state => state.selectedTool);

  // Биологические параметры вместо signalFactor и signalColor
  const radius = 12;
  const membranePotential = neuron.membranePotential ?? -70;
  const spikeThreshold = neuron.spikeThreshold ?? -55;
  const isRefractory = neuron.refractoryDuration > 0;
  const isReadyToSend = neuron.readyToSend ?? false;

  const circleRef = useDragNeuron({ 
    id: neuron.id, 
    selectedTool, 
    onDrag: (id, x, y) => onDrag(id, x, y)
  });

  const biologicalColor = getBiologicalColor(membranePotential, spikeThreshold);

  return (
    <g>
      {/* Фон */}
      <circle
        cx={x}
        cy={y}
        r={radius * 0.7}
        className="fill-white/20"
      />
      
      {/* Основной нейрон */}
      <circle
        ref={circleRef}
        cx={x}
        cy={y}
        r={radius}
        fill={biologicalColor}
        className={`
          transition-all duration-300 ease-out drop-shadow-sm
          ${isSelected && 'stroke-3 stroke-blue-400'}
          ${selectedTool === 'none' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
          ${isReadyToSend && 'animate-pulse'}
          ${isRefractory && 'opacity-70'}
        `}
        onClick={(e) => onClick(e, neuron.id)}
        onContextMenu={(e) => onContextMenu(e, neuron.id)}
      />
      
      {/* Подпись */}
      {neuron.label && (
        <text
          x={x}
          y={y - radius - 8}
          className="text-xs fill-slate-700 font-medium text-center select-none drop-shadow"
          textAnchor="middle"
          pointerEvents="none"
        >
          {neuron.label}
        </text>
      )}
    </g>
  );
};