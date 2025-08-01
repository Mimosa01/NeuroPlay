import { Button } from "../../shared/components/Button";
import { useEditSelection } from "./hooks/useEditSelection";

export const EdgeBody = () => {
  const {
    weight,
    setWeight,
    saveEdge,
  } = useEditSelection();

  return (
    <>
      <label className="block">Вес ребра</label>
      <input
        type="number"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        className="w-full border-1 border-slate-500/10 backdrop-blur-sm rounded-lg px-2 py-1"
      />

      <Button
        onClick={saveEdge}
        className={`bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700`}
      >
        Save
      </Button>
    </>
  );
};
