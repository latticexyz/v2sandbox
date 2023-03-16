// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { CounterTable } from "../tables/CounterTable.sol";
import { World } from "@latticexyz/world/src/World.sol";

bytes32 constant SingletonID = bytes32(uint256(0x060D));
uint256 constant ID = uint256(keccak256("system.Increment"));

contract IncrementSystem is System {
  function increment() public returns (uint32) {
    uint32 counter = CounterTable.get(SingletonID);
    uint32 newValue = counter + 1;
    CounterTable.set(SingletonID, newValue);

    return newValue;
  }
}
