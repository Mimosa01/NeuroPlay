import type { ISynaps } from "../../interfaces/ISynaps.interface";
import type { IModulationCloud } from "../../interfaces/IModulationCloud.interface";
import type { INeuron } from "../../interfaces/INeuron.interface";
import type { NeuronInstance, Coords, NeuronType } from "../../types/types";
import Synaps from "../Synaps";
import { NeuronFactory } from "../NeuronFactory";
import NeuronAccessor from "../neurons/NeuronAccessor";


export default class Network {
  public readonly neurons: Map<string, NeuronInstance> = new Map();
  public readonly synapses: Map<string, ISynaps> = new Map();
  public readonly modulationClouds: Map<string, IModulationCloud> = new Map();

  constructor () {};

  public createNeuron(coords: Coords, type: NeuronType): NeuronInstance {
    const neuron = NeuronFactory.create(type, coords);
    this.neurons.set(neuron.id, neuron);
    return neuron;
  }

  public removeNeuron(neuronId: string): void {
    this.neurons.delete(neuronId);

    for (const [synapsId, synaps] of this.synapses) {
      if (synaps.source.id === neuronId || synaps.target.id === neuronId) {
        this.synapses.delete(synapsId);
      }
    }
  }

  public createSynaps(source: NeuronInstance, target: NeuronInstance, conductance?: number, delay?: number): ISynaps {
    const synaps = new Synaps(source, target, conductance, delay);
    source.addOutputSynaps(synaps);
    target.addInputSynaps(synaps);
    this.synapses.set(synaps.id, synaps);
    return synaps;
  }

  public removeSynaps(synapsId: string): void {
    const synaps = this.synapses.get(synapsId);
    if (!synaps) return;

    synaps.source.removeOutputSynaps(synapsId);
    synaps.target.removeInputSynaps(synapsId);
    this.synapses.delete(synapsId);
  }

  public addModulationCloud(cloud: IModulationCloud): void {
    this.modulationClouds.set(cloud.id, cloud);
  }

  public removeDeadClouds(cloudId: string): void {
    this.modulationClouds.delete(cloudId);
  }

  public reset(): void {
    this.neurons.clear();
    this.synapses.clear();
  }

  public getNeuron(id: string): NeuronInstance | undefined {
    return this.neurons.get(id);
  }

  public getSynaps(id: string): ISynaps | undefined {
    return this.synapses.get(id);
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

  public findNearestSynaps(coords: Coords, maxDistance: number = Infinity): ISynaps | null {
    let nearest: ISynaps | null = null;
    let minDist = Infinity;
    const { x, y } = coords;

    for (const synaps of this.synapses.values()) {
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