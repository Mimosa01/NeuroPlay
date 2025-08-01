import { useEffect, useMemo, useState } from 'react';
import { useSelectionStore } from '../store/useSelectionStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';

const activationFunctions = ['relu', 'sigmoid', 'linear'];

export const useEditSelection = () => {
  const selectedNeuronId = useSelectionStore(state => state.selectedNeuronId);
  const selectedEdgeId = useSelectionStore(state => state.selectedEdgeId);
  const setSelectedNeuronId = useSelectionStore(state => state.setSelectedNeuronId);
  const setSelectedEdgeId = useSelectionStore(state => state.setSelectedEdgeId);

  const neurons = useNetworkStore(state => state.neuronsDTO);
  const edges = useNetworkStore(state => state.edgesDTO);
  const updateNeuron = useNetworkStore(state => state.updateNeuron);
  const updateEdgeWeight = useNetworkStore(state => state.updateEdgeWeight);

  const neuron = useMemo(() => neurons.find(n => n.id === selectedNeuronId) || null, [neurons, selectedNeuronId]);
  const edge = useMemo(() => edges.find(e => e.id === selectedEdgeId) || null, [edges, selectedEdgeId]);

  const [activation, setActivation] = useState('');
  const [label, setLabel] = useState('');
  const [weight, setWeight] = useState('');

  const [initialActivation, setInitialActivation] = useState('');
  const [initialLabel, setInitialLabel] = useState('');

  const [inactivityThreshold, setInactivityThreshold] = useState('0');
  const [initialInactivityThreshold, setInitialInactivityThreshold] = useState('0');




  useEffect(() => {
    if (neuron) {
      setActivation(neuron.activationType);
      setInitialActivation(neuron.activationType);
      setLabel(neuron.label ?? '');
      setInitialLabel(neuron.label ?? '');
      setInactivityThreshold(String(neuron.inactivityThreshold ?? 10));
      setInitialInactivityThreshold(String(neuron.inactivityThreshold ?? 10));

    }
    if (edge) {
      setWeight(edge.weight.toString());
    }
  }, [neuron, edge]);

  const saveNeuron = () => {
    if (!neuron) return;

    const parsed = parseInt(inactivityThreshold as unknown as string, 10);
    if (isNaN(parsed)) return;

    updateNeuron(neuron.id, {
      label,
      activationType: activation,
      inactivityThreshold: parsed,
    });

    setSelectedNeuronId(null);
  };


  const saveEdge = () => {
    if (!edge) return;
    const parsed = parseFloat(weight);
    if (!isNaN(parsed)) {
      updateEdgeWeight(edge.id, parsed);
      setSelectedEdgeId(null);
    }
  };

  const clearSelection = () => {
    setSelectedNeuronId(null);
    setSelectedEdgeId(null);
  };

  return {
    neuron,
    neuronID: neuron?.id,
    edge,
    activation,
    setActivation,
    label,
    setLabel,
    weight,
    setWeight,
    saveNeuron,
    saveEdge,
    clearSelection,
    inactivityThreshold,
    setInactivityThreshold,
    hasNeuronChanges:
      activation !== initialActivation ||
      label !== initialLabel ||
      inactivityThreshold !== initialInactivityThreshold,
    activationFunctions,
    accumulatedSignal: neuron?.accumulatedSignal ?? 0,
  };
};
