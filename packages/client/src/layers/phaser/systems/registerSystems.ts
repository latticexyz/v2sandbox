import { PhaserLayer } from "../createPhaserLayer";

import { createCamera } from "./createCamera";
import { createPlayerSystem } from "./createPlayerSystem";
import { createPositionSystem } from "./createPositionSystem";
import { createMapSystem } from "./createMapSystem";
import { createMonsterSystem } from "./createMonsterSystem";
import { createMessagesSystem } from "./createMessagesSystem";

export const registerSystems = (layer: PhaserLayer) => {
  createCamera(layer);
  createPlayerSystem(layer);
  createMonsterSystem(layer);
  createPositionSystem(layer);
  createMapSystem(layer);
  createMessagesSystem(layer);
};