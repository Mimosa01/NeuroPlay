import { useState } from "react";

type ButtonProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
};

export const Button = ({ icon: Icon, label, onClick }: ButtonProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        className={`
          group flex items-center justify-center w-11 aspect-square backdrop-blur-sm rounded-lg
          hover:shadow-md transition-shadow duration-300
        `}
        aria-label={label}
        onClick={onClick}
      >
        <Icon
          className="w-6 h-6 stroke-slate-800 group-hover:stroke-blue-500 transition-all duration-300"
          strokeWidth={2}
        />
      </button>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute top-1/2 transform -translate-y-1/2 left-full ml-4 px-2 py-1 rounded-lg text-slate-800 text-xs bg-white whitespace-nowrap shadow-lg select-none pointer-events-none z-10">
          {label}
        </div>
      )}
    </div>
  );
};
