import NeuronAccessor from "../neurons/NeuronAccessor";
import type Network from "./Network";

export class NetworkSimulator {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  public tick(): void {
    // Электрические синапсы
    for (const synaps of this.network.electricSynapses.values()) {
      synaps.deliver();
    }
    // === Phase 1: Доставка сигналов от рёбер ===
    // Все рёбра обновляют задержки и применяют готовые сигналы
    for (const synaps of this.network.chemicalSynapses.values()) {
      synaps.deliverSignals(); // внутри вызывает neuron.receive(effect_mV)
    }

    this.applyModulationClouds();

    // === Phase 2: Обработка всех нейронов ===
    for (const neuron of this.network.neurons.values()) {
      neuron.step(); // ← ВСЁ внутри: утечка, спайк, рефрактер
    }

    // === Phase 3: Удаление мёртвых нейронов (опционально — можно реже) ===
    this.removeDeadNeurons();
    this.cleanupClouds();
  }

  private removeDeadNeurons(): void {
    for (const neuron of Array.from(this.network.neurons.values())) {
      if (neuron.isDead()) {
        // Удаляем входящие синапсы
        for (const synaps of neuron.inputSynapses.values()) {
          this.network.removeSynaps(synaps.id);
        }
        // Удаляем исходящие синапсы
        for (const synaps of neuron.outputSynapses.values()) {
          this.network.removeSynaps(synaps.id);
        }
        // Удаляем нейрон
        this.network.removeNeuron(neuron.id);
        console.log(`[Network] Нейрон ${neuron.id} удалён (мертвый)`);
      }
    }
  }

  private cleanupClouds(): void {
    for (const [id, cloud] of this.network.modulationClouds) {
      if (!cloud.isAlive()) {
        this.network.modulationClouds.delete(id);
      }
    }
  }

  private applyModulationClouds(): void {
    // 1. Сброс: возвращаем все синапсы к базовой проводимости
    for (const synaps of this.network.chemicalSynapses.values()) {
      synaps.resetConductance();
    }

    // 2. Накопление эффектов от облаков — теперь для НЕЙРОНОВ (для spikeThreshold, tau)
    for (const neuron of this.network.neurons.values()) {
      const coords = new NeuronAccessor(neuron).getCoords();
      for (const cloud of this.network.modulationClouds.values()) {
        if (cloud.affects(coords) && neuron.hasReceptor(cloud.type)) {
          neuron.applyModulationEffect(cloud.getScaledEffect());
        }
      }
    }

    // 3. Применяем модуляцию к НЕЙРОНАМ
    for (const neuron of this.network.neurons.values()) {
      neuron.finalizeModulation();
    }

    // 4. 🔥 Самое важное: применяем conductanceMultiplier к ВСЕМ входящим синапсам нейрона
    for (const neuron of this.network.neurons.values()) {
      const coords = new NeuronAccessor(neuron).getCoords();
      let totalMultiplier = 1;

      for (const cloud of this.network.modulationClouds.values()) {
        if (cloud.affects(coords) && neuron.hasReceptor(cloud.type)) {
          const effect = cloud.getScaledEffect();
          if (effect.conductanceMultiplier !== undefined) {
            totalMultiplier *= effect.conductanceMultiplier;
          }
        }
      }

      // Применяем множитель ко всем входящим синапсам
      for (const synaps of neuron.inputSynapses.values()) {
        synaps.applyConductanceMultiplier(totalMultiplier);
      }
    }

    // 5. Обновляем облака
    for (const cloud of this.network.modulationClouds.values()) {
      cloud.update();
    }
    this.cleanupClouds();
  }
}