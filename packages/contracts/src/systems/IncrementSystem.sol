// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { CounterTable } from "../tables/CounterTable.sol";
import { World } from "@latticexyz/world/src/World.sol";

contract IncrementSystem is System {
  function increment() public returns (uint32) {
    uint32 count = CounterTable.get(bytes32("singleton"));
    uint32 nextCount = count + 1;
    // TODO: add suport for routes in the autogen tables (right now we just have support for ids)
    // CounterTable.set(bytes32("singleton"), amount);
    World(msg.sender).setRecord("/mud", "/counter", new bytes32[](0), abi.encodePacked(uint32(nextCount)));
    return nextCount;
  }
}
