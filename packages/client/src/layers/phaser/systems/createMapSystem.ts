import { createNoise2D } from "simplex-noise";
import { Tileset } from "../../../artTypes/world";
import { PhaserLayer } from "../createPhaserLayer";

export function createMapSystem(layer: PhaserLayer) {
  const noise2D = createNoise2D();
  const {
    scenes: {
      Main: {
        maps: {
          Main: { putTileAt },
        },
      },
    },
  } = layer;

  for (let x = -100; x < 100; x++) {
    for (let y = -100; y < 100; y++) {
      const noise = noise2D(x, y);

      if (noise > 0.5) {
        putTileAt({ x, y }, Tileset.Mountains, "Foreground");
      } else if (noise < -0.5) {
        putTileAt({ x, y }, Tileset.Forest, "Foreground");
      }
    }
  }
}
