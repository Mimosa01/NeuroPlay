import { useEffect, useState } from 'react';
import { useSelectionStore } from '../store/useSelectionStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';
import { toast } from 'sonner';
import type { NeuroTransmitterType } from '../../network/types';

type NeuronFormFields = {
  label: string;
  inactivityThreshold: string;
  refractoryDuration: string;
  spikeThreshold: string;
  tau: string;
  transmitter: NeuroTransmitterType;
  receptors: Set<NeuroTransmitterType>
};

export const useEditNeuron = () => {
  const selectedNeuronId = useSelectionStore(state => state.selectedNeuronId);
  const neurons = useNetworkStore(state => state.neuronsDTO);
  const updateNeuron = useNetworkStore(state => state.updateNeuron);

  const neuron = neurons.find(n => n.id === selectedNeuronId) || null;

  const [form, setForm] = useState<NeuronFormFields>({
    label: '',
    inactivityThreshold: '100',
    refractoryDuration: '4',
    spikeThreshold: '15',
    tau: '15',
    transmitter: 'glutamate',
    receptors: new Set(), // ← по умолчанию пустой Set
  });

  const [initialForm, setInitialForm] = useState<NeuronFormFields>(form);

  // Вспомогательная функция для сравнения Set'ов
  const setsAreEqual = (a: Set<NeuroTransmitterType>, b: Set<NeuroTransmitterType>): boolean => {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  };

  // Обновляем форму при смене нейрона
  useEffect(() => {
    if (neuron) {
      const newForm: NeuronFormFields = {
        label: neuron.label ?? '',
        inactivityThreshold: String(neuron.inactivityThreshold ?? 100),
        refractoryDuration: String(neuron.refractoryDuration ?? 4),
        spikeThreshold: String(neuron.spikeThreshold ?? 15),
        tau: String(neuron.tau ?? 15),
        transmitter: neuron.neuroTransmitter,
        receptors: new Set(neuron.receptors || []),
      };
      setForm(newForm);
      setInitialForm(newForm);
    } else {
      const emptyForm: NeuronFormFields = {
        label: '',
        inactivityThreshold: '100',
        refractoryDuration: '4',
        spikeThreshold: '15',
        tau: '15',
        transmitter: 'glutamate',
        receptors: new Set(),
      };
      setForm(emptyForm);
      setInitialForm(emptyForm);
    }
  }, [neuron]);

  const save = () => {
    if (!neuron) return;

    const parsedInactivity = parseInt(form.inactivityThreshold, 10);
    const parsedRefractory = parseInt(form.refractoryDuration, 10);
    const parsedSpikeThreshold = parseInt(form.spikeThreshold, 10);
    const parsedTau = parseInt(form.tau, 10);

    if (
      isNaN(parsedInactivity) ||
      isNaN(parsedRefractory) ||
      isNaN(parsedSpikeThreshold) ||
      isNaN(parsedTau)
    ) {
      toast.error('Некорректные значения параметров', { duration: 3000, position: 'top-right' });
      return;
    }

    if (parsedTau < 1 || parsedTau > 100) {
      toast.error('Постоянная времени (τ) должна быть от 1 до 100', { duration: 3000, position: 'top-right' });
      return;
    }

    updateNeuron(neuron.id, {
      label: form.label,
      inactivityThreshold: parsedInactivity,
      refractoryDuration: parsedRefractory,
      spikeThreshold: parsedSpikeThreshold,
      tau: parsedTau,
      neuroTransmitter: form.transmitter,
      receptors: form.receptors, // ← сохраняем как массив
    });

    setInitialForm({ ...form }); // важно: создать новый объект
    toast.success('Параметры нейрона сохранены', { duration: 2000, position: 'top-right' });
  };

  const hasChanges = (
    form.label !== initialForm.label ||
    form.inactivityThreshold !== initialForm.inactivityThreshold ||
    form.refractoryDuration !== initialForm.refractoryDuration ||
    form.spikeThreshold !== initialForm.spikeThreshold ||
    form.tau !== initialForm.tau ||
    form.transmitter !== initialForm.transmitter ||
    !setsAreEqual(form.receptors, initialForm.receptors) // ← сравниваем Set'ы
  );

  return {
    neuron,
    form,
    setForm,
    save,
    hasChanges,
    membranePotential: neuron?.membranePotential ?? 0,
  };
};
