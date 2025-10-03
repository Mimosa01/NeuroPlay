import type { IChemicalSynaps } from "../../interfaces/ISynaps.interface";
import type { IModulationCloud } from "../../interfaces/IModulationCloud.interface";
import type { INeuron } from "../../interfaces/INeuron.interface";
import type { NeuronInstance, Coords, NeuronType } from "../../types/types";
import { NeuronFactory } from "../NeuronFactory";
import NeuronAccessor from "../neurons/NeuronAccessor";
import ChemicalSynaps from "../../synapses/ChemicalSynaps";
import type { IElectricSynaps } from "../../interfaces/IElectricSynaps.interface";
import ElectricSynaps from "../../synapses/ElectricSynaps";


export default class Network {
  public readonly neurons: Map<string, NeuronInstance> = new Map();
  public readonly chemicalSynapses: Map<string, IChemicalSynaps> = new Map();
  public readonly modulationClouds: Map<string, IModulationCloud> = new Map();
  public readonly electricSynapses: Map<string, IElectricSynaps> = new Map();

  constructor () {};

  public createNeuron(coords: Coords, type: NeuronType): NeuronInstance {
    const neuron = NeuronFactory.create(type, coords);
    this.neurons.set(neuron.id, neuron);
    return neuron;
  }

  public removeNeuron(neuronId: string): void {
    this.neurons.delete(neuronId);

    for (const [synapsId, synaps] of this.chemicalSynapses) {
      if (synaps.source.id === neuronId || synaps.target.id === neuronId) {
        this.chemicalSynapses.delete(synapsId);
      }
    }
  }

  public createSynaps(source: NeuronInstance, target: NeuronInstance, conductance?: number, delay?: number): IChemicalSynaps {
    const synaps = new ChemicalSynaps(source, target, conductance, delay);
    source.addOutputSynaps(synaps);
    target.addInputSynaps(synaps);
    this.chemicalSynapses.set(synaps.id, synaps);
    return synaps;
  }

  public removeSynaps(synapsId: string): void {
    const synaps = this.chemicalSynapses.get(synapsId);
    if (!synaps) return;

    synaps.source.removeOutputSynaps(synapsId);
    synaps.target.removeInputSynaps(synapsId);
    this.chemicalSynapses.delete(synapsId);
  }

  public createElectricSynaps(source: NeuronInstance, target: NeuronInstance, conductance?: number): IElectricSynaps {
    const synaps = new ElectricSynaps(source, target, conductance);
    source.addOutputElectricSynaps(synaps);
    target.addInputElectricSynaps(synaps);
    this.electricSynapses.set(synaps.id, synaps);
    return synaps;
  }

  public removeElectricSynaps(id: string): void {
    this.electricSynapses.delete(id);
  }

  public addModulationCloud(cloud: IModulationCloud): void {
    this.modulationClouds.set(cloud.id, cloud);
  }

  public removeDeadClouds(cloudId: string): void {
    this.modulationClouds.delete(cloudId);
  }

  public reset(): void {
    this.neurons.clear();
    this.chemicalSynapses.clear();
  }

  public getNeuron(id: string): NeuronInstance | undefined {
    return this.neurons.get(id);
  }

  public getSynaps(id: string): IChemicalSynaps | undefined {
    return this.chemicalSynapses.get(id);
  }

  public getElectricSynaps(id: string): IElectricSynaps | undefined {
    return this.electricSynapses.get(id);
  }

  public findNearestNeuron(coords: Coords, maxDistance: number = Infinity): INeuron | null {
    let nearestNeuron: INeuron | null = null;
    let minDistance = Infinity;

    for (const neuron of this.neurons.values()) {
      const accessor = new NeuronAccessor(neuron);
      const dx = accessor.getCoords().x - coords.x;
      const dy = accessor.getCoords().y - coords.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDistance && dist <= maxDistance) {
        minDistance = dist;
        nearestNeuron = neuron;
      }
    }

    return nearestNeuron;
  }

  public findNearestSynaps(coords: Coords, maxDistance: number = Infinity): IChemicalSynaps | null {
    let nearest: IChemicalSynaps | null = null;
    let minDist = Infinity;
    const { x, y } = coords;

    for (const synaps of this.chemicalSynapses.values()) {
      const { x: x1, y: y1 } = new NeuronAccessor(synaps.source).getCoords();
      const { x: x2, y: y2 } = new NeuronAccessor(synaps.target).getCoords();

      const dx = x2 - x1;
      const dy = y2 - y1;
      const lengthSq = dx * dx + dy * dy;

      if (lengthSq === 0) continue;

      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSq));
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;
      const dist = Math.hypot(projX - x, projY - y);

      if (dist < minDist && dist <= maxDistance) {
        minDist = dist;
        nearest = synaps;
      }
    }

    return nearest;
  }
}