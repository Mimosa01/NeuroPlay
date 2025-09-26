import React, { memo } from 'react';
import type { NeuronDTO } from '../../network/dto/neuron.dto';
import { useToolStore } from '../store/useToolStore';
import { useNeuronController } from '../hooks/useNeuronController';
import { TRANSMITTER_STYLES } from '../../../shared/constants/transmitter.constants';

interface Props {
  neuron: NeuronDTO;
}

const NeuronView: React.FC<Props> = ({ neuron }) => {
  const { handlers, state, circleRef } = useNeuronController(neuron);
  const selectedTool = useToolStore(state => state.selectedTool);

  const style = TRANSMITTER_STYLES[neuron.neuroTransmitter as keyof typeof TRANSMITTER_STYLES] || TRANSMITTER_STYLES.glutamate;

  const badgeX = neuron.coords.x + state.displayRadius * 0.6;
  const badgeY = neuron.coords.y - state.displayRadius * 0.6;

  return (
    <g>
      {/* Спайк */}
      {state.isSpiking && (
        <circle
          cx={neuron.coords.x}
          cy={neuron.coords.y}
          r={state.displayRadius + 8}
          className="fill-yellow-300 opacity-80 animate-ping"
          style={{ animationDuration: '0.8s' }}
        />
      )}

      {/* Основной нейрон */}
      <circle
        ref={circleRef}
        cx={neuron.coords.x}
        cy={neuron.coords.y}
        r={state.displayRadius}
        fill={state.biologicalColor}
        className={`
          transition-all duration-200 ease-out
          ${state.isSelected ? 'stroke-2 stroke-blue-500 drop-shadow-md' : 'drop-shadow-sm'}
          ${selectedTool === 'none' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
          ${state.isRefractory ? 'opacity-80' : 'opacity-100'}
          ${state.isReadyToSend && !state.isSpiking ? 'ring-2 ring-green-400/60 animate-pulse' : ''}
          focus:outline-none
        `}
        onClick={handlers.onClick}
        onContextMenu={handlers.onContextMenu}
        onMouseEnter={handlers.onMouseEnter}
        onMouseLeave={handlers.onMouseLeave}
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
          x={neuron.coords.x}
          y={neuron.coords.y - state.displayRadius - 10}
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


const NeuronViewMemo = memo(NeuronView);
export default NeuronViewMemo;