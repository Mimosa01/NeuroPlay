import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useEditNeuron } from '../hooks/useEditNeuron';
import { useEditSynaps } from '../hooks/useEditSynapse';
import { useEditElectricSynaps } from '../hooks/useEditElectricSynapse';
import { useSelectionStore } from '../store/useSelectionStore';
import { SynapsBody } from './SynapsBody';
import { NeuronBody } from './NeuronBody';
import { ElectricSynapsBody } from './ElectricSynapsBody';

export const EditPanel: React.FC = () => {
  const { neuron } = useEditNeuron();
  const { synaps } = useEditSynaps();
  const { synaps: electricSynaps } = useEditElectricSynaps(); // ← обрати внимание
  const clearSelection = useSelectionStore(state => state.clearSelection);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (neuron || synaps || electricSynaps) { // ← обновляем условие
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    } 
  }, [neuron, synaps, electricSynaps]); // ← добавляем electricSynaps в зависимости

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearSelection();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

  if (!neuron && !synaps && !electricSynaps) return null; // ← обновляем условие

  return (
    <div
      className={`
        fixed top-4 right-4 w-64 z-50
        transition-all duration-200 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2 pointer-events-none'}
      `}
    >
      <div className="
        flex flex-col 
        max-h-[80vh] 
        bg-white/40
        backdrop-blur-sm 
        rounded-xl 
        shadow-sm 
        border border-white/30
        overflow-hidden
      ">
        {/* Заголовок (всегда виден) */}
        <div className="flex justify-between items-center p-4 pb-2">
          <h3 className="text-sm font-semibold text-slate-800">
            {neuron ? 'Нейрон' : (electricSynaps ? 'Эл. синапс' : 'Связь')}
          </h3>
          <button
            onClick={clearSelection}
            className="
              flex items-center justify-center w-8 h-8
              rounded-lg
              text-slate-500 hover:text-blue-600
              hover:bg-white/60
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-400/50
            "
            aria-label="Закрыть панель"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Прокручиваемый контент */}
        <div className="
          overflow-y-auto 
          p-4 pt-2 
          max-h-[calc(80vh-60px)]
          scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent
          hover:scrollbar-thumb-slate-400
        ">
          {neuron && <NeuronBody />}
          {synaps && <SynapsBody />}
          {electricSynaps && <ElectricSynapsBody />}
        </div>
      </div>
    </div>
  );
};