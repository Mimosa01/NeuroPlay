import { useEffect, useState } from 'react';
import { useSelectionStore } from '../store/useSelectionStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';
import { toast } from 'sonner';

type SynapsFormFields = {
  conductance: string;
  delay: string;
};

export const useEditSynaps = () => {
  const selectedSynapsId = useSelectionStore(state => state.selectedSynapsId);
  const synapses = useNetworkStore(state => state.synapsesDTO);
  const updateSynaps = useNetworkStore(state => state.updateSynaps);

  const synaps = synapses.find(e => e.id === selectedSynapsId) || null;

  const [form, setForm] = useState<SynapsFormFields>({
    conductance: '1.0',
    delay: '1',
  });

  const [initialForm, setInitialForm] = useState<SynapsFormFields>(form);

  // Обновляем форму при смене синапса
  useEffect(() => {
    if (synaps) {
      const newForm = {
        conductance: String(synaps.conductance ?? 1.0),
        delay: String(synaps.delay ?? 1),
      };
      setForm(newForm);
      setInitialForm(newForm);
    } else {
      setForm({
        conductance: '1.0',
        delay: '1',
      });
      setInitialForm({
        conductance: '1.0',
        delay: '1',
      });
    }
  }, [synaps]);

  const save = () => {
    if (!synaps) return;

    const parsedConductance = parseFloat(form.conductance);
    const parsedDelay = parseInt(form.delay, 10);

    if (isNaN(parsedConductance) || isNaN(parsedDelay)) {
      toast.error('Некорректные значения параметров', { duration: 3000, position: 'top-right' });
      return;
    }

    if (parsedConductance < 0.1 || parsedConductance > 10.0) {
      toast.error('Проводимость должна быть от 0.1 до 10.0 μS', { duration: 3000, position: 'top-right' });
      return;
    }

    if (parsedDelay < 0 || parsedDelay > 10) {
      toast.error('Задержка должна быть от 0 до 10 шагов', { duration: 3000, position: 'top-right' });
      return;
    }

    updateSynaps(synaps.id, {
      conductance: parsedConductance,
      delay: parsedDelay
    });

    setInitialForm(form);
    toast.success('Параметры связи сохранены', { duration: 2000, position: 'top-right' });
  };

  const hasChanges = (
    form.conductance !== initialForm.conductance ||
    form.delay !== initialForm.delay
  );

  return {
    synaps,
    form,
    setForm,
    save,
    hasChanges,
  };
};