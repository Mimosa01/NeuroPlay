import React from 'react';
import { useToolStore } from '../../../shared/hooks/useToolStore';
import type { NeuronDTO } from '../../network/dto/neuron.dto';
import { useDragNeuron } from '../hooks/useDragNeuron';
import { useNeuronHandlers } from '../hooks/useNeuronHandlers';
import { getBiologicalColor } from '../utils/neuronUtils';

// Цвета и символы для каждого типа
const TRANSMITTER_STYLES = {
  glutamate: { color: '#10b981', symbol: '+' }, // возбуждающий
  gaba: { color: '#ef4444', symbol: '–' },     // тормозной
  dopamine: { color: '#3b82f6', symbol: 'D' },
  serotonin: { color: '#8b5cf6', symbol: 'S' },
} as const;

type Props = {
  neuron: NeuronDTO;
  isSelected?: boolean;
};

export const NeuronView: React.FC<Props> = ({ neuron, isSelected }) => {
  const { x, y } = neuron.coords;
  const { onDrag, onClick, onContextMenu } = useNeuronHandlers();
  const selectedTool = useToolStore((state) => state.selectedTool);

  const baseRadius = 16;
  const membranePotential = neuron.membranePotential ?? -70;
  const spikeThreshold = neuron.spikeThreshold ?? -55;
  const isRefractory = neuron.refractoryDuration > 0;
  const isReadyToSend = neuron.readyToSend ?? false;
  const isSpiking = membranePotential >= spikeThreshold && !isRefractory;

  const [isHovered, setIsHovered] = React.useState(false);
  const displayRadius = baseRadius * (isHovered ? 1.2 : 1);

  const circleRef = useDragNeuron({
    id: neuron.id,
    selectedTool,
    onDrag: (id, newX, newY) => onDrag(id, newX, newY),
  });

  const biologicalColor = getBiologicalColor(membranePotential, spikeThreshold);

  // Получаем стиль по типу медиатора
  const transmitter = neuron.neuroTransmitter || 'glutamate';
  const style = TRANSMITTER_STYLES[transmitter as keyof typeof TRANSMITTER_STYLES] || TRANSMITTER_STYLES.glutamate;

  // Позиция флажка: смещение от центра вправо-вверх
  const badgeX = x + displayRadius * 0.6;
  const badgeY = y - displayRadius * 0.6;

  return (
    <g>
      {/* Спайк */}
      {isSpiking && (
        <circle
          cx={x}
          cy={y}
          r={displayRadius + 8}
          className="fill-yellow-300 opacity-80 animate-ping"
          style={{ animationDuration: '0.8s' }}
        />
      )}

      {/* Основной нейрон */}
      <circle
        ref={circleRef}
        cx={x}
        cy={y}
        r={displayRadius}
        fill={biologicalColor}
        className={`
          transition-all duration-200 ease-out
          ${isSelected ? 'stroke-2 stroke-blue-500 drop-shadow-md' : 'drop-shadow-sm'}
          ${selectedTool === 'none' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
          ${isRefractory ? 'opacity-80' : 'opacity-100'}
          ${isReadyToSend && !isSpiking ? 'ring-2 ring-green-400/60' : ''}
          ${isReadyToSend && !isSpiking ? 'animate-pulse' : ''}
          focus:outline-none
        `}
        onClick={(e) => onClick(e, neuron.id)}
        onContextMenu={(e) => onContextMenu(e, neuron.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        aria-label={`Neuron ${neuron.label || neuron.id}`}
      />

      {/* Индикатор типа нейромедиатора */}
      <circle
        cx={badgeX}
        cy={badgeY}
        r="5"
        fill={style.color}
        stroke="#fff"
        strokeWidth="1.5"
        className="drop-shadow-sm"
      />
      <text
        x={badgeX}
        y={badgeY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[8px] font-bold text-white select-none pointer-events-none"
      >
        {style.symbol}
      </text>

      {/* Подпись */}
      {neuron.label && (
        <text
          x={x}
          y={y - displayRadius - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium select-none pointer-events-none"
          style={{
            fill: '#1e293b',
            textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 1px 1px rgba(0,0,0,0.2)',
          }}
        >
          {neuron.label}
        </text>
      )}
    </g>
  );
};