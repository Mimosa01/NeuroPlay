import type { NetworkSnapshot } from "../types/types";
import type Network from "./network/Network";
import { NetworkSerializer } from "./network/NetworkSerializer";

export class HistoryManager {
  private network: Network;
  private history: NetworkSnapshot[] = [];
  private future: NetworkSnapshot[] = [];
  private maxHistory: number = 1000;

  constructor (network: Network) {
    this.network = network;
  }

  public takeSnapshot (): void {
    const snapshot = NetworkSerializer.createSnapshot(this.network);
    this.history.push(snapshot);
    this.future = [];

    // Ограничение истории
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }
  }

  public undo(): boolean {
    if (this.history.length === 0) return false;

    const snapshot = this.history.pop()!; // Надо предусмотреть undefined
    const current = NetworkSerializer.createSnapshot(this.network);
    this.future.push(current);
    NetworkSerializer.restoreFromSnapshot(this.network, snapshot);
    return true;
  }

  public redo(): boolean {
    if (this.future.length === 0) return false;

    const snapshot = this.future.pop()!; // Надо предусмотреть undefined
    const current = NetworkSerializer.createSnapshot(this.network);
    this.history.push(current);
    NetworkSerializer.restoreFromSnapshot(this.network, snapshot);
    return true;
  }

  public clear(): void {
    this.history = [];
    this.future = [];
  }

  public getHistoryLength(): number {
    return this.history.length;
  }

  public getFutureLength(): number {
    return this.future.length;
  }
}
