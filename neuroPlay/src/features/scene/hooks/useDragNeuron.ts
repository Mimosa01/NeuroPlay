import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type DragConfig = {
  id: string;
  selectedTool: string;
  onDrag: (id: string, x: number, y: number) => void;
};

export function useDragNeuron({ id, selectedTool, onDrag }: DragConfig) {
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const dragBehavior = d3.drag<SVGCircleElement, unknown>()
      .on('start', (event) => {
        if (selectedTool !== 'none') {
          event.on('drag', null);
        }
      })
      .on('drag', (event) => {
        if (selectedTool !== 'none') return;
        onDrag(id, event.x, event.y);
      });

    d3.select(ref.current).call(dragBehavior);

    return () => {
      d3.select(ref.current).on('.drag', null);
    };
  }, [id, selectedTool, onDrag]);

  return ref;
}
