// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { CounterTable_ } from "../tables/CounterTable.sol";

uint256 constant tableId = uint256(keccak256(bytes("/counter")));

contract IncrementSystem is System {
  function increment() public {
    uint32 counter = CounterTable_.getValue(tableId, bytes32("singleton"));
    CounterTable_.set(tableId, bytes32("singleton"), counter + 1);
  }
}
