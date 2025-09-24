import type { IEdge } from "../../interfaces/IEdge.interface";
import type { NeuronInstance } from "../../types/types";
import NeuronAccessor from "../neurons/NeuronAccessor";
import type Network from "./Network";


export class NetworkSimulator {
  private network: Network;

  private readyNeuronsCache: NeuronInstance[] = [];
  private edgesCache: IEdge[] = [];

  constructor(network: Network) {
    this.network = network;
  }

  public tick(): void {
    // Phase 1: Обработка — только тех, кто может что-то изменить
    this.updateReadyNeuronsCache();
    this.updateEdgesCache();

    // Phase 2: process() — только для нейронов, которые могут измениться
    for (const neuron of this.network.neurons.values()) {
      neuron.process();
    }

    // Phase 3: fire() — только готовые к стрельбе
    for (const neuron of this.readyNeuronsCache) {
      const accessor = new NeuronAccessor(neuron);
      if (accessor.getReadyToSend()) {
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

  private updateReadyNeuronsCache(): void {
    this.readyNeuronsCache = Array.from(this.network.neurons.values()).filter(
      n => new NeuronAccessor(n).getReadyToSend()
    );
  }

  private updateEdgesCache(): void {
    this.edgesCache = Array.from(this.network.edges.values()).filter(
      edge => edge.getPendingSignalsCount() > 0
    );
  }

  private removeDeadNeurons(): void {
    for (const neuron of Array.from(this.network.neurons.values())) {
      if (neuron.isDead()) {
        // Удаляем все входящие ребра
        for (const edge of new NeuronAccessor(neuron).getInputEdges().values()) {
          this.network.removeEdge(edge.id);
        }
        // Удаляем все исходящие ребра
        for (const edge of new NeuronAccessor(neuron).getOutputEdges().values()) {
          this.network.removeEdge(edge.id);
        }
        // Удаляем нейрон из сети
        this.network.removeNeuron(neuron.id);
        console.log(`[Network] Нейрон ${neuron.id} и все его ребра удалены (мертвый)`);
      }
    }
  }
}