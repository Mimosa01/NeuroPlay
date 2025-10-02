import { Hash, Link } from "lucide-react";
import type { FC } from "react";

type HeaderCardProps = {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subtitle?: string;
  variant?: 'default' | 'neuron' | 'synaps';
};

export const HeaderCard: FC<HeaderCardProps> = ({ 
  icon: Icon, 
  subtitle,
  variant = 'default'
}) => {
  // Определяем заголовок и иконку по варианту
  const getTitle = () => {
    if (variant === 'neuron') return 'Нейрон';
    if (variant === 'synaps') return 'Синапс';
    return 'Элемент';
  };

  const getIcon = () => {
    if (Icon) return Icon;
    if (variant === 'neuron') return Hash;
    if (variant === 'synaps') return Link;
    return Hash;
  };

  const SelectedIcon = getIcon();
  const title = getTitle();

  // Цвета по варианту
  const bgColor = 
    variant === 'neuron' ? 'bg-blue-50/70' :
    variant === 'synaps' ? 'bg-purple-50/70' :
    'bg-slate-50/70';

  const iconColor = 
    variant === 'neuron' ? 'text-blue-600' :
    variant === 'synaps' ? 'text-purple-600' :
    'text-slate-500';

  return (
    <div className={`
      flex items-center gap-3 
      p-3 
      ${bgColor}
      rounded-xl 
      border border-slate-200/60
      backdrop-blur-sm
      shadow-sm
      transition-colors duration-200
    `}>
      <div className={`
        flex items-center justify-center w-8 h-8
        rounded-lg
        ${bgColor.replace('bg-', 'bg-').replace('/70', '/30')}
        border border-slate-200/50
      `}>
        <SelectedIcon className={`w-4 h-4 ${iconColor}`} />
      </div>
      
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-800">
          {title}
        </div>
        {subtitle && (
          <div className="
            font-mono text-xs text-slate-600 truncate
            mt-0.5
          ">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};