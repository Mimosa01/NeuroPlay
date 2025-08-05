import { type FC } from 'react';
import { useToolStore } from '../../../shared/hooks/useToolStore';
import type { EdgeDTO } from '../../network/dto/edge.dto';
import { useEdgeGeometry } from '../hooks/useEdgeGeometry';
import { useEdgeHandlers } from '../hooks/useEdgeHandlers';
import { useEdgeStyles } from '../hooks/useEdgeStyles';

export const EdgeView: FC<{ edge: EdgeDTO }> = ({ edge }) => {
  const { 
    x1, y1, x2, y2, 
    labelX, labelY, 
    lineWidth, 
    width, 
    divRef 
  } = useEdgeGeometry(edge);
  
  const { onClick } = useEdgeHandlers(edge.id);
  const { colors, isSelected } = useEdgeStyles(edge);
  const selectedTool = useToolStore(state => state.selectedTool);

  return (
    <g>
      <defs>
        {/* Нормальная стрелка */}
        <marker
          id={`arrowhead-${edge.id}`}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 0 0 L 6 3 L 0 6 Z"
            fill={colors.arrow}
            className="transition-all duration-300"
          />
        </marker>

        {/* Стрелка для выделения */}
        {isSelected && (
          <marker
            id={`arrowhead-selected-${edge.id}`}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M 0 0 L 6 3 L 0 6 Z"
              className="fill-blue-500"
            />
          </marker>
        )}
      </defs>

      {/* Основная линия */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={colors.line}
        strokeWidth={lineWidth}
        markerEnd={isSelected ? `url(#arrowhead-selected-${edge.id})` : `url(#arrowhead-${edge.id})`}
        className={`
          transition-all duration-300 ease-out
          ${selectedTool === 'none' ? 'cursor-pointer' : 'cursor-default'}
        `}
        onClick={onClick}
        style={{
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.05))'
        }}
      />

      {/* Подсветка при выделении */}
      {isSelected && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          strokeWidth={lineWidth + 1}
          className="animate-pulse stroke-blue-500"
          pointerEvents="none"
        />
      )}

      {/* Метка веса */}
      <foreignObject
        x={labelX - width / 2}
        y={labelY - 12}
        width={width}
        height={24}
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={divRef}
          className={`
            w-fit text-xs font-medium backdrop-blur-sm rounded-lg px-2 py-1 text-center whitespace-nowrap
            border border-white/30
            transition-all duration-300
          `}
          style={{
            color: colors.text
          }}
        >
          {typeof edge.weight === 'number' ? edge.weight.toFixed(1) : edge.weight}
        </div>
      </foreignObject>
    </g>
  );
};