import { Zap, Tag, Clock, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { IconInput } from '../../../shared/components/IconInput';
import { SaveButton } from '../../../shared/components/SaveButton';
import { useEditSelection } from '../hooks/useEditSelection';
import { HeaderCard } from './HeaderCard';
import { SignalIndicator } from './SignalIndicator';
import toShortenText from '../utils/toShortenText';

export const NeuronBody = () => {
  const {
    neuronID,
    label,
    saveNeuron,
    hasNeuronChanges,
    membranePotential,
    inactivityThreshold,
    refractoryDuration,
    spikeThreshold,
    spikeAmplitude,
    decayFactor,
    setNeuronForm,
  } = useEditSelection();

  // Нормализуем значения для индикаторов
  const refractoryPercent = Math.min(100, Math.max(0, (Number(refractoryDuration) / 20) * 100));
  const thresholdPercent = Math.min(100, Math.max(0, ((Number(spikeThreshold) - 5) / (50 - 5)) * 100));
  const decayPercent = Math.min(100, Math.max(0, ((0.99 - Number(decayFactor)) / (0.99 - 0.80)) * 100));

  return (
    <div className="space-y-5 text-slate-800">
      <HeaderCard 
        variant="neuron"
        subtitle={toShortenText(neuronID || '')}
      />
      
      {/* Текущий потенциал */}
      <SignalIndicator signal={membranePotential ?? 0} />

      {/* Основные настройки */}
      <div className="space-y-4">
        <IconInput
          icon={Tag}
          label="Метка"
          type="text"
          value={label}
          onChange={e => setNeuronForm('label', e.target.value)}
          placeholder="Название нейрона"
          autoFocus
        />
        
        <IconInput
          icon={Zap}
          label="Шагов до 'смерти'"
          type="number"
          min="1"
          max="1000"
          value={inactivityThreshold}
          onChange={e => setNeuronForm('inactivityThreshold', e.target.value)}
          helpText={`Удалится после ${inactivityThreshold} шагов без активности`}
        />
      </div>

      {/* Динамика спайка */}
      <div className="space-y-4 pt-2 border-t border-slate-200/40">
        <div className="space-y-2">
          <IconInput
            icon={Activity}
            label="Порог спайка"
            type="number"
            step="1"
            min="5"
            max="50"
            value={spikeThreshold}
            onChange={e => setNeuronForm('spikeThreshold', e.target.value)}
            helpText={`${spikeThreshold} мВ (относительно покоя)`}
          />
          <div 
            className="group relative w-full h-2 bg-slate-200 rounded-full overflow-hidden"
            title={`Порог: ${spikeThreshold} мВ`}
          >
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
              style={{ width: `${thresholdPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <IconInput
            icon={TrendingUp}
            label="Амплитуда спайка"
            type="number"
            step="10"
            min="50"
            max="200"
            value={spikeAmplitude}
            onChange={e => setNeuronForm('spikeAmplitude', e.target.value)}
            helpText={`${spikeAmplitude} мВ — сила выходного сигнала`}
          />
        </div>

        <div className="space-y-2">
          <IconInput
            icon={Clock}
            label="Рефрактерный период"
            type="number"
            min="1"
            max="20"
            value={refractoryDuration}
            onChange={e => setNeuronForm('refractoryDuration', e.target.value)}
            helpText={`${refractoryDuration} шагов — нельзя активироваться`}
          />
          <div 
            className="group relative w-full h-2 bg-slate-200 rounded-full overflow-hidden"
            title={`Рефрактерность: ${refractoryDuration} шагов`}
          >
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300"
              style={{ width: `${refractoryPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Затухание */}
        <div className="space-y-2 pt-2 border-t border-slate-200/40">
          <IconInput
            icon={TrendingDown}
            label="Фактор затухания"
            type="number"
            step="0.01"
            min="0.80"
            max="0.99"
            value={decayFactor}
            onChange={e => setNeuronForm('decayFactor', e.target.value)}
            helpText={`${((1 - Number(decayFactor)) * 100).toFixed(2)}% сигнала теряется за шаг`}
          />
          <div 
            className="group relative w-full h-2 bg-slate-200 rounded-full overflow-hidden"
            title={`Затухание: ${((1 - Number(decayFactor)) * 100).toFixed(2)}% за шаг`}
          >
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-300"
              style={{ width: `${decayPercent}%` }}
            />
          </div>
        </div>

      {/* Сохранение */}
      <div className="pt-3">
        <SaveButton 
          hasChanges={!!hasNeuronChanges} 
          onClick={saveNeuron} 
        />
      </div>
    </div>
  );
};
