import { useState } from 'react';
import { 
  PauseIcon, 
  PlayIcon, 
  StepBackIcon, 
  StepForwardIcon,
  Clock
} from 'lucide-react';
import { ButtonTool } from './ButtonTool';
import { useControlStore } from './useControlStore';
import { Slider } from './Slider';

export function ControlToolbar() {
    const { 
      isPlaying, 
      play, 
      pause, 
      stepForward, 
      stepBackward,
      speed,
      setSpeed
    } = useControlStore();
    
    const [showSpeedSlider, setShowSpeedSlider] = useState(false);

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
        
        <div className="relative">
          <ButtonTool
            onClick={() => setShowSpeedSlider(!showSpeedSlider)}
            label={`Скорость: ${speed}ms`}
            icon={Clock}
          />
          
          {showSpeedSlider && <Slider value={speed} setValue={setSpeed} label='ms'/>}
        </div>
      </div>
    );
}