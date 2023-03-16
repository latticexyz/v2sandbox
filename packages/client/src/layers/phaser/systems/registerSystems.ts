import { PhaserLayer } from "../createPhaserLayer";
import { createCounterSystem } from "./createCounterSystem";
import { createCamera } from "./createCamera";

export const registerSystems = (layer: PhaserLayer) => {
  createCamera(layer);
  createCounterSystem(layer);
};