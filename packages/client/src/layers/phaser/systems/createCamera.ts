import { TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";

export const createCamera = (layer: PhaserLayer) => {
  const {
    scenes: {
      Main: {
        objectPool,
        camera: { phaserCamera },
      },
    },
    networkLayer: {
      utils: { onPlayerLoaded },
    },
  } = layer;

  phaserCamera.centerOn(0, 0);

  onPlayerLoaded((playerData) => {
    if(!playerData) {
      return;
    }

    const { player } = playerData;
    const playerObj = objectPool.get(player, "Sprite");

    playerObj.setComponent({
      id: "CameraFollow",
      once: (playerSprite) => {
        phaserCamera.startFollow(playerSprite, true, 0.1, 0.1, -(TILE_WIDTH / 2), -(TILE_HEIGHT / 2));
      },
    });
  });
};
