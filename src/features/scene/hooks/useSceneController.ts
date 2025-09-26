import { useCallback, useRef } from 'react';
import { useD3Zoom } from '../hooks/useD3Zoom';
import { useToolLogic } from './useToolLogic';


interface SceneController {
  svgRef: React.RefObject<SVGSVGElement>;
  gRef: React.RefObject<SVGGElement>;
  onClick: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export function useSceneController(): SceneController {
  const svgRef = useRef<SVGSVGElement>(null!);
  const gRef = useRef<SVGGElement>(null!);
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

  return {
    svgRef,
    gRef,
    onClick
  };
}