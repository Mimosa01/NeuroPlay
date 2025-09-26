import { useHintHotkey } from '../hooks/useHintHotkey';
import { hotkeyToString } from '../utils/hotKeyParser';

export const HotkeyHint = () => {
  const { 
    isHelpVisible, 
    toggleHelp, 
    getBinding, 
    groupedHints, 
    categoryNames 
  } = useHintHotkey();

  if (!isHelpVisible) return

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={toggleHelp}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-slate-800">Горячие клавиши</h2>
          <button 
            onClick={toggleHelp}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Два столбца */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedHints).map(([category, commands]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-slate-700 border-b pb-1">
                {categoryNames[category] || category}
              </h3>
              <div className="space-y-2">
                {commands.map(({ action, label }) => {
                  const binding = getBinding(action);
                  const keyText = binding 
                    ? hotkeyToString(binding.combination) 
                    : '—';
                  
                  return (
                    <div key={action} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-700 text-sm">{label}</span>
                      <kbd className="bg-slate-700 text-white px-2 py-1 rounded text-xs font-mono">
                        {keyText}
                      </kbd>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-sm text-slate-500">
          Нажмите <kbd className="bg-slate-200 px-2 py-1 rounded">Esc</kbd> для закрытия
        </div>
      </div>
    </div>
  );
};