// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import { IncrementSystemWrapper, SubWorld } from "../src/wrapper/IncrementSystemWrapper.sol";
import { World } from "@latticexyz/world/src/World.sol";
import { CounterTableTableId } from "../src/tables/CounterTable.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // --------------- SANITY CHECKS ----------------

    // Sanity check 1: the world address should be the same as the one we just deployed
    console.log("Deployed world: ", worldAddress);

    // Sanity check 2: the msg.sender of this function should be the deployer account
    new TestContract().test();

    // Sanity check 3: check the key schema
    bytes32 schema = World(worldAddress).getKeySchema(CounterTableTableId).unwrap();
    console.logBytes32(schema);

    // ------------------ EXAMPLES ------------------

    // Call increment on world via the IncrementSystemWrapper
    uint32 newValue = IncrementSystemWrapper.increment(World(worldAddress));
    console.log("Increment via World:", newValue);

    // Call increment on world via the IncrementSystemWrapper and SubWorld custom type
    SubWorld world = SubWorld.wrap(worldAddress);
    newValue = world.increment();
    console.log("Increment via SubWorld:", newValue);

    vm.stopBroadcast();
  }
}

contract TestContract {
  function test() public view {
    console.log(msg.sender);
  }
}
