import {
  defineSceneConfig,
  defineScaleConfig,
  defineCameraConfig,
} from "@latticexyz/phaserx";
import { Scenes, TILE_HEIGHT } from "./constants";

export const phaserConfig = {
  sceneConfig: {
    [Scenes.Main]: defineSceneConfig({
      assets: {},
      maps: {},
      sprites: {},
      animations: [],
      tilesets: {},
    }),
  },
  scale: defineScaleConfig({
    parent: "phaser-game",
    zoom: 1,
    mode: Phaser.Scale.NONE,
  }),
  cameraConfig: defineCameraConfig({
    pinchSpeed: 1,
    wheelSpeed: 1,
    maxZoom: 3,
    minZoom: 1,
  }),
  cullingChunkSize: TILE_HEIGHT * 16,
};
