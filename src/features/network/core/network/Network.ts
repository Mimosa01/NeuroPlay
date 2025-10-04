import type { IChemicalSynaps } from "../../interfaces/ISynaps.interface";
import type { IModulationCloud } from "../../interfaces/IModulationCloud.interface";
import type { INeuron } from "../neurons/base/interfaces/INeuron.interface";
import type { NeuronInstance, Coords, NeuronType, AnySynaps, SynapseType } from "../../types/types";
import { NeuronFactory } from "../NeuronFactory";
import { distancePointToSegment } from "../../utils/geometry";
import type { IElectricSynaps } from "../../interfaces/IElectricSynaps.interface";
import NeuronAccessor from "../neurons/base/NeuronAccessor";
import { SynapseRegistry } from "../synapses/SynapseRegistry";
import { SynapseFactory } from "../SynapseFactory";

export default class Network {
  public readonly neurons: Map<string, NeuronInstance> = new Map();
  public readonly modulationClouds: Map<string, IModulationCloud> = new Map();
  public readonly synapseRegistry = new SynapseRegistry();
  public readonly synapseFactory: SynapseFactory;

  constructor () {
    this.synapseFactory = new SynapseFactory(this.synapseRegistry);
  };

  public createNeuron(coords: Coords, type: NeuronType): NeuronInstance {
    const neuron = NeuronFactory.create(type, coords);
    this.neurons.set(neuron.id, neuron);
    return neuron;
  }

  public removeNeuron(neuronId: string): void {
    const neuron = this.neurons.get(neuronId);
    if (!neuron) return;

    // Удаляем все синапсы, в которых участвует нейрон
    for (const synapsId of neuron.synapses.getAllSynapseIds()) {
      this.synapseRegistry.remove(synapsId);
    }

    neuron.synapses.clearAll();
    this.neurons.delete(neuronId);
  }

  public createSynaps(
    type: SynapseType,
    sourceId: string,
    targetId: string,
    conductance?: number,
    delay?: number
  ): IChemicalSynaps | IElectricSynaps | null {
    const source = this.neurons.get(sourceId);
    const target = this.neurons.get(targetId);
    if (!source || !target) return null;

    return this.synapseFactory.create(type, source, target, conductance, delay);
  }

  public removeSynapse(id: string): void {
    this.synapseFactory.remove(id);
  }

  public addModulationCloud(cloud: IModulationCloud): void {
    this.modulationClouds.set(cloud.id, cloud);
  }

  public removeDeadClouds(cloudId: string): void {
    this.modulationClouds.delete(cloudId);
  }

  public reset(): void {
    this.neurons.clear();
    this.modulationClouds.clear();
    this.synapseRegistry.clear();
  }

  public getNeuron(id: string): NeuronInstance | undefined {
    return this.neurons.get(id);
  }

  public getSynaps(id: string): IChemicalSynaps | undefined {
    return this.synapseRegistry.getChemical(id);
  }

  public getElectricSynaps(id: string): IElectricSynaps | undefined {
    return this.synapseRegistry.getElectric(id);
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

  public findNearestSynaps(coords: Coords, maxDistance: number = Infinity): AnySynaps | null {
    let nearest: AnySynaps | null = null;
    let minDist = Infinity;
    const { x, y } = coords;

    const allSynapses = [
      ...Array.from(this.synapseRegistry.getAllChemical().values()).map(s => ({ synaps: s, type: 'chemical' as const })),
      ...Array.from(this.synapseRegistry.getAllElectric().values()).map(s => ({ synaps: s, type: 'electric' as const }))
    ];

    for (const item of allSynapses) {
      const dist = this.distanceToSynaps(item.synaps, x, y);
      if (dist < minDist && dist <= maxDistance) {
        minDist = dist;
        nearest = item;
      }
    }

    return nearest;
  }

  private distanceToSynaps(synaps: IChemicalSynaps | IElectricSynaps, x: number, y: number): number {
    const { x: x1, y: y1 } = new NeuronAccessor(synaps.source).getCoords();
    const { x: x2, y: y2 } = new NeuronAccessor(synaps.target).getCoords();
    return distancePointToSegment({ x, y }, { x: x1, y: y1 }, { x: x2, y: y2 });
  }
}