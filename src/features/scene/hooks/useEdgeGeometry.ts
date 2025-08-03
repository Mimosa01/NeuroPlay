import { useState, useEffect, useRef } from 'react';
import type { EdgeDTO } from '../../network/dto/edge.dto';
import { useEdgeLayout } from './useEdgeLayout';
import { getLineWidth } from '../utils/edgeUtils';

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
  const [width, setWidth] = useState(30);
  const layout = useEdgeLayout(edge);
  const lineWidth = getLineWidth(edge.weight ?? 0);

  useEffect(() => {
    if (divRef.current) {
      const { width: contentWidth } = divRef.current.getBoundingClientRect();
      setWidth(contentWidth);
    }
  }, [edge.weight]);

  return {
    ...layout,
    lineWidth,
    width,
    setWidth,
    divRef
  };
}