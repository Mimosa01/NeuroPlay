import { Signal } from "lucide-react";
import colorFromSignal from "../../../shared/utils/colorFromSignal";

export const SignalIndicator = ({ signal }: { signal: number }) => {
  const signalLevel = Math.min(1, signal);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4 text-slate-500" />
        <label className="font-medium text-sm">Сигнал</label>
      </div>
      <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="flex justify-between text-xs mb-1">
          <span>{signal.toFixed(3)}</span>
          <span className="text-slate-500">1.000</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300`}
            style={{ 
              width: `${signalLevel * 100}%`,
              backgroundColor: colorFromSignal(signalLevel)
            }}
          />
        </div>
      </div>
    </div>
  );
};