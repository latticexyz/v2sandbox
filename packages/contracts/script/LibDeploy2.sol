// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";
import { World } from "@latticexyz/world/src/World.sol";
import { IncrementSystem } from "../src/systems/IncrementSystem.sol";
import { CounterTable } from "../src/counter/CounterTable.sol";

struct DeployResult {
  World world;
  address deployer;
}

library LibDeploy {
  function deploy() internal returns (DeployResult memory result) {
    result.world = new World();
    result.world.registerRoute("", "/counter");
    result.world.registerTable("/counter", "/CounterTable", CounterTable.getSchema());

    result.world.registerSystem("", "/increment", new IncrementSystem(), true);

    console.log("Increment function selector");
    console.logBytes4(IncrementSystem.increment.selector);
  }
}
