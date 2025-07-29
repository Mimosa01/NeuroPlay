import { useEffect, useRef } from 'react';
import * as d3 from "d3";

export const Scene = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null); // контейнер, который будем трансформировать

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    const g = d3.select<SVGGElement, unknown>(gRef.current);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="w-full h-[100vh] bg-slate-50 cursor-grab"
    >
      <g ref={gRef}>
        {/* Здесь будут нейроны, связи и т.д. */}
        <circle cx={100} cy={100} r={10} fill="black" />
        <text x={80} y={80} fill="black">Центр</text>
      </g>
    </svg>
  );
};
