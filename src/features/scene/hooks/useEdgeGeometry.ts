import { useState, useRef, useMemo } from 'react';
import type { EdgeDTO } from '../../network/dto/edge.dto';
import { useEdgeLayout } from './useEdgeLayout';
import { getLineWidth } from '../utils/edgeUtils';

// Предполагаем, что радиус нейрона везде одинаковый
const NEURON_RADIUS = 20;
const PADDING = NEURON_RADIUS + 4; // +4 для небольшого зазора

interface EdgeGeometry {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  labelX: number;
  labelY: number;
  lineWidth: number;
  width: number;
  setWidth: (width: number) => void;
  divRef: React.RefObject<HTMLDivElement>;
}

export function useEdgeGeometry(edge: EdgeDTO): EdgeGeometry {
  const divRef = useRef<HTMLDivElement>(null!);
  const [width, setWidth] = useState(50);
  const layout = useEdgeLayout(edge);
  const lineWidth = getLineWidth(edge.conductance ?? 0);

  const shortened = useMemo(() => {
    const { x1, y1, x2, y2, labelX, labelY } = layout;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length <= PADDING * 2) {
      return { x1, y1, x2: x1, y2: y1, labelX, labelY };
    }

    const unitX = dx / length;
    const unitY = dy / length;

    return {
      x1: x1 + unitX * PADDING,
      y1: y1 + unitY * PADDING,
      x2: x2 - unitX * PADDING,
      y2: y2 - unitY * PADDING,
      labelX,
      labelY,
    };
  }, [layout]);

  return {
    ...shortened,
    lineWidth,
    width,
    setWidth,
    divRef,
  };
}