import { Hash, Link } from "lucide-react";
import type { FC } from "react";

type HeaderCardProps = {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subtitle?: string;
  variant?: 'default' | 'neuron' | 'edge';
};

export const HeaderCard: FC<HeaderCardProps> = ({ 
  icon: Icon, 
  subtitle,
  variant = 'default'
}) => {
  // Определяем заголовок и иконку по варианту
  const getTitle = () => {
    if (variant === 'neuron') return 'Нейрон';
    if (variant === 'edge') return 'Связь';
    return 'Элемент';
  };

  const getIcon = () => {
    if (Icon) return Icon;
    if (variant === 'neuron') return Hash;
    if (variant === 'edge') return Link;
    return Hash;
  };

  const SelectedIcon = getIcon();
  const title = getTitle();

  // Цвета по варианту
  const bgColor = 
    variant === 'neuron' ? 'bg-blue-50/60' :
    variant === 'edge' ? 'bg-purple-50/60' :
    'bg-slate-50/60';

  const iconColor = 
    variant === 'neuron' ? 'text-blue-600' :
    variant === 'edge' ? 'text-purple-600' :
    'text-slate-500';

  return (
    <div className={`
      flex items-start gap-3 
      p-3 
      ${bgColor}
      rounded-xl 
      border border-slate-200/50
      backdrop-blur-sm
    `}>
      <SelectedIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
      
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-800">
          {title}
        </div>
        {subtitle && (
          <div className="font-mono text-xs text-slate-600 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
