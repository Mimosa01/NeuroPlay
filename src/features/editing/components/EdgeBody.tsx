import { useEditSelection } from "../hooks/useEditSelection";
import { Link } from 'lucide-react';
import { WeightSlider } from "./WeightSlider";
import { SaveButton } from "../../../shared/components/SaveButton";
import { HeaderCard } from "./HeaderCard";
import toShortenText from "../utils/toShortenText";

export const EdgeBody = () => {
  const {
    weight,
    setWeight,
    saveEdge,
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

      <WeightSlider 
        value={weight}
        onChange={setWeight}
      />

      <SaveButton 
        hasChanges={true}
        onClick={saveEdge}
      />
    </div>
  );
};