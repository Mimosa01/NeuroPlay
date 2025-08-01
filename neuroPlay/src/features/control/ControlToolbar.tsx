import { PauseIcon, PlayIcon, StepBackIcon, StepForwardIcon } from 'lucide-react';
import { ButtonTool } from './ButtonTool';
import { useControlStore } from './useControlStore';

export function ControlToolbar() {
    const { isPlaying, play, pause, stepForward, stepBackward } = useControlStore();

  return (
    <div className="flex flex-col gap-4 p-2 w-fit shadow-md backdrop-blur-sm rounded-lg">
      <ButtonTool
        onClick={isPlaying ? pause : play} 
        label={isPlaying ? "Остановить анимацию" : "Включить анимацию"}
        icon={isPlaying ? PauseIcon : PlayIcon}
      />
      <ButtonTool 
        onClick={stepBackward} 
        label="Шаг назад"
        icon={StepBackIcon}
      />
      <ButtonTool
        onClick={stepForward} 
        label="Шаг вперед"
        icon={StepForwardIcon}
      />
    </div>
  );
}
