import { useSceneClickHandler } from "../hooks/useSceneClickHandler";
import { NeuronView } from "./NeuronView";
import { useNetworkStore } from "../../network/store/useNetworkStore";
import { useSelectionStore } from "../../editing/store/useSelectionStore";
import { EdgeView } from "./EdgeView";

export const Scene = () => {
  const { svgRef, gRef, onClick } = useSceneClickHandler();
  const neurons = useNetworkStore(state => state.neuronsDTO);
  const edges = useNetworkStore(state => state.edgesDTO);

  const selectedNeuronId = useSelectionStore(state => state.selectedNeuronId);

  return (
    <svg
      ref={svgRef}
      className="w-full h-[100vh] bg-slate-50 cursor-grab"
      onClick={onClick}
    >
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

      <g ref={gRef}>
        {edges.map(edge => (
          <EdgeView key={edge.id} edge={edge} />
        ))}

        {neurons.map(neuron => (
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
