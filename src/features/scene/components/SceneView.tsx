import { useNetworkStore } from '../../network/store/useNetworkStore';
import NeuronViewMemo from './NeuronView';
import SinapsViewMemo from './SynapsView';
import CloudViewMemo from './CloudView'; // ← импортируем облако
import type { useSceneController } from '../hooks/useSceneController';

interface Props {
  controller: ReturnType<typeof useSceneController>;
}

export const SceneView: React.FC<Props> = ({ controller }) => {
  const { svgRef, gRef, onClick } = controller;

  const neurons = useNetworkStore(state => state.neuronsDTO);
  const sinapses = useNetworkStore(state => state.synapsesDTO);
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
        {sinapses.map((sinaps) => (
          <SinapsViewMemo key={sinaps.id} synaps={sinaps} />
        ))}

        {/* Нейроны — самый верхний слой */}
        {neurons.map((neuron) => (
          <NeuronViewMemo key={neuron.id} neuron={neuron} />
        ))}
      </g>
    </svg>
  );
};