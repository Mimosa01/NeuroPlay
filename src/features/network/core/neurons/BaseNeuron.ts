import { v4 as uuidv4 } from 'uuid';
import type { Coords } from "../../../../shared/types/types";
import type { IEdge } from "../../interfaces/IEdge.interface";
import { DEFAULT_BIOLOGICAL_NEURON_PARAMS as DBNP} from '../../params/defaultNeuronParams';
import type { NeuroTransmitterType } from '../../types/types';

export default abstract class BaseNeuron {
  public readonly id: string;
  public inputEdges: Map<string, IEdge> = new Map();
  public outputEdges: Map<string, IEdge> = new Map();
  public label: string = '';
  public coords: Coords;

  public refractory: boolean = false;
  public refractoryCounter: number = 0;
  public refractoryDuration: number = DBNP.refractoryDuration; 
  public restingPotential: number = DBNP.restingPotential;         // мВ (базовый уровень) 
  public membranePotential: number = DBNP.restingPotential;        // мВ (покойный потенциал)
  public inactivityCounter: number = 0;
  public inactivityThreshold: number = DBNP.inactivityThreshold;   // шагов до "смерти"
  public neuroTransmitter: NeuroTransmitterType = 'glutamate';     // тип нейромедиатора

  public spikeThreshold: number = DBNP.spikeThreshold;             // мВ (порог спайка)
  public spikeAmplitude: number = DBNP.spikeAmplitude;             // мВ (размер спайка)

  public decayFactor: number = DBNP.decayFactor;                   // фактор затухания

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

  protected isRefractory (): boolean {
    if (this.refractory) {
      this.refractoryCounter++;
      if (this.refractoryCounter >= this.refractoryDuration) {
        this.refractory = false;
        this.refractoryCounter = 0;
        this.membranePotential = this.restingPotential;
      }
      return true;
    }
    return false;
  }

  public isDead(): boolean {
    return this.inactivityCounter >= this.inactivityThreshold;
  }
}