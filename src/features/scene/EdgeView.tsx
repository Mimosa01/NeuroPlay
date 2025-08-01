import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useEdgeLayout } from './hooks/useEdgeLayout';
import { useToolStore } from '../../shared/hooks/useToolStore';
import { useSelectionStore } from '../editing/store/useSelectionStore';
import type { EdgeDTO } from '../network/dto/edge.dto';

export const EdgeView: FC<{ edge: EdgeDTO }> = ({ edge }) => {
  const setSelectedEdgeId = useSelectionStore(state => state.setSelectedEdgeId);
  const selectedTool = useToolStore(state => state.selectedTool);
  const divRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(30);

  const {
    x1, y1, x2, y2,
    labelX, labelY,
    weight,
    weightColor,
  } = useEdgeLayout(edge);

  useEffect(() => {
    if (divRef.current) {
      const { width: contentWidth } = divRef.current.getBoundingClientRect();
      setWidth(contentWidth);
    }
  }, [weight]);

  const onEdgeClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'none') {
      e.stopPropagation();
      setSelectedEdgeId(edge.id);
    }
  }, [edge.id, selectedTool, setSelectedEdgeId]);

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="stroke-slate-400 cursor-pointer"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
        onClick={onEdgeClick}
      />
      <foreignObject
        x={labelX - width / 2}
        y={labelY - 12}
        width={width}
        height={24}
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={divRef}
          className={`w-fit text-xs ${weightColor} backdrop-blur-sm rounded px-1 text-center whitespace-nowrap`}
        >
          {weight}
        </div>
      </foreignObject>
    </g>
  );
};
