import { Zap, Activity } from "lucide-react";
import type { FC } from "react";
import { ToggleSwitch } from "../../../shared/components/ToggleSwitch";
import type { NeuronFormFields } from "../types/types";

type GradedSwitchProps = {
  form: NeuronFormFields;
  setForm: React.Dispatch<React.SetStateAction<NeuronFormFields>>;
}

export const GradedSwitch: FC<GradedSwitchProps> = ({ form, setForm }) => {

  return (
    <ToggleSwitch
      value={form.mode}
      onChange={(value) => setForm(prev => ({ ...prev, mode: value }))}
      options={[
        {
          value: 'spiking',
          icon: Zap,
          label: 'Спайковый',
          ariaLabel: 'Спайковый нейрон',
        },
        {
          value: 'graded',
          icon: Activity,
          label: 'Градуальный',
          ariaLabel: 'Градуальный нейрон',
        }
      ]}
    />
  );
};