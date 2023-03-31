import { defineSystem, UpdateType, Has, isComponentUpdate } from "@latticexyz/recs";
import { store } from "../../../store";
import { PhaserLayer } from "../createPhaserLayer";

export function createMessagesSystem(layer: PhaserLayer) {
  const { networkLayer: {
    world,
    playerEntity,
    components: {
      PlayerTable,
      HealthTable
    }
  } } = layer;

    defineSystem(world, [Has(PlayerTable), Has(HealthTable)], (update) => {
      if(update.type === UpdateType.Exit) return;
      if(!isComponentUpdate(update, HealthTable)) return;

      const { entity, value } = update;
      if(entity !== playerEntity) return;

      const [currentHealth, previousHealth] = value;

      store.setState({
        messages: [
          ...store.getState().messages,
          {
            message: `Health changed from ${previousHealth?.current} to ${currentHealth?.current}`,
            color: "pink"
          }
        ]
      })
    });
}