import { 
  Eraser, 
  GitCommitHorizontal, 
  GitPullRequestArrow, 
  GitPullRequestClosed, 
  Pause, 
  Play, 
  StepBack, 
  StepForward, 
  Trash2 
} from "lucide-react";

export const TOOL_BUTTONS = [
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

export const CONTROL_BUTTONS = [
  {
    id: 'play',
    icon: Play,
    label: 'Включить анимацию'
  },
  {
    id: 'pause',
    icon: Pause,
    label: 'Остановить анимацию'
  },
  {
    id: 'back',
    icon: StepBack,
    label: 'Шаг назад'
  },
  {
    id: 'next',
    icon: StepForward,
    label: 'Шаг вперед'
  },
]