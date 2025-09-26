import type { IEdge } from "../../interfaces/IEdge.interface";
import type { INeuron } from "../../interfaces/INeuron.interface";
import type { NeuronInstance, Coords, NeuronType } from "../../types";
import Edge from "../Edge";
import { NeuronFactory } from "../NeuronFactory";
import NeuronAccessor from "../neurons/NeuronAccessor";


export default class Network {
  public readonly neurons: Map<string, NeuronInstance> = new Map();
  public readonly edges: Map<string, IEdge> = new Map();

  constructor () {};

  public createNeuron(coords: Coords, type: NeuronType): INeuron {
    const neuron = NeuronFactory.create(type, coords);
    this.neurons.set(neuron.id, neuron);
    return neuron;
  }

  public removeNeuron(neuronId: string): void {
    this.neurons.delete(neuronId);

    for (const [edgeId, edge] of this.edges) {
      if (edge.source.id === neuronId || edge.target.id === neuronId) {
        this.edges.delete(edgeId);
      }
    }
  }

  public createEdge(source: NeuronInstance, target: NeuronInstance, conductance?: number, delay?: number): IEdge {
    const edge = new Edge(source, target, conductance, delay);
    source.addOutputEdge(edge);
    target.addInputEdge(edge);
    this.edges.set(edge.id, edge);
    return edge;
  }

  public removeEdge(edgeId: string): void {
    const edge = this.edges.get(edgeId);
    if (!edge) return;

    edge.source.removeOutputEdge(edgeId);
    edge.target.removeInputEdge(edgeId);
    this.edges.delete(edgeId);
  }

  public reset(): void {
    this.neurons.clear();
    this.edges.clear();
  }

  public getNeuron(id: string): NeuronInstance | undefined {
    return this.neurons.get(id);
  }

  public getEdge(id: string): IEdge | undefined {
    return this.edges.get(id);
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

  public findNearestEdge(coords: Coords, maxDistance: number = Infinity): IEdge | null {
    let nearest: IEdge | null = null;
    let minDist = Infinity;
    const { x, y } = coords;

    for (const edge of this.edges.values()) {
      const { x: x1, y: y1 } = new NeuronAccessor(edge.source).getCoords();
      const { x: x2, y: y2 } = new NeuronAccessor(edge.target).getCoords();

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
        nearest = edge;
      }
    }

    return nearest;
  }
}