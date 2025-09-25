import { v4 as uuidv4 } from 'uuid';
import type { Coords } from "../../../../shared/types/types";
import type { IEdge } from "../../interfaces/IEdge.interface";
import { DEFAULT_BIOLOGICAL_NEURON_PARAMS as DBNP} from '../../params/defaultNeuronParams';
import type { NeuronInstance, NeuroTransmitterType } from '../../types/types';


export default abstract class BaseNeuron implements NeuronInstance {
  public readonly id: string;
  public inputEdges: Map<string, IEdge> = new Map();
  public outputEdges: Map<string, IEdge> = new Map();
  public label: string = '';
  public coords: Coords;

  public refractoryDuration: number = DBNP.refractoryDuration; 
  public refractorySteps: number = 0;
  public restingPotential: number = DBNP.restingPotential;         // мВ (базовый уровень) 
  public membranePotential: number = DBNP.restingPotential;        // мВ (покойный потенциал)
  public inactivityCounter: number = 0;
  public inactivityThreshold: number = DBNP.inactivityThreshold;   // шагов до "смерти"
  public neuroTransmitter: NeuroTransmitterType = 'glutamate';     // тип нейромедиатора
  public tau: number = DBNP.tau || 15;                          // мембранная постоянная (в шагах)

  public spikeThreshold: number = DBNP.spikeThreshold;             // мВ (порог спайка)
  public spikeAmplitude: number = DBNP.spikeAmplitude;             // мВ (размер спайка)

  public readyToSend: boolean = false;

  constructor (coords: Coords) {
    this.id = uuidv4();
    this.coords = coords;
  }
  
  public addInputEdge (edge: IEdge): void {
    this.inputEdges.set(edge.id, edge);
  }

  public addOutputEdge (edge: IEdge): void {
    this.outputEdges.set(edge.id, edge);
  }

  public removeInputEdge (edgeId: string): void {
    this.inputEdges.delete(edgeId);
  }

  public removeOutputEdge (edgeId: string): void {
    this.outputEdges.delete(edgeId);
  }

  public step(): void {
    // 1. Обновляем рефрактер
    if (this.refractorySteps > 0) {
      this.refractorySteps--;
    }

    // 2. Применяем утечку (возвращаем к restingPotential)
    const diff = this.membranePotential - this.restingPotential;
    this.membranePotential -= diff / this.tau;

    // 3. Обновляем счётчик бездействия
    if (Math.abs(diff) < 0.1) {
      this.inactivityCounter++;
    } else {
      this.inactivityCounter = 0;
    }

    // 4. Проверяем, нужно ли генерировать спайк
    this.checkForSpike();
  }

  public receive(signal_mV: number): void {
    this.membranePotential += signal_mV;
    if (signal_mV > 0) this.inactivityCounter = 0;
  }

  public fire(): void {
    for (const edge of this.outputEdges.values()) {
      edge.transmit(); // ← без аргументов!
    }

    this.refractorySteps = this.refractoryDuration;
  }

  public isRefractory(): boolean {
    return this.refractorySteps > 0;
  }

  public isDead(): boolean {
    return this.inactivityCounter >= this.inactivityThreshold;
  }

  public abstract checkForSpike(): void;
}