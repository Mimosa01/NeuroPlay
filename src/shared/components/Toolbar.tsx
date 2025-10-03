import type { FC } from "react";
import { ButtonTool } from "./ButtonTool";
import { useToolStore } from "../../features/scene/store/useToolStore";
import type { Tool } from "../../features/scene/types";
import { SynapsTypeSwitch } from "./SynapsTypeSwitch";

type ToolbarProps = {
  tools: Tool[];
}

export const Toolbar: FC<ToolbarProps> = ({ tools }) => {
  const setSelectedTool = useToolStore((state) => state.setSelectedTool);
  const selectedTool = useToolStore((state) => state.selectedTool);

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 p-2 w-fit bg-white/40 shadow-md backdrop-blur-sm rounded-lg">
        {tools.map((tool) => (
          <ButtonTool 
            key={tool.id}
            label={tool.label}
            icon={tool.icon}
            onClick={() => setSelectedTool(tool.id)}
            isActive={selectedTool === tool.id}
          />
        ))}
      </div>

      <div className="absolute left-17.5 top-17.5">
        {/* Переключатель типа синапса */}
        {selectedTool === 'connect' && <SynapsTypeSwitch />}
      </div>
    </div>
  )
}
