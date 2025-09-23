export type ToolType = 'none' | 'add' | 'delete' | 'connect' | 'reconnect' | 'play' | 'pause' | 'clear' | 'back' | 'next';

export type Tool = {
  id: ToolType;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

export type Coords = {
  x: number;
  y: number;
}
