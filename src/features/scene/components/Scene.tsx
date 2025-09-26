import { useSceneController } from '../hooks/useSceneController';
import { SceneView } from './SceneView';

export const Scene = () => {
  const controller = useSceneController();

  return <SceneView controller={controller} />;
};
