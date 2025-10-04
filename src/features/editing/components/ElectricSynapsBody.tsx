import { Link, Activity } from 'lucide-react';
import { SaveButton } from "./SaveButton";
import { HeaderCard } from "./HeaderCard";
import toShortenText from "../utils/toShortenText";
import { IconInput } from "../../../shared/components/IconInput";
import { useEditElectricSynaps } from '../hooks/useEditElectricSynapse';

export const ElectricSynapsBody = () => {
  const {
    synaps,
    form,
    setForm,
    save,
    hasChanges,
  } = useEditElectricSynaps();

  if (!synaps) return null;

  const sourceId = toShortenText(synaps.sourceId || '');
  const targetId = toShortenText(synaps.targetId || '');

  // Проводимость: 0.01 → 1.0 → 0% → 100%
  const conductanceValue = parseFloat(form.conductance) || 0.01;
  const conductancePercent = Math.min(100, Math.max(0, ((conductanceValue - 0.1) / (1.0 - 0.1)) * 100));

  return (
    <div className="space-y-5 text-slate-800">
      <HeaderCard 
        icon={Link}
        subtitle={`${sourceId} ↔ ${targetId}`} // двунаправленный символ
      />

      {/* Проводимость */}
      <div className="space-y-2">
        <IconInput
          icon={Activity}
          label="Проводимость"
          type="number"
          step="0.1"
          min="0.1"
          max="1.0"
          value={form.conductance}
          onChange={(e) => setForm(prev => ({ ...prev, conductance: e.target.value }))}
          helpText="μS (микросименсы)"
          autoFocus
        />
        
        <div 
          className="group relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden cursor-pointer"
          title={`Проводимость: ${conductanceValue.toFixed(2)} μS`}
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${conductancePercent}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-medium text-blue-700 drop-shadow">
              {conductanceValue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <SaveButton 
          hasChanges={hasChanges}
          onClick={save}
        />
      </div>
    </div>
  );
};