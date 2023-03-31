// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/world/IWorld.sol";
import { CounterTable } from "../src/tables/CounterTable.sol";

contract CounterTest is MudV2Test {
  IWorld world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testCounter() public {
    // Expect the counter to be 1 because it was incremented in the PostDeploy script.
    uint32 counter = CounterTable.get(world, bytes32("singleton"));
    assertEq(counter, 1);

    // Expect the counter to be 2 after calling increment.
    world.mud_increment_increment();
    counter = CounterTable.get(world, bytes32("singleton"));
    assertEq(counter, 2);
  }
}
