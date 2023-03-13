import ReactDOM from "react-dom/client";
import { setupMUDNetwork } from "@latticexyz/std-client";
import { createWorld } from "@latticexyz/recs";
import { config } from "./config";
import { defineStoreComponents } from "@latticexyz/recs";
import { World } from "@latticexyz/world/types/ethers-contracts/World";
import { abi as WorldAbi } from "@latticexyz/world/abi/World.json";
import { Contract, Wallet } from "ethers";
import { ethers } from "ethers";
import mudConfig from "../../contracts/mud.config.mjs";
import { App } from "./App";
import { SingletonID } from "@latticexyz/network";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// The world contains references to all entities, all components and disposers.
export const world = createWorld();
export const singletonIndex = world.registerEntity({ id: SingletonID });

// Components contain the application state.
// If a contractId is provided, MUD syncs the state with the corresponding table
export const components = defineStoreComponents(world, mudConfig);

// Components expose a stream that triggers when the component is updated.
components.CounterTable.update$.subscribe((update) => {
  console.log("Counter updated", update);
  document.getElementById("counter")!.innerHTML = String(
    update.value?.[0]?.[0]
  );
});

// Create a World contract instance
export const worldContract = new Contract(
  config.worldAddress,
  WorldAbi,
  new Wallet(
    config.privateKey!,
    new ethers.providers.JsonRpcProvider(config.provider.jsonRpcUrl)
  )
) as World;

// Just for demonstration purposes: we create a global function that can be
// called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)
(window as any).increment = async () => {};

// This is where the magic happens
setupMUDNetwork<typeof components, {}>(config, world, components, {}).then(
  ({ startSync }) => {
    // After setting up the network, we can tell MUD to start the synchronization process.
    startSync();

    root.render(
      <App
        world={world}
        worldContract={worldContract}
        components={components}
      />
    );
  }
);
