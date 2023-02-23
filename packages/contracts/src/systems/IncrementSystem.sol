// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { CounterTable } from "../tables/CounterTable.sol";

contract IncrementSystem is System {
  function increment() public {
    uint32 counter = CounterTable.get(bytes32("singleton"));
    CounterTable.set(bytes32("singleton"), counter + 1);
  }
}
