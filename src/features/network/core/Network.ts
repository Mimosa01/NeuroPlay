import Neuron from './Neuron';
import Edge from './Edge';
import type { NeuronId, EdgeId } from '../types/types';
import type { Coords, NetworkSnapshot } from '../../../shared/types/types';
import { neuronToDTO } from '../dto/neuronTo';
import { edgeToDTO } from '../dto/edgeTo';

export default class Network {
  public readonly neurons: Map<NeuronId, Neuron> = new Map();
  public readonly edges: Map<EdgeId, Edge> = new Map();

  private history: NetworkSnapshot[] = [];
  private future: NetworkSnapshot[] = [];

  constructor () {};

  public addNeuron(coords: Coords): Neuron {
    const neuron = new Neuron(coords);
    this.neurons.set(neuron.id, neuron);
    return neuron;
  }

  public removeNeuron(neuronId: NeuronId): void {
    this.neurons.delete(neuronId);

    for (const [edgeId, edge] of this.edges) {
      if (edge.source.id === neuronId || edge.target.id === neuronId) {
        this.edges.delete(edgeId);
      }
    }
  }

  public addEdge(source: Neuron, target: Neuron): void {
    const edge = new Edge(source, target);
    this.edges.set(edge.id, edge);
  }

  public removeEdge(edgeId: EdgeId): void {
    const edge = this.edges.get(edgeId);
    if (!edge) return;

    edge.source.removeOutputEdge(edgeId);
    edge.target.removeInputEdge(edgeId);
    this.edges.delete(edgeId);
  }

  public tick(): void {
    for (const neuron of this.neurons.values()) {
      neuron.process();
    }

    for (const neuron of this.neurons.values()) {
      if (neuron.getReadyToSend()) {
        neuron.fire();
        break;
      }
    }

    for (const neuron of this.neurons.values()) {
      neuron.decay();
    }

    this.removeDeadNeurons();
  }

  public undoTick(): void {
    if (this.history.length === 0) return;
    const prev = this.history.pop()!;
    this.future.push(this.createSnapshot());
    this.restoreFromSnapshot(prev);
  }

  public redoTick(): void {
    if (this.future.length === 0) return;
    const nextSnapshot = this.future.pop()!;
    this.history.push(this.createSnapshot());
    this.restoreFromSnapshot(nextSnapshot);
  }

  public reset(): void {
    this.neurons.clear();
    this.edges.clear();
  }

  public getNeuron(id: NeuronId): Neuron | undefined {
    return this.neurons.get(id);
  }

  public getEdge(id: EdgeId): Edge | undefined {
    return this.edges.get(id);
  }

  public findNearestNeuron(coords: Coords, maxDistance: number = Infinity): Neuron | null {
    let nearestNeuron: Neuron | null = null;
    let minDistance = Infinity;

    for (const neuron of this.neurons.values()) {
      const dx = neuron.getCoords().x - coords.x;
      const dy = neuron.getCoords().y - coords.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDistance && dist <= maxDistance) {
        minDistance = dist;
        nearestNeuron = neuron;
      }
    }

    return nearestNeuron;
  }

  public findEdgeNear({ x, y }: { x: number; y: number }): Edge | null {
    let nearest: Edge | null = null;
    let minDist = 8; // порог в пикселях

    for (const edge of this.edges.values()) {
      const { x: x1, y: y1 } = edge.source.getCoords();
      const { x: x2, y: y2 } = edge.target.getCoords();

      const dx = x2 - x1;
      const dy = y2 - y1;
      const lengthSq = dx * dx + dy * dy;

      if (lengthSq === 0) continue;

      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSq));
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;
      const dist = Math.hypot(projX - x, projY - y);

      if (dist < minDist) {
        minDist = dist;
        nearest = edge;
      }
    }

    return nearest;
  }

  public createSnapshot(): NetworkSnapshot {
    return {
      neurons: Array.from(this.neurons.values()).map(n => neuronToDTO(n)),
      edges: Array.from(this.edges.values()).map(e => edgeToDTO(e))
    };
  }

  public restoreFromSnapshot(snapshot: NetworkSnapshot) {
    snapshot.neurons.forEach(({ id, coords, accumulatedSignal, inactivityCounter }) => {
      const neuron = this.neurons.get(id);
      if (neuron) {
        neuron.setCoords(coords);
        if (accumulatedSignal !== undefined) neuron.setAccumulatedSignal(accumulatedSignal);
        if (inactivityCounter !== undefined) neuron.setInactivityCounter(inactivityCounter);
      }
    });

    snapshot.edges.forEach(({ id, weight }) => {
      const edge = this.edges.get(id);
      if (edge) {
        edge.setWeight(weight);
      }
    });
  }


  public removeDeadNeurons(): void {
    for (const neuron of Array.from(this.neurons.values())) {
      if (neuron.isDead()) {
        // Удаляем все входящие ребра
        for (const edge of neuron.getInputEdges().values()) {
          this.removeEdge(edge.id);
        }
        // Удаляем все исходящие ребра
        for (const edge of neuron.getOutputEdges().values()) {
          this.removeEdge(edge.id);
        }
        // Удаляем нейрон из сети
        this.removeNeuron(neuron.id);
        console.log(`[Network] Нейрон ${neuron.id} и все его ребра удалены (мертвый)`);
      }
    }
  }

}
