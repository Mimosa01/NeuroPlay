import { FlaskConical, Zap } from 'lucide-react';
import type { FC } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { useToolStore } from '../../features/scene/store/useToolStore';

export const SynapsTypeSwitch: FC = () => {
  const synapsType = useToolStore((state) => state.synapsType);
  const setSynapsType = useToolStore((state) => state.setSynapsType);

  return (
    <ToggleSwitch
      value={synapsType}
      onChange={setSynapsType}
      options={[
        {
          value: 'chemical',
          icon: FlaskConical,
          label: 'Химический',
          ariaLabel: 'Химический синапс',
        },
        {
          value: 'electric',
          icon: Zap,
          label: 'Электрический',
          ariaLabel: 'Электрический синапс',
        }
      ]}
    />
  );
};