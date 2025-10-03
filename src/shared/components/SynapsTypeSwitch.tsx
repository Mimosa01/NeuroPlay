import { useToolStore } from '../../features/scene/store/useToolStore';
import { FlaskConical, Zap } from 'lucide-react';
import type { FC } from 'react';

export const SynapsTypeSwitch: FC = () => {
  const synapsType = useToolStore((state) => state.synapsType);
  const setSynapsType = useToolStore((state) => state.setSynapsType);

  return (
    <div className="relative flex items-center justify-between w-24 h-10 rounded-full bg-white/60 border border-white/30 shadow-sm overflow-hidden">
      {/* Фон переключателя */}
      <div
        className={`
          absolute top-0.5 left-0.5 h-[calc(100%-4px)] w-1/2 rounded-full bg-blue-500/20 transition-transform duration-300 ease-in-out
          ${synapsType === 'electric' ? 'transform translate-x-full' : ''}
        `}
      />

      {/* Кнопки */}
      <button
        className={`
          flex items-center justify-center w-1/2 h-full z-10
          transition-colors duration-200
          ${synapsType === 'chemical' ? 'text-blue-600' : 'text-slate-500'}
        `}
        onClick={() => setSynapsType('chemical')}
        aria-label="Химический синапс"
      >
        <FlaskConical className="w-5 h-5" />
      </button>

      <button
        className={`
          flex items-center justify-center w-1/2 h-full z-10
          transition-colors duration-200
          ${synapsType === 'electric' ? 'text-blue-600' : 'text-slate-500'}
        `}
        onClick={() => setSynapsType('electric')}
        aria-label="Электрический синапс"
      >
        <Zap className="w-5 h-5" />
      </button>
    </div>
  );
};