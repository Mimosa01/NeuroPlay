import type { FC } from "react";
import type { Tool } from "../../types/types";
import { Button } from "./Button";

type ToolbarProps = {
  tools: Tool[];
}

export const Toolbar: FC<ToolbarProps> = ({ tools }) => {
  return (
    <div className="flex flex-col gap-4 p-2 w-fit shadow-md backdrop-blur-sm rounded-lg">
      {tools.map((tool) => (
        <Button 
          key={tool.id}
          label={tool.label}
          icon={tool.icon}
          onClick={() => console.log('lol')}
        />
      ))}
    </div>
  )
}