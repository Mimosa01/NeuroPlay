import type { ChemicalSynapsDTO } from "../../dto/synaps.dto";
import type { NeuronDTO } from "../../dto/neuron.dto";
import type { IChemicalSynaps } from "../../interfaces/ISynaps.interface";
import type { INeuron } from "../../interfaces/INeuron.interface";
import type { Coords, NeuronType } from "../../types/types";
import { eventBus } from "../EventBus";
import { HistoryManager } from "../HistoryManager";
import { ModulationCloud } from "../ModulationCloud";
import NeuronAccessor from "../neurons/NeuronAccessor";
import Network from "./Network";
import { NetworkSerializer } from "./NetworkSerealizer";
import { NetworkSimulator } from "./NetworkSimulator";
import type { IElectricSynaps } from "../../interfaces/IElectricSynaps.interface";
import type { ElectricSynapsDTO } from "../../dto/electricSynaps.dto";


type Listener = () => void;

export class NetworkFacade {
  public readonly network: Network;
  public readonly history: HistoryManager;
  public readonly simulator: NetworkSimulator;

  private listeners: Listener[] = [];
  private neuronSubscriptions = new Map<string, Array<() => void>>();

  constructor () {
    this.network = new Network();
    this.history = new HistoryManager(this.network);
    this.simulator = new NetworkSimulator(this.network);

    eventBus.subscribe('neuron.spike', (event) => {
      const neuron = this.network.getNeuron(event.payload.neuronId);
      if (!neuron) return;
    for (const synaps of neuron.outputSynapses.values()) {
      synaps.transmit();
      }
    });

    eventBus.subscribe('modulation.cloud.spawn', (event) => {
      const { neuronId, modulator, coords } = event.payload;
      console.log(`Создал или добавил облако. НЕЙРОН: ${neuronId}`) // временно
      const NEARBY_RADIUS = 50;

      const nearbyCloud = Array.from(this.network.modulationClouds.values()).find(cloud =>
        cloud.type === modulator && cloud.isNear(coords, NEARBY_RADIUS)
      );

      if (nearbyCloud) {
        nearbyCloud.setStrength(0.5);
        nearbyCloud.setTtl(5);
      } else {
        const newCloud = new ModulationCloud(modulator, coords);
        this.network.modulationClouds.set(newCloud.id, newCloud);
      }
    });
  }

  // === Система событий ===
  private notifyChange() {
    this.listeners.forEach(listener => listener());
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public createNeuron(coords: Coords, type: NeuronType): INeuron {
    const neuron = this.network.createNeuron(coords, type);

    const unsubscribes: Array<() => void> = [];

    unsubscribes.push(
      eventBus.subscribe('chemicalSynaps.signal.delivered', (event) => {
        if (event.payload.targetId === neuron.id) {
          neuron.receive(event.payload.effect_mV);
        }
      })
    );

    this.neuronSubscriptions.set(neuron.id, unsubscribes);

    this.history.takeSnapshot();
    this.notifyChange();
    return neuron;
  }

  public createSynaps (sourceId: string, targetId: string): IChemicalSynaps | null {
    const source = this.network.getNeuron(sourceId);
    const target = this.network.getNeuron(targetId);
    if (!source || !target) return null;
    const synaps = this.network.createSynaps(source, target);
    this.notifyChange();
    return synaps;
  }

  public createElectricSynaps (sourceId: string, targetId: string): IElectricSynaps | null {
    const source = this.network.getNeuron(sourceId);
    const target = this.network.getNeuron(targetId);

    if (!source || !target) return null;
    const synaps = this.network.createElectricSynaps(source, target);
    this.notifyChange();
    return synaps;
  }
 
  public removeNeuron(id: string): void {
    const unsubscribes = this.neuronSubscriptions.get(id);
    if (unsubscribes) {
      unsubscribes.forEach(unsub => unsub());
      this.neuronSubscriptions.delete(id);
    }

    this.network.removeNeuron(id);
    this.history.takeSnapshot();
    this.notifyChange();
  }

  public removeSynaps (id: string): void {
    this.network.removeSynaps(id);
    this.notifyChange();
  }

  public findNearestNeuron (coords: Coords, maxDistance: number = 30): INeuron | null {
    return this.network.findNearestNeuron(coords, maxDistance);
  }

  public findNearestSynaps (coords: Coords, maxDistance: number = 30): IChemicalSynaps | null {
    return this.network.findNearestSynaps(coords, maxDistance);
  }

  public resetNetwork (): void {
    this.network.reset();
    this.history.clear();
    this.history.takeSnapshot();
    this.notifyChange();
  }

  public exciteNeuron (id: string, signal: number): void {
    const neuron = this.network.getNeuron(id);
    if (neuron) neuron.receive(signal);
    this.notifyChange();
  }

  public updateNeuron (id: string, data: Partial<NeuronDTO>): void {
    const neuron = this.network.getNeuron(id);
    if (!neuron) return;

    const accessor = new NeuronAccessor(neuron);

    if (data.label !== undefined) accessor.setLabel(data.label);
    if (data.inactivityThreshold !== undefined) accessor.setInactivityThreshold(data.inactivityThreshold);
    if (data.refractoryDuration !== undefined) accessor.setRefractoryDuration(data.refractoryDuration);
    if (data.spikeThreshold !== undefined) accessor.setSpikeThreshold(data.spikeThreshold);
    if (data.coords !== undefined) accessor.setCoords(data.coords);
    if (data.tau !== undefined) accessor.setTau(data.tau);
    if (data.neuroTransmitter !== undefined) accessor.setNeuroTransmitter(data.neuroTransmitter);
    if (data.receptors !== undefined) accessor.setReceptors(data.receptors);

    this.notifyChange();
  }

  public updateSynaps (id: string, data: Partial<ChemicalSynapsDTO>): void {
    const synaps = this.network.getSynaps(id);
    if (!synaps) return;

    if (data.conductance) synaps.setConductance(data.conductance);
    if (data.delay) synaps.setDelay(data.delay);

    this.notifyChange();
  }

  public updateElectricSynaps (id: string, data: Partial<ElectricSynapsDTO>): void {
    const synaps = this.network.getSynaps(id);
    if (!synaps) return;

    if (data.conductance) synaps.setConductance(data.conductance);

    this.notifyChange();
  }

  // === Методы симуляции ===

  public tick (): void {
    this.history.takeSnapshot();
    this.simulator.tick();
    this.notifyChange();
  }

  public undoTick (): void {
    if (this.history.getHistoryLength() > 0) this.history.undo();
    this.notifyChange();
  }

  public redoTick (): void {
    if (this.history.getFutureLength() > 0) this.history.redo();
    this.notifyChange();
  }

  // === Для UI — получение DTO ===

  getSnapshot() {
    return NetworkSerializer.createSnapshot(this.network);
  }
}