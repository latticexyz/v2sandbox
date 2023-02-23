import { setupMUDNetwork } from "@latticexyz/std-client";
import { createWorld } from "@latticexyz/recs";
import { config } from "./config";
import { Type, defineComponent } from "@latticexyz/recs";
import { World } from "@latticexyz/world/types/ethers-contracts/World";
import { abi as WorldAbi } from "@latticexyz/world/abi/World.json";
import { Contract, Wallet } from "ethers";
import * as ethers from "ethers";

// The world contains references to all entities, all components and disposers.
const world = createWorld();

// Components contain the application state.
// If a contractId is provided, MUD syncs the state with the corresponding table
const components = {
  Counter: defineComponent(
    world,
    {
      0: Type.Number,
    },
    {
      metadata: {
        contractId: "/counter",
      },
    }
  ),
};

// Components expose a stream that triggers when the component is updated.
components.Counter.update$.subscribe(({ value }) => {
  console.log("Counter updated", value);
  document.getElementById("counter")!.innerHTML = String(value?.[0]?.[0]);
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

// Just for demonstration purposes: we create a global function that can be
// called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)
(window as any).increment = async () => {
  const txResult = await worldContract["call(string,bytes)"](
    "/increment",
    "0xd09de08a",
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
