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

  return (
    <div className="space-y-4 text-gray-800">
      <HeaderCard 
        icon={Link}
        subtitle={`${sourceId} → ${targetId}`}
      />

      {/* Проводимость (микросименсы) */}
      <div className="space-y-2">
        <IconInput
          icon={Activity}
          label="Проводимость"
          type="number"
          step="0.1"
          min="0.1"
          max="10.0"
          value={conductance}
          onChange={(e) => setEdgeForm('conductance', e.target.value)}
          helpText="μS (микросименсы)"
        />
        
        {/* Визуализация проводимости */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ 
              width: `${Math.min(100, (parseFloat(conductance) || 0) * 10)}%` 
            }}
          />
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
        
        {/* Визуализация задержки */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ 
              width: `${Math.min(100, (parseFloat(delay) || 0) * 10)}%` 
            }}
          />
        </div>
      </div>

      {/* Информация о нейромедиаторе (если есть) */}
      {edge?.neurotransmitter && (
        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-700 font-medium">
            Нейромедиатор: {edge.neurotransmitter}
          </div>
        </div>
      )}

      <SaveButton 
        hasChanges={hasEdgeChanges}
        onClick={saveEdge}
      />
    </div>
  );
};