// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { console } from "forge-std/console.sol";
import { World } from "@latticexyz/world/src/World.sol";

// Using a custom World makes it easier to iterate on the World contract in MUD without having to rebuild MUD,
// because CustomWorld is automatically rebuilt using deployment.
contract CustomWorld is World {

}
