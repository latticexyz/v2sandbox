import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineMapConfig,
  defineCameraConfig,
} from "@latticexyz/phaserx";
import {
  Sprites,
  Assets,
  Maps,
  Scenes,
  TILE_HEIGHT,
  TILE_WIDTH,
  Animations,
} from "./constants";

export const phaserConfig = {
  sceneConfig: {
    [Scenes.Main]: defineSceneConfig({
      assets: {
        [Assets.MainAtlas]: {
          type: AssetType.MultiAtlas,
          key: Assets.MainAtlas,
          // Add a timestamp to the end of the path to prevent caching
          path: `/assets/atlases/atlas.json?timestamp=${Date.now()}`,
          options: {
            imagePath: "/assets/atlases/",
          },
        },
      },
      maps: {},
      sprites: {},
      animations: [
        {
          key: Animations.SwordsmanIdle,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 3,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/soldier/idle/",
          suffix: ".png",
        },
      ],
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
