import { useNetworkStore } from '../../network/store/useNetworkStore';
import NeuronViewMemo from './NeuronView';
import SynapsViewMemo from './SynapsView';
import CloudViewMemo from './CloudView'; // ← импортируем облако
import type { useSceneController } from '../hooks/useSceneController';
import ElectricSynapsViewMemo from './ElectricSynapsView';

interface Props {
  controller: ReturnType<typeof useSceneController>;
}

export const SceneView: React.FC<Props> = ({ controller }) => {
  const { svgRef, gRef, onClick } = controller;

  const neurons = useNetworkStore(state => state.neuronsDTO);
  const synapses = useNetworkStore(state => state.synapsesDTO);
  const electricSynapses = useNetworkStore(state => state.electricSynapsesDTO);
  const clouds = useNetworkStore(state => state.cloudsDTO);

  return (
    <svg
      ref={svgRef}
      className="w-full h-[100vh] select-none"
      onClick={onClick}
      style={{
        background: 'radial-gradient(circle at center, #f8fafc 0%, #f1f5f9 100%)'
      }}
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
        {/* Облака — самый нижний слой */}
        {clouds.map((cloud) => (
          <CloudViewMemo key={cloud.id} cloud={cloud} />
        ))}

        {/* Рёбра — поверх облаков */}
        {synapses.map((synaps) => (
          <SynapsViewMemo key={synaps.id} synaps={synaps} />
        ))}

        {electricSynapses.map((synaps) => (
          <ElectricSynapsViewMemo key={synaps.id} synaps={synaps} />
        ))}

        {/* Нейроны — самый верхний слой */}
        {neurons.map((neuron) => (
          <NeuronViewMemo key={neuron.id} neuron={neuron} />
        ))}
      </g>
    </svg>
  );
};