import type { NetworkSnapshot } from "../../../shared/types/types";
import { edgeToDTO } from "../dto/edgeTo";
import { neuronToDTO } from "../dto/neuronTo";
import type { IEdge } from "../interfaces/IEdge.interface";
import type { INeuron } from "../interfaces/INeuron.interface";
import type Network from "./Network";

export class NetworkSimulator {
  private network: Network;
  private history: NetworkSnapshot[] = [];
  private future: NetworkSnapshot[] = [];

  private readyNeuronsCache: INeuron[] = [];
  private edgesCache: IEdge[] = [];

  constructor(network: Network) {
    this.network = network;
  }

  public tick(): void {
    const snapshot = this.createSnapshot();
    this.history.push(snapshot);
    this.future = [];

    // Phase 1: Обработка — только тех, кто может что-то изменить
    this.updateReadyNeuronsCache();
    this.updateEdgesCache();

    // Phase 2: process() — только для нейронов, которые могут измениться
    for (const neuron of this.network.neurons.values()) {
      neuron.process();
    }

    // Phase 3: fire() — только готовые к стрельбе
    for (const neuron of this.readyNeuronsCache) {
      if (neuron.getReadyToSend()) {
        neuron.fire();
      }
    }

    // Phase 4: deliver — только для рёбер, у которых есть очередь
    for (const edge of this.edgesCache) {
      edge.deliverSignals();
    }

    // Phase 5: decay — для всех, но можно оптимизировать позже
    for (const neuron of this.network.neurons.values()) {
      neuron.decay();
    }

    // Phase 6: удаление мёртвых — в Simulator, т.к. влияет на состояние
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

  private updateReadyNeuronsCache(): void {
    this.readyNeuronsCache = Array.from(this.network.neurons.values()).filter(
      n => n.getReadyToSend()
    );
  }

  private updateEdgesCache(): void {
    this.edgesCache = Array.from(this.network.edges.values()).filter(
      edge => edge.getPendingSignalsCount() > 0
    );
  }

  public createSnapshot(): NetworkSnapshot {
      return {
        neurons: Array.from(this.network.neurons.values()).map(n => neuronToDTO(n)),
        edges: Array.from(this.network.edges.values()).map(e => edgeToDTO(e))
      };
    }
  
  public restoreFromSnapshot(snapshot: NetworkSnapshot) {
    snapshot.neurons.forEach(({ id, coords, membranePotential, inactivityCounter }) => {
      const neuron = this.network.neurons.get(id);
      if (neuron) {
        neuron.setCoords(coords);
        if (membranePotential !== undefined) neuron.setMembranePotential(membranePotential);
        if (inactivityCounter !== undefined) neuron.setInactivityCounter(inactivityCounter);
      }
    });

    snapshot.edges.forEach(({ id, conductance, delay }) => {
      const edge = this.network.edges.get(id);
      if (edge) {
        if (conductance !== undefined) edge.setConductance(conductance);
        if (delay !== undefined) edge.setDelay(delay);
      }
    });
  }

  public removeDeadNeurons(): void {
    for (const neuron of Array.from(this.network.neurons.values())) {
      if (neuron.isDead()) {
        // Удаляем все входящие ребра
        for (const edge of neuron.getInputEdges().values()) {
          this.network.removeEdge(edge.id);
        }
        // Удаляем все исходящие ребра
        for (const edge of neuron.getOutputEdges().values()) {
          this.network.removeEdge(edge.id);
        }
        // Удаляем нейрон из сети
        this.network.removeNeuron(neuron.id);
        console.log(`[Network] Нейрон ${neuron.id} и все его ребра удалены (мертвый)`);
      }
    }
  }
}