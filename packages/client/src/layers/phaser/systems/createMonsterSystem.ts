import { HueTintAndOutlineFXPipeline } from "@latticexyz/phaserx";
import { defineSystem, Has, UpdateType } from "@latticexyz/recs";
import { Animations } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";

export function createMonsterSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: { MonsterTable },
    },
    scenes: {
      Main: { objectPool },
    },
  } = layer;

  defineSystem(world, [Has(MonsterTable)], ({ entity, type }) => {
    if(type === UpdateType.Exit) {
      objectPool.remove(entity);
      return;
    }

    const obj = objectPool.get(entity, "Sprite");
    obj.setComponent({
      id: 'appearance',
      once: (sprite) => {
        sprite.play(Animations.GolemIdle);
        sprite.setPipeline(HueTintAndOutlineFXPipeline.KEY);
        sprite.setPipelineData("hueTint", 0xb00b1e);
      }
    })
  });
}