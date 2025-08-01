import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { EdgeBody } from './EdgeBody';
import { NeuronBody } from './NeuronBody';
import { useEditSelection } from './hooks/useEditSelection';
import { Button } from '../../shared/components/Button';

export const EditPanel: React.FC = () => {
  const {
      neuron,
      edge,
      clearSelection,
    } = useEditSelection();
  
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') clearSelection();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [clearSelection]);
  
    if (!neuron && !edge) return null;

  return (
    <div className="fixed top-20 right-10 flex flex-col gap-4 shadow-md backdrop-blur-sm rounded-lg p-4 w-64 z-50">
      <div className='flex justify-between items-center'>
        <h3 className="font-bold">{ neuron ? 'Нейрон' : 'Ребро' }</h3>
        <Button
          onClick={clearSelection}
          className='
            group flex items-center justify-center w-11 aspect-square backdrop-blur-sm rounded-lg
            hover:shadow-md transition-shadow duration-300'
        >
          <X className='w-6 h-6 group-hover:stroke-blue-500 transition-all duration-300'/>
        </Button>
      </div>
      {neuron && <NeuronBody />}
      {edge && <EdgeBody />}
    </div>
  );
};
