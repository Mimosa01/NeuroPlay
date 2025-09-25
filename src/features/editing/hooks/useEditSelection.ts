import { useEffect, useMemo, useState } from 'react';
import { useSelectionStore } from '../store/useSelectionStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';
import { toast } from 'sonner';
import type { NeuroTransmitterType } from '../../network/types/types';

type NeuronFormFields = {
  label: string;
  inactivityThreshold: string;
  refractoryDuration: string;
  spikeThreshold: string;
  tau: string;
  transmitter: NeuroTransmitterType;
};

export const useEditSelection = () => {
  const selectedNeuronId = useSelectionStore(state => state.selectedNeuronId);
  const selectedEdgeId = useSelectionStore(state => state.selectedEdgeId);
  const setSelectedNeuronId = useSelectionStore(state => state.setSelectedNeuronId);
  const setSelectedEdgeId = useSelectionStore(state => state.setSelectedEdgeId);

  const neurons = useNetworkStore(state => state.neuronsDTO);
  const edges = useNetworkStore(state => state.edgesDTO);
  const updateNeuron = useNetworkStore(state => state.updateNeuron);
  const updateEdge = useNetworkStore(state => state.updateEdge);

  const neuron = useMemo(
    () => neurons.find(n => n.id === selectedNeuronId) || null,
    [neurons, selectedNeuronId]
  );
  const edge = useMemo(
    () => edges.find(e => e.id === selectedEdgeId) || null,
    [edges, selectedEdgeId]
  );

  const [neuronForm, setNeuronForm] = useState<NeuronFormFields>({
    label: '',
    inactivityThreshold: '100',
    refractoryDuration: '4',
    spikeThreshold: '15',
    tau: '15',
    transmitter: 'glutamate'
  });

  const [initialNeuronForm, setInitialNeuronForm] = useState<NeuronFormFields>(neuronForm);

  const [edgeForm, setEdgeForm] = useState({
    conductance: '1.0',
    delay: '1',
  });

  const [initialEdgeForm, setInitialEdgeForm] = useState(edgeForm);

  // === Нейрон ===
  useEffect(() => {
    if (neuron) {
      const newForm: NeuronFormFields = {
        label: neuron.label ?? '',
        inactivityThreshold: String(neuron.inactivityThreshold ?? 100),
        refractoryDuration: String(neuron.refractoryDuration ?? 4),
        spikeThreshold: String(neuron.spikeThreshold ?? 15),
        tau: String(neuron.tau ?? 15),
        transmitter: neuron.neuroTransmitter
      };
      setNeuronForm(newForm);
      setInitialNeuronForm(newForm);
    }
  }, [neuron]);

  // === Ребро ===
  useEffect(() => {
    if (edge) {
      const newForm = {
        conductance: String(edge.conductance ?? 1.0),
        delay: String(edge.delay ?? 1),
      };
      setEdgeForm(newForm);
      setInitialEdgeForm(newForm);
    }
  }, [edge]);

  // === Сохранение нейрона ===
  const saveNeuron = () => {
    if (!neuron) return;

    const parsedInactivity = parseInt(neuronForm.inactivityThreshold, 10);
    const parsedRefractory = parseInt(neuronForm.refractoryDuration, 10);
    const parsedSpikeThreshold = parseInt(neuronForm.spikeThreshold, 10);
    const parsedTau = parseInt(neuronForm.tau, 10);

    if (
      isNaN(parsedInactivity) || 
      isNaN(parsedRefractory) || 
      isNaN(parsedSpikeThreshold) ||
      isNaN(parsedTau)
    ) {
      toast.error('Некорректные значения параметров', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    // Валидация tau (например, 1–100)
    if (parsedTau < 1 || parsedTau > 100) {
      toast.error('Постоянная времени (τ) должна быть от 1 до 100', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    updateNeuron(neuron.id, {
      label: neuronForm.label,
      inactivityThreshold: parsedInactivity,
      refractoryDuration: parsedRefractory,
      spikeThreshold: parsedSpikeThreshold,
      tau: parsedTau,
      neuroTransmitter: neuronForm.transmitter,
    });

    toast.success('Параметры нейрона сохранены', {
      duration: 2000,
      position: 'top-right'
    });
  };

  // === Сохранение ребра ===
  const saveEdge = () => {
    if (!edge) return;
    
    const parsedConductance = parseFloat(edgeForm.conductance);
    const parsedDelay = parseInt(edgeForm.delay, 10);

    if (isNaN(parsedConductance) || isNaN(parsedDelay)) {
      toast.error('Некорректные значения параметров', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    if (parsedConductance < 0.1 || parsedConductance > 10.0) {
      toast.error('Проводимость должна быть от 0.1 до 10.0 μS', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    if (parsedDelay < 0 || parsedDelay > 10) {
      toast.error('Задержка должна быть от 0 до 10 шагов', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    updateEdge(edge.id, {
      conductance: parsedConductance,
      delay: parsedDelay
    });

    toast.success('Параметры связи сохранены', {
      duration: 2000,
      position: 'top-right'
    });
  };

  // === Очистка ===
  const clearSelection = () => {
    setSelectedNeuronId(null);
    setSelectedEdgeId(null);
    setNeuronForm({ 
      label: '', 
      inactivityThreshold: '100',
      refractoryDuration: '4',
      spikeThreshold: '15',
      tau: '15',
      transmitter: 'glutamate'
    });
    setEdgeForm({
      conductance: '1.0',
      delay: '1',
    });
  };

  // === Проверка изменений — ОБНОВЛЕНО! ===
  const hasNeuronChanges = useMemo(() => {
    return (
      neuronForm.label !== initialNeuronForm.label ||
      neuronForm.inactivityThreshold !== initialNeuronForm.inactivityThreshold ||
      neuronForm.refractoryDuration !== initialNeuronForm.refractoryDuration ||
      neuronForm.spikeThreshold !== initialNeuronForm.spikeThreshold ||
      neuronForm.tau !== initialNeuronForm.tau || // ✅
      neuronForm.transmitter !== initialNeuronForm.transmitter // ✅
    );
  }, [neuronForm, initialNeuronForm]);

  const hasEdgeChanges = useMemo(() => {
    return (
      edgeForm.conductance !== initialEdgeForm.conductance ||
      edgeForm.delay !== initialEdgeForm.delay
    );
  }, [edgeForm, initialEdgeForm]);

  return {
    neuron,
    neuronID: neuron?.id,
    edge,
    
    // Нейронные поля
    ...neuronForm,
    setNeuronForm: (key: keyof NeuronFormFields, value: string) => {
      setNeuronForm(prev => ({ ...prev, [key]: value }));
    },
    
    // Ребровые поля
    ...edgeForm,
    setEdgeForm: (key: keyof typeof edgeForm, value: string) => {
      setEdgeForm(prev => ({ ...prev, [key]: value }));
    },
    
    // Методы
    saveNeuron,
    saveEdge,
    clearSelection,
    hasNeuronChanges,
    hasEdgeChanges,
    
    // Значения для отображения
    membranePotential: neuron?.membranePotential ?? 0,
  };
};