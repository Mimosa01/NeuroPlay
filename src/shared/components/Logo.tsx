import { BrainCircuit } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="
      flex items-center gap-2
      px-3 py-2
      bg-white/40
      backdrop-blur-sm
      rounded-xl
      border border-white/30 dark:border-slate-700/50
      shadow-sm
      transition-all duration-300
      hover:shadow-md
      hover:bg-white/80 dark:hover:bg-slate-800/80
    ">
      <BrainCircuit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      <h3 className="
        font-logo text-xl font-bold
        text-slate-800 dark:text-slate-100
        tracking-tight
      ">
        NeuroPlay
      </h3>
    </div>
  );
};