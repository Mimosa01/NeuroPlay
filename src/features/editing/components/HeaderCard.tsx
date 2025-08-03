import { Hash } from "lucide-react";
import type { FC } from "react";

type HeaderCardProps = {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subtitle?: string;
  variant?: 'default' | 'neuron' | 'edge';
}

export const HeaderCard: FC<HeaderCardProps> = ({ 
  icon: Icon, 
  subtitle,
  variant = 'default'
}) => {
  if (variant === 'neuron' && !Icon) {
    Icon = Hash;
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
      {Icon && <Icon className="w-4 h-4 text-slate-500" />}
      <div className="flex flex-col">
        {subtitle && (
          <div className="font-mono text-xs text-slate-600 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};