import type { IChemicalSynaps } from '../interfaces/ISynaps.interface';
import type { IElectricSynaps } from '../interfaces/IElectricSynaps.interface';
import type { INeuron } from './neurons/base/interfaces/INeuron.interface';
import ChemicalSynaps from './synapses/ChemicalSynaps';
import ElectricSynaps from './synapses/ElectricSynapse';
import type { SynapseRegistry } from './synapses/SynapseRegistry';
import type { SynapseType } from '../types/types';


export class SynapseFactory {
  private registry: SynapseRegistry;

  constructor(registry: SynapseRegistry) {
    this.registry = registry;
  }

  public create(
    type: SynapseType,
    source: INeuron,
    target: INeuron,
    conductance?: number,
    delay?: number
  ): IChemicalSynaps | IElectricSynaps {
    let synapse: IChemicalSynaps | IElectricSynaps;
    switch (type) {
      case 'chemical':
        synapse = new ChemicalSynaps(source, target, conductance, delay);
        this.registry.addChemical(synapse);
        source.synapses.addOutputChemical(synapse.id);
        target.synapses.addInputChemical(synapse.id);
        return synapse;
      case 'electric':
        synapse = new ElectricSynaps(source, target, conductance);
        this.registry.addElectric(synapse);
        source.synapses.addOutputElectric(synapse.id);
        target.synapses.addOutputElectric(synapse.id);
        return synapse;
      default:
        throw new Error(`Unknown synapse type: ${type}`);
    }
  }

  // public createChemical(
  //   source: INeuron,
  //   target: INeuron,
  //   conductance?: number,
  //   delay?: number
  // ): IChemicalSynaps {
  //   const synaps = new ChemicalSynaps(source, target, conductance, delay);

  //   this.registry.addChemical(synaps);

  //   // Добавляем ID в менеджеры
  //   source.synapses.addOutputChemical(synaps.id);
  //   target.synapses.addInputChemical(synaps.id);

  //   return synaps;
  // }

  // public createElectric(
  //   source: INeuron,
  //   target: INeuron,
  //   conductance?: number
  // ): IElectricSynaps {
  //   const synaps = new ElectricSynaps(source, target, conductance);

  //   this.registry.addElectric(synaps);

  //   source.synapses.addOutputElectric(synaps.id);
  //   target.synapses.addInputElectric(synaps.id);

  //   return synaps;
  // }

  public remove(id: string): boolean {
    const synaps = this.registry.getChemical(id) || this.registry.getElectric(id);
    if (!synaps) return false;

    synaps.source.synapses.removeOutputSynapse(id);
    synaps.target.synapses.removeInputSynapse(id);

    this.registry.remove(id);

    return true;
  }
}