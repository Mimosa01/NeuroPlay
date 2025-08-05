import { Activity } from "lucide-react";

interface WeightSliderProps {
  value: string;
  onChange: (value: string) => void;
}

export const WeightSlider = ({ value, onChange }: WeightSliderProps) => {
  const weightValue = parseFloat(value) || 0;
  const weightColor = weightValue > 0 
    ? 'text-green-600' 
    : weightValue < 0 
      ? 'text-red-600' 
      : 'text-slate-500';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-slate-500" />
        <label className="font-medium text-sm">Проводимость</label>
      </div>
      <div className="relative">
        <input
          type="number"
          step="0.1"
          min="0.1"
          max="10.0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <div className={`absolute right-3 top-2.5 text-sm font-medium ${weightColor}`}>
          {weightValue.toFixed(1)} μS
        </div>
      </div>
      
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            weightValue > 0 
              ? 'bg-blue-500' 
              : 'bg-slate-300'
          }`}
          style={{ 
            width: `${Math.min(100, weightValue * 10)}%`
          }}
        />
      </div>
    </div>
  );
};