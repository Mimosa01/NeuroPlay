import type Network from "./Network";

export class NetworkSimulator {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  public tick(): void {
    // === Phase 1: Доставка сигналов от рёбер ===
    // Все рёбра обновляют задержки и применяют готовые сигналы
    for (const edge of this.network.edges.values()) {
      edge.deliverSignals(); // внутри вызывает neuron.receive(effect_mV)
    }

    // === Phase 2: Обработка всех нейронов ===
    for (const neuron of this.network.neurons.values()) {
      neuron.step(); // ← ВСЁ внутри: утечка, спайк, рефрактер
    }

    // === Phase 3: Удаление мёртвых нейронов (опционально — можно реже) ===
    this.removeDeadNeurons();
  }

  private removeDeadNeurons(): void {
    for (const neuron of Array.from(this.network.neurons.values())) {
      if (neuron.isDead()) {
        // Удаляем входящие рёбра
        for (const edge of neuron.inputEdges.values()) {
          this.network.removeEdge(edge.id);
        }
        // Удаляем исходящие рёбра
        for (const edge of neuron.outputEdges.values()) {
          this.network.removeEdge(edge.id);
        }
        // Удаляем нейрон
        this.network.removeNeuron(neuron.id);
        console.log(`[Network] Нейрон ${neuron.id} удалён (мертвый)`);
      }
    }
  }
}