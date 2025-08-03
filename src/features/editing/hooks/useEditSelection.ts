import { useEffect, useMemo, useState } from 'react';
import { useSelectionStore } from '../store/useSelectionStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';
import { toast } from 'sonner';

type NeuronFormFields = {
  label: string;
  inactivityThreshold: string;
  refractoryThreshold: string;
  signalThreshold: string;
  fading: string; 
};

export const useEditSelection = () => {
  const selectedNeuronId = useSelectionStore(state => state.selectedNeuronId);
  const selectedEdgeId = useSelectionStore(state => state.selectedEdgeId);
  const setSelectedNeuronId = useSelectionStore(state => state.setSelectedNeuronId);
  const setSelectedEdgeId = useSelectionStore(state => state.setSelectedEdgeId);

  const neurons = useNetworkStore(state => state.neuronsDTO);
  const edges = useNetworkStore(state => state.edgesDTO);
  const updateNeuron = useNetworkStore(state => state.updateNeuron);
  const updateEdgeWeight = useNetworkStore(state => state.updateEdgeWeight);

  const neuron = useMemo(
    () => neurons.find(n => n.id === selectedNeuronId) || null,
    [neurons, selectedNeuronId]
  );
  const edge = useMemo(
    () => edges.find(e => e.id === selectedEdgeId) || null,
    [edges, selectedEdgeId]
  );

  const [form, setForm] = useState<NeuronFormFields>({
    label: '',
    inactivityThreshold: '10',
    refractoryThreshold: '2',
    signalThreshold: '0.9',
    fading: '0.95',
  });

  const [initialForm, setInitialForm] = useState<NeuronFormFields>(form);

  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (neuron) {
      const newForm: NeuronFormFields = {
        label: neuron.label ?? '',
        inactivityThreshold: String(neuron.inactivityThreshold ?? 10),
        refractoryThreshold: String(neuron.refractoryThreshold ?? 2),
        signalThreshold: String(neuron.signalThreshold ?? 0.9),
        fading: String(neuron.fading ?? 0.95), 
      };
      setForm(newForm);
      setInitialForm(newForm);
    }
  }, [neuron]);

  useEffect(() => {
    if (edge) {
      setWeight(String(edge.weight));
    }
  }, [edge]);

  const saveNeuron = () => {
    if (!neuron) return;

    const parsedInactivity = parseInt(form.inactivityThreshold, 10);
    const parsedRefractory = parseInt(form.refractoryThreshold, 10);
    const parsedSignal = parseFloat(form.signalThreshold);
    const parsedFading = parseFloat(form.fading);

    if (isNaN(parsedInactivity) || isNaN(parsedRefractory) || 
        isNaN(parsedSignal) || isNaN(parsedFading)) return;

    if (parsedFading < 0 || parsedFading > 1) return;

    updateNeuron(neuron.id, {
      label: form.label,
      inactivityThreshold: parsedInactivity,
      refractoryThreshold: parsedRefractory,
      signalThreshold: parsedSignal,
      fading: parsedFading, 
    });

    toast.success('Изменения сохранены', {
      duration: 2000,
      position: 'top-right'
    });
  };

  const saveEdge = () => {
    if (!edge) return;
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight)) return;

    updateEdgeWeight(edge.id, parsedWeight);

    toast.success('Изменения сохранены', {
      duration: 2000,
      position: 'top-right'
    });
  };

  const clearSelection = () => {
    setSelectedNeuronId(null);
    setSelectedEdgeId(null);
    setForm({ 
      label: '', 
      inactivityThreshold: '10',
      refractoryThreshold: '2',
      signalThreshold: '0.9',
      fading: '0.95',
    });
    setWeight('');
  };

  const hasNeuronChanges = useMemo(() => {
    return (
      form.label !== initialForm.label ||
      form.inactivityThreshold !== initialForm.inactivityThreshold ||
      form.refractoryThreshold !== initialForm.refractoryThreshold ||
      form.signalThreshold !== initialForm.signalThreshold ||
      form.fading !== initialForm.fading
    );
  }, [form, initialForm]);

  return {
    neuron,
    neuronID: neuron?.id,
    edge,
    ...form,
    setForm: (key: keyof NeuronFormFields, value: string) => {
      setForm(prev => ({ ...prev, [key]: value }));
    },
    weight,
    setWeight,
    saveNeuron,
    saveEdge,
    clearSelection,
    hasNeuronChanges,
    accumulatedSignal: neuron?.accumulatedSignal ?? 0,
  };
};