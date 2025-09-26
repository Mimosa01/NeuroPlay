export type ToolType = 'none' | 'add' | 'delete' | 'connect' | 'reconnect' | 'play' | 'pause' | 'clear' | 'back' | 'next' | 'pan';

export type Tool = {
  id: ToolType;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}
