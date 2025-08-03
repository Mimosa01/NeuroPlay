import { LayoutUI } from "./shared/components/LayoutUI";
import { Scene } from "./features/scene/Scene";
import { usePlayback } from "./features/control/usePlayback";
import { EditPanel } from "./features/editing/components/EditPanel";
import { Toaster } from "sonner";


function App() {
  usePlayback();

  return (
    <>
      <Toaster />
      <LayoutUI />
      <Scene /> 
      <EditPanel /> 
    </>
  )
}

export default App
