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
    const element = ref.current;
    if (!element) return;

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

    const selection = d3.select(element);
    selection.call(dragBehavior);

    return () => {
      selection.on('.drag', null);
    };
  }, [id, selectedTool, onDrag]);

  return ref;
}