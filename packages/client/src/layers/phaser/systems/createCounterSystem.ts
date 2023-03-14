import { defineSystem, getComponentValue, Has } from "@latticexyz/recs";
import { Animations } from "../constants";
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
        sprite.setPosition(counter.value * 32 + 50, 50);
      },
    });
  });
};
