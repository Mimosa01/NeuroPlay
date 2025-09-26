import { useCallback, useRef, useState, useMemo } from 'react';
import type { EdgeDTO } from '../../network/dto/edge.dto';
import { useInteractionStore } from '../store/useInteractionStore';
import { useSelectionStore } from '../../editing/store/useSelectionStore';
import { useToolStore } from '../store/useToolStore';
import { getWeightColors, getLineWidth } from '../utils/edgeUtils';

interface EdgeController {
  handlers: {
    onClick: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  state: {
    isHovered: boolean;
    isSelected: boolean;
    isInteractive: boolean;
    displayWidth: number;
  };
  geometry: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    labelX: number;
    labelY: number;
  };
  styles: {
    lineColor: string;
    arrowColor: string;
    textColor: string;
  };
  label: {
    text: string;
    width: number;
    setWidth: (w: number) => void;
    divRef: React.RefObject<HTMLDivElement>;
  };
}

export function useEdgeController(edge: EdgeDTO): EdgeController {
  const divRef = useRef<HTMLDivElement>(null!);
  const [width, setWidth] = useState(50);

  const { hoveredId, setHoveredId } = useInteractionStore();
  const { selectedEdgeId } = useSelectionStore();
  const selectedTool = useToolStore(state => state.selectedTool);

  const isHovered = hoveredId === edge.id;
  const isSelected = selectedEdgeId === edge.id;
  const isInteractive = selectedTool === 'none';

  // Вычисляем геометрию
  const geometry = useMemo(() => {
    const { x: x1, y: y1 } = edge.sourceCoords;
    const { x: x2, y: y2 } = edge.targetCoords;

    // Укорачиваем линию на 20px с каждой стороны (аналогично PADDING в старом коде)
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) {
      return { x1, y1, x2, y2, labelX: x1, labelY: y1 - 20 };
    }

    const unitX = dx / length;
    const unitY = dy / length;

    const shorten = 30;
    const startX = x1 + unitX * shorten;
    const startY = y1 + unitY * shorten;
    const endX = x2 - unitX * shorten;
    const endY = y2 - unitY * shorten;

    // Позиция метки (75% от начала)
    const t = 0.75;
    const baseX = startX + (endX - startX) * t;
    const baseY = startY + (endY - startY) * t;

    const offset = 10;
    const normX = -dy / length;
    const normY = dx / length;

    const labelX = baseX + normX * offset;
    const labelY = baseY + normY * offset;

    return { x1: startX, y1: startY, x2: endX, y2: endY, labelX, labelY };
  }, [edge]);

  // Стили
  const weightColors = getWeightColors(edge.conductance ?? 0);
  const styles = {
    lineColor: isSelected ? '#60a5fa' : weightColors.line,
    arrowColor: isSelected ? '#60a5fa' : weightColors.arrow,
    textColor: weightColors.text,
  };

  const lineWidth = getLineWidth(edge.conductance ?? 0);
  const displayWidth = isSelected || isHovered ? lineWidth * 1.5 : lineWidth;

  const handlers = {
    onClick: useCallback((e: React.MouseEvent) => {
      if (isInteractive) {
        e.stopPropagation();
        useSelectionStore.getState().setSelectedEdgeId(edge.id);
      }
    }, [edge.id, isInteractive]),

    onMouseEnter: useCallback(() => {
      if (isInteractive) {
        setHoveredId(edge.id);
      }
    }, [edge.id, isInteractive, setHoveredId]),

    onMouseLeave: useCallback(() => {
      if (isInteractive) {
        setHoveredId(null);
      }
    }, [isInteractive, setHoveredId]),
  };

  return {
    handlers,
    state: {
      isHovered,
      isSelected,
      isInteractive,
      displayWidth,
    },
    geometry,
    styles,
    label: {
      text: typeof edge.conductance === 'number' ? edge.conductance.toFixed(1) : edge.conductance,
      width,
      setWidth,
      divRef,
    },
  };
}