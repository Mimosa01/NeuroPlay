import NeuronAccessor from "../neurons/base/NeuronAccessor";
import type Network from "./Network";

export class NetworkSimulator {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  public tick(): void {
    // === Phase 0: Обработка электрических синапсов ===
    for (const synaps of this.network.synapseRegistry.getAllElectric().values()) {
      synaps.deliver();
    }

    // === Phase 1: Обработка химических синапсов ===
    for (const synaps of this.network.synapseRegistry.getAllChemical().values()) {
      synaps.deliverSignals();
    }

    this.applyModulationClouds();

    // === Phase 2: Обработка всех нейронов ===
    for (const neuron of this.network.neurons.values()) {
      neuron.step();
    }

    // === Phase 3: Удаление мёртвых нейронов ===
    this.removeDeadNeurons();
    this.cleanupClouds();
  }

  private removeDeadNeurons(): void {
    for (const neuron of Array.from(this.network.neurons.values())) {
      if (neuron.isDead()) {
        this.network.removeNeuron(neuron.id);
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
    /// 1. Сброс: возвращаем все синапсы к базовой проводимости
    for (const synaps of this.network.synapseRegistry.getAllChemical().values()) {
      synaps.resetConductance();
    }

    // 2. Накопление эффектов от облаков — для НЕЙРОНОВ
    for (const neuron of this.network.neurons.values()) {
      const coords = new NeuronAccessor(neuron).getCoords();
      for (const cloud of this.network.modulationClouds.values()) {
        if (cloud.affects(coords) && neuron.receptors.hasReceptor(cloud.type)) {
          neuron.applyModulationEffect(cloud.getScaledEffect());
        }
      }
    }

    // 3. Применяем модуляцию к НЕЙРОНАМ
    for (const neuron of this.network.neurons.values()) {
      neuron.finalizeModulation();
    }

    // 4. Применяем conductanceMultiplier ко ВСЕМ входящим химическим синапсам
    for (const neuron of this.network.neurons.values()) {
      const coords = new NeuronAccessor(neuron).getCoords();
      let totalMultiplier = 1;

      for (const cloud of this.network.modulationClouds.values()) {
        if (cloud.affects(coords) && neuron.receptors.hasReceptor(cloud.type)) {
          const effect = cloud.getScaledEffect();
          if (effect.conductanceMultiplier !== undefined) {
            totalMultiplier *= effect.conductanceMultiplier;
          }
        }
      }

      // Применяем множитель ко всем входящим химическим синапсам
      for (const synapsId of neuron.synapses.getInputChemicalIds()) {
        const synaps = this.network.synapseRegistry.getChemical(synapsId);
        if (synaps) {
          synaps.applyConductanceMultiplier(totalMultiplier);
        }
      }
    }

    // 5. Обновляем облака
    for (const cloud of this.network.modulationClouds.values()) {
      cloud.update();
    }
    this.cleanupClouds();
  }
}