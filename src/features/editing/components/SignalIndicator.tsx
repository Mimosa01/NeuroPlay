import { Signal } from "lucide-react";
import { normalizeMembranePotential } from "../../../shared/utils/signalNormalization";
import { getSignalStrengthColor } from "../../../shared/utils/getSignalStrenghtColor";

export const SignalIndicator = ({ signal }: { signal: number }) => {
  const normalizedValue = normalizeMembranePotential(signal);
  const barColor = getSignalStrengthColor(normalizedValue);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4 text-slate-500" />
        <label className="font-medium text-sm">Потенциал</label>
      </div>
      <div className="p-2 bg-white border border-slate-200 rounded-lg">
        <div className="text-xs font-mono mb-1">
          <span className="text-slate-700">
            {signal > 0 ? '+' : ''}{signal.toFixed(1)} мВ
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${normalizedValue}%`,
              backgroundColor: barColor
            }}
          />
        </div>
      </div>
    </div>
  );
};