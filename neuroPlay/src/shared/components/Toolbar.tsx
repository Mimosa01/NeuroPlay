import type { FC } from "react";
import type { Tool } from "../types/types";
import { ButtonTool } from "../../features/control/ButtonTool";
import { useToolStore } from "../hooks/useToolStore";

type ToolbarProps = {
  tools: Tool[];
}

export const Toolbar: FC<ToolbarProps> = ({ tools }) => {
  const setSelectedTool = useToolStore((state) => state.setSelectedTool);
  const selectedTool = useToolStore((state) => state.selectedTool);

  return (
    <div className="flex flex-col gap-4 p-2 w-fit shadow-md backdrop-blur-sm rounded-lg">
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
  )
}