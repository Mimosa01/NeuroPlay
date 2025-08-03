import { Weight } from "lucide-react";

export const WeightSlider = ({ 
  value, 
  onChange,
  min = -5,
  max = 5,
  step = 0.1
}: { 
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
}) => {
  const weightValue = parseFloat(value) || 0;
  const weightColor = weightValue > 0 
    ? 'text-green-600' 
    : weightValue < 0 
      ? 'text-red-600' 
      : 'text-slate-500';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Weight className="w-4 h-4 text-slate-500" />
        <label className="font-medium text-sm">Вес связи</label>
      </div>
      <div className="relative">
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-moz-appearance]:textfield"
        />
        <div className={`absolute right-3 top-2.5 text-sm font-medium ${weightColor}`}>
          {weightValue > 0 ? '+' : ''}{weightValue.toFixed(1)}
        </div>
      </div>
      
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            weightValue > 0 
              ? 'bg-green-500' 
              : weightValue < 0 
                ? 'bg-red-500' 
                : 'bg-slate-300'
          }`}
          style={{ 
            width: `${Math.min(100, Math.abs(weightValue) * 20)}%`,
            marginLeft: weightValue < 0 ? `${100 - Math.min(100, Math.abs(weightValue) * 20)}%` : '0'
          }}
        />
      </div>
    </div>
  );
};