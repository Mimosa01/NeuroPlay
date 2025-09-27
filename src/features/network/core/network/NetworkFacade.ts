import type { EdgeDTO } from "../../dto/edge.dto";
import type { NeuronDTO } from "../../dto/neuron.dto";
import type { IEdge } from "../../interfaces/IEdge.interface";
import type { INeuron } from "../../interfaces/INeuron.interface";
import type { Coords, NeuronType } from "../../types";
import { HistoryManager } from "../HistoryManager";
import NeuronAccessor from "../neurons/NeuronAccessor";
import Network from "./Network";
import { NetworkSerializer } from "./NetworkSerealizer";
import { NetworkSimulator } from "./NetworkSimulator";


type Listener = () => void;

export class NetworkFacade {
  public readonly network: Network;
  public readonly history: HistoryManager;
  public readonly simulator: NetworkSimulator;

  private listeners: Listener[] = [];

  constructor () {
    this.network = new Network();
    this.history = new HistoryManager(this.network);
    this.simulator = new NetworkSimulator(this.network);
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

  // === Методы сети ===
  public createNeuron (coords: Coords, type: NeuronType): INeuron {
    const neuron = this.network.createNeuron(coords, type);
    this.history.takeSnapshot();
    this.notifyChange();
    return neuron;
  }

  public createEdge (sourceId: string, targetId: string): IEdge | null {
    const source = this.network.getNeuron(sourceId);
    const target = this.network.getNeuron(targetId);
    if (!source || !target) return null;
    const edge = this.network.createEdge(source, target);
    this.notifyChange();
    return edge;
  }

  public removeNeuron (id: string): void {
    this.network.removeNeuron(id);
    this.history.takeSnapshot();
    this.notifyChange();
  }

  public removeEdge (id: string): void {
    this.network.removeEdge(id);
    this.notifyChange();
  }

  public findNearestNeuron (coords: Coords, maxDistance: number = 30): INeuron | null {
    return this.network.findNearestNeuron(coords, maxDistance);
  }

  public findNearestEdge (coords: Coords, maxDistance: number = 30): IEdge | null {
    return this.network.findNearestEdge(coords, maxDistance);
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

  public updateEdge (id: string, data: Partial<EdgeDTO>): void {
    const edge = this.network.getEdge(id);
    if (!edge) return;

    if (data.conductance) edge.setConductance(data.conductance);
    if (data.delay) edge.setDelay(data.delay);

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