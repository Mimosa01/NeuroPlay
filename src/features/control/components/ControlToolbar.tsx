import { 
  PauseIcon, 
  PlayIcon, 
  StepBackIcon, 
  StepForwardIcon,
  Clock
} from 'lucide-react';
import { useControlStore } from '../store/useControlStore';
import { ButtonTool } from '../../../shared/components/ButtonTool';
import { Slider } from './Slider';

export function ControlToolbar() {
  const { 
    isPlaying, 
    play, 
    pause, 
    redo, 
    undo,
    speed,
    setSpeed,
    showSpeedSlider,
    setShowSpeedSlider
  } = useControlStore();

  return (
    <div className="flex flex-col gap-4 p-2 w-fit bg-white/40 shadow-md backdrop-blur-sm rounded-lg">
      <ButtonTool
        onClick={isPlaying ? pause : play} 
        label={isPlaying ? "Остановить анимацию" : "Включить анимацию"}
        icon={isPlaying ? PauseIcon : PlayIcon}
      />
      
      <ButtonTool 
        onClick={undo} 
        label="Шаг назад"
        icon={StepBackIcon}
      />
      
      <ButtonTool
        onClick={redo} 
        label="Шаг вперед"
        icon={StepForwardIcon}
      />
      
      <div className="relative">
        <ButtonTool
          onClick={() => setShowSpeedSlider(!showSpeedSlider)}
          label={`Скорость: ${speed}мс`}
          icon={Clock}
        />
        
        {showSpeedSlider && (
          <Slider 
            value={speed} 
            setValue={setSpeed} 
            label='мс'
            onClose={() => setShowSpeedSlider(false)}
          />
        )}
      </div>
    </div>
  );
}
