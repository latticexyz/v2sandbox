import { Tileset } from "../../../artTypes/world";
import { PhaserLayer } from "../createPhaserLayer";

export function createMapSystem(layer: PhaserLayer) {
  const {
    scenes: {
      Main: {
        maps: {
          Main: {
            putTileAt,
          }
        }
      }
    }
  } = layer;

  for(let x = 0; x < 10; x++) {
    for(let y = 0; y < 10; y++) {
      const coord = { x,y };
      const randomTile = Phaser.Math.RND.between(0, 2);

      putTileAt(coord, randomTile, "Foreground");
      putTileAt(coord, Tileset.Grass, "Background");
    }
  }
}