import React, { useState } from 'react';
import { useDragNeuron } from './hooks/useDragNeuron';
import { useNeuronHandlers } from './hooks/useNeuronHandlers';
import { useNeuronGeometry } from './hooks/useNeuronGeometry';
import { useToolStore } from '../../shared/hooks/useToolStore';
import type { NeuronDTO } from '../network/dto/neuron.dto';

type Props = {
  neuron: NeuronDTO;
  isSelected?: boolean;
};

export const NeuronView: React.FC<Props> = ({ neuron, isSelected }) => {
  const { x, y } = neuron.coords;
  const { onDrag, onClick, onContextMenu } = useNeuronHandlers();
  const { radius, signalFactor, signalColor } = useNeuronGeometry(neuron);
  const selectedTool = useToolStore(state => state.selectedTool);

  const [isDragging, setIsDragging] = useState(false);

  const circleRef = useDragNeuron({ 
    id: neuron.id, 
    selectedTool, 
    onDrag: (id, x, y) => {
      setIsDragging(true);
      onDrag(id, x, y);
      setTimeout(() => setIsDragging(false), 50);
    }
  });

  const showProgressBar = !isDragging;

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius * 0.7}
        className="fill-white/20"
      />
      
      {showProgressBar && (
        <>
          <rect
            x={x - radius}
            y={y + radius + 5}
            width={radius * 2}
            height={3}
            rx={1.5}
            className="fill-slate-300"
          />
          <rect
            x={x - radius}
            y={y + radius + 5}
            width={(radius * 2) * signalFactor}
            height={3}
            rx={1.5}
            fill={signalColor}
          />
        </>
      )}
      
      <circle
        ref={circleRef}
        cx={x}
        cy={y}
        r={radius}
        fill={signalColor}
        className={`
          transition-all duration-300 ease-out drop-shadow-sm
          ${isSelected && 'stroke-3 stroke-blue-400'}
          ${selectedTool === 'none' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
        `}
        onClick={(e) => onClick(e, neuron.id)}
        onContextMenu={(e) => onContextMenu(e, neuron.id)}
      />
      
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