import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { defineSystem, getComponentValue, Has, UpdateType } from "@latticexyz/recs";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";

export function createPositionSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: { PositionTable },
    },
    scenes: {
      Main: { objectPool },
    },
  } = layer;

  defineSystem(world, [Has(PositionTable)], ({ entity, type }) => {
    if(type === UpdateType.Exit) {
      objectPool.remove(entity);
      return;
    }

    const position = getComponentValue(PositionTable, entity);
    if(!position) return;

    const pixelCoord = tileCoordToPixelCoord(position, TILE_WIDTH, TILE_HEIGHT);

    const obj = objectPool.get(entity, "Sprite");
    obj.setComponent({
      id: "position",
      once: (sprite) => {
        sprite.setPosition(pixelCoord.x, pixelCoord.y);
      },
    });
  });
}