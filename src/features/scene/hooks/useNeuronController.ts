import { useCallback, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { NeuronDTO } from '../../network/dto/neuron.dto';
import { useInteractionStore } from '../store/useInteractionStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';
import { useSelectionStore } from '../../editing/store/useSelectionStore';
import { getBiologicalColor } from '../utils/neuronUtils';
import { useToolStore } from '../store/useToolStore';
import { EXCITE_SIGNAL } from '../../../shared/constants/neuron.constants';

interface NeuronController {
  handlers: {
    onClick: (e: React.MouseEvent) => void;
    onContextMenu: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  state: {
    isHovered: boolean;
    isSelected: boolean;
    isDragging: boolean;
    isSpiking: boolean;
    isRefractory: boolean;
    isReadyToSend: boolean;
    biologicalColor: string;
    displayRadius: number;
  };
  circleRef: React.RefObject<SVGCircleElement>;
}

export function useNeuronController(neuron: NeuronDTO): NeuronController {
  const circleRef = useRef<SVGCircleElement>(null!);
  const { hoveredId, draggingId, setHoveredId, setDraggingId } = useInteractionStore();
  const { selectedNeuronId, setSelectedNeuronId } = useSelectionStore();
  const selectedTool = useToolStore(state => state.selectedTool);
  const updateNeuron = useNetworkStore(state => state.updateNeuron);
  const exciteNeuron = useNetworkStore(state => state.exciteNeuron);

  const isHovered = hoveredId === neuron.id;
  const isSelected = selectedNeuronId === neuron.id;
  const isDragging = draggingId === neuron.id;

  const membranePotential = neuron.membranePotential ?? -70;
  const spikeThreshold = neuron.spikeThreshold ?? -55;
  const isRefractory = neuron.refractoryDuration > 0;
  const isReadyToSend = neuron.readyToSend ?? false;
  const isSpiking = membranePotential >= spikeThreshold && !isRefractory;

  const biologicalColor = getBiologicalColor(membranePotential, spikeThreshold);
  const baseRadius = 16;
  const displayRadius = baseRadius * (isHovered ? 1.2 : 1);

  // Обработчики
  const handlers = {
    onClick: useCallback((e: React.MouseEvent) => {
      if (selectedTool === 'none') {
        e.stopPropagation();
        setSelectedNeuronId(neuron.id);
      }
    }, [neuron.id, selectedTool, setSelectedNeuronId]),

    onContextMenu: useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      exciteNeuron(neuron.id, EXCITE_SIGNAL);
    }, [neuron.id, exciteNeuron]),

    onMouseEnter: useCallback(() => {
      setHoveredId(neuron.id);
    }, [neuron.id, setHoveredId]),

    onMouseLeave: useCallback(() => {
      setHoveredId(null);
    }, [setHoveredId]),
  };

  useEffect(() => {
    if (!circleRef.current) return;

    const element = d3.select(circleRef.current);

    const drag = d3.drag<SVGCircleElement, unknown>()
      .on('start', () => {
        setDraggingId(neuron.id);
      })
      .on('drag', (event) => {
        updateNeuron(neuron.id, { coords: { x: event.x, y: event.y } });
      })
      .on('end', () => {
        setDraggingId(null);
      });

    element.call(drag);

    return () => {
      element.on('.drag', null);
    };
  }, [neuron.id, selectedTool, updateNeuron, setDraggingId]);

  return {
    handlers,
    state: {
      isHovered,
      isSelected,
      isDragging,
      isSpiking,
      isRefractory,
      isReadyToSend,
      biologicalColor,
      displayRadius,
    },
    circleRef,
  };
}