import Edge from './Edge';
import type { NeuronType } from '../types/types';
import type { Coords } from '../../../shared/types/types'; // NetworkSnapshot
// import { neuronToDTO } from '../dto/neuronTo';
// import { edgeToDTO } from '../dto/edgeTo';
import type { INeuron } from '../interfaces/INeuron.interface';
import { NeuronFactory } from './NeuronFactory';
import type { IEdge } from '../interfaces/IEdge.interface';

export default class Network {
  public readonly neurons: Map<string, INeuron> = new Map();
  public readonly edges: Map<string, IEdge> = new Map();

  // private history: NetworkSnapshot[] = [];
  // private future: NetworkSnapshot[] = [];

  constructor () {};

  public addNeuron(coords: Coords, type: NeuronType): INeuron {
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

  public addEdge(source: INeuron, target: INeuron, conductance?: number, delay?: number): Edge {
    const edge = new Edge(source, target, conductance, delay, source.getNeuroTransmitter());
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

  // public tick(): void {
  //   // Phase 1: Обработка нейронов (проверка порога)
  //   for (const neuron of this.neurons.values()) {
  //     neuron.process();
  //   }

  //   // Phase 2: Стрельба готовых нейронов
  //   for (const neuron of this.neurons.values()) {
  //     if (neuron.getReadyToSend()) {
  //       neuron.fire();
  //     }
  //   }

  //   for (const edge of this.edges.values()) {
  //     edge.deliverSignals();
  //   }

  //   // Phase 3: Затухание и очистка
  //   for (const neuron of this.neurons.values()) {
  //     neuron.decay();
  //   }

  //   this.removeDeadNeurons();
  // }

  // public undoTick(): void {
  //   if (this.history.length === 0) return;
  //   const prev = this.history.pop()!;
  //   this.future.push(this.createSnapshot());
  //   this.restoreFromSnapshot(prev);
  // }

  // public redoTick(): void {
  //   if (this.future.length === 0) return;
  //   const nextSnapshot = this.future.pop()!;
  //   this.history.push(this.createSnapshot());
  //   this.restoreFromSnapshot(nextSnapshot);
  // }

  public reset(): void {
    this.neurons.clear();
    this.edges.clear();
  }

  public getNeuron(id: string): INeuron | undefined {
    return this.neurons.get(id);
  }

  public getEdge(id: string): IEdge | undefined {
    return this.edges.get(id);
  }

  public findNearestNeuron(coords: Coords, maxDistance: number = Infinity): INeuron | null {
    let nearestNeuron: INeuron | null = null;
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

  public findEdgeNear({ x, y }: { x: number; y: number }): IEdge | null {
    let nearest: IEdge | null = null;
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

  // public createSnapshot(): NetworkSnapshot {
  //   return {
  //     neurons: Array.from(this.neurons.values()).map(n => neuronToDTO(n)),
  //     edges: Array.from(this.edges.values()).map(e => edgeToDTO(e))
  //   };
  // }

  // public restoreFromSnapshot(snapshot: NetworkSnapshot) {
  //   snapshot.neurons.forEach(({ id, coords, membranePotential, inactivityCounter }) => {
  //     const neuron = this.neurons.get(id);
  //     if (neuron) {
  //       neuron.setCoords(coords);
  //       if (membranePotential !== undefined) neuron.setMembranePotential(membranePotential);
  //       if (inactivityCounter !== undefined) neuron.setInactivityCounter(inactivityCounter);
  //     }
  //   });

  //   snapshot.edges.forEach(({ id, conductance, delay }) => {
  //     const edge = this.edges.get(id);
  //     if (edge) {
  //       if (conductance !== undefined) edge.setConductance(conductance);
  //       if (delay !== undefined) edge.setDelay(delay);
  //     }
  //   });
  // }

  // public removeDeadNeurons(): void {
  //   for (const neuron of Array.from(this.neurons.values())) {
  //     if (neuron.isDead()) {
  //       // Удаляем все входящие ребра
  //       for (const edge of neuron.getInputEdges().values()) {
  //         this.removeEdge(edge.id);
  //       }
  //       // Удаляем все исходящие ребра
  //       for (const edge of neuron.getOutputEdges().values()) {
  //         this.removeEdge(edge.id);
  //       }
  //       // Удаляем нейрон из сети
  //       this.removeNeuron(neuron.id);
  //       console.log(`[Network] Нейрон ${neuron.id} и все его ребра удалены (мертвый)`);
  //     }
  //   }
  // }
}