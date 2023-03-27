import { setupMUDNetwork } from "@latticexyz/std-client";
import { createWorld } from "@latticexyz/recs";
import { config } from "./config";
import { defineStoreComponents } from "@latticexyz/recs";
import { abi as WorldAbi } from "../../contracts/out/world/IWorld.sol/IWorld.json";
import { IWorld } from "../../contracts/types/ethers-contracts/IWorld";
import { Contract, Wallet } from "ethers";
import * as ethers from "ethers";
import mudConfig from "../../contracts/mud.config.mjs";

// The world contains references to all entities, all components and disposers.
const world = createWorld();

// Components contain the application state.
// If a contractId is provided, MUD syncs the state with the corresponding table
const components = defineStoreComponents(world, mudConfig);

// Components expose a stream that triggers when the component is updated.
components.CounterTable.update$.subscribe((update) => {
  const [nextValue, prevValue] = update.value;
  console.log("Counter updated", update, { nextValue, prevValue });
  document.getElementById("counter")!.innerHTML = String(
    nextValue?.value ?? "unset"
  );
});

// Create a World contract instance
const worldContract = new Contract(
  config.worldAddress,
  WorldAbi,
  new Wallet(
    config.privateKey!,
    new ethers.providers.JsonRpcProvider(config.provider.jsonRpcUrl)
  )
) as IWorld;

// Just for demonstration purposes: we create a global function that can be
// called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)
(window as any).increment = async () => {
  const txResult = await worldContract.mud_increment_increment({
    gasLimit: 1_000_000,
    gasPrice: 0,
  });

  console.log(txResult);
  console.log(await txResult.wait());
};

// This is where the magic happens
setupMUDNetwork<typeof components, {}>(config, world, components, {}).then(
  ({ startSync }) => {
    // After setting up the network, we can tell MUD to start the synchronization process.
    startSync();
  }
);
