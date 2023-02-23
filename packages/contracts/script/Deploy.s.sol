// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import { LibDeploy, DeployResult } from "./LibDeploy2.sol";

contract Deploy is Script {
  function run() external returns (address world) {
    vm.startBroadcast();
    DeployResult memory result = LibDeploy.deploy();
    world = address(result.world);

    console.log("Deployed world: ", world);
    vm.stopBroadcast();
  }
}
