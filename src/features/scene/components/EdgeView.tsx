import { type FC, useState } from 'react';
import { useToolStore } from '../../../shared/hooks/useToolStore';
import type { EdgeDTO } from '../../network/dto/edge.dto';
import { useEdgeGeometry } from '../hooks/useEdgeGeometry';
import { useEdgeHandlers } from '../hooks/useEdgeHandlers';
import { useEdgeStyles } from '../hooks/useEdgeStyles';

export const EdgeView: FC<{ edge: EdgeDTO }> = ({ edge }) => {
  const { x1, y1, x2, y2, labelX, labelY, width, divRef } = useEdgeGeometry(edge);
  const { onClick } = useEdgeHandlers(edge.id);
  const { colors, isSelected } = useEdgeStyles(edge);
  const selectedTool = useToolStore((state) => state.selectedTool);

  const [isHovered, setIsHovered] = useState(false);
  const isInteractive = selectedTool === 'none';

  // Толщина линии: базовая + при наведении/выделении
  const baseLineWidth = 2;
  const activeLineWidth = isSelected || isHovered ? 3 : baseLineWidth;

  return (
    <g>
      <defs>
        {/* Единая стрелка — цвет меняется динамически */}
        <marker
          id={`arrowhead-${edge.id}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 0 0 L 8 4 L 0 8 Z"
            fill={isSelected ? '#60a5fa' /* blue-400 */ : colors.arrow}
            className="transition-colors duration-200"
          />
        </marker>
      </defs>

      {/* Основная линия */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isSelected ? '#60a5fa' : colors.line}
        strokeWidth={activeLineWidth}
        markerEnd={`url(#arrowhead-${edge.id})`}
        className={`
          transition-all duration-200 ease-out
          ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
        `}
        onClick={onClick}
        onMouseEnter={() => isInteractive && setIsHovered(true)}
        onMouseLeave={() => isInteractive && setIsHovered(false)}
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))',
        }}
      />

      {/* Метка веса */}
      <foreignObject
        x={labelX - width / 2}
        y={labelY - 12}
        width={Math.max(width, 28)} // минимум 28px, чтобы не сжималось
        height={24}
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={divRef}
          className={`
            w-full text-xs font-medium text-center whitespace-nowrap
            rounded-md px-2 py-0.5
            transition-all duration-200 ease-out
            ${isSelected || isHovered
              ? 'bg-blue-500/90 text-white shadow-md'
              : 'bg-white/80 text-slate-700 border border-white/40 backdrop-blur-sm'
            }
          `}
        >
          {typeof edge.conductance === 'number' ? edge.conductance.toFixed(1) : edge.conductance}
        </div>
      </foreignObject>
    </g>
  );
};
