import { LayoutUI } from "./shared/components/LayoutUI";
import { Scene } from "./features/scene/Scene";
import { EditPanel } from "./features/editing/EditPanel";
import { usePlayback } from "./features/control/usePlayback";


function App() {
  usePlayback();

  return (
    <>
      <LayoutUI />
      <Scene /> 
      <EditPanel /> 
    </>
  )
}

export default App
