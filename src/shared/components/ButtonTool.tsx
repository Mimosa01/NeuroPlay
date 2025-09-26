import type { FC } from "react";

type ButtonToolProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
  isActive?: boolean;
};

export const ButtonTool: FC<ButtonToolProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  isActive 
}) => {
  return (
    <div className="relative flex flex-col items-center group">
      <button
        className={`
          group flex items-center justify-center w-11 aspect-square
          rounded-xl
          transition-all duration-200 ease-out
          hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-blue-400/50
          active:scale-95
          ${isActive
            ? 'bg-blue-500/10 shadow-[0_4px_12px_-4px_rgba(59,130,246,0.4)]'
            : 'bg-white/60 hover:bg-white/80'
          }
          backdrop-blur-sm
          border border-white/30
        `}
        aria-label={label}
        onClick={onClick}
        type="button"
      >
        <Icon
          className={`
            w-6 h-6 transition-colors duration-200
            ${isActive ? 'text-blue-600' : 'text-slate-700 group-hover:text-slate-900'}
          `}
          strokeWidth={2}
        />
      </button>

      {/* Плавный tooltip */}
      <div
        className={`
          absolute top-1/2 left-full ml-3
          px-2 py-1.5 rounded-lg
          text-xs font-medium
          bg-slate-800 text-white
          whitespace-nowrap
          pointer-events-none
          select-none
          z-20
          opacity-0 invisible
          transition-all duration-200 ease-out
          group-hover:opacity-100 group-hover:visible group-hover:translate-x-0
        `}
      >
        {label}
      </div>
    </div>
  );
};