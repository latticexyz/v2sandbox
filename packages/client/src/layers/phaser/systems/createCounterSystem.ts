import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { defineSystem, getComponentValue, Has } from "@latticexyz/recs";
import { Animations, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";

export const createCounterSystem = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { objectPool },
    },
    networkLayer: {
      components: { CounterTable },
    },
  } = layer;

  defineSystem(world, [Has(CounterTable)], ({ entity }) => {
    const counter = getComponentValue(CounterTable, entity);
    if (counter == undefined) return;

    const counterObj = objectPool.get(counter.value, "Sprite");
    counterObj.setComponent({
      id: "sprite",
      once: (sprite) => {
        sprite.play(Animations.SwordsmanIdle);

        const coord = {
          x: (counter.value % 10),
          y: Math.floor(counter.value / 10)
        };
        const pixelCoord = tileCoordToPixelCoord(coord, TILE_WIDTH, TILE_HEIGHT);
        sprite.setPosition(pixelCoord.x, pixelCoord.y)
      },
    });
  });
};
