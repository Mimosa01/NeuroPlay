import type { FC } from "react";

type SliderProps = {
  value: number;
  setValue: (value: number) => void;
  label?: string;
}

export const Slider: FC<SliderProps> = ({ value, setValue, label }) => {
  return (
    <div className="
      absolute left-full ml-4 top-1/2 transform -translate-y-1/2
      flex items-center gap-2 p-2 
      bg-white/80
      rounded-lg shadow-md
      transition-all duration-200
    ">
      <input
        type="range"
        min="100"
        max="2000"
        step="50"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="
          w-20 h-1.5 
          bg-slate-200 
          rounded-lg 
          appearance-none 
          cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-blue-500
        "
      />
      <div className="text-xs text-slate-600 w-12">
        {value}{label}
      </div>
    </div>
  )
}