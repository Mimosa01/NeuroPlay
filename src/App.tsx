import { Toaster } from "sonner";
import { LayoutUI } from "./shared/components/LayoutUI";
import { Scene } from "./features/scene/components/Scene";
import { EditPanel } from "./features/editing/components/EditPanel";
import { HotkeyProvider } from "./features/hotkey/HotkeyProvider";
import { usePlayback } from "./features/control/hooks/usePlayback";


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
