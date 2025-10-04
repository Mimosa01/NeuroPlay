import type { IModulationCloud } from "../interfaces/IModulationCloud.interface";
import type { ModulationCloudDTO } from "./modulationCloud.dto";

export function modulationCloudToDTO (cloud: IModulationCloud): ModulationCloudDTO {
  return {
    id: cloud.id,
    type: cloud.type,
    center: cloud.getCenter(),
    radius: cloud.getRadius(),
    modulator: cloud.modulator
  }
}