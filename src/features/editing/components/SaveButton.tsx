import { Check, Save } from 'lucide-react';
import { Button } from "../../../shared/components/Button";

export const SaveButton = ({ 
  hasChanges, 
  onClick 
}: { 
  hasChanges: boolean; 
  onClick: () => void 
}) => (
  <Button
    onClick={onClick}
    disabled={!hasChanges}
    className={`
      w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-200
      flex items-center justify-center gap-2
      focus:outline-none focus:ring-2 focus:ring-blue-400/50
      ${
        hasChanges
          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-[0.98]'
          : 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed'
      }
    `}
  >
    {hasChanges ? (
      <>
        <Save className="w-4 h-4" />
        Сохранить
      </>
    ) : (
      <>
        <Check className="w-4 h-4" />
        Сохранено
      </>
    )}
  </Button>
);
