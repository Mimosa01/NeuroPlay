import { memo, type FC } from 'react';
import type { EdgeDTO } from '../../network/dto/edge.dto';
import { useEdgeController } from '../hooks/useEdgeController';

const EdgeView: FC<{ edge: EdgeDTO }> = ({ edge }) => {
  const { handlers, state, geometry, styles, label } = useEdgeController(edge);

  const { x1, y1, x2, y2, labelX, labelY } = geometry;
  const { onClick, onMouseEnter, onMouseLeave } = handlers;

  // Если линия вырождена (слишком короткая)
  if (x1 === x2 && y1 === y2) {
    return null;
  }

  return (
    <g>
      <defs>
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
            fill={styles.arrowColor}
            className="transition-colors duration-200"
          />
        </marker>
      </defs>

      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={styles.lineColor}
        strokeWidth={state.displayWidth}
        markerEnd={`url(#arrowhead-${edge.id})`}
        className={`
          transition-all duration-200 ease-out
          ${state.isInteractive ? 'cursor-pointer' : 'cursor-default'}
        `}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))',
        }}
      />

      <foreignObject
        x={labelX - label.width / 2}
        y={labelY - 12}
        width={Math.max(label.width, 28)}
        height={24}
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={label.divRef}
          className={`
            w-full text-xs font-medium text-center whitespace-nowrap
            rounded-md px-2 py-0.5
            transition-all duration-200 ease-out
            ${state.isSelected || state.isHovered
              ? 'bg-blue-500/90 text-white shadow-md'
              : 'bg-white/80 text-slate-700 border border-white/40 backdrop-blur-sm'
            }
          `}
        >
          {label.text}
        </div>
      </foreignObject>
    </g>
  );
};


const EdgeViewMemo = memo(EdgeView);
export default EdgeViewMemo;