import { 
  Eraser, 
  GitCommitHorizontal, 
  GitPullRequestArrow, 
  GitPullRequestClosed, 
  Trash2 
} from "lucide-react";
import type { Tool } from "../types/types";

export const TOOL_BUTTONS: Tool[] = [
  {
    id: 'add',
    icon: GitCommitHorizontal,
    label: 'Режим добавления нейронов'
  },
  {
    id: 'connect',
    icon: GitPullRequestArrow,
    label: 'Режим соединения нейронов'
  },
  {
    id: 'reconnect',
    icon: GitPullRequestClosed,
    label: 'Режим разрешения связей'
  },
  {
    id: 'delete',
    icon: Eraser,
    label: 'Режим удаления нейронов'
  },
  {
    id: 'clear',
    icon: Trash2,
    label: 'Очистить холст'
  },
]
