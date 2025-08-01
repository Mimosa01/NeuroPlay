import { Button } from "../../shared/components/Button";
import { useEditSelection } from "./hooks/useEditSelection";


export const NeuronBody = () => {
  const {
    neuronID,
    activation,
    setActivation,
    label,
    setLabel,
    saveNeuron,
    hasNeuronChanges,
    activationFunctions,
    accumulatedSignal,
    inactivityThreshold,
    setInactivityThreshold,
  } = useEditSelection();

  return (
    <div className="space-y-3 text-sm text-gray-700">
      <div>
        <strong>Neuron ID:</strong> {neuronID}
      </div>

      <div>
        <label className="block font-semibold">Текущий сигнал</label>
        <div className="p-2 border border-slate-300 backdrop-blur-sm rounded-lg">
          {accumulatedSignal?.toFixed(3)}
        </div>
      </div>

      <div>
        <label className="block">Функция активации</label>
        <select
          value={activation}
          onChange={e => setActivation(e.target.value)}
          className="w-full border border-slate-300 backdrop-blur-sm rounded-lg px-2 py-1"
        >
          {activationFunctions.map(fn => (
            <option key={fn} value={fn}>{fn}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block">Метка</label>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          className="w-full border border-slate-300 backdrop-blur-sm rounded-lg px-2 py-1"
        />
      </div>

      <div>
        <label className="block">Шагов до "смерти" нейрона</label>
        <input
          type="number"
          min={1}
          max={1000}
          value={inactivityThreshold}
          onChange={e => setInactivityThreshold(e.target.value)}
          className="w-full border border-slate-300 backdrop-blur-sm rounded-lg px-2 py-1"
        />
      </div>

      <Button
        onClick={saveNeuron}
        className={`bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700
          ${!hasNeuronChanges ? 'opacity-50 pointer-events-none' : ''}  
        `}
      >
        Сохранить
      </Button>
    </div>
  );
};
