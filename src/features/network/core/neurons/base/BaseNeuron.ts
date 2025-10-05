import { v4 as uuidv4 } from 'uuid';
import type { ModulatorEffect } from '../../../types/modulator.types';
import type { Coords } from '../../../types/types';
import { NeuronState } from './NeuronState';
import { RefractoryManager } from './managers/RefractoryManager';
import { ActivityManager } from './managers/ActivityManager';
import { AdaptationManager } from './managers/AdaptationManager';
import { ElectricSignalManager } from './managers/ElectricSignalManager';
import { ModulationManager } from './managers/ModulationManager';
import { SynapseManager } from './managers/SynapseManager';
import { ReceptorManager } from './managers/ReceptorManager';
import type { INeuron } from './interfaces/INeuron.interface';
import type { INeuronLogic } from './interfaces/INeuronLogic.interface';


export default abstract class BaseNeuron implements INeuron, INeuronLogic {
  public readonly id: string;
  public coords: Coords;
  public label: string = '';
  
  public state: NeuronState;

  protected refractory: RefractoryManager;
  protected adaptation: AdaptationManager;
  protected modulation: ModulationManager;
  protected activity: ActivityManager;
  public readonly electric: ElectricSignalManager;
  public readonly synapses: SynapseManager;
  public readonly receptors: ReceptorManager;

  constructor (coords: Coords) {
    this.id = uuidv4();
    this.coords = coords;
    this.state = new NeuronState();

    this.refractory = new RefractoryManager(this.state);
    this.adaptation = new AdaptationManager(this.state);
    this.modulation = new ModulationManager(this.state);
    this.activity = new ActivityManager(this.state);
    this.electric = new ElectricSignalManager(this.state);
    this.synapses = new SynapseManager();
    this.receptors = new ReceptorManager(this.state);
  }

  public step(): void {
    this.refractory.update();
    this.adaptation.update();
    this.activity.update();
    this.electric.update();
    this.applyLeakage();
    this.checkForSpike();
  }

  public receive(signal_mV: number): void {
    if (this.state.mode !== 'graded') {
      this.state.membranePotential += signal_mV;
      this.activity.onSignalReceived();
    }
  }

  public isRefractory(): boolean {
    return this.refractory.isRefractory();
  }

  public isDead(): boolean {
    return this.activity.isDead();
  }

  public applyModulationEffect(effect: ModulatorEffect): void {
    this.modulation.applyEffect(effect);
  }

  public finalizeModulation(): void {
    this.modulation.finalize();
  }

  private applyLeakage(): void {
    const diff = this.state.membranePotential - this.state.restingPotential;
    this.state.membranePotential -= diff / this.state.tau;
  }

  public abstract checkForSpike (): void;
  
  public abstract fire (): void;
}