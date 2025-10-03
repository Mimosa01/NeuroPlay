import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSelectionStore } from '../store/useSelectionStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';

type ElectricSynapsFormFields = {
  conductance: string;
};

export const useEditElectricSynaps = () => {
  const selectedSynapsId = useSelectionStore(state => state.selectedSynapsId);
  const selectedSynapsType = useSelectionStore(state => state.selectedSynapsType); // ← добавляем
  const electricSynapses = useNetworkStore(state => state.electricSynapsesDTO);
  const updateElectricSynaps = useNetworkStore(state => state.updateElectricSynaps);

  // Показываем только если выбран электрический синапс
  const synaps = selectedSynapsType === 'electric' 
    ? electricSynapses.find(e => e.id === selectedSynapsId) || null 
    : null;

  const [form, setForm] = useState<ElectricSynapsFormFields>({
    conductance: '0.1',
  });

  const [initialForm, setInitialForm] = useState<ElectricSynapsFormFields>(form);

  useEffect(() => {
    if (synaps) {
      const newForm = {
        conductance: String(synaps.conductance ?? 0.1),
      };
      setForm(newForm);
      setInitialForm(newForm);
    } else {
      setForm({
        conductance: '0.1',
      });
      setInitialForm({
        conductance: '0.1',
      });
    }
  }, [synaps]);

  const save = () => {
    if (!synaps) return;

    const parsedConductance = parseFloat(form.conductance);

    if (isNaN(parsedConductance)) {
      toast.error('Некорректное значение проводимости', { duration: 3000, position: 'top-right' });
      return;
    }

    if (parsedConductance < 0.1 || parsedConductance > 1.0) {
      toast.error('Проводимость должна быть от 0.1 до 1.0 μS', { duration: 3000, position: 'top-right' });
      return;
    }

    updateElectricSynaps(synaps.id, {
      conductance: parsedConductance,
    });

    setInitialForm(form);
    toast.success('Параметры электрического синапса сохранены', { duration: 2000, position: 'top-right' });
  };

  const hasChanges = (
    form.conductance !== initialForm.conductance
  );

  return {
    synaps, // ← возвращаем synaps
    form,
    setForm,
    save,
    hasChanges,
  };
};