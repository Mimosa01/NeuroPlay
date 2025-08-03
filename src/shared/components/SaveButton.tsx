import { Button } from "./Button";

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
      w-full py-2 px-4 rounded-lg font-medium transition-all
      ${hasChanges 
        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
      }
    `}
  >
    {hasChanges ? 'Сохранить изменения' : 'Нет изменений'}
  </Button>
);