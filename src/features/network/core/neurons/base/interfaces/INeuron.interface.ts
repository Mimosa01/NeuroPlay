import type { Coords } from "../../../../types/types";
import type { ElectricSignalManager } from "../managers/ElectricSignalManager";
import type { ReceptorManager } from "../managers/ReceptorManager";
import type { SynapseManager } from "../managers/SynapseManager";
import type { NeuronState } from "../NeuronState";


export interface INeuron {
  readonly id: string;
  readonly synapses: SynapseManager;
  readonly receptors: ReceptorManager;
  readonly electric: ElectricSignalManager;
  coords: Coords;
  label: string;
  state: NeuronState;
}