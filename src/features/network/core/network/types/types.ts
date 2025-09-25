// import type { Coords } from "../../../../../shared/types/types";
import type { EdgeDTO } from "../../../dto/edge.dto";
import type { NeuronDTO } from "../../../dto/neuron.dto";

// export type NeuronSnapshot = {
//   id: string;
//   coords: Coords;
//   label: string;
//   membranePotential: number;
//   spikeThreshold: number;
//   spikeAmplitude: number;
//   inactivityCounter: number;
//   inactivityThreshold: number;
//   readyToSend: boolean;
//   refractoryDuration: number;
//   decayFactor: number;
// };

// export type EdgeSnapshot = {
//   id: string;
//   sourceId: string;
//   targetId: string;
//   sourceCoords: Coords;
//   targetCoords: Coords;
//   conductance: number;
//   delay: number;
// };

export type NetworkSnapshot = {
  neurons: NeuronDTO[];
  edges: EdgeDTO[];
};