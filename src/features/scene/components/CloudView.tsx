import React, { memo } from 'react';
import { useCloudController } from '../hooks/useCloudController';
import type { ModulationCloudDTO } from '../../network/dto/modulationCloud.dto';

interface Props {
  cloud: ModulationCloudDTO;
}

const CloudView: React.FC<Props> = ({ cloud }) => {
  const { handlers, state, style, cloudRef } = useCloudController(cloud);

  const badgeX = cloud.center.x + state.displayRadius * 0.6;
  const badgeY = cloud.center.y - state.displayRadius * 0.6;

  return (
    <g ref={cloudRef}>
      {/* Градиент для облака */}
      <defs>
        <radialGradient id={`cloud-gradient-${cloud.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={style.color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={style.color} stopOpacity="0.02" />
        </radialGradient>
      </defs>

      {/* Основное облако — пульсирующий градиентный круг */}
      <circle
        cx={cloud.center.x}
        cy={cloud.center.y}
        r={state.displayRadius}
        fill={`url(#cloud-gradient-${cloud.id})`}
        className={`
          transition-all duration-300 ease-out
          ${state.isHovered ? 'cursor-pointer' : 'cursor-default'}
        `}
        onMouseEnter={handlers.onMouseEnter}
        onMouseLeave={handlers.onMouseLeave}
        style={{
          animation: 'cloud-pulse 3s infinite ease-in-out',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))',
        }}
      />

      {/* Индикатор типа модулятора (как у нейрона) */}
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

      {/* Подпись типа (опционально, можно убрать) */}
      <text
        x={cloud.center.x}
        y={cloud.center.y - state.displayRadius - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[9px] font-medium select-none pointer-events-none"
        style={{
          fill: style.color,
          opacity: 0.7,
          textShadow: '0 1px 2px rgba(255,255,255,0.8)',
        }}
      >
        {cloud.type}
      </text>
    </g>
  );
};

// Кастомная анимация пульсации для облака
const CloudViewMemo = memo(CloudView);

export default CloudViewMemo;