import { Zap, Tag, Clock, Gauge, TrendingDown } from 'lucide-react';
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
    accumulatedSignal,
    inactivityThreshold,
    refractoryThreshold,
    signalThreshold,
    fading,
    setForm,
  } = useEditSelection();

  return (
    <div className="space-y-4 text-gray-800">
      <HeaderCard 
        variant="neuron"
        subtitle={toShortenText(neuronID || '')}
      />
      
      <SignalIndicator signal={accumulatedSignal ?? 0} />

      <IconInput
        icon={Tag}
        label="Метка"
        type="text"
        value={label}
        onChange={e => setForm('label', e.target.value)}
        placeholder="Название нейрона"
      />
      
      <IconInput
        icon={Zap}
        label="Шагов до 'смерти'"
        type="number"
        min="1"
        max="1000"
        value={inactivityThreshold}
        onChange={e => setForm('inactivityThreshold', e.target.value)}
      />

      <IconInput
        icon={Clock}
        label="Длительность рефрактерности"
        type="number"
        min="1"
        max="10"
        value={refractoryThreshold}
        onChange={e => setForm('refractoryThreshold', e.target.value)}
        helpText="Сколько шагов нейрон неактивен после спайка"
      />

      <IconInput
        icon={Gauge}
        label="Порог активации"
        type="number"
        step="0.05"
        min="0.1"
        max="1.0"
        value={signalThreshold}
        onChange={e => setForm('signalThreshold', e.target.value)}
        helpText="Минимальный сигнал для генерации спайка"
      />

      <IconInput
        icon={TrendingDown}
        label="Коэффициент затухания"
        type="number"
        step="0.05"
        min="0.1"
        max="1.0"
        value={fading}
        onChange={e => setForm('fading', e.target.value)}
        helpText="Насколько быстро сигнал уменьшается без входов"
      />
      
      <SaveButton 
        hasChanges={hasNeuronChanges ?? false} 
        onClick={saveNeuron} 
      />
    </div>
  );
};