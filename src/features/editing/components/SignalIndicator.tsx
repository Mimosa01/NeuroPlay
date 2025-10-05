import { useState, useEffect } from 'react';
import { Signal } from 'lucide-react';
import { getSignalStrengthColor } from '../utils/getSignalStrenghtColor';
import { normalizeMembranePotential } from '../utils/signalNormalization';

const MIN_VALUE = -100;
const MAX_VALUE = 50;
const RESTING_POTENTIAL = -70;
const SPIKE_THRESHOLD = -55;

export const SignalIndicator = ({ 
  signal: initialSignal, 
  onSignalChange 
}: { 
  signal: number; 
  onSignalChange?: (value: number) => void; 
}) => {
  // Локальное состояние для отображения в input (может быть пустой строкой)
  const [inputValue, setInputValue] = useState<string>(initialSignal.toString());
  const [lastValidValue, setLastValidValue] = useState<number>(initialSignal);

  // Синхронизация при изменении initialSignal извне
  useEffect(() => {
    setInputValue(initialSignal.toString());
    setLastValidValue(initialSignal);
  }, [initialSignal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Разрешаем пустое значение и знак минус в начале
    if (rawValue === '' || rawValue === '-') {
      setInputValue(rawValue);
      return;
    }
    // Проверяем, что это число (в т.ч. с десятичной точкой и минусом)
    if (/^-?\d*\.?\d*$/.test(rawValue)) {
      setInputValue(rawValue);
    }
  };

  const handleInputBlur = () => {
    let value = parseFloat(inputValue);
    
    // Если поле пустое или только "-", возвращаем последнее валидное значение
    if (isNaN(value) || inputValue === '-') {
      setInputValue(lastValidValue.toString());
      return;
    }

    // Ограничиваем диапазон
    value = Math.min(MAX_VALUE, Math.max(MIN_VALUE, value));
    
    // Сохраняем как валидное
    setLastValidValue(value);
    setInputValue(value.toString());
    onSignalChange?.(value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  // Для визуализации используем lastValidValue (гарантированно число)
  const displaySignal = lastValidValue;
  const normalizedValue = normalizeMembranePotential(displaySignal);
  const barColor = getSignalStrengthColor(normalizedValue);
  const textColor = displaySignal >= SPIKE_THRESHOLD ? 'text-red-600 font-bold' : 'text-slate-700';
  const spikeThresholdPercent = ((SPIKE_THRESHOLD - RESTING_POTENTIAL) / (30 - RESTING_POTENTIAL)) * 100;

  return (
    <div className="space-y-2 w-full max-w-xs">
      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <label className="font-medium text-sm text-slate-800">Мембранный потенциал</label>
      </div>

      <div className="
        p-3 
        bg-gradient-to-br from-slate-50/80 to-white/80 
        border border-slate-200/60 
        rounded-xl 
        shadow-sm
        backdrop-blur-sm
        transition-all duration-200
        hover:border-slate-300/80
      ">
        <div className="text-[10px] font-mono mb-2 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                aria-label="Мембранный потенциал в милливольтах"
                className={`
                  no-spinner
                  w-16 text-center py-1 px-2
                  ${textColor}
                  bg-white/70 backdrop-blur-sm
                  border border-slate-300/40
                  rounded-lg
                  font-mono text-[11px] leading-none
                  outline-none
                  duration-300
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  placeholder:text-slate-400
                `}
                placeholder="–70"
              />
              <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-500 text-[9px] pointer-events-none">
                мВ
              </span>
            </div>
          </div>
          <span className="text-slate-500 text-[10px] whitespace-nowrap bg-slate-100/50 px-1.5 py-0.5 rounded">
            покой: {RESTING_POTENTIAL} мВ
          </span>
        </div>
        <div 
          className="group relative w-full h-3 bg-slate-200 rounded-full overflow-hidden"
          title={`Потенциал: ${displaySignal.toFixed(1)} мВ\nПорог спайка: ${SPIKE_THRESHOLD} мВ`}
          role="progressbar"
          aria-valuenow={displaySignal}
          aria-valuemin={MIN_VALUE}
          aria-valuemax={MAX_VALUE}
        >
          <div 
            className="absolute top-0 bottom-0 w-px bg-red-500/70 z-10"
            style={{ left: `${spikeThresholdPercent}%` }}
          />
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.max(0, Math.min(100, normalizedValue))}%`,
              background: `linear-gradient(to right, ${barColor}60, ${barColor})`
            }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-0.5">
          <span>Гиперполяризация</span>
          <span>Деполяризация</span>
        </div>
      </div>
    </div>
  );
};