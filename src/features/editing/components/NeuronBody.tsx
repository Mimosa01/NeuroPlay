import { Zap, Tag, Clock, Activity, Waves, FlaskConical } from 'lucide-react';
import { IconInput } from '../../../shared/components/IconInput';
import { SaveButton } from '../../../shared/components/SaveButton';
import { useEditSelection } from '../hooks/useEditSelection';
import { HeaderCard } from './HeaderCard';
import { SignalIndicator } from './SignalIndicator';
import toShortenText from '../utils/toShortenText';
import { TRANSMITTER_CONFIG } from '../utils/constants';
import type { NeuroTransmitterType } from '../../network/types/types';

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
    tau,
    transmitter,
    setNeuronForm,
  } = useEditSelection();

  const refractoryPercent = Math.min(100, Math.max(0, (Number(refractoryDuration) / 20) * 100));
  const thresholdPercent = Math.min(100, Math.max(0, ((Number(spikeThreshold) - 5) / (50 - 5)) * 100));
  const tauPercent = Math.min(100, Math.max(0, ((Number(tau) - 1) / (100 - 1)) * 100));

  const transmitterConfig = TRANSMITTER_CONFIG[transmitter] || TRANSMITTER_CONFIG.glutamate;

  return (
    <div className="space-y-5 text-slate-800">
      {/* Заголовок с типом нейромедиатора */}
      <div className="space-y-3">
        <HeaderCard 
          variant="neuron"
          subtitle={toShortenText(neuronID || '')}
        />
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${transmitterConfig.bg} border border-slate-200/50`}>
          <FlaskConical className={`w-4 h-4 ${transmitterConfig.iconColor}`} />
          <span className={`text-sm font-medium ${transmitterConfig.color}`}>
            {transmitterConfig.label}
          </span>
        </div>
      </div>
      
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

        <div className="space-y-2">
          <IconInput
            icon={Waves}
            label="Постоянная времени (τ)"
            type="number"
            step="1"
            min="1"
            max="100"
            value={tau}
            onChange={e => setNeuronForm('tau', e.target.value)}
            helpText={`Время затухания сигнала (${tau} шагов)`}
          />
          <div 
            className="group relative w-full h-2 bg-slate-200 rounded-full overflow-hidden"
            title={`τ = ${tau} шаг`}
          >
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-300"
              style={{ width: `${tauPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Выбор нейромедиатора */}
      <div className="pt-2 border-t border-slate-200/40">
        <label className="block text-sm font-medium text-slate-800 mb-3">
          Нейромедиатор
        </label>
        {/* Адаптивная сетка: 2 на мобильных, 3-4 на десктопе */}
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(TRANSMITTER_CONFIG) as [NeuroTransmitterType, typeof TRANSMITTER_CONFIG[NeuroTransmitterType]][])
            .map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setNeuronForm('transmitter', key)}
                title={config.label}
                className={`
                  flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all
                  ${transmitter === key
                    ? `${config.bg} border-blue-500 ring-2 ring-blue-500/30`
                    : 'bg-white border-slate-200 hover:bg-slate-50'}
                `}
              >
                <FlaskConical className={`w-4 h-4 mb-1 ${config.iconColor}`} />
                <span className="text-[10px] font-medium text-center leading-tight">
                  {config.label}
                </span>
              </button>
            ))}
        </div>
      </div>

      <div className="pt-3">
        <SaveButton 
          hasChanges={!!hasNeuronChanges} 
          onClick={saveNeuron} 
        />
      </div>
    </div>
  );
};