import { Signal } from "lucide-react";
import { normalizeMembranePotential } from "../../../shared/utils/signalNormalization";
import { getSignalStrengthColor } from "../../../shared/utils/getSignalStrenghtColor";

export const SignalIndicator = ({ signal }: { signal: number }) => {
  const normalizedValue = normalizeMembranePotential(signal);
  const barColor = getSignalStrengthColor(normalizedValue);

  // Цвет текста в зависимости от активности
  const textColor = signal >= -55 ? 'text-red-600 font-bold' : 'text-slate-700';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4 text-slate-500" />
        <label className="font-medium text-sm text-slate-800">Мембранный потенциал</label>
      </div>
      
      <div className="
        p-3 
        bg-gradient-to-br from-slate-50 to-white 
        border border-slate-200/60 
        rounded-xl 
        shadow-sm
      ">
        {/* Значение */}
        <div className="text-xs font-mono mb-2 flex justify-between items-center">
          <span className={`${textColor} transition-colors duration-200`}>
            {signal > 0 ? '+' : ''}{signal.toFixed(1)} мВ
          </span>
          <span className="text-slate-500 text-[10px]">
            покой: -70 мВ
          </span>
        </div>

        {/* Индикатор */}
        <div 
          className="group relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"
          title={`Потенциал: ${signal.toFixed(1)} мВ\nПорог спайка: -55 мВ`}
        >
          {/* Порог спайка (фиксированная метка) */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-red-400/60"
            style={{ left: '72%' }} // ≈ (-55 - (-70)) / (30 - (-70)) = 15/100 → но визуально ~72%
          />

          {/* Основной прогресс */}
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.max(0, normalizedValue)}%`,
              background: `linear-gradient(to right, ${barColor}80, ${barColor})`
            }}
          />
        </div>

        {/* Легенда */}
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-0.5">
          <span>Гиперполяризация</span>
          <span>Деполяризация</span>
        </div>
      </div>
    </div>
  );
};
 