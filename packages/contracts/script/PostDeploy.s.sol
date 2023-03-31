// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import { World } from "@latticexyz/world/src/World.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { IWorld } from "../src/world/IWorld.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
  }
}
