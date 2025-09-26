import { useEffect, useState } from 'react';
import { useSelectionStore } from '../store/useSelectionStore';
import { useNetworkStore } from '../../network/store/useNetworkStore';
import { toast } from 'sonner';

type EdgeFormFields = {
  conductance: string;
  delay: string;
};

export const useEditEdge = () => {
  const selectedEdgeId = useSelectionStore(state => state.selectedEdgeId);
  const edges = useNetworkStore(state => state.edgesDTO);
  const updateEdge = useNetworkStore(state => state.updateEdge);

  const edge = edges.find(e => e.id === selectedEdgeId) || null;

  const [form, setForm] = useState<EdgeFormFields>({
    conductance: '1.0',
    delay: '1',
  });

  const [initialForm, setInitialForm] = useState<EdgeFormFields>(form);

  // Обновляем форму при смене ребра
  useEffect(() => {
    if (edge) {
      const newForm = {
        conductance: String(edge.conductance ?? 1.0),
        delay: String(edge.delay ?? 1),
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
  }, [edge]);

  const save = () => {
    if (!edge) return;

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

    updateEdge(edge.id, {
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
    edge,
    form,
    setForm,
    save,
    hasChanges,
  };
};