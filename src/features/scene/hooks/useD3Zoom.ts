import { type RefObject, useEffect } from 'react';
import * as d3 from 'd3';

export function useD3Zoom(
  svgRef: RefObject<SVGSVGElement | null>,
  gRef: RefObject<SVGGElement | null>
) {
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    return () => {
      svg.on('.zoom', null);
    };
  }, [svgRef, gRef]);
}
