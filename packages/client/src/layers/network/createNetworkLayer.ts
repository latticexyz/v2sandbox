import { setupMUDNetwork } from "@latticexyz/std-client";
import { createWorld } from "@latticexyz/recs";
import { config } from "./config";
import { defineStoreComponents } from "@latticexyz/recs";
import mudConfig from "../../../../contracts/mud.config.mjs";
import { SingletonID } from "@latticexyz/network";
import { IWorld__factory } from "../../../../contracts/types/ethers-contracts/factories/IWorld__factory";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
  // The world contains references to all entities, all components and disposers.
  const world = createWorld();
  const singletonEntity = world.registerEntity({ id: SingletonID });

  // Components contain the application state.
  // If a contractId is provided, MUD syncs the state with the corresponding table
  const components = defineStoreComponents(world, mudConfig);

  // Give components a Human-readable ID
  Object.entries(components).forEach(([name, component]) => {
    component.id = name;
  });

  const networkSetupResult = await setupMUDNetwork<typeof components, {}>(
    config,
    world,
    components,
    {} as never,
    { syncThread: "main" }
  );

  const signer = networkSetupResult.network.signer.get();
  if (!signer) throw new Error("No signer");

  const worldContract = IWorld__factory.connect(config.worldAddress, signer);

  networkSetupResult.startSync();

  return {
    world,
    worldContract,
    singletonEntity,
    network: networkSetupResult,
    components: {
      ...components,
      ...networkSetupResult.components,
    },
  };
};
