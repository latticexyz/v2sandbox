import { PhaserLayer } from "../createPhaserLayer";

export const createCamera = (layer: PhaserLayer) => {
  const {
    scenes: {
      Main: {
        camera: {
          phaserCamera
        }
      }
    }
  } = layer;

  phaserCamera.setBounds(0, 0, 1200, 1200);
}