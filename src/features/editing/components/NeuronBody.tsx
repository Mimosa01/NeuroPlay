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

  return (
    <div className="space-y-4 text-gray-800">
      <HeaderCard 
        variant="neuron"
        subtitle={toShortenText(neuronID || '')}
      />
      
      <SignalIndicator signal={membranePotential ?? 0} />

      <IconInput
        icon={Tag}
        label="Метка"
        type="text"
        value={label}
        onChange={e => setNeuronForm('label', e.target.value)}
        placeholder="Название нейрона"
      />
      
      <IconInput
        icon={Zap}
        label="Шагов до 'смерти'"
        type="number"
        min="1"
        max="1000"
        value={inactivityThreshold}
        onChange={e => setNeuronForm('inactivityThreshold', e.target.value)}
        helpText="Шагов без активности до удаления"
      />

      <IconInput
        icon={Clock}
        label="Длительность рефрактерности"
        type="number"
        min="1"
        max="20"
        value={refractoryDuration}
        onChange={e => setNeuronForm('refractoryDuration', e.target.value)}
        helpText="Шагов после спайка без активности"
      />

      <IconInput
        icon={Activity}
        label="Порог спайка"
        type="number"
        step="1"
        min="5"
        max="50"
        value={spikeThreshold}
        onChange={e => setNeuronForm('spikeThreshold', e.target.value)}
        helpText="мВ (относительно покоя 0 мВ)"
      />

      <IconInput
        icon={TrendingUp}
        label="Амплитуда спайка"
        type="number"
        step="10"
        min="50"
        max="200"
        value={spikeAmplitude}
        onChange={e => setNeuronForm('spikeAmplitude', e.target.value)}
        helpText="мВ (размер передаваемого сигнала)"
      />

      <IconInput
        icon={TrendingDown}
        label="Фактор затухания"
        type="number"
        step="0.01"
        min="0.80"
        max="0.99"
        value={decayFactor}
        onChange={e => setNeuronForm('decayFactor', e.target.value)}
        helpText={`${decayFactor} = ${100 - (Number(decayFactor) * 100)}% затухания за шаг`}
      />
      
      <SaveButton 
        hasChanges={hasNeuronChanges ?? false} 
        onClick={saveNeuron} 
      />
    </div>
  );
};