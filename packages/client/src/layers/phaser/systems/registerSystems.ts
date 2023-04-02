import { PhaserLayer } from "../createPhaserLayer";
import { createCounterSystem } from "./createCounterSystem";
import { createCamera } from "./createCamera";
import { createMapSystem } from "./createMapSystem";

export const registerSystems = (layer: PhaserLayer) => {
  createCamera(layer);
  createCounterSystem(layer);
  createMapSystem(layer);
};