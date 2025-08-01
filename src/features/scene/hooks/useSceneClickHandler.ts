import { useRef, useCallback } from 'react';
import { useD3Zoom } from './useD3Zoom';
import { useToolLogic } from '../../network/hooks/useToolLogic';

export function useSceneClickHandler() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  useD3Zoom(svgRef, gRef);
  const { handleClick } = useToolLogic();

  const onClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !gRef.current) return;

    const point = svgRef.current.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    const ctm = gRef.current.getScreenCTM();
    if (!ctm) return;

    const transformedPoint = point.matrixTransform(ctm.inverse());
    handleClick(transformedPoint.x, transformedPoint.y);
  }, [handleClick]);

  return { svgRef, gRef, onClick };
}
