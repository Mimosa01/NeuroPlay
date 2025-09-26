import { MEMBRANE_POTENTIAL_COLORS, RESTING_POTENTIAL } from "../../../shared/constants/neuron.constants";

type MembranePotential = number;
type SpikeThreshold = number;

export function getBiologicalColor(membranePotential: MembranePotential, spikeThreshold: SpikeThreshold): string {
  if (membranePotential >= spikeThreshold) {
    return MEMBRANE_POTENTIAL_COLORS.spike;
  }
  if (membranePotential > RESTING_POTENTIAL) {
    return MEMBRANE_POTENTIAL_COLORS.depolarization;
  }
  if (membranePotential < RESTING_POTENTIAL) {
    return MEMBRANE_POTENTIAL_COLORS.hyperpolarization;
  }
  return MEMBRANE_POTENTIAL_COLORS.resting;
}
