import { PhaserLayer } from "../createPhaserLayer";
import { createCounterSystem } from "./createCounterSystem";


export const registerSystems = (layer: PhaserLayer) => {
  createCounterSystem(layer);
}