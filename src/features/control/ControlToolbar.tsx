import { useState } from 'react';
import { ButtonTool } from './ButtonTool';
import { Slider } from './Slider';
import { 
  PauseIcon, 
  PlayIcon, 
  StepBackIcon, 
  StepForwardIcon,
  Clock
} from 'lucide-react';
import { useControlStore } from './store/useControlStore';


export function ControlToolbar() {
    const { 
      isPlaying, 
      play, 
      pause, 
      redo, 
      undo,
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
            label={`Скорость: ${speed}ms`}
            icon={Clock}
          />
          
          {showSpeedSlider && <Slider value={speed} setValue={setSpeed} label='ms'/>}
        </div>
      </div>
    );
}