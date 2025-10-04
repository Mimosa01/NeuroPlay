export class SynapseManager {
  private inputChemicalSynapses: Set<string> = new Set();
  private inputElectricSynapses: Set<string> = new Set();
  private outputChemicalSynapses: Set<string> = new Set();
  private outputElectricSynapses: Set<string> = new Set();

  // методы для добавления/удаления ID
  public addInputChemical(id: string): void {
    this.inputChemicalSynapses.add(id);
  }

  public addInputElectric(id: string): void {
    this.inputElectricSynapses.add(id);
  }

  public addOutputChemical(id: string): void {
    this.outputChemicalSynapses.add(id);
  }

  public addOutputElectric(id: string): void {
    this.outputElectricSynapses.add(id);
  }

  // методы для получения ID
  public getInputChemicalIds(): Set<string> {
    return this.inputChemicalSynapses;
  }

  public getInputElectricIds(): Set<string> {
    return this.inputElectricSynapses;
  }

  public getOutputChemicalIds(): Set<string> {
    return this.outputChemicalSynapses;
  }

  public getOutputElectricIds(): Set<string> {
    return this.outputElectricSynapses;
  }

  public removeInputSynapse(id: string): void {
    this.inputChemicalSynapses.delete(id);
    this.inputElectricSynapses.delete(id);
  }

  public removeOutputSynapse(id: string): void {
    this.outputChemicalSynapses.delete(id);
    this.outputElectricSynapses.delete(id);
  }

  public clearAll(): void {
    this.inputChemicalSynapses.clear();
    this.inputElectricSynapses.clear();
    this.outputChemicalSynapses.clear();
    this.outputElectricSynapses.clear();
  }

  public getAllSynapseIds(): string[] {
    const ids: string[] = [];
    ids.push(...this.inputChemicalSynapses);
    ids.push(...this.inputElectricSynapses);
    ids.push(...this.outputChemicalSynapses);
    ids.push(...this.outputElectricSynapses);
    return ids;
  }
}

// import type { IElectricSynaps } from "../../../../interfaces/IElectricSynaps.interface";
// import type { IChemicalSynaps } from "../../../../interfaces/ISynaps.interface";
// import ChemicalSynaps from "../../../synapses/ChemicalSynaps";
// import ElectricSynaps from "../../../synapses/ElectricSynaps";

// export class SynapseManager {
//   private inputChemicalSynapses: Map<string, IChemicalSynaps> = new Map();
//   private inputElectricSynapses: Map<string, IElectricSynaps> = new Map();
  
//   private outputChemicalSynapses: Map<string, IChemicalSynaps> = new Map();
//   private outputElectricSynapses: Map<string, IElectricSynaps> = new Map();

//   constructor () {}

//   public addInputSynapse (synapse: IChemicalSynaps | IElectricSynaps): void {
//     if (synapse instanceof ChemicalSynaps) {
//       this.inputChemicalSynapses.set(synapse.id, synapse);
//     } else if (synapse instanceof ElectricSynaps) {
//       this.inputElectricSynapses.set(synapse.id, synapse);
//     }
//   }

//   public addOutputSynapse (synaps: IChemicalSynaps | IElectricSynaps): void {
//     if (synaps instanceof ChemicalSynaps) {
//       this.outputChemicalSynapses.set(synaps.id, synaps);
//     } else if (synaps instanceof ElectricSynaps) {
//       this.outputElectricSynapses.set(synaps.id, synaps);
//     }
//   }

//   public removeInputSynapse (synapse: IChemicalSynaps | IElectricSynaps): void {
//     if (synapse instanceof ChemicalSynaps) {
//       this.inputChemicalSynapses.delete(synapse.id);
//     } else if (synapse instanceof ElectricSynaps) {
//       this.inputElectricSynapses.delete(synapse.id);
//     }
//   }

//   public removeOutputSynaps (synapse: IChemicalSynaps | IElectricSynaps): void {
//     if (synapse instanceof ChemicalSynaps) {
//       this.outputChemicalSynapses.delete(synapse.id);
//     } else if (synapse instanceof ElectricSynaps) {
//       this.outputElectricSynapses.delete(synapse.id);
//     }
//   }

//   public getInputChemicalSynapse (): Map<string, IChemicalSynaps> {
//     return this.inputChemicalSynapses;
//   }

//   public getInputElectricSynapse (): Map<string, IElectricSynaps> {
//     return this.inputElectricSynapses;
//   }

//   public getOutputChemicalSynapse (): Map<string, IChemicalSynaps> {
//     return this.inputChemicalSynapses;
//   }

//   public getOutputElectricSynapse (): Map<string, IElectricSynaps> {
//     return this.inputElectricSynapses;
//   }

//   // === Новый метод: получить все синапсы ===
//   public getAllSynapses(): Array<IChemicalSynaps | IElectricSynaps> {
//     const all: Array<IChemicalSynaps | IElectricSynaps> = [];

//     all.push(...this.inputChemicalSynapses.values());
//     all.push(...this.inputElectricSynapses.values());
//     all.push(...this.outputChemicalSynapses.values());
//     all.push(...this.outputElectricSynapses.values());

//     return all;
//   }

//   // === Методы для очистки ===
//   public clearAll(): void {
//     this.inputChemicalSynapses.clear();
//     this.inputElectricSynapses.clear();
//     this.outputChemicalSynapses.clear();
//     this.outputElectricSynapses.clear();
//   }
// }