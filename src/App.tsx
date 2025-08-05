import { LayoutUI } from "./shared/components/LayoutUI";
import { Scene } from "./features/scene/components/Scene";
import { usePlayback } from "./features/control/usePlayback";
import { EditPanel } from "./features/editing/components/EditPanel";
import { Toaster } from "sonner";
import { HotkeyProvider } from "./features/hotKey/HotkeyProvider";


function App() {
  usePlayback();

  return (
    <HotkeyProvider>
      <div className="relative min-h-screen">
        <Toaster />
        <LayoutUI />
        <Scene /> 
        <EditPanel /> 
      </div>
    </HotkeyProvider>
  )
}

export default App
