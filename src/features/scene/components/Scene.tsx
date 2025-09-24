import { useSceneClickHandler } from "../hooks/useSceneClickHandler";
import { NeuronView } from "./NeuronView";
import { useNetworkStore } from "../../network/store/useNetworkStore";
import { useSelectionStore } from "../../editing/store/useSelectionStore";
import { EdgeView } from "./EdgeView";
import { useToolStore } from "../../../shared/hooks/useToolStore";

export const Scene = () => {
  const { svgRef, gRef, onClick } = useSceneClickHandler();
  const neurons = useNetworkStore((state) => state.neuronsDTO);
  const edges = useNetworkStore((state) => state.edgesDTO);
  const selectedNeuronId = useSelectionStore((state) => state.selectedNeuronId);
  const selectedTool = useToolStore((state) => state.selectedTool);

  // Определяем курсор в зависимости от инструмента
  const getCursor = () => {
    if (selectedTool === 'pan') return 'grab';
    if (selectedTool === 'none') return 'default'; // drag handled per neuron
    return 'crosshair'; // например, для создания нейронов
  };

  return (
    <svg
      ref={svgRef}
      className="w-full h-[100vh] select-none"
      onClick={onClick}
      style={{
        // Мягкий градиентный фон вместо плоского серого
        background: 'radial-gradient(circle at center, #f8fafc 0%, #f1f5f9 100%)',
        cursor: getCursor(),
      }}
    >
      {/* Глобальный маркер стрелки (fallback, но EdgeView использует свои) */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-400" />
        </marker>
      </defs>

      {/* Контейнер для zoom/pan */}
      <g ref={gRef}>
        {/* Сначала — связи (чтобы были под нейронами) */}
        {edges.map((edge) => (
          <EdgeView key={edge.id} edge={edge} />
        ))}

        {/* Потом — нейроны (сверху) */}
        {neurons.map((neuron) => (
          <NeuronView
            key={neuron.id}
            neuron={neuron}
            isSelected={neuron.id === selectedNeuronId}
          />
        ))}
      </g>
    </svg>
  );
};
