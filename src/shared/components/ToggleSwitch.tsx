type ToggleOption<T> = {
  value: T;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  ariaLabel: string;
};

type ToggleSwitchProps<T> = {
  value: T;
  onChange: (value: T) => void;
  options: [ToggleOption<T>, ToggleOption<T>];
  disabled?: boolean;
};

export const ToggleSwitch = <T extends string>({
  value,
  onChange,
  options,
  disabled = false,
}: ToggleSwitchProps<T>) => {
  const [first, second] = options;

  return (
    <div className="relative flex items-center justify-between w-24 h-10 rounded-full bg-white/60 border border-white/30 shadow-sm overflow-hidden">
      {/* Фон переключателя */}
      <div
        className={`
          absolute top-0.5 left-0.5 h-[calc(100%-4px)] w-1/2 rounded-full bg-blue-500/20 transition-transform duration-300 ease-in-out
          ${value === second.value ? 'transform translate-x-full' : ''}
        `}
      />

      {/* Кнопки */}
      <button
        className={`
          flex items-center justify-center w-1/2 h-full z-10
          transition-colors duration-200
          ${value === first.value ? 'text-blue-600' : 'text-slate-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
        `}
        onClick={() => onChange(first.value)}
        aria-label={first.ariaLabel}
        disabled={disabled}
        type="button"
      >
        <first.icon className="w-5 h-5" />
      </button>

      <button
        className={`
          flex items-center justify-center w-1/2 h-full z-10
          transition-colors duration-200
          ${value === second.value ? 'text-blue-600' : 'text-slate-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
        `}
        onClick={() => onChange(second.value)}
        aria-label={second.ariaLabel}
        disabled={disabled}
        type="button"
      >
        <second.icon className="w-5 h-5" />
      </button>
    </div>
  );
};