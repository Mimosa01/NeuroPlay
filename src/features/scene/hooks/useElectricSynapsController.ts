import { useCallback, useRef, useState, useMemo } from 'react';
import type { ElectricSynapsDTO } from '../../network/dto/electricSynaps.dto';
import { useInteractionStore } from '../store/useInteractionStore';
import { useSelectionStore } from '../../editing/store/useSelectionStore';
import { useToolStore } from '../store/useToolStore';

interface ElectricSynapsController {
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

export function useElectricSynapsController(synaps: ElectricSynapsDTO): ElectricSynapsController {
  const divRef = useRef<HTMLDivElement>(null!);
  const [width, setWidth] = useState(50);

  const { hoveredId, setHoveredId } = useInteractionStore();
  const { selectedSynapsId } = useSelectionStore();
  const selectedTool = useToolStore(state => state.selectedTool);

  const isHovered = hoveredId === synaps.id;
  const isSelected = selectedSynapsId === synaps.id;
  const isInteractive = selectedTool === 'none';

  // Вычисляем геометрию
  const geometry = useMemo(() => {
    const { x: x1, y: y1 } = synaps.sourceCoords;
    const { x: x2, y: y2 } = synaps.targetCoords;

    // Укорачиваем линию на 20px с каждой стороны
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

    // Позиция метки (50% от начала)
    const t = 0.5;
    const baseX = startX + (endX - startX) * t;
    const baseY = startY + (endY - startY) * t;

    const offset = 10;
    const normX = -dy / length;
    const normY = dx / length;

    const labelX = baseX + normX * offset;
    const labelY = baseY + normY * offset;

    return { x1: startX, y1: startY, x2: endX, y2: endY, labelX, labelY };
  }, [synaps]);

  // Стили для электрических синапсов
  const styles = {
    lineColor: isSelected ? '#60a5fa' : '#94a3b8',
    arrowColor: isSelected ? '#60a5fa' : '#94a3b8',
    textColor: '#94a3b8',
  };

  // Толщина линии
  const baseWidth = 1.5 + (synaps.conductance - 0.1) * 1.5; // диапазон 1.5–3
  const displayWidth = isSelected || isHovered ? baseWidth * 1.5 : baseWidth;

  const handlers = {
    onClick: useCallback((e: React.MouseEvent) => {
      if (isInteractive) {
        e.stopPropagation();
        useSelectionStore.getState().setSelectedSynapsId(synaps.id, 'electric');
      }
    }, [synaps.id, isInteractive]),

    onMouseEnter: useCallback(() => {
      if (isInteractive) {
        setHoveredId(synaps.id);
      }
    }, [synaps.id, isInteractive, setHoveredId]),

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
      text: typeof synaps.conductance === 'number' ? synaps.conductance.toFixed(1) : synaps.conductance,
      width,
      setWidth,
      divRef,
    },
  };
}