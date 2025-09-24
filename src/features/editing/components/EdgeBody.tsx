import { useEditSelection } from "../hooks/useEditSelection";
import { Link, Activity, Clock } from 'lucide-react';
import { SaveButton } from "../../../shared/components/SaveButton";
import { HeaderCard } from "./HeaderCard";
import toShortenText from "../utils/toShortenText";
import { IconInput } from "../../../shared/components/IconInput";

export const EdgeBody = () => {
  const {
    conductance,
    delay,
    setEdgeForm,
    saveEdge,
    hasEdgeChanges,
    edge,
  } = useEditSelection();

  const sourceId = toShortenText(edge?.sourceId || '');
  const targetId = toShortenText(edge?.targetId || '');

  // Проводимость: 0.1 → 2.0 → 0% → 100%
  const conductanceValue = parseFloat(conductance) || 0.1;
  const conductancePercent = Math.min(100, Math.max(0, ((conductanceValue - 0.1) / (2.0 - 0.1)) * 100));

  // Задержка: 1 → 10 → 0% → 100%
  const delayValue = parseFloat(delay) || 1;
  const delayPercent = Math.min(100, Math.max(0, ((delayValue - 1) / (10 - 1)) * 100));

  return (
    <div className="space-y-5 text-slate-800">
      <HeaderCard 
        icon={Link}
        subtitle={`${sourceId} → ${targetId}`}
      />

      {/* Проводимость */}
      <div className="space-y-2">
        <IconInput
          icon={Activity}
          label="Проводимость"
          type="number"
          step="0.1"
          min="0.1"
          max="2.0"
          value={conductance}
          onChange={(e) => setEdgeForm('conductance', e.target.value)}
          helpText="μS (микросименсы)"
          autoFocus
        />
        
        <div 
          className="group relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden cursor-pointer"
          title={`Проводимость: ${conductanceValue.toFixed(1)} μS`}
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${conductancePercent}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-medium text-blue-700 drop-shadow">
              {conductanceValue.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Задержка */}
      <div className="space-y-2">
        <IconInput
          icon={Clock}
          label="Задержка передачи"
          type="number"
          step="1"
          min="1"
          max="10"
          value={delay}
          onChange={(e) => setEdgeForm('delay', e.target.value)}
          helpText="шагов"
        />
        
        <div 
          className="group relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden cursor-pointer"
          title={`Задержка: ${Math.round(delayValue)} шагов`}
        >
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 ease-out"
            style={{ width: `${delayPercent}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-medium text-green-700 drop-shadow">
              {Math.round(delayValue)}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <SaveButton 
          hasChanges={hasEdgeChanges}
          onClick={saveEdge}
        />
      </div>
    </div>
  );
};
