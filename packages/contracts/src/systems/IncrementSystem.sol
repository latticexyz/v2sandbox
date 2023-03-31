// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { CounterTable } from "../tables/CounterTable.sol";

contract IncrementSystem is System {
  function increment() public returns (uint32) {
    bytes32 key = bytes32(uint256(0x060D));
    uint32 counter = CounterTable.get(key);
    uint32 newValue = counter + 1;
    CounterTable.set(key, newValue);
    return newValue;
  }
}
