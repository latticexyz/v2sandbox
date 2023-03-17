import { setupMUDNetwork } from "@latticexyz/std-client";
import { createWorld } from "@latticexyz/recs";
import { config } from "./config";
import { defineStoreComponents } from "@latticexyz/recs";
import { World } from "@latticexyz/world/types/ethers-contracts/World";
import { abi as WorldAbi } from "@latticexyz/world/abi/World.json";
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
) as World;

// Just for demonstration purposes: we create a global function that can be
// called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)
(window as any).increment = async () => {
  const txResult = await worldContract["call"](
    toBytes16("mud"),
    toBytes16("increment"),
    sigHash("increment()"),
    {
      gasPrice: 0,
      gasLimit: 1_000_000,
    }
  );

  console.log(txResult);
  console.log(await txResult.wait());
};

// This is where the magic happens
setupMUDNetwork<typeof components, {}>(
  config,
  world,
  components,
  {},
  { fetchSystemCalls: true, mudConfig }
).then(({ startSync, v2SystemCallStreams }) => {
  // After setting up the network, we can tell MUD to start the synchronization process.
  startSync();
});

function toBytes16(input: string) {
  if (input.length > 16) throw new Error("String does not fit into 16 bytes");

  const result = new Uint8Array(16);
  // Set ascii bytes
  for (let i = 0; i < input.length; i++) {
    result[i] = input.charCodeAt(i);
  }
  // Set the remaining bytes to 0
  for (let i = input.length; i < 16; i++) {
    result[i] = 0;
  }
  return result;
}

function concatBytes(a: Uint8Array, b: Uint8Array) {
  const result = new Uint8Array(a.length + b.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i];
  }
  for (let i = 0; i < b.length; i++) {
    result[a.length + i] = b[i];
  }
  return result;
}

function toHexString(input: Uint8Array): string {
  let output = "0x";

  for (let i = 0; i < input.length; i++) {
    output += input[i].toString(16).padStart(2, "0");
  }

  return output;
}

function getTableId(namespace: string, tableName: string) {
  return toHexString(concatBytes(toBytes16(namespace), toBytes16(tableName)));
}

function sigHash(signature: string) {
  return ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature)),
    0,
    4
  );
}
