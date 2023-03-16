import { setupMUDNetwork } from "@latticexyz/std-client";
import { createWorld } from "@latticexyz/recs";
import { config } from "./config";
import { defineStoreComponents } from "@latticexyz/recs";
import { World } from "@latticexyz/world/types/ethers-contracts/World";
import { abi as WorldAbi } from "@latticexyz/world/abi/World.json";
import { Contract, Wallet } from "ethers";
import { ethers } from "ethers";
import mudConfig from "../../../../contracts/mud.config.mjs";
import { SingletonID } from "@latticexyz/network";
import { getBurnerWallet } from "../../getBurnerWallet";

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

  const worldContract = new Contract(
    config.worldAddress,
    WorldAbi,
    new Wallet(
      getBurnerWallet(),
      new ethers.providers.JsonRpcProvider(config.provider.jsonRpcUrl)
    )
  ) as World;

  const networkSetupResult = await setupMUDNetwork<typeof components, {}>(config, world, components, {});

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
