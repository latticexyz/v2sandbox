import { setupMUDNetwork } from "@latticexyz/std-client";
import { createWorld } from "@latticexyz/recs";
import { config } from "./config";
import { defineStoreComponents } from "@latticexyz/recs";
import { World } from "@latticexyz/world/types/ethers-contracts/World";
import { abi as WorldAbi } from "@latticexyz/world/abi/World.json";
import { Contract, Wallet } from "ethers";
import * as ethers from "ethers";
import mudConfig from "contracts/mud.config.mjs";

// The world contains references to all entities, all components and disposers.
const world = createWorld();

// Components contain the application state.
const components = defineStoreComponents(world, mudConfig);

// Components expose a stream that triggers when the component is updated.
components.CounterTable.update$.subscribe((update) => {
  console.log("Counter updated", update);
  document.getElementById("counter")!.innerHTML = String(
    update.value?.[0]?.[0]
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
) as World;

const sigHash = (signature: string) =>
  ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature)),
    0,
    4
  );

// Just for demonstration purposes: we create a global function that can be
// called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)
(window as any).increment = async () => {
  const txResult = await worldContract["call(string,bytes)"](
    "/mud/increment",
    sigHash("increment(uint32)"),
    {
      gasPrice: 0,
      gasLimit: 1_000_000,
    }
  );

  await txResult.wait();
};

// This is where the magic happens
setupMUDNetwork<typeof components, {}>(config, world, components, {}).then(
  ({ startSync }) => {
    // After setting up the network, we can tell MUD to start the synchronization process.
    startSync();
  }
);
